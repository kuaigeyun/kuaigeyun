"""设备维修到场超时提醒（INF-03 / R-10 WP-10.9）。"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Literal, Optional

from loguru import logger

from apps.kuaizhizao.models.equipment_fault import EquipmentFault, EquipmentRepair
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_ARRIVAL_OVERDUE,
    DOC_EQUIPMENT_FAULT,
    dispatch_kuaizhizao_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import register_reminder_handler
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import to_api_isoformat

ENTITY_FAULT = "equipment_fault"
RULE_PREFIX = "kuaizhizao.equipment_fault"
RULE_ARRIVAL = f"{RULE_PREFIX}.arrival_overdue"
CHANNEL_INTERNAL = "internal"
DEFAULT_RESPONSE_MINUTES = 60


class EquipmentFaultReminderService:
    @staticmethod
    async def stop_arrival_reminders(tenant_id: int, fault_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_FAULT,
            entity_id=fault_id,
            rule_id=f"{RULE_ARRIVAL}:{fault_id}",
            reason=reason,
        )

    @staticmethod
    async def on_fault_reported(
        tenant_id: int,
        fault: EquipmentFault,
        *,
        due_at: datetime,
    ) -> None:
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_ARRIVAL}:{fault.id}",
            rule_code=RULE_ARRIVAL,
            entity_type=ENTITY_FAULT,
            entity_id=fault.id,
            entity_uuid=str(fault.uuid),
            planned_at=due_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "arrival_overdue",
                "fault_no": fault.fault_no,
                "equipment_code": fault.equipment_code,
                "equipment_name": fault.equipment_name,
                "response_minutes": fault.response_minutes,
            },
        )


async def dispatch_equipment_fault_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    fault = await EquipmentFault.filter(
        tenant_id=tenant_id,
        id=event.entity_id,
        deleted_at__isnull=True,
    ).first()
    if not fault:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "故障单已删除")
        return "stopped"
    if fault.status in ("已修复", "已关闭"):
        await ReminderEventService.mark_stopped(tenant_id, event.id, "故障已关闭")
        return "stopped"

    arrived = await EquipmentRepair.filter(
        tenant_id=tenant_id,
        equipment_fault_id=fault.id,
        deleted_at__isnull=True,
        arrival_at__isnull=False,
    ).exists()
    if arrived:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "已到场签到")
        return "stopped"

    payload = event.payload or {}
    await dispatch_kuaizhizao_notification(
        tenant_id,
        trigger_document=DOC_EQUIPMENT_FAULT,
        trigger_action=ACTION_ARRIVAL_OVERDUE,
        variables={
            "fault_no": fault.fault_no or str(payload.get("fault_no") or ""),
            "equipment_code": fault.equipment_code or str(payload.get("equipment_code") or ""),
            "equipment_name": fault.equipment_name or str(payload.get("equipment_name") or ""),
            "response_minutes": str(fault.response_minutes or DEFAULT_RESPONSE_MINUTES),
            "response_due_at": to_api_isoformat(fault.response_due_at)
            if fault.response_due_at
            else "",
            "detail_path": "/apps/kuaizhizao/equipment-management/equipment-faults",
        },
        context={
            "creator_user_id": fault.reporter_id or fault.created_by,
            "assignee_user_id": fault.reporter_id or fault.created_by,
        },
    )
    logger.info(
        "equipment_fault_arrival_overdue_notified tenant={} fault={}",
        tenant_id,
        fault.id,
    )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_equipment_fault_reminder)


def compute_response_due_at(reported_at: datetime, response_minutes: int) -> datetime:
    return reported_at + timedelta(minutes=max(1, int(response_minutes)))


async def fault_has_arrival(tenant_id: int, fault_id: int) -> bool:
    return await EquipmentRepair.filter(
        tenant_id=tenant_id,
        equipment_fault_id=fault_id,
        deleted_at__isnull=True,
        arrival_at__isnull=False,
    ).exists()


def is_fault_response_overdue(
    fault: EquipmentFault,
    *,
    now: Optional[datetime] = None,
    has_arrival: bool = False,
) -> bool:
    if has_arrival:
        return False
    if fault.status in ("已修复", "已关闭"):
        return False
    due = getattr(fault, "response_due_at", None)
    if not due:
        return False
    from core.utils.timezone_utils import resolve_business_datetime

    current = now or resolve_business_datetime()
    return current > due
