"""模具供应商半年回签到期提醒（INF-03 / R-10）。

- 到期前 14 天：due_soon
- 过期后 1 天：due_overdue（未执行预警）
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal
from zoneinfo import ZoneInfo

from loguru import logger

from apps.kuaizhizao.models.mold import Mold
from apps.kuaizhizao.services.kuaizhizao_business_notification import (
    ACTION_DUE_OVERDUE,
    ACTION_DUE_SOON,
    DOC_MOLD_SIGNBACK,
    dispatch_kuaizhizao_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import (
    register_reminder_handler,
    register_reminder_preparer,
)
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import site_timezone_name, to_api_isoformat

ENTITY_TYPE = "mold"
RULE_PREFIX = "kuaizhizao.mold_signback"
RULE_DUE_SOON = f"{RULE_PREFIX}.due_soon"
RULE_OVERDUE = f"{RULE_PREFIX}.overdue"
CHANNEL_INTERNAL = "internal"
DUE_SOON_DAYS = 14
OVERDUE_AFTER_DAYS = 1


def _site_day_at_hour_utc(day, *, hour: int = 9) -> datetime:
    tz = ZoneInfo(site_timezone_name())
    local = datetime(day.year, day.month, day.day, hour, 0, 0, tzinfo=tz)
    return local.astimezone(timezone.utc)


class MoldSignbackReminderService:
    @staticmethod
    async def stop_for_mold(tenant_id: int, mold_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE,
            entity_id=mold_id,
            reason=reason,
        )

    @staticmethod
    async def schedule_due(tenant_id: int, mold: Mold) -> None:
        if not mold.signback_required:
            return
        if not mold.next_signback_due:
            return
        if not mold.is_active:
            return

        due = mold.next_signback_due
        soon_day = due - timedelta(days=DUE_SOON_DAYS)
        overdue_day = due + timedelta(days=OVERDUE_AFTER_DAYS)
        payload = {
            "due_date": due.isoformat(),
            "mold_code": mold.code,
            "mold_name": mold.name,
            "supplier": mold.supplier or mold.last_signback_supplier,
        }
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_DUE_SOON}:{mold.id}:{due.isoformat()}",
            rule_code=RULE_DUE_SOON,
            entity_type=ENTITY_TYPE,
            entity_id=mold.id,
            entity_uuid=str(mold.uuid),
            planned_at=_site_day_at_hour_utc(soon_day),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "due_soon"},
        )
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_OVERDUE}:{mold.id}:{due.isoformat()}",
            rule_code=RULE_OVERDUE,
            entity_type=ENTITY_TYPE,
            entity_id=mold.id,
            entity_uuid=str(mold.uuid),
            planned_at=_site_day_at_hour_utc(overdue_day),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "overdue"},
        )

    @staticmethod
    async def sync_for_mold(tenant_id: int, mold: Mold) -> None:
        await MoldSignbackReminderService.stop_for_mold(
            tenant_id, mold.id, reason="模具回签计划更新"
        )
        await MoldSignbackReminderService.schedule_due(tenant_id, mold)


async def dispatch_mold_signback_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    mold = await Mold.filter(
        tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
    ).first()
    if not mold:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "模具已删除")
        return "stopped"
    if not mold.signback_required or not mold.is_active:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "回签已关闭或模具停用")
        return "stopped"

    payload = event.payload or {}
    due_raw = str(payload.get("due_date") or "")
    if mold.next_signback_due and due_raw:
        if mold.next_signback_due.isoformat() != due_raw:
            await ReminderEventService.mark_stopped(
                tenant_id, event.id, "回签到期日已变更"
            )
            return "stopped"

    rule_code = str(event.rule_code or "")
    if rule_code == RULE_DUE_SOON:
        action = ACTION_DUE_SOON
        kind_label = "到期前十四天"
    elif rule_code == RULE_OVERDUE:
        action = ACTION_DUE_OVERDUE
        kind_label = "已过期一天未执行"
    else:
        await ReminderEventService.mark_stopped(
            tenant_id, event.id, f"未知模具回签提醒规则: {rule_code}"
        )
        return "stopped"

    variables = {
        "mold_code": mold.code or "—",
        "mold_name": mold.name or "—",
        "supplier": mold.supplier or mold.last_signback_supplier or "—",
        "due_date": due_raw or to_api_isoformat(mold.next_signback_due) or "—",
        "reminder_kind": kind_label,
        "detail_path": f"/apps/kuaizhizao/equipment-management/molds/{mold.uuid}",
    }
    context = {
        "creator_user_id": getattr(mold, "created_by", None),
    }
    sent = await dispatch_kuaizhizao_notification(
        tenant_id,
        trigger_document=DOC_MOLD_SIGNBACK,
        trigger_action=action,
        variables=variables,
        context=context,
    )
    if not sent:
        logger.info(
            "模具回签提醒无匹配规则或接收人 tenant={} mold={} action={}",
            tenant_id,
            mold.id,
            action,
        )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_mold_signback_reminder)


async def prepare_mold_signback_reminders() -> None:
    """扫描前幂等补齐模具回签待发事件（含迁移回填后的到期日）。"""
    molds = await Mold.filter(
        deleted_at__isnull=True,
        signback_required=True,
        is_active=True,
        next_signback_due__isnull=False,
    ).all()
    for mold in molds:
        try:
            await MoldSignbackReminderService.schedule_due(int(mold.tenant_id), mold)
        except Exception:
            logger.exception(
                "准备模具回签提醒失败 tenant={} mold={}",
                mold.tenant_id,
                mold.id,
            )


register_reminder_preparer(prepare_mold_signback_reminders)
