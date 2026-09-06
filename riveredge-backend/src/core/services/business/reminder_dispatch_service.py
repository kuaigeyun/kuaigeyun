"""提醒事件到期派发（INF-03 扫描端）。"""

from __future__ import annotations

from typing import Awaitable, Callable, Dict, List, Optional

from loguru import logger

from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_event_service import ReminderEventService
from core.utils.timezone_utils import resolve_business_datetime, to_api_isoformat

ReminderHandler = Callable[[int, ReminderEvent], Awaitable[None]]
ReminderPreparer = Callable[[], Awaitable[None]]

_DISPATCHERS: Dict[str, ReminderHandler] = {}
_PREPARERS: List[ReminderPreparer] = []
_HANDLERS_LOADED = False


def register_reminder_handler(rule_code_prefix: str, handler: ReminderHandler) -> None:
    prefix = str(rule_code_prefix or "").strip()
    if not prefix:
        raise ValueError("rule_code_prefix 不能为空")
    _DISPATCHERS[prefix] = handler


def register_reminder_preparer(preparer: ReminderPreparer) -> None:
    """登记扫描前准备逻辑（如按日历幂等写入待发 ReminderEvent）。"""
    if preparer not in _PREPARERS:
        _PREPARERS.append(preparer)


def _ensure_domain_handlers() -> None:
    global _HANDLERS_LOADED
    if _HANDLERS_LOADED:
        return
    from apps.kuaiplm.services import trial_flow_reminder_service  # noqa: F401
    from apps.kuaioa.services import training_reminder_service  # noqa: F401
    from apps.kuaioa.services import license_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import equipment_calibration_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import inventory_verify_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import mold_signback_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import quality_complaint_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import spot_check_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import line_rebind_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import equipment_fault_reminder_service  # noqa: F401
    from apps.kuaizhizao.services import supplier_eval_env_reminder_service  # noqa: F401

    _HANDLERS_LOADED = True


async def _run_preparers() -> None:
    for preparer in _PREPARERS:
        try:
            await preparer()
        except Exception as exc:
            logger.error("提醒准备失败 preparer={}: {}", preparer.__name__, exc)


def _resolve_handler(rule_code: Optional[str]) -> Optional[ReminderHandler]:
    code = str(rule_code or "").strip()
    if not code:
        return None
    for prefix, handler in _DISPATCHERS.items():
        if code.startswith(prefix):
            return handler
    return None


class ReminderDispatchService:
    @staticmethod
    async def process_due_for_tenant(tenant_id: int, *, limit: int = 100) -> dict:
        _ensure_domain_handlers()
        now = resolve_business_datetime()
        rows = (
            await ReminderEvent.filter(
                tenant_id=tenant_id,
                status__in=["pending", "failed"],
                planned_at__lte=now,
                deleted_at__isnull=True,
            )
            .order_by("planned_at", "id")
            .limit(limit)
        )
        sent = 0
        stopped = 0
        failed = 0
        skipped = 0
        for row in rows:
            claimed = await ReminderEventService.claim_for_send(tenant_id, row.id)
            if not claimed:
                skipped += 1
                continue
            handler = _resolve_handler(claimed.rule_code)
            if not handler:
                await ReminderEventService.mark_failed(
                    tenant_id,
                    claimed.id,
                    f"未注册提醒处理器: {claimed.rule_code}",
                )
                failed += 1
                continue
            try:
                outcome = await handler(tenant_id, claimed)
                if outcome == "stopped":
                    stopped += 1
                else:
                    await ReminderEventService.mark_sent(tenant_id, claimed.id)
                    sent += 1
            except Exception as exc:
                logger.error(
                    "提醒派发失败 tenant={} event={} rule={}: {}",
                    tenant_id,
                    claimed.id,
                    claimed.rule_code,
                    exc,
                )
                await ReminderEventService.mark_failed(tenant_id, claimed.id, str(exc))
                failed += 1
        return {
            "tenant_id": tenant_id,
            "checked": len(rows),
            "sent": sent,
            "stopped": stopped,
            "failed": failed,
            "skipped": skipped,
            "timestamp": to_api_isoformat(now),
        }

    @staticmethod
    async def process_all_due(*, limit_per_tenant: int = 100) -> dict:
        _ensure_domain_handlers()
        await _run_preparers()
        now = resolve_business_datetime()
        tenant_ids = (
            await ReminderEvent.filter(
                status__in=["pending", "failed"],
                planned_at__lte=now,
                deleted_at__isnull=True,
            )
            .distinct()
            .values_list("tenant_id", flat=True)
        )
        results = []
        totals = {"sent": 0, "stopped": 0, "failed": 0, "skipped": 0, "checked": 0}
        for tenant_id in tenant_ids:
            one = await ReminderDispatchService.process_due_for_tenant(
                int(tenant_id), limit=limit_per_tenant
            )
            results.append(one)
            for key in totals:
                totals[key] += int(one.get(key) or 0)
        return {
            "success": True,
            "tenant_count": len(tenant_ids),
            "timestamp": to_api_isoformat(now),
            "totals": totals,
            "tenants": results,
        }
