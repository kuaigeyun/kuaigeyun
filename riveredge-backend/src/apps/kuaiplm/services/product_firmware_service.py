"""产品固件服务（R-15 #28）：审核发布 + INF-05 版本可见性。"""

from __future__ import annotations

from typing import List, Optional, Sequence, Set

from tortoise.expressions import Q
from tortoise.transactions import in_transaction

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.product_firmware import ProductFirmware
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.product_firmware import (
    ProductFirmwareCreate,
    ProductFirmwareListResponse,
    ProductFirmwareResponse,
    ProductFirmwareUpdate,
)
from apps.kuaiplm.utils.firmware_version import firmware_policy_row
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.services.file.document_version_policy import (
    DOCUMENT_GLOBAL_VIEW_PERMISSION,
    DocumentVersionAudience,
    filter_version_rows,
    resolve_audience,
)
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "product_firmware"
ALLOWED_STATUS = {"draft", "pending", "approved", "released", "obsolete"}
MANAGE_ACTIONS = frozenset(
    {"create", "update", "delete", "submit", "approve", "reject", "execute"}
)


def _can_manage(permission_codes: Optional[Sequence[str]]) -> bool:
    codes = {str(c or "").strip().lower() for c in (permission_codes or []) if str(c or "").strip()}
    if DOCUMENT_GLOBAL_VIEW_PERMISSION in codes:
        return True
    for code in codes:
        if not code.startswith("kuaiplm:product-firmware:"):
            continue
        action = code.rsplit(":", 1)[-1]
        if action in MANAGE_ACTIONS:
            return True
    return False


class ProductFirmwareService(AppBaseService[ProductFirmware]):
    code_field = "firmware_code"
    rule_code = "KUAI_PLM_PRODUCT_FIRMWARE_CODE"
    code_prefix = "GJRJ"

    def __init__(self) -> None:
        super().__init__(ProductFirmware)
        self.model = ProductFirmware

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _get_row(self, tenant_id: int, firmware_id: int) -> ProductFirmware:
        row = await ProductFirmware.filter(
            tenant_id=tenant_id, id=firmware_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("产品固件不存在")
        return row

    async def _require_project(self, tenant_id: int, project_id: int) -> RdProject:
        project = await RdProject.filter(
            tenant_id=tenant_id, id=project_id, deleted_at__isnull=True
        ).first()
        if not project:
            raise ValidationError("研发项目不存在")
        return project

    async def _latest_released_ids(
        self, tenant_id: int, project_ids: Sequence[int]
    ) -> Set[int]:
        if not project_ids:
            return set()
        released = await ProductFirmware.filter(
            tenant_id=tenant_id,
            project_id__in=list(project_ids),
            status="released",
            deleted_at__isnull=True,
        ).order_by("-released_at", "-id")
        latest: dict[int, int] = {}
        for row in released:
            if row.project_id not in latest:
                latest[row.project_id] = row.id
        return set(latest.values())

    def _resolve_audience(
        self,
        *,
        permission_codes: Optional[Sequence[str]],
        production_view: bool,
    ) -> DocumentVersionAudience:
        if production_view:
            return resolve_audience(
                permission_codes=permission_codes,
                production_context=True,
            )
        if _can_manage(permission_codes):
            return DocumentVersionAudience.GLOBAL_VIEWER
        # 使用方：仅最新已发布；制定方通过 filter 的 created_by 看到自己的草稿/待审
        return DocumentVersionAudience.AUTHOR

    def _visible_ids(
        self,
        rows: Sequence[ProductFirmware],
        *,
        latest_ids: Set[int],
        audience: DocumentVersionAudience,
        current_user_id: Optional[int],
    ) -> Set[int]:
        policy_rows = [
            firmware_policy_row(r, latest_released_ids=latest_ids) for r in rows
        ]
        visible = filter_version_rows(
            policy_rows,
            audience=audience,
            current_user_id=current_user_id,
        )
        return {int(r["id"]) for r in visible if r.get("id") is not None}

    async def _assert_visible(
        self,
        tenant_id: int,
        row: ProductFirmware,
        *,
        current_user_id: Optional[int],
        permission_codes: Optional[Sequence[str]],
        production_view: bool = False,
    ) -> None:
        latest = await self._latest_released_ids(tenant_id, [row.project_id])
        audience = self._resolve_audience(
            permission_codes=permission_codes,
            production_view=production_view,
        )
        visible = self._visible_ids(
            [row],
            latest_ids=latest,
            audience=audience,
            current_user_id=current_user_id,
        )
        if row.id not in visible:
            raise NotFoundError("产品固件不存在或无权查看")

    async def create(
        self, tenant_id: int, payload: ProductFirmwareCreate, user: User
    ) -> ProductFirmwareResponse:
        project = await self._require_project(tenant_id, payload.project_id)
        data = payload.model_dump(exclude_unset=False)
        data["firmware_code"] = await self._ensure_code(tenant_id, data.get("firmware_code"))
        exists = await ProductFirmware.filter(
            tenant_id=tenant_id,
            firmware_code=data["firmware_code"],
            deleted_at__isnull=True,
        ).exists()
        if exists:
            raise BusinessLogicError("固件单号已存在")
        clash = await ProductFirmware.filter(
            tenant_id=tenant_id,
            project_id=project.id,
            version=data["version"],
            deleted_at__isnull=True,
        ).exists()
        if clash:
            raise BusinessLogicError("同一项目下固件版本号已存在")

        row = ProductFirmware(
            tenant_id=tenant_id,
            firmware_code=data["firmware_code"],
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            version=data["version"],
            title=data["title"],
            release_date=data.get("release_date"),
            status="draft",
            file_uuid=data.get("file_uuid"),
            file_name=data.get("file_name"),
            checksum=data.get("checksum"),
            change_summary=data.get("change_summary"),
            remarks=data.get("remarks"),
        )
        apply_create_audit(row, user)
        await row.save()
        return ProductFirmwareResponse.model_validate(row)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
        production_download_only: bool = False,
        current_user_id: Optional[int] = None,
        permission_codes: Optional[List[str]] = None,
    ) -> ProductFirmwareListResponse:
        manage = _can_manage(permission_codes)
        codes = {
            str(c or "").strip().lower() for c in (permission_codes or []) if str(c or "").strip()
        }
        is_global = DOCUMENT_GLOBAL_VIEW_PERMISSION in codes or manage

        query = ProductFirmware.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if production_download_only:
            query = query.filter(status="released")
        if project_id:
            query = query.filter(project_id=project_id)
        if status:
            if status not in ALLOWED_STATUS:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=status)
        elif not production_download_only and not is_global:
            query = query.filter(
                Q(status="released")
                | Q(
                    status__in=["draft", "pending", "approved"],
                    created_by=current_user_id,
                )
            )
        if keyword:
            query = query.filter(title__icontains=keyword)

        # 先取候选再按 INF-05 过滤，再分页（固件量级可控）
        candidates = await query.order_by("-updated_at", "-id")
        project_ids = list({r.project_id for r in candidates})
        latest_ids = await self._latest_released_ids(tenant_id, project_ids)
        audience = self._resolve_audience(
            permission_codes=permission_codes,
            production_view=production_download_only,
        )
        if audience == DocumentVersionAudience.GLOBAL_VIEWER:
            visible_rows = list(candidates)
        else:
            visible_id_set = self._visible_ids(
                candidates,
                latest_ids=latest_ids,
                audience=audience,
                current_user_id=current_user_id,
            )
            visible_rows = [r for r in candidates if r.id in visible_id_set]

        total = len(visible_rows)
        page = visible_rows[skip : skip + limit]
        return ProductFirmwareListResponse(
            items=[ProductFirmwareResponse.model_validate(r) for r in page],
            total=total,
        )

    async def get(
        self,
        tenant_id: int,
        firmware_id: int,
        *,
        current_user_id: Optional[int] = None,
        permission_codes: Optional[List[str]] = None,
        production_view: bool = False,
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        await self._assert_visible(
            tenant_id,
            row,
            current_user_id=current_user_id,
            permission_codes=permission_codes,
            production_view=production_view,
        )
        return ProductFirmwareResponse.model_validate(row)

    async def update(
        self, tenant_id: int, firmware_id: int, payload: ProductFirmwareUpdate, user: User
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status not in {"draft", "pending"}:
            raise BusinessLogicError("仅草稿或待审固件可编辑")
        data = payload.model_dump(exclude_unset=True)
        if "version" in data and data["version"] != row.version:
            clash = await ProductFirmware.filter(
                tenant_id=tenant_id,
                project_id=row.project_id,
                version=data["version"],
                deleted_at__isnull=True,
            ).exclude(id=firmware_id).exists()
            if clash:
                raise BusinessLogicError("同一项目下固件版本号已存在")
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return ProductFirmwareResponse.model_validate(row)

    async def submit(
        self, tenant_id: int, firmware_id: int, user: User
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status != "draft":
            raise BusinessLogicError("仅草稿可提交审核")
        if not row.file_uuid:
            raise ValidationError("提交前须上传固件文件")

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="product_firmware",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"产品固件审核 {row.firmware_code} {row.version}",
                content=row.title,
                business_type="",
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return ProductFirmwareResponse.model_validate(row)

    async def approve(
        self, tenant_id: int, firmware_id: int, user: User
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审固件可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return ProductFirmwareResponse.model_validate(row)

    async def reject(
        self, tenant_id: int, firmware_id: int, user: User
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审固件可驳回")
        row.status = "draft"
        row.submitted_at = None
        apply_update_audit(row, user)
        await row.save()
        return ProductFirmwareResponse.model_validate(row)

    async def release(
        self, tenant_id: int, firmware_id: int, user: User
    ) -> ProductFirmwareResponse:
        """发布后生产方可下载；同项目先前已发布版作废（仅最新生产生效）。"""
        async with in_transaction():
            row = (
                await ProductFirmware.filter(
                    tenant_id=tenant_id, id=firmware_id, deleted_at__isnull=True
                )
                .select_for_update()
                .first()
            )
            if not row:
                raise NotFoundError("产品固件不存在")
            if row.status != "approved":
                raise BusinessLogicError("仅已审核固件可发布给生产下载")

            siblings = await ProductFirmware.filter(
                tenant_id=tenant_id,
                project_id=row.project_id,
                status="released",
                deleted_at__isnull=True,
            ).exclude(id=row.id)
            now = resolve_business_datetime()
            for old in siblings:
                old.status = "obsolete"
                old.obsolete_at = now
                apply_update_audit(old, user)
                await old.save()

            row.status = "released"
            row.released_at = now
            if not row.release_date:
                row.release_date = to_site_date(row.released_at)
            apply_update_audit(row, user)
            await row.save()
            return ProductFirmwareResponse.model_validate(row)

    async def obsolete(
        self, tenant_id: int, firmware_id: int, user: User
    ) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status not in {"approved", "released"}:
            raise BusinessLogicError("仅已审核或已发布固件可作废")
        row.status = "obsolete"
        row.obsolete_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return ProductFirmwareResponse.model_validate(row)

    async def delete(self, tenant_id: int, firmware_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, firmware_id)
        if row.status not in {"draft"}:
            raise BusinessLogicError("仅草稿可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
