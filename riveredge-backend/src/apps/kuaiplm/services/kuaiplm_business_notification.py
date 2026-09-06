"""快研发业务消息提醒常量、派发与接收人解析。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from loguru import logger

from core.services.approval.approval_data_scope import (
    list_pending_approver_user_ids_for_entity,
)
from core.services.business.business_notification_service import (
    BusinessNotificationService,
    register_notification_scope_resolver,
)

TRIGGER_TRIAL_FLOW = "trial_flow"
ACTION_TRIAL_APPROVAL_OVERDUE = "approval_overdue"
ACTION_TRIAL_STEP_OVERDUE = "step_overdue"

TRIGGER_LAB_REQUEST = "lab_request"
ACTION_LAB_REPORT_SUBMITTED = "report_submitted"
ACTION_LAB_REPORT_APPROVED = "report_approved"
ACTION_LAB_REPORT_REJECTED = "report_rejected"


async def _scope_pending_approvers(_tenant_id: int, context: Dict) -> List[int]:
    entity_type = str(context.get("entity_type") or "").strip()
    raw_id = context.get("entity_id")
    try:
        entity_id = int(raw_id)
    except (TypeError, ValueError):
        return []
    if not entity_type or entity_id < 1:
        return []
    explicit = context.get("pending_approver_user_ids")
    if isinstance(explicit, list) and explicit:
        out: List[int] = []
        seen: set[int] = set()
        for item in explicit:
            try:
                uid = int(item)
            except (TypeError, ValueError):
                continue
            if uid > 0 and uid not in seen:
                seen.add(uid)
                out.append(uid)
        if out:
            return out
    return await list_pending_approver_user_ids_for_entity(
        _tenant_id, entity_type, entity_id
    )


async def _scope_report_submitter(_tenant_id: int, context: Dict) -> List[int]:
    del _tenant_id
    raw = context.get("report_submitted_by")
    try:
        uid = int(raw)
    except (TypeError, ValueError):
        return []
    return [uid] if uid > 0 else []


async def dispatch_kuaiplm_notification(
    tenant_id: int,
    *,
    trigger_document: str,
    trigger_action: str,
    variables: Optional[Dict[str, Any]] = None,
    context: Optional[Dict[str, Any]] = None,
    message_category: str = "process",
) -> int:
    """按租户「消息提醒」规则发送站内信。无匹配规则或未配置接收人时返回 0。"""
    vars_payload = dict(variables or {})
    vars_payload.setdefault("message_category", message_category)
    try:
        sent = await BusinessNotificationService.dispatch(
            tenant_id,
            trigger_document=trigger_document,
            trigger_action=trigger_action,
            variables=vars_payload,
            context=context,
        )
        if sent:
            logger.info(
                "快研发消息提醒已发送 tenant={} doc={} action={} count={}",
                tenant_id,
                trigger_document,
                trigger_action,
                sent,
            )
        return sent
    except Exception as exc:
        logger.error(
            "快研发消息提醒派发失败 tenant={} doc={} action={}: {}",
            tenant_id,
            trigger_document,
            trigger_action,
            exc,
        )
        return 0


def _lab_request_detail_path(request_id: int) -> str:
    return f"/apps/kuaiplm/lab-requests?id={request_id}"


async def notify_lab_report_submitted(
    tenant_id: int,
    *,
    request_id: int,
    code: str,
    title: str,
    report_title: Optional[str],
    creator_user_id: Optional[int],
    report_submitted_by: Optional[int],
) -> int:
    return await dispatch_kuaiplm_notification(
        tenant_id,
        trigger_document=TRIGGER_LAB_REQUEST,
        trigger_action=ACTION_LAB_REPORT_SUBMITTED,
        variables={
            "lab_code": code,
            "title": title,
            "report_title": report_title or title,
            "detail_path": _lab_request_detail_path(request_id),
        },
        context={
            "entity_type": "lab_request",
            "entity_id": request_id,
            "creator_user_id": creator_user_id,
            "report_submitted_by": report_submitted_by,
        },
    )


async def notify_lab_report_approved(
    tenant_id: int,
    *,
    request_id: int,
    code: str,
    title: str,
    report_title: Optional[str],
    creator_user_id: Optional[int],
    report_submitted_by: Optional[int],
) -> int:
    return await dispatch_kuaiplm_notification(
        tenant_id,
        trigger_document=TRIGGER_LAB_REQUEST,
        trigger_action=ACTION_LAB_REPORT_APPROVED,
        variables={
            "lab_code": code,
            "title": title,
            "report_title": report_title or title,
            "detail_path": _lab_request_detail_path(request_id),
        },
        context={
            "entity_type": "lab_request",
            "entity_id": request_id,
            "creator_user_id": creator_user_id,
            "report_submitted_by": report_submitted_by,
        },
    )


async def notify_lab_report_rejected(
    tenant_id: int,
    *,
    request_id: int,
    code: str,
    title: str,
    report_title: Optional[str],
    reject_reason: str,
    creator_user_id: Optional[int],
    report_submitted_by: Optional[int],
) -> int:
    return await dispatch_kuaiplm_notification(
        tenant_id,
        trigger_document=TRIGGER_LAB_REQUEST,
        trigger_action=ACTION_LAB_REPORT_REJECTED,
        variables={
            "lab_code": code,
            "title": title,
            "report_title": report_title or title,
            "reject_reason": reject_reason,
            "detail_path": _lab_request_detail_path(request_id),
        },
        context={
            "entity_type": "lab_request",
            "entity_id": request_id,
            "creator_user_id": creator_user_id,
            "report_submitted_by": report_submitted_by,
        },
    )


def ensure_kuaiplm_notification_scope_resolvers() -> None:
    register_notification_scope_resolver("pending_approvers", _scope_pending_approvers)
    register_notification_scope_resolver("report_submitter", _scope_report_submitter)


ensure_kuaiplm_notification_scope_resolvers()
