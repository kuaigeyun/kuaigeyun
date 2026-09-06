"""BOM 协同服务（R-15 #65）"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.bom_collaboration import (
    BOM_COLLAB_SECTIONS,
    SECTION_ELECTRONICS,
    SECTION_STRUCTURE,
    BomCollaboration,
    BomCollaborationLine,
)
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.schemas.bom_collaboration import (
    BomCollabCreate,
    BomCollabEnter,
    BomCollabFormProfile,
    BomCollabFormProfileSection,
    BomCollabLineIn,
    BomCollabLineOut,
    BomCollabListItem,
    BomCollabListResponse,
    BomCollabResponse,
    BomCollabSectionUpdate,
    BomCollabUpdate,
)
from core.services.application.industry_extension_runtime_service import (
    IndustryExtensionRuntimeService,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "bom_collaboration"
PROFILE_KEY = "kuaiplm.bom_collab"
ALLOWED_STATUS = {"draft", "pending", "approved", "entered", "rejected"}


class BomCollaborationService(AppBaseService[BomCollaboration]):
    code_field = "collab_code"
    rule_code = "KUAI_PLM_BOM_COLLAB_CODE"
    code_prefix = "BOMX"

    def __init__(self) -> None:
        super().__init__(BomCollaboration)
        self.model = BomCollaboration

    async def _profile(self, tenant_id: int) -> Dict[str, Any]:
        return await IndustryExtensionRuntimeService.resolve_profile(tenant_id, PROFILE_KEY)

    async def get_form_profile(self, tenant_id: int) -> BomCollabFormProfile:
        profile = await self._profile(tenant_id)
        sections: List[BomCollabFormProfileSection] = []
        for item in profile.get("sections") or []:
            if not isinstance(item, dict) or not item.get("key"):
                continue
            if item.get("active", True) is False:
                continue
            sections.append(
                BomCollabFormProfileSection(
                    key=str(item["key"]),
                    label=str(item.get("label") or item["key"]),
                    sort=int(item.get("sort") or 0),
                    active=True,
                )
            )
        sections.sort(key=lambda s: s.sort)
        return BomCollabFormProfile(sections=sections)

    def _section_label(self, profile: Dict[str, Any], section_key: str) -> str:
        for item in profile.get("sections") or []:
            if isinstance(item, dict) and str(item.get("key")) == section_key:
                return str(item.get("label") or section_key)
        return section_key

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

    async def _get_row(self, tenant_id: int, collab_id: int) -> BomCollaboration:
        row = await BomCollaboration.filter(
            tenant_id=tenant_id, id=collab_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("BOM 协同单不存在")
        return row

    def _validate_section(self, section: str) -> str:
        raw = (section or "").strip().lower()
        if raw not in BOM_COLLAB_SECTIONS:
            raise ValidationError(f"非法分区: {section}")
        return raw

    async def _load_lines(
        self, tenant_id: int, collab_id: int, section: Optional[str] = None
    ) -> List[BomCollaborationLine]:
        q = BomCollaborationLine.filter(
            tenant_id=tenant_id, collab_id=collab_id, deleted_at__isnull=True
        )
        if section:
            q = q.filter(section=section)
        return await q.order_by("section", "line_no", "id")

    def _to_response(
        self, row: BomCollaboration, lines: List[BomCollaborationLine]
    ) -> BomCollabResponse:
        data = BomCollabResponse.model_validate(row)
        data.electronics_lines = [
            BomCollabLineOut.model_validate(x)
            for x in lines
            if x.section == SECTION_ELECTRONICS
        ]
        data.structure_lines = [
            BomCollabLineOut.model_validate(x)
            for x in lines
            if x.section == SECTION_STRUCTURE
        ]
        return data

    async def _replace_section_lines(
        self,
        tenant_id: int,
        collab_id: int,
        section: str,
        lines: List[BomCollabLineIn],
        user: User,
    ) -> None:
        now = resolve_business_datetime()
        await BomCollaborationLine.filter(
            tenant_id=tenant_id,
            collab_id=collab_id,
            section=section,
            deleted_at__isnull=True,
        ).update(deleted_at=now)
        for idx, line in enumerate(lines, start=1):
            if not (line.material_code or "").strip() or not (line.material_name or "").strip():
                raise ValidationError("物料编码与名称不能为空")
            row = BomCollaborationLine(
                tenant_id=tenant_id,
                collab_id=collab_id,
                section=section,
                line_no=idx,
                material_id=line.material_id,
                material_code=line.material_code.strip(),
                material_name=line.material_name.strip(),
                qty=line.qty,
                unit=line.unit,
                remarks=(line.remarks or "").strip() or None,
            )
            apply_create_audit(row, user)
            await row.save()

    def _section_status(self, line_count: int) -> str:
        return "ready" if line_count > 0 else "draft"

    async def create(
        self, tenant_id: int, payload: BomCollabCreate, user: User
    ) -> BomCollabResponse:
        project = await self._require_project(tenant_id, payload.project_id)
        code = await self._ensure_code(tenant_id, payload.collab_code)
        exists = await BomCollaboration.filter(
            tenant_id=tenant_id, collab_code=code, deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("协同单号已存在")

        row = BomCollaboration(
            tenant_id=tenant_id,
            collab_code=code,
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            title=payload.title.strip(),
            status="draft",
            electronics_status="draft",
            structure_status="draft",
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()

        await self._replace_section_lines(
            tenant_id, row.id, SECTION_ELECTRONICS, payload.electronics_lines or [], user
        )
        await self._replace_section_lines(
            tenant_id, row.id, SECTION_STRUCTURE, payload.structure_lines or [], user
        )
        row.electronics_status = self._section_status(len(payload.electronics_lines or []))
        row.structure_status = self._section_status(len(payload.structure_lines or []))
        await row.save()

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
    ) -> BomCollabListResponse:
        query = BomCollaboration.filter(tenant_id=tenant_id, deleted_at__isnull=True)
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
        items: List[BomCollabListItem] = []
        for row in rows:
            e_count = await BomCollaborationLine.filter(
                tenant_id=tenant_id,
                collab_id=row.id,
                section=SECTION_ELECTRONICS,
                deleted_at__isnull=True,
            ).count()
            s_count = await BomCollaborationLine.filter(
                tenant_id=tenant_id,
                collab_id=row.id,
                section=SECTION_STRUCTURE,
                deleted_at__isnull=True,
            ).count()
            item = BomCollabListItem.model_validate(row)
            item.electronics_line_count = e_count
            item.structure_line_count = s_count
            items.append(item)
        return BomCollabListResponse(items=items, total=total)

    async def get(self, tenant_id: int, collab_id: int) -> BomCollabResponse:
        row = await self._get_row(tenant_id, collab_id)
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def update(
        self, tenant_id: int, collab_id: int, payload: BomCollabUpdate, user: User
    ) -> BomCollabResponse:
        row = await self._get_row(tenant_id, collab_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可编辑表头")
        data = payload.model_dump(exclude_unset=True)
        if "title" in data and data["title"] is not None:
            data["title"] = str(data["title"]).strip()
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def update_section(
        self,
        tenant_id: int,
        collab_id: int,
        section: str,
        payload: BomCollabSectionUpdate,
        user: User,
    ) -> BomCollabResponse:
        """仅替换指定分区行，保证两分区并行保存互不覆盖。"""
        section = self._validate_section(section)
        row = await self._get_row(tenant_id, collab_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可编辑分区")
        await self._replace_section_lines(
            tenant_id, collab_id, section, payload.lines or [], user
        )
        count = len(payload.lines or [])
        if section == SECTION_ELECTRONICS:
            row.electronics_status = self._section_status(count)
        else:
            row.structure_status = self._section_status(count)
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def submit(
        self, tenant_id: int, collab_id: int, user: User
    ) -> BomCollabResponse:
        row = await self._get_row(tenant_id, collab_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可提交审核")
        profile = await self._profile(tenant_id)
        e_label = self._section_label(profile, SECTION_ELECTRONICS)
        s_label = self._section_label(profile, SECTION_STRUCTURE)
        e_lines = await self._load_lines(tenant_id, collab_id, SECTION_ELECTRONICS)
        s_lines = await self._load_lines(tenant_id, collab_id, SECTION_STRUCTURE)
        if not e_lines:
            raise ValidationError(f"提交前「{e_label}」须至少一行")
        if not s_lines:
            raise ValidationError(f"提交前「{s_label}」须至少一行")

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="bom_collaboration",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"BOM 协同 {row.collab_code}",
                content=row.title,
                business_type="",
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        all_lines = e_lines + s_lines
        return self._to_response(row, all_lines)

    async def approve(
        self, tenant_id: int, collab_id: int, user: User
    ) -> BomCollabResponse:
        row = await self._get_row(tenant_id, collab_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def reject(
        self, tenant_id: int, collab_id: int, user: User
    ) -> BomCollabResponse:
        row = await self._get_row(tenant_id, collab_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审单据可驳回")
        row.status = "rejected"
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def enter(
        self, tenant_id: int, collab_id: int, payload: BomCollabEnter, user: User
    ) -> BomCollabResponse:
        """文员录入：回写主数据 BOM 引用，不复制 BOM 主表。"""
        row = await self._get_row(tenant_id, collab_id)
        if row.status != "approved":
            raise BusinessLogicError("仅已审核协同单可录入")
        row.status = "entered"
        row.master_bom_id = payload.master_bom_id
        row.master_bom_code = (payload.master_bom_code or "").strip() or None
        row.entered_by = user.id
        row.entered_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        row.entered_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        lines = await self._load_lines(tenant_id, collab_id)
        return self._to_response(row, lines)

    async def delete(self, tenant_id: int, collab_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, collab_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可删除")
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, user)
        await row.save()
        await BomCollaborationLine.filter(
            tenant_id=tenant_id, collab_id=collab_id, deleted_at__isnull=True
        ).update(deleted_at=now)
