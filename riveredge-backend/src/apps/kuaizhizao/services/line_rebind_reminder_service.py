"""换线后强制初检超时提醒（INF-03 / R-10 WP-10.7）。"""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from loguru import logger

from apps.kuaizhizao.models.equipment import Equipment
from apps.kuaizhizao.models.equipment_line_rebind import EquipmentLineRebind
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_DUE_OVERDUE,
    DOC_EQUIPMENT_LINE_REBIND,
    dispatch_kuaizhizao_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import (
    register_reminder_handler,
)
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import to_api_isoformat

ENTITY_EQUIPMENT = "equipment"
RULE_PREFIX = "kuaizhizao.line_rebind"
RULE_FORCE_SPOT = f"{RULE_PREFIX}.force_spot_overdue"
CHANNEL_INTERNAL = "internal"
DOC_LINE_REBIND = DOC_EQUIPMENT_LINE_REBIND


class LineRebindReminderService:
    @staticmethod
    async def stop_force_spot_reminders(
        tenant_id: int, equipment_id: int, *, reason: str
    ) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_EQUIPMENT,
            entity_id=equipment_id,
            rule_id=f"{RULE_FORCE_SPOT}:{equipment_id}",
            reason=reason,
        )

    @staticmethod
    async def on_line_rebind_completed(
        tenant_id: int,
        header: EquipmentLineRebind,
        equipment: Equipment,
        *,
        due_at: datetime,
    ) -> None:
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_FORCE_SPOT}:{equipment.id}",
            rule_code=RULE_FORCE_SPOT,
            entity_type=ENTITY_EQUIPMENT,
            entity_id=equipment.id,
            entity_uuid=str(equipment.uuid),
            planned_at=due_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "force_spot_overdue",
                "document_no": header.document_no,
                "equipment_code": equipment.code,
                "equipment_name": equipment.name,
                "production_line_code": header.production_line_code,
                "production_line_name": header.production_line_name,
                "rebind_id": header.id,
            },
        )


async def dispatch_line_rebind_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    equipment = await Equipment.filter(
        tenant_id=tenant_id,
        id=event.entity_id,
        deleted_at__isnull=True,
    ).first()
    if not equipment:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "设备已删除")
        return "stopped"
    if not getattr(equipment, "force_spot_check_required", False):
        await ReminderEventService.mark_stopped(tenant_id, event.id, "强制初检已解除")
        return "stopped"

    payload = event.payload or {}
    await dispatch_kuaizhizao_notification(
        tenant_id,
        trigger_document=DOC_LINE_REBIND,
        trigger_action=ACTION_DUE_OVERDUE,
        variables={
            "document_no": str(payload.get("document_no") or ""),
            "equipment_code": equipment.code or "",
            "equipment_name": equipment.name or "",
            "production_line_code": str(
                payload.get("production_line_code") or equipment.production_line_code or ""
            ),
            "production_line_name": str(
                payload.get("production_line_name") or equipment.production_line_name or ""
            ),
            "force_spot_check_due_at": to_api_isoformat(equipment.force_spot_check_due_at)
            if equipment.force_spot_check_due_at
            else "",
            "detail_path": "/apps/kuaizhizao/equipment-management/equipment-line-rebinds",
        },
        context={
            "creator_user_id": equipment.responsible_person_id,
            "assignee_user_id": equipment.responsible_person_id,
        },
    )
    logger.info(
        "line_rebind_force_spot_notified tenant={} equipment={}",
        tenant_id,
        equipment.id,
    )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_line_rebind_reminder)
