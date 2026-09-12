"""资产变动与清理服务。"""

from __future__ import annotations

from datetime import date
from typing import Any, Optional

from apps.kuaicaiwu.models.fixed_asset import FaAsset, FaChange, FaDisposal
from apps.kuaicaiwu.services.fa_core import generate_daily_code, model_to_dict, quantize_money, touch_updated
from apps.kuaicaiwu.services.finance_integration_hooks import record_finance_accounting_event
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User


def _parse_date(value: Any) -> date:
    if isinstance(value, date):
        return value
    return date.fromisoformat(str(value).strip()[:10])


class FaChangeService:
    async def list_changes(self, tenant_id: int) -> list[dict[str, Any]]:
        rows = await FaChange.filter(tenant_id=tenant_id, deleted_at__isnull=True).order_by(
            "-created_at", "-id"
        )
        return [model_to_dict(r) for r in rows]

    async def create_change(
        self, tenant_id: int, data: dict[str, Any], user: User
    ) -> dict[str, Any]:
        asset = await FaAsset.get_or_none(
            id=int(data["asset_id"]), tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        if asset.status == "disposed":
            raise BusinessLogicError("已清理资产不可变动")
        change_type = (data.get("change_type") or "").strip()
        if not change_type:
            raise ValidationError("变动类型必填")
        before = model_to_dict(asset)
        after = dict(before)
        after_snapshot = data.get("after_snapshot") or {}
        after.update(after_snapshot)
        code = await generate_daily_code(FaChange, tenant_id, "FAC", "change_code")
        row = await FaChange.create(
            tenant_id=tenant_id,
            change_code=code,
            asset_id=asset.id,
            asset_code=asset.asset_code,
            asset_name=asset.asset_name,
            change_type=change_type,
            change_date=_parse_date(data.get("change_date")),
            before_snapshot=before,
            after_snapshot=after,
            status="draft",
            notes=data.get("notes"),
            created_at=resolve_business_datetime(),
            updated_at=resolve_business_datetime(),
            created_by=user.id,
            created_by_name=getattr(user, "name", None) or getattr(user, "username", None),
        )
        return model_to_dict(row)

    async def confirm_change(
        self, tenant_id: int, change_id: int, user: User
    ) -> dict[str, Any]:
        row = await FaChange.get_or_none(
            id=change_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("变动单不存在")
        if row.status != "draft":
            raise BusinessLogicError("变动单已确认")
        asset = await FaAsset.get_or_none(
            id=row.asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        snap = row.after_snapshot or {}
        for key in (
            "department_id",
            "department_name",
            "user_id",
            "user_name",
            "location",
            "status",
        ):
            if key in snap:
                setattr(asset, key, snap[key])
        await touch_updated(asset, user)
        await asset.save()
        row.status = "confirmed"
        await touch_updated(row, user)
        await row.save()
        return model_to_dict(row)


class FaDisposalService:
    async def list_disposals(self, tenant_id: int) -> list[dict[str, Any]]:
        rows = await FaDisposal.filter(tenant_id=tenant_id, deleted_at__isnull=True).order_by(
            "-created_at", "-id"
        )
        return [model_to_dict(r) for r in rows]

    async def create_disposal(
        self, tenant_id: int, data: dict[str, Any], user: User
    ) -> dict[str, Any]:
        asset = await FaAsset.get_or_none(
            id=int(data["asset_id"]), tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        if asset.status == "disposed":
            raise BusinessLogicError("资产已清理")
        code = await generate_daily_code(FaDisposal, tenant_id, "FADP", "disposal_code")
        row = await FaDisposal.create(
            tenant_id=tenant_id,
            disposal_code=code,
            asset_id=asset.id,
            asset_code=asset.asset_code,
            asset_name=asset.asset_name,
            disposal_date=_parse_date(data.get("disposal_date")),
            disposal_type=(data.get("disposal_type") or "sale").strip(),
            disposal_amount=quantize_money(data.get("disposal_amount") or 0),
            status="draft",
            notes=data.get("notes"),
            created_at=resolve_business_datetime(),
            updated_at=resolve_business_datetime(),
            created_by=user.id,
            created_by_name=getattr(user, "name", None) or getattr(user, "username", None),
        )
        return model_to_dict(row)

    async def confirm_disposal(
        self, tenant_id: int, disposal_id: int, user: User
    ) -> dict[str, Any]:
        row = await FaDisposal.get_or_none(
            id=disposal_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("清理单不存在")
        if row.status != "draft":
            raise BusinessLogicError("清理单已确认")
        asset = await FaAsset.get_or_none(
            id=row.asset_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not asset:
            raise NotFoundError("资产不存在")
        asset.status = "disposed"
        await touch_updated(asset, user)
        await asset.save()

        await record_finance_accounting_event(
            tenant_id=tenant_id,
            event_type="FA_DISPOSAL",
            business_type="fixed_asset_disposal",
            source_doc_type="fa_disposal",
            source_doc_id=row.id,
            source_doc_code=row.disposal_code,
            target_doc_type="fa_asset",
            target_doc_id=asset.id,
            target_doc_code=asset.asset_code,
            amount=quantize_money(asset.original_value),
            operator_id=user.id,
            notes=row.notes or f"资产清理 {asset.asset_name}",
            payload={
                "asset_account_code": asset.asset_account_code,
                "accumulated_depreciation_account_code": asset.accumulated_depreciation_account_code,
                "accumulated_depreciation": float(asset.accumulated_depreciation),
                "disposal_amount": float(row.disposal_amount),
            },
        )
        row.status = "confirmed"
        await touch_updated(row, user)
        await row.save()
        return model_to_dict(row)
