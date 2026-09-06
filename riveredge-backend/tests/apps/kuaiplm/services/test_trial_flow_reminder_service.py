"""试流 8h/24h 提醒登记测试。"""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from apps.kuaiplm.models.trial_flow import TRIAL_FLOW_COMPONENT, TRIAL_FLOW_STRUCTURE
from apps.kuaiplm.services.trial_flow_reminder_service import (
    RULE_APPROVAL,
    RULE_STEP,
    TrialFlowReminderService,
    approval_delay_hours,
    dispatch_trial_flow_reminder,
)


def test_approval_delay_hours_component_is_24():
    assert approval_delay_hours(TRIAL_FLOW_COMPONENT) == 24


def test_approval_delay_hours_structure_is_8():
    assert approval_delay_hours(TRIAL_FLOW_STRUCTURE) == 8


@pytest.mark.asyncio
async def test_schedule_approval_reminder_uses_component_24h():
    row = MagicMock()
    row.id = 9
    row.uuid = "uuid-9"
    row.status = "pending"
    row.business_type = TRIAL_FLOW_COMPONENT
    row.submitted_at = MagicMock(tzinfo=object())

    with patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.ReminderEventService.ensure_event",
        new_callable=AsyncMock,
    ) as ensure:
        await TrialFlowReminderService.schedule_approval_reminder(1, row)
        ensure.assert_awaited_once()
        kwargs = ensure.await_args.kwargs
        assert kwargs["rule_code"] == RULE_APPROVAL
        assert kwargs["payload"]["delay_hours"] == 24


@pytest.mark.asyncio
async def test_sync_after_approve_schedules_current_step_8h():
    row = MagicMock()
    row.id = 3
    row.uuid = "uuid-3"
    row.status = "in_progress"
    row.current_step_key = "iqc"

    with patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.TrialFlowReminderService.stop_all",
        new_callable=AsyncMock,
    ) as stop_all, patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.TrialFlowReminderService.schedule_step_reminder",
        new_callable=AsyncMock,
    ) as schedule_step:
        await TrialFlowReminderService.sync_after_approve(1, row)
        stop_all.assert_awaited_once()
        schedule_step.assert_awaited_once_with(1, row, step_key="iqc")


@pytest.mark.asyncio
async def test_dispatch_stops_when_trial_no_longer_pending():
    event = MagicMock()
    event.id = 11
    event.entity_id = 5
    event.rule_code = RULE_APPROVAL
    event.payload = {"delay_hours": 8}

    with patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.TrialFlow.filter"
    ) as q, patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.ReminderEventService.mark_stopped",
        new_callable=AsyncMock,
    ) as mark_stopped:
        q.return_value.first = AsyncMock(
            return_value=MagicMock(status="in_progress", trial_code="SL001")
        )
        outcome = await dispatch_trial_flow_reminder(1, event)
        assert outcome == "stopped"
        mark_stopped.assert_awaited_once()


@pytest.mark.asyncio
async def test_dispatch_approval_overdue_marks_sent_path():
    event = MagicMock()
    event.id = 12
    event.entity_id = 6
    event.rule_code = RULE_APPROVAL
    event.payload = {"delay_hours": 24}

    row = MagicMock()
    row.id = 6
    row.uuid = "uuid-6"
    row.status = "pending"
    row.trial_code = "SL002"
    row.title = "元件试流"
    row.project_code = "P1"
    row.project_name = "项目一"
    row.business_type = TRIAL_FLOW_COMPONENT
    row.created_by = 7

    with patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.TrialFlow.filter"
    ) as q, patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.list_pending_approver_user_ids_for_entity",
        new_callable=AsyncMock,
        return_value=[42],
    ), patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.BusinessNotificationService.dispatch",
        new_callable=AsyncMock,
        return_value=1,
    ) as dispatch:
        q.return_value.first = AsyncMock(return_value=row)
        outcome = await dispatch_trial_flow_reminder(1, event)
        assert outcome == "sent"
        dispatch.assert_awaited_once()
        assert dispatch.await_args.kwargs["trigger_action"] == "approval_overdue"


@pytest.mark.asyncio
async def test_dispatch_step_stops_when_step_key_mismatch():
    event = MagicMock()
    event.id = 13
    event.entity_id = 8
    event.rule_code = RULE_STEP
    event.payload = {"step_key": "pe"}

    row = MagicMock()
    row.status = "in_progress"
    row.current_step_key = "iqc"

    with patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.TrialFlow.filter"
    ) as q, patch(
        "apps.kuaiplm.services.trial_flow_reminder_service.ReminderEventService.mark_stopped",
        new_callable=AsyncMock,
    ):
        q.return_value.first = AsyncMock(return_value=row)
        outcome = await dispatch_trial_flow_reminder(1, event)
        assert outcome == "stopped"
