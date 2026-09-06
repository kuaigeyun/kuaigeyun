"""质量投诉到期提醒（INF-03）：按 due_at 登记 ReminderEvent。"""

from __future__ import annotations

from typing import Literal

from loguru import logger

from apps.kuaizhizao.models.quality_complaint import QualityComplaint
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_DUE_OVERDUE,
    DOC_QUALITY_COMPLAINT,
    dispatch_kuaizhizao_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.approval.approval_data_scope import (
    list_pending_approver_user_ids_for_entity,
)
from core.services.business.reminder_dispatch_service import register_reminder_handler
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import to_api_isoformat

ENTITY_TYPE = "quality_complaint"
RULE_PREFIX = "kuaizhizao.quality_complaint"
RULE_DUE = f"{RULE_PREFIX}.due"
CHANNEL_INTERNAL = "internal"


class QualityComplaintReminderService:
    @staticmethod
    async def stop_all(tenant_id: int, complaint_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE,
            entity_id=complaint_id,
            reason=reason,
        )

    @staticmethod
    async def schedule_due_reminder(tenant_id: int, row: QualityComplaint) -> None:
        if row.status not in ("pending", "processing"):
            return
        if not row.due_at:
            return
        if row.due_at.tzinfo is None:
            raise ValueError("due_at 必须是带时区的 UTC 时刻")
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_DUE}:{row.id}",
            rule_code=RULE_DUE,
            entity_type=ENTITY_TYPE,
            entity_id=row.id,
            entity_uuid=str(row.uuid),
            planned_at=row.due_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "due",
                "business_type": row.business_type,
                "due_at": to_api_isoformat(row.due_at),
            },
        )

    @staticmethod
    async def sync_after_submit(tenant_id: int, row: QualityComplaint) -> None:
        await QualityComplaintReminderService.stop_all(tenant_id, row.id, reason="重新提交")
        await QualityComplaintReminderService.schedule_due_reminder(tenant_id, row)

    @staticmethod
    async def sync_after_approve(tenant_id: int, row: QualityComplaint) -> None:
        # 审核通过进入处理中，保留/刷新到期提醒（接收人改为创建人侧）
        await QualityComplaintReminderService.stop_all(tenant_id, row.id, reason="审核通过")
        await QualityComplaintReminderService.schedule_due_reminder(tenant_id, row)

    @staticmethod
    async def sync_after_terminal(tenant_id: int, complaint_id: int, *, reason: str) -> None:
        await QualityComplaintReminderService.stop_all(tenant_id, complaint_id, reason=reason)


async def dispatch_quality_complaint_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    row = await QualityComplaint.filter(
        tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
    ).first()
    if not row:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "投诉单已删除")
        return "stopped"

    rule_code = str(event.rule_code or "")
    if rule_code != RULE_DUE:
        await ReminderEventService.mark_stopped(
            tenant_id, event.id, f"未知投诉提醒规则: {rule_code}"
        )
        return "stopped"

    if row.status not in ("pending", "processing"):
        await ReminderEventService.mark_stopped(
            tenant_id, event.id, "投诉已不在待办时效内"
        )
        return "stopped"

    context = {
        "entity_type": ENTITY_TYPE,
        "entity_id": row.id,
        "entity_uuid": str(row.uuid),
        "creator_user_id": row.created_by,
    }
    if row.status == "pending":
        context["pending_approver_user_ids"] = await list_pending_approver_user_ids_for_entity(
            tenant_id, ENTITY_TYPE, row.id
        )

    sent = await dispatch_kuaizhizao_notification(
        tenant_id,
        trigger_document=DOC_QUALITY_COMPLAINT,
        trigger_action=ACTION_DUE_OVERDUE,
        variables={
            "complaint_code": row.code,
            "title": row.title,
            "business_type": row.business_type,
            "material_name": row.material_name or "",
            "due_at": to_api_isoformat(row.due_at) if row.due_at else "",
            "status": row.status,
        },
        context=context,
    )
    if sent == 0:
        logger.warning(
            "质量投诉到期提醒无接收人 tenant={} code={} status={}",
            tenant_id,
            row.code,
            row.status,
        )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_quality_complaint_reminder)
