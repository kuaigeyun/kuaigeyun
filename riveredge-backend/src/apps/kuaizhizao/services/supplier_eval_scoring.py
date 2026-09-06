"""供应商评价评分与等级（R-03）。

与主数据交期/IQC 运营评级分离：仅作用于评价单据明细。
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, List, Optional, Sequence


DEFAULT_GRADE_BANDS: List[dict] = [
    {"min": 90, "grade": "A"},
    {"min": 80, "grade": "B"},
    {"min": 70, "grade": "C"},
    {"min": 0, "grade": "D"},
]


def normalize_grade_bands(raw: Any) -> List[dict]:
    if not isinstance(raw, list) or not raw:
        return list(DEFAULT_GRADE_BANDS)
    bands: List[dict] = []
    for item in raw:
        if not isinstance(item, dict):
            continue
        try:
            mn = float(item.get("min"))
        except (TypeError, ValueError):
            continue
        grade = str(item.get("grade") or "").strip().upper()
        if not grade:
            continue
        bands.append({"min": mn, "grade": grade})
    if not bands:
        return list(DEFAULT_GRADE_BANDS)
    bands.sort(key=lambda x: x["min"], reverse=True)
    return bands


def compute_weighted_score(
    lines: Sequence[Any],
) -> Optional[Decimal]:
    """加权百分制：sum(score/max_score * weight) / sum(weight) * 100。"""
    weight_sum = Decimal("0")
    weighted = Decimal("0")
    any_scored = False
    for line in lines:
        max_score = Decimal(str(getattr(line, "max_score", None) or 0))
        weight = Decimal(str(getattr(line, "weight", None) or 0))
        score = getattr(line, "score", None)
        if max_score <= 0 or weight <= 0:
            continue
        if score is None:
            continue
        any_scored = True
        sc = Decimal(str(score))
        if sc < 0:
            sc = Decimal("0")
        if sc > max_score:
            sc = max_score
        weighted += (sc / max_score) * weight
        weight_sum += weight
    if not any_scored or weight_sum <= 0:
        return None
    return (weighted / weight_sum * Decimal("100")).quantize(Decimal("0.01"))


def resolve_grade(score: Optional[Decimal], bands: Any) -> Optional[str]:
    if score is None:
        return None
    sc = float(score)
    for band in normalize_grade_bands(bands):
        if sc >= float(band["min"]):
            return str(band["grade"])
    return None
