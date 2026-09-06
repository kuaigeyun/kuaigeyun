"""轻办公证照到期提醒常量与派发（R-14，可选用短信）。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from loguru import logger

from core.services.business.business_notification_service import BusinessNotificationService

DOC_COMPLIANCE_LICENSE = "compliance_license"
ACTION_DUE_SOON = "due_soon"
ACTION_DUE_OVERDUE = "due_overdue"


async def dispatch_kuaioa_license_notification(
    tenant_id: int,
    *,
    trigger_action: str,
    variables: Optional[Dict[str, Any]] = None,
    context: Optional[Dict[str, Any]] = None,
    preferred_channels: Optional[List[str]] = None,
    message_category: str = "process",
) -> int:
    vars_payload = dict(variables or {})
    vars_payload.setdefault("message_category", message_category)
    ctx = dict(context or {})
    if preferred_channels:
        ctx["preferred_channels"] = [
            str(c).strip().lower() for c in preferred_channels if str(c).strip()
        ]
    try:
        sent = await BusinessNotificationService.dispatch(
            tenant_id,
            trigger_document=DOC_COMPLIANCE_LICENSE,
            trigger_action=trigger_action,
            variables=vars_payload,
            context=ctx,
        )
    except Exception as exc:
        logger.exception(
            "轻办公证照提醒派发失败 tenant={} action={}: {}",
            tenant_id,
            trigger_action,
            exc,
        )
        return 0
    return int(sent or 0)
