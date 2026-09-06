"""项目建议书服务（R-15 #68）"""

from __future__ import annotations

from typing import Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.project_proposal import ProjectProposal
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.project_proposal import (
    ProjectProposalCreate,
    ProjectProposalListResponse,
    ProjectProposalResponse,
    ProjectProposalSupplierFill,
    ProjectProposalUpdate,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "project_proposal"
ALLOWED_STATUS = {"draft", "pending", "approved", "issued", "rejected"}


class ProjectProposalService(AppBaseService[ProjectProposal]):
    code_field = "proposal_code"
    rule_code = "KUAI_PLM_PROJECT_PROPOSAL_CODE"
    code_prefix = "XMJY"

    def __init__(self) -> None:
        super().__init__(ProjectProposal)
        self.model = ProjectProposal

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _require_project(self, tenant_id: int, project_id: int) -> RdProject:
        project = await RdProject.filter(
            tenant_id=tenant_id, id=project_id, deleted_at__isnull=True
        ).first()
        if not project:
            raise ValidationError("研发项目不存在")
        return project

    async def _get_row(self, tenant_id: int, proposal_id: int) -> ProjectProposal:
        row = await ProjectProposal.filter(
            tenant_id=tenant_id, id=proposal_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("项目建议书不存在")
        return row

    async def create(
        self, tenant_id: int, payload: ProjectProposalCreate, user: User
    ) -> ProjectProposalResponse:
        project = await self._require_project(tenant_id, payload.project_id)
        code = await self._ensure_code(tenant_id, payload.proposal_code)
        exists = await ProjectProposal.filter(
            tenant_id=tenant_id, proposal_code=code, deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("建议书单号已存在")

        row = ProjectProposal(
            tenant_id=tenant_id,
            proposal_code=code,
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            title=payload.title.strip(),
            summary=payload.summary,
            customer_name=(payload.customer_name or "").strip() or None,
            expected_date=payload.expected_date,
            supplier_id=payload.supplier_id,
            supplier_code=(payload.supplier_code or "").strip() or None,
            supplier_name=(payload.supplier_name or "").strip() or None,
            supplier_contact=(payload.supplier_contact or "").strip() or None,
            supplier_remark=payload.supplier_remark,
            status="draft",
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> ProjectProposalListResponse:
        query = ProjectProposal.filter(tenant_id=tenant_id, deleted_at__isnull=True)
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
        return ProjectProposalListResponse(
            items=[ProjectProposalResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get(self, tenant_id: int, proposal_id: int) -> ProjectProposalResponse:
        row = await self._get_row(tenant_id, proposal_id)
        return ProjectProposalResponse.model_validate(row)

    async def update(
        self, tenant_id: int, proposal_id: int, payload: ProjectProposalUpdate, user: User
    ) -> ProjectProposalResponse:
        row = await self._get_row(tenant_id, proposal_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可编辑")
        data = payload.model_dump(exclude_unset=True)
        if "title" in data and data["title"] is not None:
            data["title"] = str(data["title"]).strip()
        if "customer_name" in data and data["customer_name"] is not None:
            data["customer_name"] = str(data["customer_name"]).strip() or None
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def fill_supplier(
        self,
        tenant_id: int,
        proposal_id: int,
        payload: ProjectProposalSupplierFill,
        user: User,
    ) -> ProjectProposalResponse:
        """采购填写供应商信息。"""
        row = await self._get_row(tenant_id, proposal_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可填写供应商")
        row.supplier_id = payload.supplier_id
        row.supplier_code = (payload.supplier_code or "").strip() or None
        row.supplier_name = payload.supplier_name.strip()
        row.supplier_contact = (payload.supplier_contact or "").strip() or None
        row.supplier_remark = payload.supplier_remark
        apply_update_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def submit(
        self, tenant_id: int, proposal_id: int, user: User
    ) -> ProjectProposalResponse:
        row = await self._get_row(tenant_id, proposal_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可提交审核")
        if not (row.supplier_name or "").strip():
            raise ValidationError("提交前须由采购填写供应商")

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="project_proposal",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"项目建议书 {row.proposal_code}",
                content=row.title,
                business_type="",
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return ProjectProposalResponse.model_validate(row)

    async def approve(
        self, tenant_id: int, proposal_id: int, user: User
    ) -> ProjectProposalResponse:
        row = await self._get_row(tenant_id, proposal_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def reject(
        self, tenant_id: int, proposal_id: int, user: User
    ) -> ProjectProposalResponse:
        row = await self._get_row(tenant_id, proposal_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可驳回")
        row.status = "rejected"
        apply_update_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def issue(
        self, tenant_id: int, proposal_id: int, user: User
    ) -> ProjectProposalResponse:
        """审批后下发研发。"""
        row = await self._get_row(tenant_id, proposal_id)
        if row.status != "approved":
            raise BusinessLogicError("仅已审核建议书可下发研发")
        row.status = "issued"
        row.issued_at = resolve_business_datetime()
        row.issued_by = user.id
        row.issued_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        apply_update_audit(row, user)
        await row.save()
        return ProjectProposalResponse.model_validate(row)

    async def delete(self, tenant_id: int, proposal_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, proposal_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
