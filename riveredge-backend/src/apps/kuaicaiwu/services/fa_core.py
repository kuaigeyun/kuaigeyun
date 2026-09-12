"""固定资产通用辅助。"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, Optional, Type

from tortoise.models import Model

from core.utils.timezone_utils import resolve_business_datetime, today_site_str
from infra.models.user import User


def model_to_dict(row: Model, extra: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    data: Dict[str, Any] = {}
    for field in row._meta.fields_map:
        if field == "deleted_at":
            continue
        value = getattr(row, field, None)
        if isinstance(value, datetime):
            data[field] = value.isoformat()
        elif isinstance(value, date):
            data[field] = value.isoformat()
        elif isinstance(value, Decimal):
            data[field] = float(value)
        else:
            data[field] = value
    if extra:
        data.update(extra)
    return data


async def generate_daily_code(
    model: Type[Model],
    tenant_id: int,
    prefix: str,
    code_field: str,
) -> str:
    today = today_site_str().replace("-", "")
    base = f"{prefix}{today}"
    count = await model.filter(tenant_id=tenant_id, **{f"{code_field}__startswith": base}).count()
    return f"{base}{count + 1:04d}"


def quantize_money(value: Decimal | float | int | str) -> Decimal:
    return Decimal(str(value or 0)).quantize(Decimal("0.0001"), rounding=ROUND_HALF_UP)


def compute_monthly_depreciation(
    original_value: Decimal,
    residual_rate: Decimal,
    useful_life_months: int,
) -> Decimal:
    if useful_life_months <= 0:
        return Decimal("0")
    residual = quantize_money(original_value * residual_rate)
    depreciable = quantize_money(original_value - residual)
    if depreciable <= 0:
        return Decimal("0")
    return quantize_money(depreciable / Decimal(useful_life_months))


def compute_net_value(
    original_value: Decimal,
    accumulated_depreciation: Decimal,
    impairment_value: Decimal,
) -> Decimal:
    return quantize_money(original_value - accumulated_depreciation - impairment_value)


async def touch_updated(row: Model, user: Optional[User | int] = None) -> None:
    row.updated_at = resolve_business_datetime()
    if user is None:
        return
    if isinstance(user, User):
        row.updated_by = user.id
        row.updated_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        return
    resolved = await User.get_or_none(id=int(user))
    if resolved:
        row.updated_by = resolved.id
        row.updated_by_name = getattr(resolved, "name", None) or getattr(resolved, "username", None)
