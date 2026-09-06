"""开模合同 / 打样订单服务（R-15 #71）"""

from __future__ import annotations

from typing import Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.mold_sample_order import MoldSampleOrder
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.mold_sample_order import (
    DOC_KINDS,
    MoldSampleOrderCreate,
    MoldSampleOrderListResponse,
    MoldSampleOrderResponse,
    MoldSampleOrderUpdate,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "mold_sample"
ALLOWED_STATUS = {"draft", "pending", "approved", "sealed", "archived", "rejected"}


class MoldSampleOrderService(AppBaseService[MoldSampleOrder]):
    code_field = "order_code"
    rule_code = "KUAI_PLM_MOLD_SAMPLE_CODE"
    code_prefix = "KMTY"

    def __init__(self) -> None:
        super().__init__(MoldSampleOrder)
        self.model = MoldSampleOrder

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    def _normalize_kind(self, kind: str) -> str:
        value = (kind or "").strip()
        if value not in DOC_KINDS:
            raise ValidationError("单据种类须为开模合同或打样订单")
        return value

    async def _require_project(self, tenant_id: int, project_id: int) -> RdProject:
        project = await RdProject.filter(
            tenant_id=tenant_id, id=project_id, deleted_at__isnull=True
        ).first()
        if not project:
            raise ValidationError("研发项目不存在")
        return project

    async def _get_row(self, tenant_id: int, order_id: int) -> MoldSampleOrder:
        row = await MoldSampleOrder.filter(
            tenant_id=tenant_id, id=order_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("开模合同/打样订单不存在")
        return row

    async def create(
        self, tenant_id: int, payload: MoldSampleOrderCreate, user: User
    ) -> MoldSampleOrderResponse:
        project = await self._require_project(tenant_id, payload.project_id)
        code = await self._ensure_code(tenant_id, payload.order_code)
        exists = await MoldSampleOrder.filter(
            tenant_id=tenant_id, order_code=code, deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("单号已存在")

        row = MoldSampleOrder(
            tenant_id=tenant_id,
            order_code=code,
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            doc_kind=self._normalize_kind(payload.doc_kind),
            title=payload.title.strip(),
            contract_no=(payload.contract_no or "").strip() or None,
            party_name=(payload.party_name or "").strip() or None,
            file_uuid=payload.file_uuid,
            file_name=payload.file_name,
            status="draft",
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        doc_kind: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> MoldSampleOrderListResponse:
        query = MoldSampleOrder.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if project_id:
            query = query.filter(project_id=project_id)
        if status:
            if status not in ALLOWED_STATUS:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=status)
        if doc_kind:
            query = query.filter(doc_kind=self._normalize_kind(doc_kind))
        if keyword:
            query = query.filter(title__icontains=keyword)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return MoldSampleOrderListResponse(
            items=[MoldSampleOrderResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get(self, tenant_id: int, order_id: int) -> MoldSampleOrderResponse:
        row = await self._get_row(tenant_id, order_id)
        return MoldSampleOrderResponse.model_validate(row)

    async def update(
        self, tenant_id: int, order_id: int, payload: MoldSampleOrderUpdate, user: User
    ) -> MoldSampleOrderResponse:
        row = await self._get_row(tenant_id, order_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可编辑")
        data = payload.model_dump(exclude_unset=True)
        if "doc_kind" in data and data["doc_kind"] is not None:
            data["doc_kind"] = self._normalize_kind(str(data["doc_kind"]))
        if "title" in data and data["title"] is not None:
            data["title"] = str(data["title"]).strip()
        if "contract_no" in data and data["contract_no"] is not None:
            data["contract_no"] = str(data["contract_no"]).strip() or None
        if "party_name" in data and data["party_name"] is not None:
            data["party_name"] = str(data["party_name"]).strip() or None
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def submit(
        self, tenant_id: int, order_id: int, user: User
    ) -> MoldSampleOrderResponse:
        row = await self._get_row(tenant_id, order_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可提交审核")
        if not (row.file_uuid or "").strip():
            raise ValidationError("提交前须上传合同或订单文件")

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="mold_sample",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"开模/打样 {row.order_code}",
                content=row.title,
                business_type=row.doc_kind,
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return MoldSampleOrderResponse.model_validate(row)

    async def approve(
        self, tenant_id: int, order_id: int, user: User
    ) -> MoldSampleOrderResponse:
        row = await self._get_row(tenant_id, order_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def reject(
        self, tenant_id: int, order_id: int, user: User
    ) -> MoldSampleOrderResponse:
        row = await self._get_row(tenant_id, order_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可驳回")
        row.status = "rejected"
        apply_update_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def seal(
        self, tenant_id: int, order_id: int, user: User
    ) -> MoldSampleOrderResponse:
        """打印用印。"""
        row = await self._get_row(tenant_id, order_id)
        if row.status != "approved":
            raise BusinessLogicError("仅已审核单据可打印用印")
        row.status = "sealed"
        row.sealed_at = resolve_business_datetime()
        row.sealed_by = user.id
        row.sealed_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        apply_update_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def archive(
        self, tenant_id: int, order_id: int, user: User
    ) -> MoldSampleOrderResponse:
        """用印后存档。"""
        row = await self._get_row(tenant_id, order_id)
        if row.status != "sealed":
            raise BusinessLogicError("仅已用印单据可存档")
        row.status = "archived"
        row.archived_at = resolve_business_datetime()
        row.archived_by = user.id
        row.archived_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        apply_update_audit(row, user)
        await row.save()
        return MoldSampleOrderResponse.model_validate(row)

    async def delete(self, tenant_id: int, order_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, order_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
