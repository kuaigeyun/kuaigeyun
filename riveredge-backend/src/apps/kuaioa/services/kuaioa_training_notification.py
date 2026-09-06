"""轻办公培训业务消息提醒常量与派发。"""

from __future__ import annotations

from typing import Any, Dict, Optional

from loguru import logger

from core.services.business.business_notification_service import BusinessNotificationService

DOC_TRAINING = "training"
ACTION_DEPT_APPLICATION_WINDOW = "dept_application_window"
ACTION_ANNUAL_PLAN_WINDOW = "annual_plan_window"
ACTION_CONTENT_DUE = "content_due"
ACTION_SPECIAL_WORK_WINDOW = "special_work_window"
ACTION_LICENSE_EXPIRING = "license_expiring"


async def dispatch_kuaioa_training_notification(
    tenant_id: int,
    *,
    trigger_action: str,
    variables: Optional[Dict[str, Any]] = None,
    context: Optional[Dict[str, Any]] = None,
    message_category: str = "process",
) -> int:
    vars_payload = dict(variables or {})
    vars_payload.setdefault("message_category", message_category)
    try:
        sent = await BusinessNotificationService.dispatch(
            tenant_id,
            trigger_document=DOC_TRAINING,
            trigger_action=trigger_action,
            variables=vars_payload,
            context=context or {},
        )
    except Exception as exc:
        logger.exception(
            "轻办公培训提醒派发失败 tenant={} action={}: {}",
            tenant_id,
            trigger_action,
            exc,
        )
        return 0
    return int(sent or 0)
