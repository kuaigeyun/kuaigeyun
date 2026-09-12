"""内置定时任务执行处理器（按 preset code 分发）。"""

from __future__ import annotations

from typing import Any, Awaitable, Callable, Dict

from loguru import logger

Handler = Callable[[int, Dict[str, Any]], Awaitable[Dict[str, Any]]]


async def _inventory_alert_check(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.inventory_alert_service import InventoryAlertService

    result = await InventoryAlertService().run_inventory_alert_check(tenant_id, operator_id=None)
    return {
        "success": True,
        "checked_balances": result.checked_balances,
        "triggered_count": result.triggered_count,
        "resolved_count": result.resolved_count,
    }


async def _exception_detection(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.workflows.functions.exception_detection_workflow import (
        run_exception_detection_for_tenant,
    )

    out = await run_exception_detection_for_tenant(tenant_id)
    return out if isinstance(out, dict) else {"success": True}


async def _work_order_score_recalc(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.work_order_score_service import WorkOrderScoreService

    result = await WorkOrderScoreService().batch_refresh(
        tenant_id=tenant_id,
        work_order_ids=None,
        scenarios=["scheduling", "picking"],
        include_kitting=False,
    )
    return {"success": True, **result}


async def _maintenance_reminder(tenant_id: int, cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.maintenance_reminder_service import MaintenanceReminderService
    from apps.kuaizhizao.services.equipment_supervision_service import dispatch_maintenance_supervision

    advance_days = int(cfg.get("advance_days") or 7)
    service = MaintenanceReminderService()
    result = await service.check_maintenance_plans(tenant_id=tenant_id, advance_days=advance_days)
    supervision = await dispatch_maintenance_supervision(
        tenant_id=tenant_id,
        created_reminders=result.get("created_reminders") or [],
    )
    return {
        "success": True,
        "checked_count": result.get("checked_count"),
        "reminder_count": result.get("reminder_count"),
        "supervision": supervision,
    }


async def _equipment_supervision(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.equipment_supervision_service import (
        check_and_notify_spot_check_overdue,
    )

    spot_result = await check_and_notify_spot_check_overdue(tenant_id=tenant_id)
    return {"success": True, **spot_result}


async def _delivery_delay_notification(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.delivery_delay_notification_service import (
        check_and_notify_delivery_delays,
    )

    result = await check_and_notify_delivery_delays(tenant_id=tenant_id)
    return {"success": True, **result}


async def _customer_pool_recycle(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from apps.kuaizhizao.services.customer_pool_service import CustomerPoolService

    result = await CustomerPoolService.execute_recycle_job_for_tenant(tenant_id)
    return {"success": True, **result}


async def _external_master_data_sync(tenant_id: int, _cfg: Dict[str, Any]) -> Dict[str, Any]:
    from core.services.data.external_sync_scheduler import ExternalSyncSchedulerService

    stats = await ExternalSyncSchedulerService.run_due_syncs_for_tenant(tenant_id)
    return {"success": True, "stats": stats}


BUILTIN_JOB_HANDLERS: Dict[str, Handler] = {
    "kuaizhizao.inventory_alert_check": _inventory_alert_check,
    "kuaizhizao.exception_detection": _exception_detection,
    "kuaizhizao.work_order_score_recalc": _work_order_score_recalc,
    "kuaizhizao.maintenance_reminder": _maintenance_reminder,
    "kuaizhizao.equipment_supervision": _equipment_supervision,
    "kuaizhizao.delivery_delay_notification": _delivery_delay_notification,
    "kuaizhizao.customer_pool_recycle": _customer_pool_recycle,
    "kuaizhizao.external_master_data_sync": _external_master_data_sync,
}


async def execute_builtin_scheduled_job(
    tenant_id: int,
    handler_code: str,
    task_config: Dict[str, Any],
) -> Dict[str, Any]:
    code = (handler_code or "").strip()
    handler = BUILTIN_JOB_HANDLERS.get(code)
    if not handler:
        return {"success": False, "error": f"未注册的内置定时任务: {code}"}
    try:
        return await handler(tenant_id, task_config or {})
    except Exception as exc:
        logger.error("内置定时任务执行失败 tenant={} code={}: {}", tenant_id, code, exc)
        return {"success": False, "error": str(exc)}
