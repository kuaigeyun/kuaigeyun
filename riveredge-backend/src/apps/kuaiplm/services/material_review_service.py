"""物料评审服务（R-15 #37）"""

from __future__ import annotations

from typing import List, Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.material_review import (
    USAGE_STATUSES,
    MaterialReview,
    MaterialReviewLine,
)
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.material_review import (
    MaterialReviewCreate,
    MaterialReviewLineIn,
    MaterialReviewLineOut,
    MaterialReviewListItem,
    MaterialReviewListResponse,
    MaterialReviewResponse,
    MaterialReviewUpdate,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "material_review"
ALLOWED_STATUS = {"draft", "pending", "approved", "rejected"}


class MaterialReviewService(AppBaseService[MaterialReview]):
    code_field = "review_code"
    rule_code = "KUAI_PLM_MATERIAL_REVIEW_CODE"
    code_prefix = "WLPJ"

    def __init__(self) -> None:
        super().__init__(MaterialReview)
        self.model = MaterialReview

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

    async def _get_row(self, tenant_id: int, review_id: int) -> MaterialReview:
        row = await MaterialReview.filter(
            tenant_id=tenant_id, id=review_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("物料评审单不存在")
        return row

    async def _load_lines(self, tenant_id: int, review_id: int) -> List[MaterialReviewLine]:
        return (
            await MaterialReviewLine.filter(
                tenant_id=tenant_id, review_id=review_id, deleted_at__isnull=True
            )
            .order_by("line_no", "id")
        )

    def _to_response(
        self, row: MaterialReview, lines: List[MaterialReviewLine]
    ) -> MaterialReviewResponse:
        data = MaterialReviewResponse.model_validate(row)
        data.lines = [MaterialReviewLineOut.model_validate(line) for line in lines]
        return data

    def _validate_line(self, line: MaterialReviewLineIn) -> None:
        status = (line.usage_status or "").strip()
        if status not in USAGE_STATUSES:
            raise ValidationError(f"非法使用状态: {line.usage_status}")
        if not (line.material_code or "").strip() or not (line.material_name or "").strip():
            raise ValidationError("物料编码与名称不能为空")

    async def _replace_lines(
        self,
        tenant_id: int,
        review_id: int,
        lines: List[MaterialReviewLineIn],
        user: User,
    ) -> None:
        now = resolve_business_datetime()
        await MaterialReviewLine.filter(
            tenant_id=tenant_id, review_id=review_id, deleted_at__isnull=True
        ).update(deleted_at=now)
        for idx, line in enumerate(lines, start=1):
            self._validate_line(line)
            row = MaterialReviewLine(
                tenant_id=tenant_id,
                review_id=review_id,
                line_no=idx,
                material_id=line.material_id,
                material_code=line.material_code.strip(),
                material_name=line.material_name.strip(),
                usage_status=line.usage_status.strip(),
                remarks=(line.remarks or "").strip() or None,
            )
            apply_create_audit(row, user)
            await row.save()

    async def create(
        self, tenant_id: int, payload: MaterialReviewCreate, user: User
    ) -> MaterialReviewResponse:
        project = await self._require_project(tenant_id, payload.project_id)
        code = await self._ensure_code(tenant_id, payload.review_code)
        exists = await MaterialReview.filter(
            tenant_id=tenant_id, review_code=code, deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("评审单号已存在")

        row = MaterialReview(
            tenant_id=tenant_id,
            review_code=code,
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            title=payload.title.strip(),
            status="draft",
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        await self._replace_lines(tenant_id, row.id, payload.lines or [], user)
        lines = await self._load_lines(tenant_id, row.id)
        return self._to_response(row, lines)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> MaterialReviewListResponse:
        query = MaterialReview.filter(tenant_id=tenant_id, deleted_at__isnull=True)
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
        items: List[MaterialReviewListItem] = []
        for row in rows:
            line_count = await MaterialReviewLine.filter(
                tenant_id=tenant_id, review_id=row.id, deleted_at__isnull=True
            ).count()
            item = MaterialReviewListItem.model_validate(row)
            item.line_count = line_count
            items.append(item)
        return MaterialReviewListResponse(items=items, total=total)

    async def get(self, tenant_id: int, review_id: int) -> MaterialReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        lines = await self._load_lines(tenant_id, review_id)
        return self._to_response(row, lines)

    async def update(
        self, tenant_id: int, review_id: int, payload: MaterialReviewUpdate, user: User
    ) -> MaterialReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可编辑")
        data = payload.model_dump(exclude_unset=True)
        lines = data.pop("lines", None)
        if "title" in data and data["title"] is not None:
            data["title"] = str(data["title"]).strip()
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        if lines is not None:
            await self._replace_lines(
                tenant_id,
                review_id,
                [MaterialReviewLineIn.model_validate(x) for x in lines],
                user,
            )
        loaded = await self._load_lines(tenant_id, review_id)
        return self._to_response(row, loaded)

    async def submit(
        self, tenant_id: int, review_id: int, user: User
    ) -> MaterialReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可提交审核")
        lines = await self._load_lines(tenant_id, review_id)
        if not lines:
            raise ValidationError("提交前须至少一行物料评审明细")

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="material_review",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"物料评审 {row.review_code}",
                content=row.title,
                business_type="",
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return self._to_response(row, lines)

    async def approve(
        self, tenant_id: int, review_id: int, user: User
    ) -> MaterialReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, review_id)
        return self._to_response(row, lines)

    async def reject(
        self, tenant_id: int, review_id: int, user: User
    ) -> MaterialReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可驳回")
        row.status = "rejected"
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, review_id)
        return self._to_response(row, lines)

    async def delete(self, tenant_id: int, review_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, review_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可删除")
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, user)
        await row.save()
        await MaterialReviewLine.filter(
            tenant_id=tenant_id, review_id=review_id, deleted_at__isnull=True
        ).update(deleted_at=now)
