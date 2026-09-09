"""操作记录字段变更比对：金额/数量按数值相等，避免 110.0000 vs 110 误报。"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal, InvalidOperation
from typing import Any, Optional


def _empty(value: Any) -> bool:
    if value is None:
        return True
    if isinstance(value, str) and value.strip() == "":
        return True
    return False


def _try_decimal(value: Any) -> Optional[Decimal]:
    if isinstance(value, bool):
        return None
    if isinstance(value, Decimal):
        return value
    if isinstance(value, int):
        return Decimal(value)
    if isinstance(value, float):
        return Decimal(str(value))
    if isinstance(value, str):
        text = value.strip().replace(",", "")
        if not text:
            return None
        try:
            return Decimal(text)
        except (InvalidOperation, ValueError):
            return None
    return None


def format_audit_field_value(value: Any) -> str:
    """操作记录展示用：数值去掉无意义尾零，日期统一 ISO。"""
    if _empty(value):
        return ""
    if isinstance(value, datetime):
        return value.isoformat(sep=" ", timespec="seconds")
    if isinstance(value, date):
        return value.isoformat()
    dec = _try_decimal(value)
    if dec is not None:
        text = format(dec.normalize(), "f")
        if "." in text:
            text = text.rstrip("0").rstrip(".")
        return text or "0"
    return str(value).strip()


def audit_field_values_equal(old: Any, new: Any) -> bool:
    """判断两值在业务上是否相同（数值精度差不算变更）。"""
    if _empty(old) and _empty(new):
        return True
    if _empty(old) or _empty(new):
        return False

    old_dec = _try_decimal(old)
    new_dec = _try_decimal(new)
    if old_dec is not None and new_dec is not None:
        return old_dec == new_dec

    if isinstance(old, (date, datetime)) or isinstance(new, (date, datetime)):
        return format_audit_field_value(old) == format_audit_field_value(new)

    return str(old).strip() == str(new).strip()
