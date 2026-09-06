"""证照到期提醒（INF-03 / R-14）。

按证照 reminder_days 登记到期前提醒；过期当天登记 overdue。
接收人取证照 notify_user_ids；渠道由消息规则配置（可含短信），证照 notify_channels 写入上下文。
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Literal
from zoneinfo import ZoneInfo

from loguru import logger

from apps.kuaioa.constants.license_types import LICENSE_TYPE_LABELS
from apps.kuaioa.models.license import KuaioaLicense
from apps.kuaioa.services.kuaioa_license_notification import (
    ACTION_DUE_OVERDUE,
    ACTION_DUE_SOON,
    dispatch_kuaioa_license_notification,
)
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import register_reminder_handler
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import site_timezone_name

ENTITY_TYPE = "kuaioa_license"
RULE_PREFIX = "kuaioa.compliance_license"
RULE_DUE_SOON = f"{RULE_PREFIX}.due_soon"
RULE_OVERDUE = f"{RULE_PREFIX}.overdue"
CHANNEL_INTERNAL = "internal"


def _site_day_at_hour_utc(day, *, hour: int = 9) -> datetime:
    tz = ZoneInfo(site_timezone_name())
    local = datetime(day.year, day.month, day.day, hour, 0, 0, tzinfo=tz)
    return local.astimezone(timezone.utc)


def _normalize_user_ids(raw) -> list[int]:
    if not isinstance(raw, list):
        return []
    out: list[int] = []
    seen = set()
    for item in raw:
        try:
            uid = int(item)
        except (TypeError, ValueError):
            continue
        if uid <= 0 or uid in seen:
            continue
        seen.add(uid)
        out.append(uid)
    return out


def _normalize_channels(raw) -> list[str]:
    if not isinstance(raw, list):
        return ["internal"]
    out: list[str] = []
    for item in raw:
        ch = str(item or "").strip().lower()
        if ch in {"internal", "email", "sms"} and ch not in out:
            out.append(ch)
    return out or ["internal"]


class LicenseReminderService:
    @staticmethod
    async def stop_for_license(tenant_id: int, license_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_TYPE,
            entity_id=license_id,
            reason=reason,
        )

    @staticmethod
    async def sync_after_saved(tenant_id: int, license: KuaioaLicense) -> None:
        await LicenseReminderService.stop_for_license(
            tenant_id, license.id, reason="证照更新"
        )
        if not license.notify_enabled:
            return
        if not license.expiry_date:
            return
        if (license.status or "").strip().lower() != "valid":
            return

        due = license.expiry_date
        reminder_days = max(1, int(license.reminder_days or 30))
        soon_day = due - timedelta(days=reminder_days)
        payload = {
            "license_id": license.id,
            "license_code": license.license_code,
            "license_name": license.license_name,
            "license_type": license.license_type,
            "due_date": due.isoformat(),
            "notify_user_ids": _normalize_user_ids(license.notify_user_ids),
            "notify_channels": _normalize_channels(license.notify_channels),
        }
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_DUE_SOON}:{license.id}:{due.isoformat()}",
            rule_code=RULE_DUE_SOON,
            entity_type=ENTITY_TYPE,
            entity_id=license.id,
            entity_uuid=str(license.uuid),
            planned_at=_site_day_at_hour_utc(soon_day),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "due_soon"},
        )
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_OVERDUE}:{license.id}:{due.isoformat()}",
            rule_code=RULE_OVERDUE,
            entity_type=ENTITY_TYPE,
            entity_id=license.id,
            entity_uuid=str(license.uuid),
            planned_at=_site_day_at_hour_utc(due),
            channel=CHANNEL_INTERNAL,
            payload={**payload, "kind": "overdue"},
        )


async def dispatch_license_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    row = await KuaioaLicense.filter(
        tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
    ).first()
    if not row:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "证照已删除")
        return "stopped"
    if not row.notify_enabled:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "提醒已关闭")
        return "stopped"

    payload = event.payload or {}
    due_raw = str(payload.get("due_date") or "")
    if row.expiry_date and due_raw and row.expiry_date.isoformat() != due_raw:
        await ReminderEventService.mark_stopped(tenant_id, event.id, "到期日已变更")
        return "stopped"

    rule_code = str(event.rule_code or "")
    if rule_code == RULE_DUE_SOON:
        action = ACTION_DUE_SOON
        kind_label = "到期前提醒"
    elif rule_code == RULE_OVERDUE:
        action = ACTION_DUE_OVERDUE
        kind_label = "已到期"
    else:
        await ReminderEventService.mark_stopped(
            tenant_id, event.id, f"未知证照提醒规则: {rule_code}"
        )
        return "stopped"

    type_code = (row.license_type or "").strip()
    type_label = LICENSE_TYPE_LABELS.get(type_code, type_code or "—")
    notify_user_ids = _normalize_user_ids(
        payload.get("notify_user_ids") or row.notify_user_ids
    )
    notify_channels = _normalize_channels(
        payload.get("notify_channels") or row.notify_channels
    )
    variables = {
        "license_code": row.license_code or "—",
        "license_name": row.license_name or "—",
        "license_type": type_label,
        "holder_name": row.holder_name or "—",
        "expiry_date": due_raw or (row.expiry_date.isoformat() if row.expiry_date else "—"),
        "reminder_kind": kind_label,
        "detail_path": f"/apps/kuaioa/compliance/licenses?id={row.id}",
    }
    context = {
        "creator_user_id": getattr(row, "created_by", None),
        "form_notify_user_ids": notify_user_ids,
        "preferred_channels": notify_channels,
    }
    sent = await dispatch_kuaioa_license_notification(
        tenant_id,
        trigger_action=action,
        variables=variables,
        context=context,
        preferred_channels=notify_channels,
    )
    if not sent:
        logger.info(
            "证照提醒无匹配规则或接收人 tenant={} license={} action={}",
            tenant_id,
            row.id,
            action,
        )
    return "sent"


register_reminder_handler(RULE_PREFIX, dispatch_license_reminder)
