"""设备校准到期提醒租户配置读写。"""

from __future__ import annotations

from typing import Optional

from apps.kuaizhizao.constants.equipment_calibration_settings import (
    DEFAULT_CALIBRATION_REMINDER_ADVANCE_DAYS,
    EQUIPMENT_CALIBRATION_REMINDER_SETTINGS_KEY,
    MAX_CALIBRATION_REMINDER_ADVANCE_DAYS,
    MIN_CALIBRATION_REMINDER_ADVANCE_DAYS,
)
from infra.exceptions.exceptions import ValidationError
from infra.services.tenant_service import TenantService


def validate_calibration_reminder_advance_days(raw: object) -> int:
    """校验并规范化提前提醒天数。"""
    if raw is None:
        return DEFAULT_CALIBRATION_REMINDER_ADVANCE_DAYS
    try:
        value = int(raw)  # type: ignore[arg-type]
    except (TypeError, ValueError) as exc:
        raise ValidationError(
            f"advance_days 必须为 {MIN_CALIBRATION_REMINDER_ADVANCE_DAYS}"
            f"–{MAX_CALIBRATION_REMINDER_ADVANCE_DAYS} 之间的整数"
        ) from exc
    if value < MIN_CALIBRATION_REMINDER_ADVANCE_DAYS or value > MAX_CALIBRATION_REMINDER_ADVANCE_DAYS:
        raise ValidationError(
            f"advance_days 须在 {MIN_CALIBRATION_REMINDER_ADVANCE_DAYS}"
            f"–{MAX_CALIBRATION_REMINDER_ADVANCE_DAYS} 之间"
        )
    return value


async def get_calibration_reminder_advance_days(tenant_id: int) -> int:
    """读取租户级校准到期提前提醒天数。"""
    svc = TenantService()
    row = await svc.get_tenant_config(tenant_id, EQUIPMENT_CALIBRATION_REMINDER_SETTINGS_KEY)
    if row and isinstance(row.config_value, dict) and "advance_days" in row.config_value:
        return validate_calibration_reminder_advance_days(row.config_value["advance_days"])
    return DEFAULT_CALIBRATION_REMINDER_ADVANCE_DAYS


async def get_calibration_reminder_settings(tenant_id: int) -> dict[str, int]:
    advance_days = await get_calibration_reminder_advance_days(tenant_id)
    return {"advance_days": advance_days}


async def set_calibration_reminder_settings(
    tenant_id: int,
    *,
    advance_days: int,
    description: Optional[str] = None,
) -> dict[str, int]:
    validated = validate_calibration_reminder_advance_days(advance_days)
    svc = TenantService()
    await svc.set_tenant_config(
        tenant_id,
        EQUIPMENT_CALIBRATION_REMINDER_SETTINGS_KEY,
        {"advance_days": validated},
        description=description or "设备校准到期提前提醒天数",
    )
    return {"advance_days": validated}
