"""试流 8h/24h 提醒登记与派发（INF-03）。"""

from __future__ import annotations

from datetime import timedelta
from typing import Literal

from loguru import logger

from apps.kuaiplm.models.trial_flow import (
    TRIAL_FLOW_COMPONENT,
    TrialFlow,
)
from apps.kuaiplm.services.kuaiplm_business_notification import (
    ACTION_TRIAL_APPROVAL_OVERDUE,
    ACTION_TRIAL_STEP_OVERDUE,
    TRIGGER_TRIAL_FLOW,
)
from core.services.approval.approval_data_scope import (
    list_pending_approver_user_ids_for_entity,
)
from core.services.business.business_notification_service import (
    BusinessNotificationService,
)
from core.services.business.reminder_dispatch_service import register_reminder_handler
from core.services.business.reminder_event_service import ReminderEventService
from core.models.reminder_event import ReminderEvent
from core.utils.timezone_utils import resolve_business_datetime

ENTITY_TYPE = "trial_flow"
RULE_PREFIX = "kuaiplm.trial_flow"
RULE_APPROVAL = f"{RULE_PREFIX}.approval"
RULE_STEP = f"{RULE_PREFIX}.step"
CHANNEL_INTERNAL = "internal"
STEP_DELAY_HOURS = 8


def approval_delay_hours(business_type: str) -> int:
    bt = (business_type or "").strip().lower()
    if bt == TRIAL_FLOW_COMPONENT:
        return 24
    return STEP_DELAY_HOURS


class TrialFlowReminderService:
    @staticmethod
    async def stop_all(tenant_id: int, trial_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE,
            entity_id=trial_id,
            reason=reason,
        )

    @staticmethod
    async def schedule_approval_reminder(tenant_id: int, row: TrialFlow) -> None:
        if row.status != "pending" or not row.submitted_at:
            return
        hours = approval_delay_hours(row.business_type)
        anchor = row.submitted_at
        if anchor.tzinfo is None:
            raise ValueError("submitted_at 必须是带时区的 UTC 时刻")
        planned_at = anchor + timedelta(hours=hours)
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_APPROVAL}:{row.id}",
            rule_code=RULE_APPROVAL,
            entity_type=ENTITY_TYPE,
            entity_id=row.id,
            entity_uuid=str(row.uuid),
            planned_at=planned_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "approval",
                "business_type": row.business_type,
                "delay_hours": hours,
            },
        )

    @staticmethod
    async def schedule_step_reminder(
        tenant_id: int, row: TrialFlow, *, step_key: str
    ) -> None:
        if row.status != "in_progress" or not step_key:
            return
        anchor = resolve_business_datetime()
        planned_at = anchor + timedelta(hours=STEP_DELAY_HOURS)
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_STEP}:{row.id}:{step_key}",
            rule_code=RULE_STEP,
            entity_type=ENTITY_TYPE,
            entity_id=row.id,
            entity_uuid=str(row.uuid),
            planned_at=planned_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "step",
                "step_key": step_key,
                "delay_hours": STEP_DELAY_HOURS,
            },
        )

    @staticmethod
    async def sync_after_submit(tenant_id: int, row: TrialFlow) -> None:
        await TrialFlowReminderService.stop_all(tenant_id, row.id, reason="重新提交")
        await TrialFlowReminderService.schedule_approval_reminder(tenant_id, row)

    @staticmethod
    async def sync_after_approve(tenant_id: int, row: TrialFlow) -> None:
        await TrialFlowReminderService.stop_all(tenant_id, row.id, reason="审核通过")
        if row.current_step_key:
            await TrialFlowReminderService.schedule_step_reminder(
                tenant_id, row, step_key=row.current_step_key
            )

    @staticmethod
    async def sync_after_step_advanced(tenant_id: int, row: TrialFlow) -> None:
        await TrialFlowReminderService.stop_all(tenant_id, row.id, reason="工序推进")
        if row.status == "in_progress" and row.current_step_key:
            await TrialFlowReminderService.schedule_step_reminder(
                tenant_id, row, step_key=row.current_step_key
            )

    @staticmethod
    async def sync_after_terminal(tenant_id: int, trial_id: int, *, reason: str) -> None:
        await TrialFlowReminderService.stop_all(tenant_id, trial_id, reason=reason)


async def dispatch_trial_flow_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    row = await TrialFlow.filter(
        tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
    ).first()
    if not row:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "试流单已删除")
        return "stopped"

    payload = event.payload or {}
    rule_code = str(event.rule_code or "")

    if rule_code == RULE_APPROVAL:
        if row.status != "pending":
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "试流已不在待审"
            )
            return "stopped"
        approver_ids = await list_pending_approver_user_ids_for_entity(
            tenant_id, ENTITY_TYPE, row.id
        )
        hours = int(payload.get("delay_hours") or approval_delay_hours(row.business_type))
        sent = await BusinessNotificationService.dispatch(
            tenant_id,
            trigger_document=TRIGGER_TRIAL_FLOW,
            trigger_action=ACTION_TRIAL_APPROVAL_OVERDUE,
            variables={
                "trial_code": row.trial_code,
                "title": row.title,
                "project_code": row.project_code,
                "project_name": row.project_name,
                "business_type": row.business_type,
                "delay_hours": str(hours),
            },
            context={
                "entity_type": ENTITY_TYPE,
                "entity_id": row.id,
                "entity_uuid": str(row.uuid),
                "creator_user_id": row.created_by,
                "pending_approver_user_ids": approver_ids,
            },
        )
        if sent == 0:
            logger.warning(
                "试流待审超时提醒无接收人 tenant={} trial={} approvers={}",
                tenant_id,
                row.trial_code,
                approver_ids,
            )
        return "sent"

    if rule_code == RULE_STEP:
        step_key = str(payload.get("step_key") or "").strip()
        if row.status != "in_progress" or row.current_step_key != step_key:
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "工序已变更或试流已结束"
            )
            return "stopped"
        sent = await BusinessNotificationService.dispatch(
            tenant_id,
            trigger_document=TRIGGER_TRIAL_FLOW,
            trigger_action=ACTION_TRIAL_STEP_OVERDUE,
            variables={
                "trial_code": row.trial_code,
                "title": row.title,
                "project_code": row.project_code,
                "project_name": row.project_name,
                "step_key": step_key,
                "delay_hours": str(STEP_DELAY_HOURS),
            },
            context={
                "entity_type": ENTITY_TYPE,
                "entity_id": row.id,
                "entity_uuid": str(row.uuid),
                "creator_user_id": row.created_by,
            },
        )
        if sent == 0:
            logger.warning(
                "试流工序超时提醒无接收人 tenant={} trial={} step={}",
                tenant_id,
                row.trial_code,
                step_key,
            )
        return "sent"

    await ReminderEventService.mark_stopped(
        tenant_id, event.id, f"未知试流提醒规则: {rule_code}"
    )
    return "stopped"


register_reminder_handler(RULE_PREFIX, dispatch_trial_flow_reminder)
