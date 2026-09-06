"""产品固件服务（R-15 #28）"""

from __future__ import annotations

from typing import Optional

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
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "product_firmware"
ALLOWED_STATUS = {"draft", "pending", "approved", "released", "obsolete"}


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
    ) -> ProductFirmwareListResponse:
        query = ProductFirmware.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if production_download_only:
            query = query.filter(status="released")
        if project_id:
            query = query.filter(project_id=project_id)
        if status:
            if status not in ALLOWED_STATUS:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=status)
        if keyword:
            query = query.filter(title__icontains=keyword)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return ProductFirmwareListResponse(
            items=[ProductFirmwareResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get(self, tenant_id: int, firmware_id: int) -> ProductFirmwareResponse:
        row = await self._get_row(tenant_id, firmware_id)
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
        else:
            # 未开审核：提交即待项目经理人工 approve 接口
            pass
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
        """发布后生产方可下载（released）。"""
        row = await self._get_row(tenant_id, firmware_id)
        if row.status != "approved":
            raise BusinessLogicError("仅已审核固件可发布给生产下载")
        row.status = "released"
        row.released_at = resolve_business_datetime()
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
