"""固定资产服务。"""

from __future__ import annotations

from typing import Any, Optional

from apps.common.audit_actor import apply_create_audit
from apps.kuaioa.constants.asset_lifecycle import (
    ASSET_STATUS_FINANCE_PENDING,
    ASSET_STATUS_IN_STOCK,
    ASSET_STATUS_SCRAPPED,
    ASSET_STATUS_WRITTEN_OFF,
    PURCHASE_STAGE_ORDER,
    STAGE_APPROVED,
    STAGE_CARDED,
    STAGE_DRAFT,
    STAGE_FINANCE_AUDITED,
    STAGE_INBOUND,
    STAGE_ISSUED,
    STAGE_PAID,
    STAGE_PENDING,
    STAGE_PROCURING,
    STAGE_SCRAPPED,
    STAGE_WRITTEN_OFF,
)
from apps.kuaioa.models.asset import KuaioaAsset, KuaioaAssetLifecycleEvent, KuaioaAssetPurchase
from apps.kuaioa.schemas.asset import (
    AssetCreate,
    AssetLifecycleAdvance,
    AssetPurchaseCreate,
    AssetPurchaseUpdate,
    AssetUpdate,
)
from apps.kuaioa.services.approval_helper import (
    AUDIT_NODE_ASSET_PURCHASE,
    cancel_approval,
    enrich_with_approval,
    is_audit_required,
    start_approval,
)
from apps.kuaioa.services.kuaioa_list_core import (
    build_keyword_q,
    generate_daily_code,
    model_to_dict,
    parse_optional_date,
    touch_updated,
)
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError
from infra.models.user import User


def _stage_index(stage: str) -> int:
    try:
        return PURCHASE_STAGE_ORDER.index(stage)
    except ValueError:
        return -1


class AssetPurchaseService:
    async def list_purchases(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        q = KuaioaAssetPurchase.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            q = q.filter(status=status)
        if keyword:
            q = q.filter(build_keyword_q(keyword, "purchase_code", "title", "applicant_name"))
        rows = await q.order_by("-created_at", "-id")
        result = []
        for row in rows:
            item = model_to_dict(row)
            await enrich_with_approval(item, tenant_id, "kuaioa_asset_purchase")
            result.append(item)
        return result

    async def get_purchase(self, tenant_id: int, purchase_id: int) -> dict[str, Any]:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        item = model_to_dict(row)
        item["lifecycle_events"] = await self._list_events(
            tenant_id, purchase_id=purchase_id
        )
        return await enrich_with_approval(item, tenant_id, "kuaioa_asset_purchase")

    async def create_purchase(
        self, tenant_id: int, data: AssetPurchaseCreate, user: User
    ) -> dict[str, Any]:
        purchase_code = await generate_daily_code(
            KuaioaAssetPurchase, tenant_id, "AP", code_field="purchase_code"
        )
        create_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "purchase_code": purchase_code,
            "title": data.title.strip(),
            "asset_category": data.asset_category,
            "quantity": data.quantity,
            "estimated_amount": data.estimated_amount,
            "currency": data.currency,
            "applicant_id": data.applicant_id or user.id,
            "applicant_name": data.applicant_name
            or getattr(user, "name", None)
            or getattr(user, "username", None),
            "department_name": data.department_name,
            "purpose": data.purpose,
            "attachment_uuids": list(data.attachment_uuids or []),
            "status": "draft",
            "lifecycle_stage": STAGE_DRAFT,
        }
        apply_create_audit(create_payload, user)
        row = await KuaioaAssetPurchase.create(**create_payload)
        await self._append_event(
            tenant_id,
            purchase_id=row.id,
            stage=STAGE_DRAFT,
            remark="创建采买申请",
            user=user,
        )
        return model_to_dict(row)

    async def update_purchase(
        self, tenant_id: int, purchase_id: int, data: AssetPurchaseUpdate, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("当前状态不可编辑")
        payload = data.model_dump(exclude_unset=True)
        for key, value in payload.items():
            setattr(row, key, value)
        await touch_updated(row, user_id)
        await row.save()
        return model_to_dict(row)

    async def delete_purchase(self, tenant_id: int, purchase_id: int, user_id: int) -> None:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        if row.status not in {"draft", "cancelled"}:
            raise BusinessLogicError("仅草稿或已撤销状态可删除")
        row.deleted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()

    async def submit_purchase(
        self, tenant_id: int, purchase_id: int, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("当前状态不可提交")
        row.status = "pending"
        row.lifecycle_stage = STAGE_PENDING
        row.submitted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()
        user = await User.get_or_none(id=user_id)
        await self._append_event(
            tenant_id,
            purchase_id=purchase_id,
            stage=STAGE_PENDING,
            remark="提交审批",
            user=user,
            operator_id=user_id,
        )
        if await is_audit_required(tenant_id, AUDIT_NODE_ASSET_PURCHASE):
            await start_approval(
                tenant_id,
                node_key=AUDIT_NODE_ASSET_PURCHASE,
                entity_type="kuaioa_asset_purchase",
                entity_id=int(row.id),
                entity_uuid=str(row.uuid),
                title=f"固定资产采买: {row.title}",
                content=row.purpose or row.title,
                submitter_id=user_id,
            )
        else:
            row.status = "approved"
            row.lifecycle_stage = STAGE_APPROVED
            await touch_updated(row, user_id)
            await row.save()
            await self._append_event(
                tenant_id,
                purchase_id=purchase_id,
                stage=STAGE_APPROVED,
                remark="无需审批，自动通过",
                user=user,
                operator_id=user_id,
            )
        return await self.get_purchase(tenant_id, purchase_id)

    async def revoke_purchase(
        self, tenant_id: int, purchase_id: int, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        if row.status != "pending":
            raise BusinessLogicError("仅待审批状态可撤销")
        row.status = "cancelled"
        row.lifecycle_stage = STAGE_DRAFT
        await touch_updated(row, user_id)
        await row.save()
        await cancel_approval(
            tenant_id,
            entity_type="kuaioa_asset_purchase",
            entity_id=int(row.id),
            operator_id=user_id,
        )
        return model_to_dict(row)

    async def advance_lifecycle(
        self,
        tenant_id: int,
        purchase_id: int,
        data: AssetLifecycleAdvance,
        user: User,
    ) -> dict[str, Any]:
        row = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("采买申请不存在")
        if row.status != "approved":
            raise BusinessLogicError("仅已批准的采买申请可推进生命周期")

        target = (data.stage or "").strip()
        allowed = {
            STAGE_PROCURING,
            STAGE_PAID,
            STAGE_INBOUND,
            STAGE_ISSUED,
            STAGE_CARDED,
            STAGE_FINANCE_AUDITED,
            STAGE_WRITTEN_OFF,
        }
        if target not in allowed:
            raise BusinessLogicError(f"不支持的生命周期阶段: {target}")

        current = row.lifecycle_stage or STAGE_APPROVED
        if _stage_index(target) <= _stage_index(current):
            raise BusinessLogicError("生命周期阶段不可回退或重复推进")
        if _stage_index(target) != _stage_index(current) + 1:
            raise BusinessLogicError("请按采买→付款→入库→领料→建卡→财务审核→销账顺序推进")

        if target == STAGE_PAID:
            if data.payment_amount is None:
                raise BusinessLogicError("付款登记须填写实付金额")
            row.payment_amount = data.payment_amount
            row.payment_at = resolve_business_datetime()

        if target == STAGE_CARDED:
            await self.register_asset_from_purchase(
                tenant_id, purchase_id, user.id, record_stage=False
            )

        if target == STAGE_FINANCE_AUDITED:
            await KuaioaAsset.filter(
                tenant_id=tenant_id, purchase_id=purchase_id, deleted_at__isnull=True
            ).update(
                status=ASSET_STATUS_FINANCE_PENDING,
                finance_audited_at=resolve_business_datetime(),
            )

        if target == STAGE_WRITTEN_OFF:
            await KuaioaAsset.filter(
                tenant_id=tenant_id, purchase_id=purchase_id, deleted_at__isnull=True
            ).update(
                status=ASSET_STATUS_WRITTEN_OFF,
                written_off_at=resolve_business_datetime(),
            )

        row.lifecycle_stage = target
        if data.file_uuid:
            attachments = list(row.attachment_uuids or [])
            if data.file_uuid not in attachments:
                attachments.append(data.file_uuid)
            row.attachment_uuids = attachments
        await touch_updated(row, user.id)
        await row.save()
        await self._append_event(
            tenant_id,
            purchase_id=purchase_id,
            stage=target,
            remark=data.remark,
            file_uuid=data.file_uuid,
            user=user,
        )
        return await self.get_purchase(tenant_id, purchase_id)

    async def register_asset_from_purchase(
        self,
        tenant_id: int,
        purchase_id: int,
        user_id: int,
        *,
        record_stage: bool = True,
    ) -> dict[str, Any]:
        purchase = await KuaioaAssetPurchase.get_or_none(
            id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not purchase:
            raise NotFoundError("采买申请不存在")
        if purchase.status != "approved":
            raise BusinessLogicError("仅已批准的采买申请可建卡")
        existing = await KuaioaAsset.filter(
            tenant_id=tenant_id, purchase_id=purchase_id, deleted_at__isnull=True
        ).count()
        if existing > 0:
            raise BusinessLogicError("该采买申请已建卡")

        asset_service = AssetRegistryService()
        quantity = max(1, int(purchase.quantity or 1))
        created: list[dict[str, Any]] = []
        for index in range(quantity):
            asset_name = purchase.title if quantity == 1 else f"{purchase.title}-{index + 1}"
            item = await asset_service.create_asset(
                tenant_id,
                AssetCreate(
                    asset_name=asset_name,
                    asset_category=purchase.asset_category,
                    purchase_id=purchase.id,
                    purchase_amount=purchase.payment_amount or purchase.estimated_amount,
                    purchase_date=to_site_date(resolve_business_datetime()).isoformat(),
                    custodian_id=purchase.applicant_id,
                    custodian_name=purchase.applicant_name,
                    department_name=purchase.department_name,
                    attachment_uuids=list(purchase.attachment_uuids or []),
                ),
                user_id,
            )
            created.append(item)

        if record_stage:
            purchase.lifecycle_stage = STAGE_CARDED
            await touch_updated(purchase, user_id)
            await purchase.save()
            user = await User.get_or_none(id=user_id)
            await self._append_event(
                tenant_id,
                purchase_id=purchase_id,
                stage=STAGE_CARDED,
                remark=f"建卡 {len(created)} 台",
                user=user,
                operator_id=user_id,
            )
        return {"assets": created, "count": len(created), "asset": created[0] if created else None}

    async def _list_events(
        self,
        tenant_id: int,
        *,
        purchase_id: Optional[int] = None,
        asset_id: Optional[int] = None,
    ) -> list[dict[str, Any]]:
        q = KuaioaAssetLifecycleEvent.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if purchase_id:
            q = q.filter(purchase_id=purchase_id)
        if asset_id:
            q = q.filter(asset_id=asset_id)
        rows = await q.order_by("occurred_at", "id")
        return [model_to_dict(r) for r in rows]

    async def _append_event(
        self,
        tenant_id: int,
        *,
        purchase_id: Optional[int] = None,
        asset_id: Optional[int] = None,
        stage: str,
        remark: Optional[str] = None,
        file_uuid: Optional[str] = None,
        user: Optional[User] = None,
        operator_id: Optional[int] = None,
    ) -> None:
        op_id = operator_id or (user.id if user else None)
        op_name = None
        if user:
            op_name = getattr(user, "name", None) or getattr(user, "username", None)
        payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "purchase_id": purchase_id,
            "asset_id": asset_id,
            "stage": stage,
            "remark": remark,
            "file_uuid": file_uuid,
            "operator_id": op_id,
            "operator_name": op_name,
            "occurred_at": resolve_business_datetime(),
        }
        if user:
            apply_create_audit(payload, user)
        elif op_id:
            payload["created_by"] = op_id
            payload["updated_by"] = op_id
        await KuaioaAssetLifecycleEvent.create(**payload)


class AssetRegistryService:
    async def list_assets(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        q = KuaioaAsset.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            q = q.filter(status=status)
        if keyword:
            q = q.filter(build_keyword_q(keyword, "asset_code", "asset_name", "custodian_name"))
        rows = await q.order_by("-created_at", "-id")
        return [model_to_dict(row) for row in rows]

    async def get_asset(self, tenant_id: int, asset_id: int) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        item = model_to_dict(row)
        purchase_service = AssetPurchaseService()
        events: list[dict[str, Any]] = await purchase_service._list_events(
            tenant_id, asset_id=asset_id
        )
        if row.purchase_id:
            purchase_events = await purchase_service._list_events(
                tenant_id, purchase_id=row.purchase_id
            )
            merged = {e["id"]: e for e in purchase_events + events}
            events = sorted(
                merged.values(),
                key=lambda e: (str(e.get("occurred_at") or ""), int(e.get("id") or 0)),
            )
        item["lifecycle_events"] = events
        return item

    async def create_asset(
        self, tenant_id: int, data: AssetCreate, user_id: int
    ) -> dict[str, Any]:
        asset_code = await generate_daily_code(
            KuaioaAsset, tenant_id, "FA", code_field="asset_code"
        )
        create_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "asset_code": asset_code,
            "asset_name": data.asset_name.strip(),
            "asset_category": data.asset_category,
            "purchase_id": data.purchase_id,
            "purchase_amount": data.purchase_amount,
            "purchase_date": parse_optional_date(data.purchase_date),
            "custodian_id": data.custodian_id,
            "custodian_name": data.custodian_name,
            "department_name": data.department_name,
            "location": data.location,
            "attachment_uuids": list(data.attachment_uuids or []),
            "notes": data.notes,
            "status": ASSET_STATUS_IN_STOCK,
        }
        user = await User.get_or_none(id=user_id)
        if user:
            apply_create_audit(create_payload, user)
        else:
            create_payload["created_by"] = user_id
            create_payload["updated_by"] = user_id
        row = await KuaioaAsset.create(**create_payload)
        return model_to_dict(row)

    async def update_asset(
        self, tenant_id: int, asset_id: int, data: AssetUpdate, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        payload = data.model_dump(exclude_unset=True)
        if "purchase_date" in payload:
            payload["purchase_date"] = parse_optional_date(payload["purchase_date"])
        for key, value in payload.items():
            setattr(row, key, value)
        await touch_updated(row, user_id)
        await row.save()
        return model_to_dict(row)

    async def delete_asset(self, tenant_id: int, asset_id: int, user_id: int) -> None:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        row.deleted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()

    async def assign_asset(
        self, tenant_id: int, asset_id: int, *, custodian_id: int, custodian_name: str, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        row.custodian_id = custodian_id
        row.custodian_name = custodian_name
        row.status = "in_use"
        await touch_updated(row, user_id)
        await row.save()
        return model_to_dict(row)

    async def return_asset(self, tenant_id: int, asset_id: int, user_id: int) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        row.custodian_id = None
        row.custodian_name = None
        row.status = ASSET_STATUS_IN_STOCK
        await touch_updated(row, user_id)
        await row.save()
        return model_to_dict(row)

    async def scrap_asset(self, tenant_id: int, asset_id: int, user_id: int) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        row.status = ASSET_STATUS_SCRAPPED
        await touch_updated(row, user_id)
        await row.save()
        user = await User.get_or_none(id=user_id)
        await AssetPurchaseService()._append_event(
            tenant_id,
            purchase_id=row.purchase_id,
            asset_id=asset_id,
            stage=STAGE_SCRAPPED,
            remark="原设备报废",
            user=user,
            operator_id=user_id,
        )
        return model_to_dict(row)

    async def finance_audit_asset(
        self, tenant_id: int, asset_id: int, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        if row.status == ASSET_STATUS_SCRAPPED:
            raise BusinessLogicError("已报废资产不可财务审核")
        row.status = ASSET_STATUS_FINANCE_PENDING
        row.finance_audited_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()
        user = await User.get_or_none(id=user_id)
        await AssetPurchaseService()._append_event(
            tenant_id,
            purchase_id=row.purchase_id,
            asset_id=asset_id,
            stage=STAGE_FINANCE_AUDITED,
            remark="财务审核",
            user=user,
            operator_id=user_id,
        )
        return model_to_dict(row)

    async def write_off_asset(
        self, tenant_id: int, asset_id: int, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaAsset.get_or_none(
            id=asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("固定资产不存在")
        if not row.finance_audited_at:
            raise BusinessLogicError("须先完成财务审核再销账")
        row.status = ASSET_STATUS_WRITTEN_OFF
        row.written_off_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()
        user = await User.get_or_none(id=user_id)
        await AssetPurchaseService()._append_event(
            tenant_id,
            purchase_id=row.purchase_id,
            asset_id=asset_id,
            stage=STAGE_WRITTEN_OFF,
            remark="财务销账",
            user=user,
            operator_id=user_id,
        )
        return model_to_dict(row)


async def apply_asset_purchase_decision(
    tenant_id: int, purchase_id: int, approved: bool, user_id: int
) -> None:
    row = await KuaioaAssetPurchase.get_or_none(
        id=purchase_id, tenant_id=tenant_id, deleted_at__isnull=True
    )
    if not row:
        return
    row.status = "approved" if approved else "rejected"
    row.lifecycle_stage = STAGE_APPROVED if approved else STAGE_DRAFT
    await touch_updated(row, user_id)
    await row.save()
    user = await User.get_or_none(id=user_id)
    await AssetPurchaseService()._append_event(
        tenant_id,
        purchase_id=purchase_id,
        stage=STAGE_APPROVED if approved else STAGE_DRAFT,
        remark="审批通过" if approved else "审批驳回",
        user=user,
        operator_id=user_id,
    )
