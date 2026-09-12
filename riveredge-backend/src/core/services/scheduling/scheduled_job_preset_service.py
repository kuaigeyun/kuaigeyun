"""租户内置定时任务预设同步。"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Set

from loguru import logger

from core.config.scheduled_job_registry import (
    PRESET_BY_CODE,
    SCHEDULED_JOB_PRESETS,
    ScheduledJobPreset,
    get_preset,
)
from core.models.scheduled_task import ScheduledTask
from core.services.system.installed_feature_scope import get_installed_application_codes


def _preset_task_config(preset: ScheduledJobPreset) -> Dict[str, Any]:
    return {
        "preset": True,
        "handler": preset.code,
        "module": preset.module,
        "required_app": preset.required_app,
    }


def is_preset_task(task: ScheduledTask) -> bool:
    cfg = task.task_config or {}
    return bool(cfg.get("preset")) or task.type == "builtin"


def preset_handler_code(task: ScheduledTask) -> str:
    cfg = task.task_config or {}
    return str(cfg.get("handler") or task.code or "").strip()


class ScheduledJobPresetService:
    @staticmethod
    async def list_catalog(*, installed_apps: Optional[Set[str]] = None) -> List[Dict[str, Any]]:
        apps = installed_apps
        if apps is None:
            apps = set()
        out: List[Dict[str, Any]] = []
        for preset in SCHEDULED_JOB_PRESETS:
            if preset.required_app and apps and preset.required_app not in apps:
                continue
            out.append(
                {
                    "code": preset.code,
                    "name": preset.name,
                    "description": preset.description,
                    "module": preset.module,
                    "required_app": preset.required_app,
                    "default_cron": preset.default_cron,
                    "default_active": preset.default_active,
                }
            )
        return out

    @staticmethod
    async def sync_presets_for_tenant(tenant_id: int) -> Dict[str, Any]:
        installed = await get_installed_application_codes(tenant_id)
        created = 0
        skipped = 0
        for preset in SCHEDULED_JOB_PRESETS:
            if preset.required_app not in installed:
                skipped += 1
                continue
            exists = await ScheduledTask.filter(
                tenant_id=tenant_id,
                code=preset.code,
                deleted_at__isnull=True,
            ).exists()
            if exists:
                continue
            await ScheduledTask.create(
                tenant_id=tenant_id,
                name=preset.name,
                code=preset.code,
                description=preset.description,
                type="builtin",
                trigger_type="cron",
                trigger_config={"cron": preset.default_cron},
                task_config=_preset_task_config(preset),
                is_active=preset.default_active,
            )
            created += 1
            logger.info("已创建内置定时任务 tenant={} code={}", tenant_id, preset.code)
        return {
            "tenant_id": tenant_id,
            "created": created,
            "skipped": skipped,
            "total_presets": len(SCHEDULED_JOB_PRESETS),
        }

    @staticmethod
    def validate_preset_update(task: ScheduledTask, update_data: Dict[str, Any]) -> None:
        from infra.exceptions.exceptions import ValidationError

        if not is_preset_task(task):
            return
        forbidden = {"code", "type", "task_config"}
        touched = forbidden.intersection(update_data.keys())
        if touched:
            raise ValidationError(f"内置定时任务不可修改字段: {', '.join(sorted(touched))}")
        if "trigger_type" in update_data and update_data["trigger_type"] not in (
            "cron",
            "interval",
        ):
            raise ValidationError("内置定时任务仅支持 cron 或 interval 触发")

    @staticmethod
    def catalog_entry_for_task(task: ScheduledTask) -> Optional[Dict[str, Any]]:
        preset = get_preset(preset_handler_code(task))
        if not preset:
            return None
        return {
            "code": preset.code,
            "module": preset.module,
            "description": preset.description,
            "editable_fields": ["name", "description", "trigger_type", "trigger_config", "is_active"],
        }
