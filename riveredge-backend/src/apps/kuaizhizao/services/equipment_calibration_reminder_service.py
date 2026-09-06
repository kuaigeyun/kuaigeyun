"""设备外校计量到期提醒（INF-03 / R-09）。

- 到期前 1 个月：due_soon
- 过期后 1 天：due_overdue
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal, Optional
from zoneinfo import ZoneInfo

from loguru import logger

from apps.kuaizhizao.constants.calibration_plan_types import CALIBRATION_PLAN_EXTERNAL
from apps.kuaizhizao.models.equipment import Equipment, EquipmentCalibration
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_DUE_OVERDUE,
    ACTION_DUE_SOON,
    DOC_EQUIPMENT_CALIBRATION,
    dispatch_kuaizhizao_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import register_reminder_handler
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import site_timezone_name, to_api_isoformat

ENTITY_TYPE = "equipment"
RULE_PREFIX = "kuaizhizao.equipment_calibration"
RULE_DUE_SOON = f"{RULE_PREFIX}.due_soon"
RULE_OVERDUE = f"{RULE_PREFIX}.overdue"
CHANNEL_INTERNAL = "internal"
DUE_SOON_DAYS = 30
OVERDUE_AFTER_DAYS = 1


def _site_day_at_hour_utc(day, *, hour: int = 9) -> datetime:
    tz = ZoneInfo(site_timezone_name())
    local = datetime(day.year, day.month, day.day, hour, 0, 0, tzinfo=tz)
    return local.astimezone(timezone.utc)


class EquipmentCalibrationReminderService:
    @staticmethod
    async def stop_for_equipment(tenant_id: int, equipment_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE,
            entity_id=equipment_id,
            reason=reason,
        )

    @staticmethod
    async def schedule_external_due(
        tenant_id: int,
        equipment: Equipment,
        calib: EquipmentCalibration,
    ) -> None:
        if (calib.plan_type or "").strip().lower() != CALIBRATION_PLAN_EXTERNAL:
            return
        if not calib.expiry_date:
            return

        due = calib.expiry_date
        soon_day = due - timedelta(days=DUE_SOON_DAYS)
        overdue_day = due + timedelta(days=OVERDUE_AFTER_DAYS)
        payload = {
            "calibration_id": calib.id,
            "plan_type": CALIBRATION_PLAN_EXTERNAL,
            "due_date": due.isoformat(),
            "equipment_code": equipment.code,
            "equipment_name": equipment.name,
        }
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_DUE_SOON}:{equipment.id}:{due.isoformat()}",
            rule_code=RULE_DUE_SOON,
            entity_type=ENTITY_TYPE,
            entity_id=equipment.id,
            entity_uuid=str(equipment.uuid),
            planned_at=_site_day_at_hour_utc(soon_day),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "due_soon"},
        )
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_OVERDUE}:{equipment.id}:{due.isoformat()}",
            rule_code=RULE_OVERDUE,
            entity_type=ENTITY_TYPE,
            entity_id=equipment.id,
            entity_uuid=str(equipment.uuid),
            planned_at=_site_day_at_hour_utc(overdue_day),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "overdue"},
        )

    @staticmethod
    async def sync_after_calibration_saved(
        tenant_id: int,
        equipment: Equipment,
        calib: EquipmentCalibration,
    ) -> None:
        await EquipmentCalibrationReminderService.stop_for_equipment(
            tenant_id,
            equipment.id,
            reason="校准记录更新",
        )
        await EquipmentCalibrationReminderService.schedule_external_due(
            tenant_id, equipment, calib
        )


async def dispatch_equipment_calibration_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    equipment = await Equipment.filter(
        tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
    ).first()
    if not equipment:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "设备已删除")
        return "stopped"

    payload = event.payload or {}
    due_raw = str(payload.get("due_date") or "")
    if equipment.next_calibration_date and due_raw:
        if equipment.next_calibration_date.isoformat() != due_raw:
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "计量到期日已变更"
            )
            return "stopped"

    rule_code = str(event.rule_code or "")
    if rule_code == RULE_DUE_SOON:
        action = ACTION_DUE_SOON
        kind_label = "到期前一个月"
    elif rule_code == RULE_OVERDUE:
        action = ACTION_DUE_OVERDUE
        kind_label = "已过期一天"
    else:
        await ReminderEventService.mark_stopped(
            tenant_id, event.id, f"未知外校提醒规则: {rule_code}"
        )
        return "stopped"

    variables = {
        "equipment_code": equipment.code or "—",
        "equipment_name": equipment.name or "—",
        "due_date": due_raw or to_api_isoformat(equipment.next_calibration_date) or "—",
        "reminder_kind": kind_label,
        "detail_path": (
            f"/apps/kuaizhizao/equipment-management/equipment-calibrations"
            f"?highlight={equipment.uuid}"
        ),
    }
    context = {
        "creator_user_id": getattr(equipment, "responsible_person_id", None)
        or getattr(equipment, "created_by", None),
    }
    sent = await dispatch_kuaizhizao_notification(
        tenant_id,
        trigger_document=DOC_EQUIPMENT_CALIBRATION,
        trigger_action=action,
        variables=variables,
        context=context,
    )
    if not sent:
        logger.info(
            "设备外校提醒无匹配规则或接收人 tenant={} equipment={} action={}",
            tenant_id,
            equipment.id,
            action,
        )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_equipment_calibration_reminder)
