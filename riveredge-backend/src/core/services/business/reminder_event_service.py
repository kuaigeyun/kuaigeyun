"""提醒事件账本服务（INF-03）。"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from tortoise.exceptions import IntegrityError
from tortoise.transactions import in_transaction

from core.models.reminder_event import ReminderEvent
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import ValidationError


class ReminderEventService:
    """幂等登记与认领提醒事件。"""

    @staticmethod
    async def ensure_event(
        tenant_id: int,
        *,
        rule_id: str,
        entity_type: str,
        entity_id: int,
        planned_at: datetime,
        channel: str,
        rule_code: Optional[str] = None,
        entity_uuid: Optional[str] = None,
        payload: Optional[Dict[str, Any]] = None,
    ) -> ReminderEvent:
        rule_id = str(rule_id or "").strip()
        entity_type = str(entity_type or "").strip()
        channel = str(channel or "").strip().lower()
        if not rule_id or not entity_type or entity_id < 1 or not channel:
            raise ValidationError("提醒事件缺少 rule_id/entity_type/entity_id/channel")
        if planned_at.tzinfo is None:
            raise ValidationError("planned_at 必须是带时区的 UTC 时刻")

        existing = await ReminderEvent.filter(
            tenant_id=tenant_id,
            rule_id=rule_id,
            entity_type=entity_type,
            entity_id=entity_id,
            planned_at=planned_at,
            channel=channel,
            deleted_at__isnull=True,
        ).first()
        if existing:
            return existing

        try:
            return await ReminderEvent.create(
                tenant_id=tenant_id,
                rule_id=rule_id,
                rule_code=rule_code,
                entity_type=entity_type,
                entity_id=entity_id,
                entity_uuid=entity_uuid,
                channel=channel,
                planned_at=planned_at,
                status="pending",
                payload=payload or {},
            )
        except IntegrityError:
            existing = await ReminderEvent.filter(
                tenant_id=tenant_id,
                rule_id=rule_id,
                entity_type=entity_type,
                entity_id=entity_id,
                planned_at=planned_at,
                channel=channel,
                deleted_at__isnull=True,
            ).first()
            if existing:
                return existing
            raise

    @staticmethod
    async def claim_for_send(tenant_id: int, event_id: int) -> Optional[ReminderEvent]:
        """原子认领：仅 pending/failed 可认领；已 sent/cancelled/stopped 返回 None。"""
        async with in_transaction():
            event = (
                await ReminderEvent.filter(
                    tenant_id=tenant_id,
                    id=event_id,
                    deleted_at__isnull=True,
                )
                .select_for_update()
                .first()
            )
            if not event:
                return None
            if event.status in {"sent", "cancelled", "stopped"}:
                return None
            event.status = "claimed"
            event.attempt_count = int(event.attempt_count or 0) + 1
            event.last_error = None
            await event.save(
                update_fields=["status", "attempt_count", "last_error", "updated_at"]
            )
            return event

    @staticmethod
    async def mark_sent(tenant_id: int, event_id: int) -> ReminderEvent:
        event = await ReminderEvent.filter(
            tenant_id=tenant_id, id=event_id, deleted_at__isnull=True
        ).first()
        if not event:
            raise ValidationError("提醒事件不存在")
        event.status = "sent"
        event.sent_at = resolve_business_datetime()
        event.last_error = None
        await event.save(update_fields=["status", "sent_at", "last_error", "updated_at"])
        return event

    @staticmethod
    async def mark_failed(tenant_id: int, event_id: int, error: str) -> ReminderEvent:
        event = await ReminderEvent.filter(
            tenant_id=tenant_id, id=event_id, deleted_at__isnull=True
        ).first()
        if not event:
            raise ValidationError("提醒事件不存在")
        event.status = "failed"
        event.last_error = (error or "")[:2000]
        await event.save(update_fields=["status", "last_error", "updated_at"])
        return event

    @staticmethod
    async def mark_stopped(
        tenant_id: int, event_id: int, reason: str
    ) -> ReminderEvent:
        event = await ReminderEvent.filter(
            tenant_id=tenant_id, id=event_id, deleted_at__isnull=True
        ).first()
        if not event:
            raise ValidationError("提醒事件不存在")
        event.status = "stopped"
        event.stopped_reason = (reason or "")[:200]
        event.last_error = None
        await event.save(
            update_fields=["status", "stopped_reason", "last_error", "updated_at"]
        )
        return event

    @staticmethod
    async def stop_future_for_entity(
        tenant_id: int,
        *,
        entity_type: str,
        entity_id: int,
        reason: str,
        rule_id: Optional[str] = None,
    ) -> int:
        """业务完成后停止后续提醒。"""
        qs = ReminderEvent.filter(
            tenant_id=tenant_id,
            entity_type=entity_type,
            entity_id=entity_id,
            status__in=["pending", "failed"],
            deleted_at__isnull=True,
        )
        if rule_id:
            qs = qs.filter(rule_id=rule_id)
        rows = await qs.all()
        for row in rows:
            row.status = "stopped"
            row.stopped_reason = (reason or "")[:200]
            await row.save(update_fields=["status", "stopped_reason", "updated_at"])
        return len(rows)
