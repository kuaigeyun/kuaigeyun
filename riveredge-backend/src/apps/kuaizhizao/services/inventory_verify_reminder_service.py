"""库存验证开单/月末完成提醒（INF-03 / R-07）。"""

from __future__ import annotations

from calendar import monthrange
from datetime import datetime, timezone
from typing import Literal, Optional
from zoneinfo import ZoneInfo

from loguru import logger

from apps.kuaizhizao.constants.rework_business_types import REWORK_BUSINESS_INVENTORY_VERIFY
from apps.kuaizhizao.models.rework_order import ReworkOrder
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_MONTH_END_OVERDUE,
    ACTION_OPEN_OVERDUE,
    DOC_REWORK_ORDER,
    dispatch_kuaizhizao_notification,
)
from core.models.application import Application
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import (
    register_reminder_handler,
    register_reminder_preparer,
)
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import (
    resolve_business_datetime,
    site_timezone_name,
    to_api_isoformat,
    to_site_timezone,
)

ENTITY_TYPE_CALENDAR = "inventory_verify_calendar"
ENTITY_TYPE_ORDER = "rework_order"
RULE_PREFIX = "kuaizhizao.inventory_verify"
RULE_OPEN = f"{RULE_PREFIX}.open_overdue"
RULE_MONTH_END = f"{RULE_PREFIX}.month_end"
CHANNEL_INTERNAL = "internal"
OPEN_DAY = 10


def _month_entity_id(year: int, month: int) -> int:
    return year * 100 + month


def _parse_verify_month(value: Optional[str]) -> Optional[tuple[int, int]]:
    raw = (value or "").strip()
    if len(raw) != 7 or raw[4] != "-":
        return None
    try:
        year = int(raw[:4])
        month = int(raw[5:7])
    except ValueError:
        return None
    if year < 2000 or month < 1 or month > 12:
        return None
    return year, month


def _site_wall_clock_utc(year: int, month: int, day: int, hour: int, minute: int) -> datetime:
    tz = ZoneInfo(site_timezone_name())
    local = datetime(year, month, day, hour, minute, 0, tzinfo=tz)
    return local.astimezone(timezone.utc)


class InventoryVerifyReminderService:
    @staticmethod
    async def _has_open_order(tenant_id: int, verify_month: str) -> bool:
        return await ReworkOrder.filter(
            tenant_id=tenant_id,
            business_type=REWORK_BUSINESS_INVENTORY_VERIFY,
            verify_month=verify_month,
            deleted_at__isnull=True,
        ).exclude(status="cancelled").exists()

    @staticmethod
    async def ensure_open_calendar_for_month(
        tenant_id: int, *, year: int, month: int
    ) -> None:
        verify_month = f"{year:04d}-{month:02d}"
        entity_id = _month_entity_id(year, month)
        if await InventoryVerifyReminderService._has_open_order(tenant_id, verify_month):
            await ReminderEventService.stop_future_for_entity(
                tenant_id,
                entity_type=ENTITY_TYPE_CALENDAR,
                entity_id=entity_id,
                reason="本月库存验证已开单",
                rule_id=f"{RULE_OPEN}:{verify_month}",
            )
            return

        planned_at = _site_wall_clock_utc(year, month, OPEN_DAY, 0, 0)
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_OPEN}:{verify_month}",
            rule_code=RULE_OPEN,
            entity_type=ENTITY_TYPE_CALENDAR,
            entity_id=entity_id,
            entity_uuid=verify_month,
            planned_at=planned_at,
            channel=CHANNEL_INTERNAL,
            payload={"kind": "open_overdue", "verify_month": verify_month},
        )

    @staticmethod
    async def ensure_open_calendars(tenant_id: int) -> None:
        now_site = to_site_timezone(resolve_business_datetime())
        year, month = now_site.year, now_site.month
        await InventoryVerifyReminderService.ensure_open_calendar_for_month(
            tenant_id, year=year, month=month
        )
        if month == 12:
            await InventoryVerifyReminderService.ensure_open_calendar_for_month(
                tenant_id, year=year + 1, month=1
            )
        else:
            await InventoryVerifyReminderService.ensure_open_calendar_for_month(
                tenant_id, year=year, month=month + 1
            )

    @staticmethod
    async def schedule_month_end(tenant_id: int, row: ReworkOrder) -> None:
        if (row.business_type or "").strip() != REWORK_BUSINESS_INVENTORY_VERIFY:
            return
        if row.status in ("closed", "cancelled"):
            return
        parsed = _parse_verify_month(row.verify_month)
        if not parsed:
            return
        year, month = parsed
        last_day = monthrange(year, month)[1]
        planned_at = _site_wall_clock_utc(year, month, last_day, 23, 59)
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_MONTH_END}:{row.id}",
            rule_code=RULE_MONTH_END,
            entity_type=ENTITY_TYPE_ORDER,
            entity_id=row.id,
            entity_uuid=str(row.uuid),
            planned_at=planned_at,
            channel=CHANNEL_INTERNAL,
            payload={
                "kind": "month_end",
                "verify_month": row.verify_month,
                "rework_code": row.code,
            },
        )

    @staticmethod
    async def sync_after_order_saved(tenant_id: int, row: ReworkOrder) -> None:
        if (row.business_type or "").strip() != REWORK_BUSINESS_INVENTORY_VERIFY:
            return
        parsed = _parse_verify_month(row.verify_month)
        if parsed:
            year, month = parsed
            await ReminderEventService.stop_future_for_entity(
                tenant_id,
                entity_type=ENTITY_TYPE_CALENDAR,
                entity_id=_month_entity_id(year, month),
                reason="库存验证已开单",
                rule_id=f"{RULE_OPEN}:{row.verify_month}",
            )
        await InventoryVerifyReminderService.schedule_month_end(tenant_id, row)

    @staticmethod
    async def sync_after_terminal(
        tenant_id: int, row: ReworkOrder, *, reason: str
    ) -> None:
        if (row.business_type or "").strip() != REWORK_BUSINESS_INVENTORY_VERIFY:
            return
        await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE_ORDER,
            entity_id=row.id,
            reason=reason,
        )


async def prepare_inventory_verify_calendars() -> None:
    tenant_ids = (
        await Application.filter(
            code="kuaizhizao",
            is_installed=True,
            deleted_at__isnull=True,
        )
        .distinct()
        .values_list("tenant_id", flat=True)
    )
    for tenant_id in tenant_ids:
        try:
            await InventoryVerifyReminderService.ensure_open_calendars(int(tenant_id))
        except Exception as exc:
            logger.error(
                "库存验证开单日历登记失败 tenant={}: {}",
                tenant_id,
                exc,
            )


async def dispatch_inventory_verify_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    rule_code = str(event.rule_code or "")

    if rule_code == RULE_OPEN:
        verify_month = str((event.payload or {}).get("verify_month") or event.entity_uuid or "")
        if not verify_month:
            await ReminderEventService.mark_stopped(tenant_id, event.id, "缺少验证月份")
            return "stopped"
        if await InventoryVerifyReminderService._has_open_order(tenant_id, verify_month):
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "本月库存验证已开单"
            )
            return "stopped"
        sent = await dispatch_kuaizhizao_notification(
            tenant_id,
            trigger_document=DOC_REWORK_ORDER,
            trigger_action=ACTION_OPEN_OVERDUE,
            variables={
                "verify_month": verify_month,
                "rework_code": "—",
                "product_name": "—",
                "status": "未开单",
                "detail_path": "/apps/kuaizhizao/production-execution/rework-orders",
            },
            context={},
        )
        if not sent:
            logger.info(
                "库存验证开单提醒无匹配规则或接收人 tenant={} month={}",
                tenant_id,
                verify_month,
            )
        return "sent"

    if rule_code == RULE_MONTH_END:
        row = await ReworkOrder.filter(
            tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
        ).first()
        if not row:
            await ReminderEventService.mark_stopped(tenant_id, event.id, "返工单已删除")
            return "stopped"
        if (row.business_type or "").strip() != REWORK_BUSINESS_INVENTORY_VERIFY:
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "非库存验证返工单"
            )
            return "stopped"
        if row.status in ("closed", "cancelled"):
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "库存验证已结束"
            )
            return "stopped"
        sent = await dispatch_kuaizhizao_notification(
            tenant_id,
            trigger_document=DOC_REWORK_ORDER,
            trigger_action=ACTION_MONTH_END_OVERDUE,
            variables={
                "verify_month": row.verify_month or "—",
                "rework_code": row.code or str(row.id),
                "product_name": row.product_name or "—",
                "status": row.status or "—",
                "detail_path": (
                    f"/apps/kuaizhizao/production-execution/rework-orders?highlight={row.id}"
                ),
                "due_at": to_api_isoformat(event.planned_at) or "—",
            },
            context={"creator_user_id": row.created_by},
        )
        if not sent:
            logger.info(
                "库存验证月末提醒无匹配规则或接收人 tenant={} rework={}",
                tenant_id,
                row.id,
            )
        return "sent"

    await ReminderEventService.mark_stopped(
        tenant_id, event.id, f"未知库存验证提醒规则: {rule_code}"
    )
    return "stopped"


register_reminder_handler(RULE_PREFIX, dispatch_inventory_verify_reminder)
register_reminder_preparer(prepare_inventory_verify_calendars)
