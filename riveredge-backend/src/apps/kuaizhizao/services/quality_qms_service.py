"""质量体系服务：体系文件 / 内审 / 管理评审"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Type

from tortoise.models import Model

from apps.common.base_service import AppBaseService
from apps.kuaizhizao.models.defect_record import DefectRecord
from apps.kuaizhizao.models.incoming_inspection import IncomingInspection
from apps.kuaizhizao.models.oqc_inspection import OQCInspection
from apps.kuaizhizao.models.quality_8d_report import Quality8DReport
from apps.kuaizhizao.models.qms_internal_audit import QmsInternalAudit
from apps.kuaizhizao.models.qms_management_review import QmsManagementReview
from apps.kuaizhizao.models.qms_system_document import QmsSystemDocument
from apps.kuaizhizao.schemas.quality_qms import (
    QmsInternalAuditCreate,
    QmsInternalAuditListResponse,
    QmsInternalAuditResponse,
    QmsInternalAuditUpdate,
    QmsManagementReviewCreate,
    QmsManagementReviewListResponse,
    QmsManagementReviewResponse,
    QmsManagementReviewUpdate,
    QmsManagementReviewInputSummary,
    QmsSystemDocumentReviewDueSummary,
    QmsSystemDocumentCreate,
    QmsSystemDocumentListResponse,
    QmsSystemDocumentResponse,
    QmsSystemDocumentReviseRequest,
    QmsSystemDocumentRejectRequest,
    QmsSystemDocumentUpdate,
    QmsSystemDocumentVersionListResponse,
    QmsSystemDocumentVersionResponse,
)
from apps.kuaizhizao.services.qms_iso_clause_service import iso_clause_service
from core.services.file.document_version_policy import (
    DOCUMENT_GLOBAL_VIEW_PERMISSION,
    can_view_historical_versions,
    filter_version_rows,
    resolve_audience,
)
from core.services.authorization.user_permission_service import UserPermissionService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError
from datetime import datetime
import re

DOC_STATUSES = {"draft", "effective", "obsolete", "rejected"}
DOC_ZONES = frozenset({"formal", "pending", "all"})
AUDIT_STATUSES = {"planned", "in_progress", "completed", "closed"}
REVIEW_STATUSES = {"draft", "in_progress", "completed", "closed"}


def _normalize_links(value: Any) -> Optional[List[Dict[str, Any]]]:
    if value is None:
        return None
    if not isinstance(value, list):
        raise BusinessLogicError("证据链接须为数组")
    out: List[Dict[str, Any]] = []
    for item in value:
        if not isinstance(item, dict):
            raise BusinessLogicError("证据链接元素须为对象")
        ref_type = str(item.get("ref_type") or "").strip()
        if not ref_type:
            raise BusinessLogicError("证据链接缺少 ref_type")
        out.append(
            {
                "ref_type": ref_type,
                "ref_id": item.get("ref_id"),
                "ref_code": item.get("ref_code"),
                "ref_name": item.get("ref_name"),
                "path": item.get("path"),
                "note": item.get("note"),
            }
        )
    return out


def _bump_version(current: str) -> str:
    raw = (current or "A0").strip() or "A0"
    m = re.match(r"^([A-Za-z]+)(\d+)$", raw)
    if m:
        return f"{m.group(1)}{int(m.group(2)) + 1}"
    return f"{raw}.1"


def _version_policy_row(ver: Any) -> Dict[str, Any]:
    return {
        "id": getattr(ver, "id", None),
        "document_id": getattr(ver, "document_id", None),
        "document_code": getattr(ver, "document_code", None),
        "version": getattr(ver, "version", None),
        "status": getattr(ver, "status", None),
        "is_effective": bool(getattr(ver, "is_effective", False)),
        "is_latest_effective": bool(getattr(ver, "is_effective", False)),
        "title": getattr(ver, "title", None),
        "content": getattr(ver, "content", None),
        "file_uuid": getattr(ver, "file_uuid", None),
        "file_url": getattr(ver, "file_url", None),
        "change_summary": getattr(ver, "change_summary", None),
        "effective_at": getattr(ver, "effective_at", None),
        "obsolete_at": getattr(ver, "obsolete_at", None),
        "created_by": getattr(ver, "created_by", None),
        "created_by_name": getattr(ver, "created_by_name", None),
        "created_at": getattr(ver, "created_at", None),
        "updated_at": getattr(ver, "updated_at", None),
    }


class _QmsCrudMixin:
    model: Type[Model]
    code_field: str
    rule_code: str
    code_prefix: str
    allowed_statuses: set

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _get_row(self, tenant_id: int, row_id: int) -> Model:
        row = await self.model.filter(id=row_id, tenant_id=tenant_id, deleted_at__isnull=True).first()
        if not row:
            raise NotFoundError("记录不存在")
        return row

    def _apply_status_guard(self, status: Optional[str]) -> None:
        if status is not None and status not in self.allowed_statuses:
            raise BusinessLogicError(f"非法状态: {status}")


class QmsSystemDocumentService(AppBaseService[QmsSystemDocument], _QmsCrudMixin):
    code_field = "document_code"
    rule_code = "QMS_SYSTEM_DOCUMENT_CODE"
    code_prefix = "TXWJ"
    allowed_statuses = DOC_STATUSES

    def __init__(self) -> None:
        super().__init__(QmsSystemDocument)
        self.model = QmsSystemDocument

    async def create_document(
        self,
        tenant_id: int,
        payload: QmsSystemDocumentCreate,
        *,
        actor_id: Optional[int] = None,
        actor_name: Optional[str] = None,
    ) -> QmsSystemDocumentResponse:
        data = payload.model_dump(exclude_unset=False)
        self._apply_status_guard(data.get("status"))
        data["document_code"] = await self._ensure_code(tenant_id, data.get("document_code"))
        data["evidence_links"] = _normalize_links(data.get("evidence_links"))
        data["training_refs"] = _normalize_links(data.get("training_refs"))
        data = await iso_clause_service.resolve_clause_snapshot(tenant_id, data)
        exists = await QmsSystemDocument.filter(
            tenant_id=tenant_id, document_code=data["document_code"], deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("体系文件编码已存在")
        if actor_id is not None:
            data["created_by"] = actor_id
            data["created_by_name"] = actor_name
            data["updated_by"] = actor_id
            data["updated_by_name"] = actor_name
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion

        row = await QmsSystemDocument.create(tenant_id=tenant_id, **data)
        await QmsSystemDocumentVersion.create(
            tenant_id=tenant_id,
            document_id=row.id,
            document_code=row.document_code,
            version=row.version,
            status=row.status if row.status in DOC_STATUSES else "draft",
            is_effective=False,
            title=row.title,
            content=row.content,
            file_url=row.file_url,
            created_by=getattr(row, "created_by", None),
            created_by_name=getattr(row, "created_by_name", None),
            updated_by=getattr(row, "updated_by", None),
            updated_by_name=getattr(row, "updated_by_name", None),
        )
        return QmsSystemDocumentResponse.model_validate(row)

    async def list_documents(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        doc_type: Optional[str] = None,
        zone: Optional[str] = None,
        current_user_id: Optional[int] = None,
        permission_codes: Optional[List[str]] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> QmsSystemDocumentListResponse:
        zone_key = (zone or "formal").strip().lower()
        if zone_key not in DOC_ZONES:
            raise BusinessLogicError("非法目录分区")

        codes = {str(c or "").strip().lower() for c in (permission_codes or []) if str(c or "").strip()}
        is_global = DOCUMENT_GLOBAL_VIEW_PERMISSION in codes
        can_manage = any(
            c.startswith("kuaizhizao:quality-management-system-documents:")
            and c.split(":")[-1] in {"update", "create", "publish", "obsolete", "reject"}
            for c in codes
        )

        query = QmsSystemDocument.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        # 驳回永不进正式目录；头表 rejected 仅制定方/有维护权/全局可见于待审或全部
        if zone_key == "formal":
            query = query.filter(status="effective")
        elif zone_key == "pending":
            query = query.filter(status__in=["draft", "pending", "rejected"])
            if not is_global and not can_manage and current_user_id is not None:
                query = query.filter(created_by=current_user_id)
        else:
            # all：使用方仅正式；制定方/有维护权/全局可见全量（含本人驳回）
            if not is_global and not can_manage:
                if current_user_id is not None:
                    from tortoise.expressions import Q

                    query = query.filter(
                        Q(status="effective")
                        | Q(
                            status__in=["draft", "pending", "rejected"],
                            created_by=current_user_id,
                        )
                    )
                else:
                    query = query.filter(status="effective")
            # 无维护权的使用方已在上方排除他人 rejected；有维护权/全局可见全部含 rejected

        if keyword:
            query = query.filter(title__icontains=keyword)
        if status:
            query = query.filter(status=status)
        if doc_type:
            query = query.filter(doc_type=doc_type)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return QmsSystemDocumentListResponse(
            items=[QmsSystemDocumentResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get_document(self, tenant_id: int, document_id: int) -> QmsSystemDocumentResponse:
        row = await self._get_row(tenant_id, document_id)
        return QmsSystemDocumentResponse.model_validate(row)

    async def list_versions(
        self,
        tenant_id: int,
        document_id: int,
        *,
        current_user_id: Optional[int] = None,
        permission_codes: Optional[List[str]] = None,
    ) -> QmsSystemDocumentVersionListResponse:
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion

        row = await self._get_row(tenant_id, document_id)
        versions = await QmsSystemDocumentVersion.filter(
            tenant_id=tenant_id,
            document_id=document_id,
            deleted_at__isnull=True,
        ).order_by("-id")
        policy_rows = [_version_policy_row(v) for v in versions]
        is_author = bool(
            current_user_id is not None
            and getattr(row, "created_by", None) is not None
            and int(row.created_by) == int(current_user_id)
        )
        audience = resolve_audience(
            permission_codes=permission_codes,
            is_author=is_author,
        )
        visible = filter_version_rows(
            policy_rows,
            audience=audience,
            current_user_id=current_user_id,
        )
        items = [QmsSystemDocumentVersionResponse.model_validate(v) for v in visible]
        return QmsSystemDocumentVersionListResponse(
            items=items,
            total=len(items),
            audience=audience.value,
            can_view_history=can_view_historical_versions(audience),
        )

    async def revise_document(
        self,
        tenant_id: int,
        document_id: int,
        payload: QmsSystemDocumentReviseRequest,
        *,
        actor_id: Optional[int] = None,
        actor_name: Optional[str] = None,
    ) -> QmsSystemDocumentResponse:
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion
        from tortoise.transactions import in_transaction

        row = await self._get_row(tenant_id, document_id)
        if row.status != "effective":
            raise BusinessLogicError("仅现行有效文件可升版")
        new_version = (payload.version or "").strip() or _bump_version(row.version)
        clash = await QmsSystemDocumentVersion.filter(
            tenant_id=tenant_id,
            document_id=row.id,
            version=new_version,
            deleted_at__isnull=True,
        ).exists()
        if clash:
            raise BusinessLogicError(f"版本号已存在: {new_version}")

        async with in_transaction():
            await QmsSystemDocumentVersion.create(
                tenant_id=tenant_id,
                document_id=row.id,
                document_code=row.document_code,
                version=new_version,
                status="draft",
                is_effective=False,
                title=row.title,
                content=row.content,
                file_url=row.file_url,
                change_summary=(payload.change_summary or None),
                created_by=actor_id or getattr(row, "created_by", None),
                created_by_name=actor_name or getattr(row, "created_by_name", None),
                updated_by=actor_id,
                updated_by_name=actor_name,
            )
            row.version = new_version
            row.status = "draft"
            if actor_id is not None:
                row.updated_by = actor_id
                row.updated_by_name = actor_name
            await row.save()
        return QmsSystemDocumentResponse.model_validate(row)

    async def reject_document(
        self,
        tenant_id: int,
        document_id: int,
        payload: Optional[QmsSystemDocumentRejectRequest] = None,
        *,
        actor_id: Optional[int] = None,
        actor_name: Optional[str] = None,
    ) -> QmsSystemDocumentResponse:
        """驳回待审/草稿升版：版本记 rejected；若仍有现行生效版则恢复头表，否则头表保持 rejected。"""
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion
        from tortoise.transactions import in_transaction

        row = await self._get_row(tenant_id, document_id)
        if row.status not in ("draft", "pending"):
            raise BusinessLogicError("仅草稿或待审文件可驳回")
        reason = (payload.reason if payload else None) or None
        reason = (reason or "").strip() or None

        async with in_transaction():
            draft_ver = await QmsSystemDocumentVersion.filter(
                tenant_id=tenant_id,
                document_id=row.id,
                version=row.version,
                deleted_at__isnull=True,
            ).first()
            if draft_ver:
                draft_ver.status = "rejected"
                draft_ver.is_effective = False
                if reason:
                    prev = (draft_ver.change_summary or "").strip()
                    draft_ver.change_summary = f"{prev}\n驳回：{reason}".strip() if prev else f"驳回：{reason}"
                if actor_id is not None:
                    draft_ver.updated_by = actor_id
                    draft_ver.updated_by_name = actor_name
                await draft_ver.save()

            # 升版驳回：恢复仍标记为生效的历史版（升版未发布时旧版仍 is_effective）
            prev_eff = (
                await QmsSystemDocumentVersion.filter(
                    tenant_id=tenant_id,
                    document_id=row.id,
                    status="effective",
                    is_effective=True,
                    deleted_at__isnull=True,
                )
                .exclude(version=row.version)
                .order_by("-id")
                .first()
            )
            if prev_eff:
                row.version = prev_eff.version
                row.title = prev_eff.title
                row.content = prev_eff.content
                row.file_url = prev_eff.file_url
                row.status = "effective"
                row.effective_at = prev_eff.effective_at or resolve_business_datetime()
                row.obsolete_at = None
            else:
                row.status = "rejected"
            if actor_id is not None:
                row.updated_by = actor_id
                row.updated_by_name = actor_name
            await row.save()
        return QmsSystemDocumentResponse.model_validate(row)

    async def update_document(
        self, tenant_id: int, document_id: int, payload: QmsSystemDocumentUpdate
    ) -> QmsSystemDocumentResponse:
        row = await self._get_row(tenant_id, document_id)
        data = payload.model_dump(exclude_unset=True)
        self._apply_status_guard(data.get("status"))
        if "evidence_links" in data:
            data["evidence_links"] = _normalize_links(data.get("evidence_links"))
        if "training_refs" in data:
            data["training_refs"] = _normalize_links(data.get("training_refs"))
        data = await iso_clause_service.resolve_clause_snapshot(tenant_id, data)
        if "document_code" in data and data["document_code"]:
            clash = await QmsSystemDocument.filter(
                tenant_id=tenant_id,
                document_code=data["document_code"],
                deleted_at__isnull=True,
            ).exclude(id=document_id).exists()
            if clash:
                raise BusinessLogicError("体系文件编码已存在")
        for key, value in data.items():
            setattr(row, key, value)
        await row.save()
        return QmsSystemDocumentResponse.model_validate(row)

    async def publish_document(self, tenant_id: int, document_id: int) -> QmsSystemDocumentResponse:
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion
        from tortoise.transactions import in_transaction

        row = await self._get_row(tenant_id, document_id)
        if row.status == "obsolete":
            raise BusinessLogicError("已作废文件不可再次生效")

        async with in_transaction():
            # 旧生效版降为历史
            await QmsSystemDocumentVersion.filter(
                tenant_id=tenant_id,
                document_id=row.id,
                is_effective=True,
                deleted_at__isnull=True,
            ).update(is_effective=False, status="obsolete", obsolete_at=resolve_business_datetime())

            ver = await QmsSystemDocumentVersion.filter(
                tenant_id=tenant_id,
                document_id=row.id,
                version=row.version,
                deleted_at__isnull=True,
            ).first()
            if ver:
                ver.status = "effective"
                ver.is_effective = True
                ver.title = row.title
                ver.content = row.content
                ver.file_url = row.file_url
                ver.effective_at = resolve_business_datetime()
                ver.obsolete_at = None
                await ver.save()
            else:
                await QmsSystemDocumentVersion.create(
                    tenant_id=tenant_id,
                    document_id=row.id,
                    document_code=row.document_code,
                    version=row.version,
                    status="effective",
                    is_effective=True,
                    title=row.title,
                    content=row.content,
                    file_url=row.file_url,
                    effective_at=resolve_business_datetime(),
                    created_by=getattr(row, "updated_by", None) or getattr(row, "created_by", None),
                    created_by_name=getattr(row, "updated_by_name", None)
                    or getattr(row, "created_by_name", None),
                )

            row.status = "effective"
            row.effective_at = resolve_business_datetime()
            row.obsolete_at = None
            await row.save()
        return QmsSystemDocumentResponse.model_validate(row)

    async def obsolete_document(self, tenant_id: int, document_id: int) -> QmsSystemDocumentResponse:
        from apps.kuaizhizao.models.qms_system_document_version import QmsSystemDocumentVersion

        row = await self._get_row(tenant_id, document_id)
        if row.status == "draft":
            raise BusinessLogicError("草稿请直接删除，无需作废")
        row.status = "obsolete"
        row.obsolete_at = resolve_business_datetime()
        await row.save()
        await QmsSystemDocumentVersion.filter(
            tenant_id=tenant_id,
            document_id=row.id,
            is_effective=True,
            deleted_at__isnull=True,
        ).update(
            is_effective=False,
            status="obsolete",
            obsolete_at=resolve_business_datetime(),
        )
        return QmsSystemDocumentResponse.model_validate(row)

    async def delete_document(self, tenant_id: int, document_id: int) -> None:
        row = await self._get_row(tenant_id, document_id)
        if row.status == "effective":
            raise BusinessLogicError("生效中文件请先作废再删除")
        row.deleted_at = resolve_business_datetime()
        await row.save()

    async def count_review_due_documents(self, tenant_id: int) -> QmsSystemDocumentReviewDueSummary:
        now = resolve_business_datetime()
        due_count = await QmsSystemDocument.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            status="effective",
            next_review_at__isnull=False,
            next_review_at__lte=now,
        ).count()
        return QmsSystemDocumentReviewDueSummary(due_count=due_count)


class QmsInternalAuditService(AppBaseService[QmsInternalAudit], _QmsCrudMixin):
    code_field = "audit_code"
    rule_code = "QMS_INTERNAL_AUDIT_CODE"
    code_prefix = "NS"
    allowed_statuses = AUDIT_STATUSES

    def __init__(self) -> None:
        super().__init__(QmsInternalAudit)
        self.model = QmsInternalAudit

    async def create_audit(self, tenant_id: int, payload: QmsInternalAuditCreate) -> QmsInternalAuditResponse:
        data = payload.model_dump(exclude_unset=False)
        self._apply_status_guard(data.get("status"))
        data["audit_code"] = await self._ensure_code(tenant_id, data.get("audit_code"))
        data["finding_links"] = _normalize_links(data.get("finding_links"))
        data["training_refs"] = _normalize_links(data.get("training_refs"))
        data["calibration_refs"] = _normalize_links(data.get("calibration_refs"))
        data = await iso_clause_service.resolve_clause_snapshot(tenant_id, data)
        exists = await QmsInternalAudit.filter(
            tenant_id=tenant_id, audit_code=data["audit_code"], deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("内审编码已存在")
        row = await QmsInternalAudit.create(tenant_id=tenant_id, **data)
        return QmsInternalAuditResponse.model_validate(row)

    async def list_audits(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> QmsInternalAuditListResponse:
        query = QmsInternalAudit.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if keyword:
            query = query.filter(title__icontains=keyword)
        if status:
            query = query.filter(status=status)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return QmsInternalAuditListResponse(
            items=[QmsInternalAuditResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get_audit(self, tenant_id: int, audit_id: int) -> QmsInternalAuditResponse:
        return QmsInternalAuditResponse.model_validate(await self._get_row(tenant_id, audit_id))

    async def update_audit(
        self, tenant_id: int, audit_id: int, payload: QmsInternalAuditUpdate
    ) -> QmsInternalAuditResponse:
        row = await self._get_row(tenant_id, audit_id)
        data = payload.model_dump(exclude_unset=True)
        self._apply_status_guard(data.get("status"))
        for key in ("finding_links", "training_refs", "calibration_refs"):
            if key in data:
                data[key] = _normalize_links(data.get(key))
        if data.get("audit_code"):
            clash = await QmsInternalAudit.filter(
                tenant_id=tenant_id, audit_code=data["audit_code"], deleted_at__isnull=True
            ).exclude(id=audit_id).exists()
            if clash:
                raise BusinessLogicError("内审编码已存在")
        data = await iso_clause_service.resolve_clause_snapshot(tenant_id, data)
        for key, value in data.items():
            setattr(row, key, value)
        await row.save()
        return QmsInternalAuditResponse.model_validate(row)

    async def delete_audit(self, tenant_id: int, audit_id: int) -> None:
        row = await self._get_row(tenant_id, audit_id)
        row.deleted_at = resolve_business_datetime()
        await row.save()


class QmsManagementReviewService(AppBaseService[QmsManagementReview], _QmsCrudMixin):
    code_field = "review_code"
    rule_code = "QMS_MANAGEMENT_REVIEW_CODE"
    code_prefix = "GLPS"
    allowed_statuses = REVIEW_STATUSES

    def __init__(self) -> None:
        super().__init__(QmsManagementReview)
        self.model = QmsManagementReview

    async def create_review(
        self, tenant_id: int, payload: QmsManagementReviewCreate
    ) -> QmsManagementReviewResponse:
        data = payload.model_dump(exclude_unset=False)
        self._apply_status_guard(data.get("status"))
        data["review_code"] = await self._ensure_code(tenant_id, data.get("review_code"))
        data["input_links"] = _normalize_links(data.get("input_links"))
        data["training_refs"] = _normalize_links(data.get("training_refs"))
        data["calibration_refs"] = _normalize_links(data.get("calibration_refs"))
        exists = await QmsManagementReview.filter(
            tenant_id=tenant_id, review_code=data["review_code"], deleted_at__isnull=True
        ).exists()
        if exists:
            raise BusinessLogicError("管理评审编码已存在")
        row = await QmsManagementReview.create(tenant_id=tenant_id, **data)
        return QmsManagementReviewResponse.model_validate(row)

    async def list_reviews(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> QmsManagementReviewListResponse:
        query = QmsManagementReview.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if keyword:
            query = query.filter(title__icontains=keyword)
        if status:
            query = query.filter(status=status)
        total = await query.count()
        rows = await query.order_by("-updated_at", "-id").offset(skip).limit(limit)
        return QmsManagementReviewListResponse(
            items=[QmsManagementReviewResponse.model_validate(r) for r in rows],
            total=total,
        )

    async def get_review(self, tenant_id: int, review_id: int) -> QmsManagementReviewResponse:
        return QmsManagementReviewResponse.model_validate(await self._get_row(tenant_id, review_id))

    async def update_review(
        self, tenant_id: int, review_id: int, payload: QmsManagementReviewUpdate
    ) -> QmsManagementReviewResponse:
        row = await self._get_row(tenant_id, review_id)
        data = payload.model_dump(exclude_unset=True)
        self._apply_status_guard(data.get("status"))
        for key in ("input_links", "training_refs", "calibration_refs"):
            if key in data:
                data[key] = _normalize_links(data.get(key))
        if data.get("review_code"):
            clash = await QmsManagementReview.filter(
                tenant_id=tenant_id, review_code=data["review_code"], deleted_at__isnull=True
            ).exclude(id=review_id).exists()
            if clash:
                raise BusinessLogicError("管理评审编码已存在")
        for key, value in data.items():
            setattr(row, key, value)
        await row.save()
        return QmsManagementReviewResponse.model_validate(row)

    async def delete_review(self, tenant_id: int, review_id: int) -> None:
        row = await self._get_row(tenant_id, review_id)
        row.deleted_at = resolve_business_datetime()
        await row.save()

    async def get_input_summary(
        self,
        tenant_id: int,
        *,
        period_start: Optional[datetime] = None,
        period_end: Optional[datetime] = None,
    ) -> QmsManagementReviewInputSummary:
        end = period_end or resolve_business_datetime()
        start = period_start
        if start is None:
            start = end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        nc_query = DefectRecord.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        nc_query = nc_query.filter(created_at__gte=start, created_at__lte=end)
        nonconforming_count = await nc_query.count()

        open_8d_count = await Quality8DReport.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
        ).exclude(status="closed").count()

        iqc_rows = await IncomingInspection.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            status__in=["已检验", "已审核"],
            inspection_time__gte=start,
            inspection_time__lte=end,
        ).all()
        iqc_total = len(iqc_rows)
        iqc_pass_count = sum(
            1 for row in iqc_rows if str(getattr(row, "quality_status", "") or "").strip() == "合格"
        )
        iqc_pass_rate = round(iqc_pass_count / iqc_total * 100, 2) if iqc_total else None

        oqc_rows = await OQCInspection.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            status__in=["已检验", "已审核"],
            inspection_time__gte=start,
            inspection_time__lte=end,
        ).all()
        oqc_total = len(oqc_rows)
        oqc_pass_count = sum(
            1 for row in oqc_rows if str(getattr(row, "quality_status", "") or "").strip() == "合格"
        )
        oqc_pass_rate = round(oqc_pass_count / oqc_total * 100, 2) if oqc_total else None

        summary_parts = [
            f"期内不合格台账 {nonconforming_count} 笔",
            f"8D 未关闭 {open_8d_count} 笔",
        ]
        if iqc_total:
            summary_parts.append(f"IQC 合格率 {iqc_pass_rate}%（{iqc_pass_count}/{iqc_total}）")
        else:
            summary_parts.append("IQC 期内无已检验记录")
        if oqc_total:
            summary_parts.append(f"OQC 合格率 {oqc_pass_rate}%（{oqc_pass_count}/{oqc_total}）")
        else:
            summary_parts.append("OQC 期内无已检验记录")

        return QmsManagementReviewInputSummary(
            period_start=start,
            period_end=end,
            nonconforming_count=nonconforming_count,
            open_8d_count=open_8d_count,
            iqc_total=iqc_total,
            iqc_pass_count=iqc_pass_count,
            iqc_pass_rate=iqc_pass_rate,
            oqc_total=oqc_total,
            oqc_pass_count=oqc_pass_count,
            oqc_pass_rate=oqc_pass_rate,
            summary_text="；".join(summary_parts),
        )
