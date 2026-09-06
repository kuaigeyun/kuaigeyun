"""轻办公培训消息提醒规则预设。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Set, Tuple
from uuid import UUID

from loguru import logger

from apps.kuaioa.services.kuaioa_training_notification import (
    ACTION_ANNUAL_PLAN_WINDOW,
    ACTION_CONTENT_DUE,
    ACTION_DEPT_APPLICATION_WINDOW,
    ACTION_LICENSE_EXPIRING,
    ACTION_SPECIAL_WORK_WINDOW,
    DOC_TRAINING,
)
from core.models.message_template import MessageTemplate
from core.services.messaging.message_template_service import MessageTemplateService
from infra.services.business_config_service import BusinessConfigService

BUILTIN_IN_APP_CHANNEL_UUID = "__builtin_internal_channel__"

KUAIOA_TRAINING_NOTIFICATION_RULE_PRESETS: List[Dict[str, Any]] = [
    {
        "id": "oa_preset_training_dept_application_window",
        "scene_name": "部门培训申请窗口",
        "trigger_document": DOC_TRAINING,
        "trigger_action": ACTION_DEPT_APPLICATION_WINDOW,
        "template_code": "OA_TRAINING_DEPT_APPLICATION_WINDOW",
        "recipient_scopes": ["user_specified"],
        "enabled": False,
    },
    {
        "id": "oa_preset_training_annual_plan_window",
        "scene_name": "年度培训计划窗口",
        "trigger_document": DOC_TRAINING,
        "trigger_action": ACTION_ANNUAL_PLAN_WINDOW,
        "recipient_scopes": ["user_specified"],
        "template_code": "OA_TRAINING_ANNUAL_PLAN_WINDOW",
        "enabled": False,
    },
    {
        "id": "oa_preset_training_content_due",
        "scene_name": "培训内容记录逾期",
        "trigger_document": DOC_TRAINING,
        "trigger_action": ACTION_CONTENT_DUE,
        "template_code": "OA_TRAINING_CONTENT_DUE",
        "recipient_scopes": ["creator", "user_specified"],
        "enabled": False,
    },
    {
        "id": "oa_preset_training_special_work_window",
        "scene_name": "特殊作业资格确认窗口",
        "trigger_document": DOC_TRAINING,
        "trigger_action": ACTION_SPECIAL_WORK_WINDOW,
        "template_code": "OA_TRAINING_SPECIAL_WORK_WINDOW",
        "recipient_scopes": ["user_specified"],
        "enabled": False,
    },
    {
        "id": "oa_preset_training_license_expiring",
        "scene_name": "上岗证到期提醒",
        "trigger_document": DOC_TRAINING,
        "trigger_action": ACTION_LICENSE_EXPIRING,
        "template_code": "OA_TRAINING_LICENSE_EXPIRING",
        "recipient_scopes": ["user_specified"],
        "enabled": False,
    },
]

_TEMPLATE_CODES: Set[str] = {
    str(p.get("template_code") or "").strip()
    for p in KUAIOA_TRAINING_NOTIFICATION_RULE_PRESETS
    if str(p.get("template_code") or "").strip()
}


def _normalize_rules(raw: Any) -> List[dict]:
    notifications = raw if isinstance(raw, dict) else {}
    rules = notifications.get("rules") if isinstance(notifications, dict) else None
    if not isinstance(rules, list):
        return []
    return [r for r in rules if isinstance(r, dict)]


def _rule_identity(rule: dict) -> Tuple[str, str]:
    return (
        str(rule.get("trigger_document") or "").strip(),
        str(rule.get("trigger_action") or "").strip(),
    )


async def _template_uuid_by_code(tenant_id: int, code: str) -> Optional[str]:
    row = await MessageTemplate.filter(
        tenant_id=tenant_id, code=code, deleted_at__isnull=True
    ).first()
    if not row:
        return None
    return str(row.uuid)


async def load_kuaioa_training_notification_rule_presets(tenant_id: int) -> Dict[str, int]:
    templates_created = await MessageTemplateService.load_preset_sme(
        tenant_id,
        only_codes=_TEMPLATE_CODES,
    )
    cfg = await BusinessConfigService().get_business_config(tenant_id)
    existing = _normalize_rules((cfg.get("parameters") or {}).get("notifications"))
    existing_keys: Set[Tuple[str, str]] = {_rule_identity(r) for r in existing}
    existing_ids = {str(r.get("id") or "") for r in existing if r.get("id")}

    created = 0
    for preset in KUAIOA_TRAINING_NOTIFICATION_RULE_PRESETS:
        doc, action = _rule_identity(preset)
        if (doc, action) in existing_keys:
            continue
        preset_id = str(preset.get("id") or "").strip()
        if preset_id and preset_id in existing_ids:
            continue
        template_code = str(preset.get("template_code") or "").strip()
        template_uuid = await _template_uuid_by_code(tenant_id, template_code)
        if not template_uuid:
            logger.warning(
                "轻办公培训提醒预设跳过：未找到消息模板 tenant={} code={}",
                tenant_id,
                template_code,
            )
            continue
        existing.append(
            {
                "id": preset_id or f"oa_preset_{doc}_{action}",
                "scene_name": preset.get("scene_name") or f"{doc} {action}",
                "enabled": bool(preset.get("enabled", False)),
                "trigger_document": doc,
                "trigger_action": action,
                "channel_uuids": [BUILTIN_IN_APP_CHANNEL_UUID],
                "channels": [BUILTIN_IN_APP_CHANNEL_UUID],
                "recipient_scopes": list(preset.get("recipient_scopes") or []),
                "recipient_user_ids": [],
                "form_notify_default_user_ids": [],
                "template_uuid": template_uuid,
                "template": template_uuid,
                "template_code": template_code,
            }
        )
        existing_keys.add((doc, action))
        if preset_id:
            existing_ids.add(preset_id)
        created += 1

    if created > 0:
        await BusinessConfigService().batch_update_process_parameters(
            tenant_id,
            {"notifications": {"rules": existing}},
        )
    return {"templates_created": templates_created, "rules_created": created}
