"""产品固件 INF-05 策略行映射（R-15 #28 / R-01 文控入口）。"""

from __future__ import annotations

from typing import Any, Dict, Optional, Set


def firmware_policy_status(business_status: str) -> str:
    """业务状态 → INF-05 status（rejected 永不出现；未发布不进正式有效）。"""
    st = (business_status or "").strip().lower()
    if st == "obsolete":
        return "obsolete"
    if st == "released":
        return "effective"
    # draft / pending / approved：使用方不可见，制定方可见自己的
    return "draft"


def firmware_policy_row(
    row: Any,
    *,
    latest_released_ids: Optional[Set[int]] = None,
) -> Dict[str, Any]:
    latest = latest_released_ids or set()
    st = str(getattr(row, "status", "") or "")
    is_released = st == "released"
    is_latest = bool(is_released and getattr(row, "id", None) in latest)
    return {
        "id": getattr(row, "id", None),
        "project_id": getattr(row, "project_id", None),
        "version": getattr(row, "version", None),
        "status": firmware_policy_status(st),
        # 仅「当前最新已发布」视为生效，避免遗留多 released 被使用方看见
        "is_effective": is_latest,
        "is_latest_effective": is_latest,
        "is_production_effective": is_latest,
        "created_by": getattr(row, "created_by", None),
    }
