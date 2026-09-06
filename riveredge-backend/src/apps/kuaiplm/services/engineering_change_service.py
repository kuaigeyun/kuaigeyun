"""工程变更服务（R-04 / ECN）"""

from __future__ import annotations

from typing import List, Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.engineering_change import (
    CHANGE_KINDS,
    DISPOSITIONS,
    EngineeringChange,
    EngineeringChangeMaterialLine,
    EngineeringChangeSignoff,
)
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.engineering_change import (
    EcnMaterialLineIn,
    EcnMaterialLineOut,
    EcnSignoffOut,
    EngineeringChangeCreate,
    EngineeringChangeErpAudit,
    EngineeringChangeListItem,
    EngineeringChangeListResponse,
    EngineeringChangeResponse,
    EngineeringChangeUpdate,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "engineering_change"
ALLOWED_STATUS = {
    "draft",
    "pending",
    "approved",
    "erp_pending",
    "erp_failed",
    "closed",
}
ERP_RESULTS = {"pass", "fail"}

# 通用部门会签骨架；条件加签后续由审批引擎计算，禁止客户专名硬编码进分支
DEFAULT_SIGNOFF_DEPTS: list[tuple[str, str]] = [
    ("rd", "研发"),
    ("pe", "工艺"),
    ("qa", "质量"),
    ("prod", "制造"),
    ("purchasing", "采购"),
    ("warehouse", "仓储"),
]


class EngineeringChangeService(AppBaseService[EngineeringChange]):
    code_field = "ecn_code"
    rule_code = "KUAI_PLM_ECN_CODE"
    code_prefix = "ECN"

    def __init__(self) -> None:
        super().__init__(EngineeringChange)
        self.model = EngineeringChange

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _optional_project(
        self, tenant_id: int, project_id: Optional[int]
    ) -> Optional[RdProject]:
        if not project_id:
            return None
        project = await RdProject.filter(
            tenant_id=tenant_id, id=project_id, deleted_at__isnull=True
        ).first()
        if not project:
            raise ValidationError("研发项目不存在")
        return project

    async def _get_row(self, tenant_id: int, ecn_id: int) -> EngineeringChange:
        row = await EngineeringChange.filter(
            tenant_id=tenant_id, id=ecn_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("工程变更单不存在")
        return row

    async def _load_children(self, tenant_id: int, ecn_id: int):
        materials = (
            await EngineeringChangeMaterialLine.filter(
                tenant_id=tenant_id, ecn_id=ecn_id, deleted_at__isnull=True
            )
            .order_by("line_no", "id")
        )
        signoffs = (
            await EngineeringChangeSignoff.filter(
                tenant_id=tenant_id, ecn_id=ecn_id, deleted_at__isnull=True
            )
            .order_by("sort_order", "id")
        )
        return materials, signoffs

    def _to_response(
        self,
        row: EngineeringChange,
        materials: List[EngineeringChangeMaterialLine],
        signoffs: List[EngineeringChangeSignoff],
    ) -> EngineeringChangeResponse:
        data = EngineeringChangeResponse.model_validate(row)
        data.materials = [EcnMaterialLineOut.model_validate(m) for m in materials]
        data.signoffs = [EcnSignoffOut.model_validate(s) for s in signoffs]
        return data

    def _validate_disposition(self, disposition: Optional[str]) -> Optional[str]:
        if disposition is None or disposition == "":
            return None
        d = disposition.strip().lower()
        if d not in DISPOSITIONS:
            raise ValidationError(f"非法库存处置: {disposition}")
        return d

    async def _replace_materials(
        self,
        tenant_id: int,
        ecn_id: int,
        materials: List[EcnMaterialLineIn],
        user: User,
    ) -> None:
        now = resolve_business_datetime()
        await EngineeringChangeMaterialLine.filter(
            tenant_id=tenant_id, ecn_id=ecn_id, deleted_at__isnull=True
        ).update(deleted_at=now)
        for idx, line in enumerate(materials, start=1):
            row = EngineeringChangeMaterialLine(
                tenant_id=tenant_id,
                ecn_id=ecn_id,
                line_no=idx,
                material_id=line.material_id,
                material_code=line.material_code.strip(),
                material_name=line.material_name.strip(),
                before_desc=line.before_desc,
                after_desc=line.after_desc,
                stock_qty=line.stock_qty,
                unit_price=line.unit_price,
                cost_amount=line.cost_amount,
                disposition=self._validate_disposition(line.disposition),
                owner_user_id=line.owner_user_id,
                owner_user_name=line.owner_user_name,
                remarks=line.remarks,
            )
            apply_create_audit(row, user)
            await row.save()

    async def _seed_signoffs(
        self, tenant_id: int, ecn_id: int, user: User
    ) -> List[EngineeringChangeSignoff]:
        created: List[EngineeringChangeSignoff] = []
        for order, (code, name) in enumerate(DEFAULT_SIGNOFF_DEPTS):
            row = EngineeringChangeSignoff(
                tenant_id=tenant_id,
                ecn_id=ecn_id,
                dept_code=code,
                dept_name=name,
                sort_order=order,
                status="pending",
            )
            apply_create_audit(row, user)
            await row.save()
            created.append(row)
        return created

    async def create(
        self, tenant_id: int, payload: EngineeringChangeCreate, user: User
    ) -> EngineeringChangeResponse:
        kind = (payload.change_kind or "").strip().lower()
        if kind not in CHANGE_KINDS:
            raise ValidationError("非法更改种类")
        project = await self._optional_project(tenant_id, payload.project_id)
        code = await self._ensure_code(tenant_id, payload.ecn_code)
        exists = await EngineeringChange.filter(
            tenant_id=tenant_id, ecn_code=code, deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("工程变更单号已存在")

        row = EngineeringChange(
            tenant_id=tenant_id,
            ecn_code=code,
            project_id=project.id if project else None,
            project_code=project.project_code if project else None,
            project_name=project.project_name if project else None,
            change_kind=kind,
            title=payload.title.strip(),
            change_reason=payload.change_reason,
            status="draft",
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        await self._replace_materials(tenant_id, row.id, payload.materials or [], user)
        await self._seed_signoffs(tenant_id, row.id, user)
        materials, signoffs = await self._load_children(tenant_id, row.id)
        return self._to_response(row, materials, signoffs)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        change_kind: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> EngineeringChangeListResponse:
        query = EngineeringChange.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if project_id:
            query = query.filter(project_id=project_id)
        if status:
            if status not in ALLOWED_STATUS:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=status)
        if change_kind:
            kind = change_kind.strip().lower()
            if kind not in CHANGE_KINDS:
                raise ValidationError("非法更改种类")
            query = query.filter(change_kind=kind)
        if keyword:
            query = query.filter(title__icontains=keyword)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return EngineeringChangeListResponse(
            items=[EngineeringChangeListItem.model_validate(r) for r in rows],
            total=total,
        )

    async def get(self, tenant_id: int, ecn_id: int) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        materials, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, materials, signoffs)

    async def get_by_uuid(self, tenant_id: int, ecn_uuid: str) -> EngineeringChangeResponse:
        row = await EngineeringChange.filter(
            tenant_id=tenant_id, uuid=ecn_uuid, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("工程变更单不存在")
        materials, signoffs = await self._load_children(tenant_id, row.id)
        return self._to_response(row, materials, signoffs)

    async def delete_by_uuid(self, tenant_id: int, ecn_uuid: str, user: User) -> None:
        row = await EngineeringChange.filter(
            tenant_id=tenant_id, uuid=ecn_uuid, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("工程变更单不存在")
        await self.delete(tenant_id, row.id, user)

    async def update(
        self,
        tenant_id: int,
        ecn_id: int,
        payload: EngineeringChangeUpdate,
        user: User,
    ) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status not in {"draft", "erp_failed"}:
            raise BusinessLogicError("仅草稿或 ERP 稽核退回可编辑")
        data = payload.model_dump(exclude_unset=True)
        materials = data.pop("materials", None)
        for key, value in data.items():
            setattr(row, key, value)
        if materials is not None:
            await self._replace_materials(tenant_id, ecn_id, materials, user)
        apply_update_audit(row, user)
        await row.save()
        mats, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, mats, signoffs)

    async def submit(
        self, tenant_id: int, ecn_id: int, user: User
    ) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status not in {"draft", "erp_failed"}:
            raise BusinessLogicError("仅草稿或 ERP 稽核退回可提交")
        mats, _ = await self._load_children(tenant_id, ecn_id)
        if not mats:
            raise ValidationError("提交前须至少一行变更物料")
        for line in mats:
            if not line.owner_user_id:
                raise ValidationError(
                    f"物料行 {line.material_code} 须指定会签负责人"
                )

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        row.erp_audit_status = None
        row.erp_audit_notes = None
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="engineering_change",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"工程变更审核 {row.ecn_code}",
                content=row.title,
                business_type=row.change_kind,
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        mats, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, mats, signoffs)

    async def approve(
        self, tenant_id: int, ecn_id: int, user: User
    ) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审工程变更可通过")
        row.status = "erp_pending"
        row.approved_at = resolve_business_datetime()
        row.erp_audit_status = "pending"
        apply_update_audit(row, user)
        await row.save()
        mats, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, mats, signoffs)

    async def reject(
        self, tenant_id: int, ecn_id: int, user: User
    ) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审工程变更可驳回")
        row.status = "draft"
        row.submitted_at = None
        apply_update_audit(row, user)
        await row.save()
        mats, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, mats, signoffs)

    async def erp_audit(
        self,
        tenant_id: int,
        ecn_id: int,
        payload: EngineeringChangeErpAudit,
        user: User,
    ) -> EngineeringChangeResponse:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status != "erp_pending":
            raise BusinessLogicError("仅待 ERP 稽核状态可回填")
        result = (payload.result or "").strip().lower()
        if result not in ERP_RESULTS:
            raise ValidationError("ERP 稽核结果须为 pass 或 fail")
        row.erp_ecn_no = payload.erp_ecn_no.strip()
        row.erp_audit_status = result
        row.erp_audit_notes = payload.notes
        if result == "pass":
            row.status = "closed"
            row.closed_at = resolve_business_datetime()
        else:
            row.status = "erp_failed"
        apply_update_audit(row, user)
        await row.save()
        mats, signoffs = await self._load_children(tenant_id, ecn_id)
        return self._to_response(row, mats, signoffs)

    async def delete(self, tenant_id: int, ecn_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, ecn_id)
        if row.status != "draft":
            raise BusinessLogicError("仅草稿可删除")
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, user)
        await row.save()
        await EngineeringChangeMaterialLine.filter(
            tenant_id=tenant_id, ecn_id=ecn_id, deleted_at__isnull=True
        ).update(deleted_at=now)
        await EngineeringChangeSignoff.filter(
            tenant_id=tenant_id, ecn_id=ecn_id, deleted_at__isnull=True
        ).update(deleted_at=now)
