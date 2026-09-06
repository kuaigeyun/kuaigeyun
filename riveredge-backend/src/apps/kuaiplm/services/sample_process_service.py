"""样品加工申请服务（R-15 #33）— 种类/附件/校验读行业扩展 profile。"""

from __future__ import annotations

from typing import Any, Dict, Optional

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.rd_project import RdProject
from apps.kuaiplm.models.sample_process import SampleProcessApplication
from apps.kuaiplm.schemas.sample_process import (
    SampleProcessAttachment,
    SampleProcessCreate,
    SampleProcessFormProfile,
    SampleProcessListResponse,
    SampleProcessResponse,
    SampleProcessUpdate,
)
from core.services.application.industry_extension_runtime_service import (
    IndustryExtensionRuntimeService,
)
from core.services.approval.approval_instance_service import ApprovalInstanceService
from core.services.approval.audit_binding_service import AuditBindingService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

AUDIT_NODE = "sample_process"
PROFILE_KEY = "kuaiplm.sample_process"
ALLOWED_STATUS = {"draft", "pending", "approved", "rejected", "closed"}


class SampleProcessService(AppBaseService[SampleProcessApplication]):
    code_field = "application_code"
    rule_code = "KUAI_PLM_SAMPLE_PROCESS_CODE"
    code_prefix = "YPJG"

    def __init__(self) -> None:
        super().__init__(SampleProcessApplication)
        self.model = SampleProcessApplication

    async def _profile(self, tenant_id: int) -> Dict[str, Any]:
        return await IndustryExtensionRuntimeService.resolve_profile(tenant_id, PROFILE_KEY)

    async def get_form_profile(self, tenant_id: int) -> SampleProcessFormProfile:
        profile = await self._profile(tenant_id)
        return SampleProcessFormProfile(
            request_kinds=list(profile.get("request_kinds") or []),
            attachment_types=list(profile.get("attachment_types") or []),
            field_labels=dict(profile.get("field_labels") or {}),
            validation_rules=list(profile.get("validation_rules") or []),
        )

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _get_row(self, tenant_id: int, application_id: int) -> SampleProcessApplication:
        row = await SampleProcessApplication.filter(
            tenant_id=tenant_id, id=application_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("样品加工申请不存在")
        return row

    async def _require_project(self, tenant_id: int, project_id: int) -> RdProject:
        project = await RdProject.filter(
            tenant_id=tenant_id, id=project_id, deleted_at__isnull=True
        ).first()
        if not project:
            raise ValidationError("研发项目不存在")
        return project

    async def _validate_kind(self, tenant_id: int, kind: str, profile: Dict[str, Any]) -> str:
        raw = (kind or "").strip() or "general"
        allowed = IndustryExtensionRuntimeService.active_kind_codes(profile)
        if raw not in allowed:
            raise ValidationError(f"非法申请种类: {kind}")
        return raw

    async def _normalize_attachments(
        self, tenant_id: int, raw: list[Any] | None, profile: Dict[str, Any]
    ) -> list[dict[str, Any]]:
        if not raw:
            return []
        allowed = IndustryExtensionRuntimeService.active_attachment_codes(profile)
        out: list[dict[str, Any]] = []
        for item in raw:
            if isinstance(item, SampleProcessAttachment):
                data = item.model_dump()
            elif isinstance(item, dict):
                data = item
            else:
                raise ValidationError("附件格式非法")
            atype = str(data.get("attachment_type") or "").strip()
            fuuid = str(data.get("file_uuid") or "").strip()
            if not atype or not fuuid:
                raise ValidationError("附件须包含 attachment_type 与 file_uuid")
            if atype not in allowed:
                raise ValidationError(f"非法附件类型: {atype}")
            out.append(
                {
                    "attachment_type": atype,
                    "file_uuid": fuuid,
                    "file_name": (str(data.get("file_name") or "").strip() or None),
                }
            )
        return out

    async def create(
        self, tenant_id: int, payload: SampleProcessCreate, user: User
    ) -> SampleProcessResponse:
        profile = await self._profile(tenant_id)
        project = await self._require_project(tenant_id, payload.project_id)
        kind = await self._validate_kind(tenant_id, payload.request_kind, profile)
        attachments = await self._normalize_attachments(tenant_id, payload.attachments, profile)
        code = await self._ensure_code(tenant_id, payload.application_code)
        exists = await SampleProcessApplication.filter(
            tenant_id=tenant_id,
            application_code=code,
            deleted_at__isnull=True,
        ).exists()
        if exists:
            raise BusinessLogicError("申请单号已存在")

        row = SampleProcessApplication(
            tenant_id=tenant_id,
            application_code=code,
            project_id=project.id,
            project_code=project.project_code,
            project_name=project.project_name,
            request_kind=kind,
            title=payload.title.strip(),
            material_code=(payload.material_code or "").strip() or None,
            material_version=(payload.material_version or "").strip() or None,
            release_date=payload.release_date,
            purpose=payload.purpose,
            status="draft",
            attachments=attachments,
            remarks=payload.remarks,
        )
        apply_create_audit(row, user)
        await row.save()
        return SampleProcessResponse.model_validate(row)

    async def list(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        project_id: Optional[int] = None,
        request_kind: Optional[str] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> SampleProcessListResponse:
        query = SampleProcessApplication.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if project_id:
            query = query.filter(project_id=project_id)
        if status:
            if status not in ALLOWED_STATUS:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=status)
        if request_kind:
            profile = await self._profile(tenant_id)
            query = query.filter(
                request_kind=await self._validate_kind(tenant_id, request_kind, profile)
            )
        if keyword:
            query = query.filter(title__icontains=keyword)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return SampleProcessListResponse(
            items=[SampleProcessResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get(self, tenant_id: int, application_id: int) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        return SampleProcessResponse.model_validate(row)

    async def update(
        self, tenant_id: int, application_id: int, payload: SampleProcessUpdate, user: User
    ) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回申请可编辑")
        profile = await self._profile(tenant_id)
        data = payload.model_dump(exclude_unset=True)
        if "request_kind" in data and data["request_kind"] is not None:
            data["request_kind"] = await self._validate_kind(
                tenant_id, data["request_kind"], profile
            )
        if "attachments" in data:
            data["attachments"] = await self._normalize_attachments(
                tenant_id, data.get("attachments") or [], profile
            )
        if "title" in data and data["title"] is not None:
            data["title"] = str(data["title"]).strip()
        for key in ("material_code", "material_version"):
            if key in data and data[key] is not None:
                data[key] = str(data[key]).strip() or None
        for key, value in data.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return SampleProcessResponse.model_validate(row)

    async def submit(
        self, tenant_id: int, application_id: int, user: User
    ) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可提交审核")
        attachments = row.attachments or []
        if not attachments:
            raise ValidationError("提交前须至少上传一个附件")

        profile = await self._profile(tenant_id)
        await self._validate_kind(tenant_id, row.request_kind, profile)
        required = IndustryExtensionRuntimeService.require_fields_for_kind(
            profile, row.request_kind
        )
        if "material_code" in required and not (row.material_code or "").strip():
            msg = IndustryExtensionRuntimeService.validation_message(
                profile, row.request_kind
            ) or "请填写物料编码"
            raise ValidationError(msg)

        row.status = "pending"
        row.submitted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()

        if await AuditBindingService.is_audit_enabled(tenant_id, AUDIT_NODE):
            instance = await ApprovalInstanceService.start_approval_for_node(
                tenant_id=tenant_id,
                user_id=user.id,
                node_key=AUDIT_NODE,
                entity_type="sample_process",
                entity_id=row.id,
                entity_uuid=str(row.uuid),
                title=f"样品加工申请 {row.application_code}",
                content=row.title,
                business_type=row.request_kind,
                send_notification=True,
            )
            if instance is None:
                raise ValidationError(
                    f"审核已开启但未找到可用审批流程，请检查 {AUDIT_NODE} 绑定"
                )
        return SampleProcessResponse.model_validate(row)

    async def approve(
        self, tenant_id: int, application_id: int, user: User
    ) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审申请可通过")
        row.status = "approved"
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return SampleProcessResponse.model_validate(row)

    async def reject(
        self, tenant_id: int, application_id: int, user: User
    ) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        if row.status != "pending":
            raise BusinessLogicError("仅待审申请可驳回")
        row.status = "rejected"
        apply_update_audit(row, user)
        await row.save()
        return SampleProcessResponse.model_validate(row)

    async def close(
        self, tenant_id: int, application_id: int, user: User
    ) -> SampleProcessResponse:
        row = await self._get_row(tenant_id, application_id)
        if row.status != "approved":
            raise BusinessLogicError("仅已审核申请可关闭")
        row.status = "closed"
        row.closed_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
        return SampleProcessResponse.model_validate(row)

    async def delete(self, tenant_id: int, application_id: int, user: User) -> None:
        row = await self._get_row(tenant_id, application_id)
        if row.status not in {"draft", "rejected"}:
            raise BusinessLogicError("仅草稿或已驳回可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, user)
        await row.save()
