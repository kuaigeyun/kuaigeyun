"""实验委托实测判定引擎（服务端唯一；禁止前端/读侧重算历史结果）。"""

from __future__ import annotations

from decimal import Decimal, InvalidOperation
from typing import Any, Optional

JUDGMENT_ENGINE = "lab_range_v1"
COMPARE_TYPES = frozenset({"range", "eq", "gte", "lte", "na"})
JUDGMENTS = frozenset({"pass", "fail", "ng", "na"})


def _parse_decimal(raw: Optional[str]) -> Optional[Decimal]:
    if raw is None:
        return None
    text = str(raw).strip().replace(",", "")
    if not text:
        return None
    try:
        return Decimal(text)
    except (InvalidOperation, ValueError):
        return None


def build_rule_version(
    *,
    compare_type: str,
    standard_min: Optional[str],
    standard_max: Optional[str],
    standard_value: Optional[str],
    unit: Optional[str],
) -> str:
    """由标准字段生成可追溯版本串（无独立规则主数据时的真源版本）。"""
    parts = [
        JUDGMENT_ENGINE,
        f"cmp={compare_type or 'range'}",
        f"min={standard_min or ''}",
        f"max={standard_max or ''}",
        f"val={standard_value or ''}",
        f"unit={unit or ''}",
    ]
    return "|".join(parts)


def evaluate_measure_judgment(
    *,
    compare_type: str,
    measured_value: Optional[str],
    standard_min: Optional[str],
    standard_max: Optional[str],
    standard_value: Optional[str],
    unit: Optional[str] = None,
) -> tuple[str, str, dict[str, Any]]:
    """
    计算自动判定并返回 (auto_judgment, rule_version, snapshot)。
    实测为空 → na；无法解析数值且非 na 类型 → fail。
    """
    cmp = (compare_type or "range").strip().lower()
    if cmp not in COMPARE_TYPES:
        cmp = "range"
    rule_version = build_rule_version(
        compare_type=cmp,
        standard_min=standard_min,
        standard_max=standard_max,
        standard_value=standard_value,
        unit=unit,
    )
    measured_raw = None if measured_value is None else str(measured_value)
    measured_stripped = (measured_raw or "").strip()

    if cmp == "na" or not measured_stripped:
        judgment = "na"
    else:
        measured_num = _parse_decimal(measured_stripped)
        if measured_num is None:
            judgment = "fail"
        elif cmp == "eq":
            std = _parse_decimal(standard_value)
            judgment = "pass" if std is not None and measured_num == std else "fail"
        elif cmp == "gte":
            std = _parse_decimal(standard_min if standard_min not in (None, "") else standard_value)
            judgment = "pass" if std is not None and measured_num >= std else "fail"
        elif cmp == "lte":
            std = _parse_decimal(standard_max if standard_max not in (None, "") else standard_value)
            judgment = "pass" if std is not None and measured_num <= std else "fail"
        else:
            lo = _parse_decimal(standard_min)
            hi = _parse_decimal(standard_max)
            ok = True
            if lo is not None and measured_num < lo:
                ok = False
            if hi is not None and measured_num > hi:
                ok = False
            if lo is None and hi is None:
                eq = _parse_decimal(standard_value)
                ok = eq is not None and measured_num == eq
            judgment = "pass" if ok else "fail"

    # 业务上不合格统一可标 ng；数值越界用 fail，显式人工可改 ng
    if judgment == "fail":
        # 保留 fail；看板可按 fail/ng 一并置顶
        pass

    snapshot: dict[str, Any] = {
        "engine": JUDGMENT_ENGINE,
        "rule_version": rule_version,
        "compare_type": cmp,
        "standard_min": standard_min,
        "standard_max": standard_max,
        "standard_value": standard_value,
        "unit": unit,
        "measured_value": measured_raw,
        "auto_judgment": judgment,
    }
    return judgment, rule_version, snapshot


def aggregate_header_judgment(line_judgments: list[Optional[str]]) -> Optional[str]:
    """行最终判定汇总到单头：ng > fail > pass > na。"""
    normalized = [(j or "").strip().lower() for j in line_judgments if (j or "").strip()]
    if not normalized:
        return None
    if any(j == "ng" for j in normalized):
        return "ng"
    if any(j == "fail" for j in normalized):
        return "fail"
    if any(j == "pass" for j in normalized):
        return "pass"
    return "na"


def resolve_final_judgment(
    auto_judgment: Optional[str], manual_judgment: Optional[str]
) -> Optional[str]:
    if manual_judgment is not None and str(manual_judgment).strip():
        return str(manual_judgment).strip().lower()
    if auto_judgment is not None and str(auto_judgment).strip():
        return str(auto_judgment).strip().lower()
    return None
