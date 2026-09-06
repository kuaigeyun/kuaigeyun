"""研发交付物版本号与 INF-05 状态映射（无服务依赖，可单测）。"""

from __future__ import annotations

import re
from typing import Any, Dict

from apps.kuaiplm.constants.rd_project import RdDeliverableStatus


def bump_deliverable_version(current: str) -> str:
    raw = (current or "A0").strip() or "A0"
    m = re.match(r"^([A-Za-z]+)(\d+)$", raw)
    if m:
        return f"{m.group(1)}{int(m.group(2)) + 1}"
    return f"{raw}.1"


def head_status_to_version_status(status: str) -> str:
    mapping = {
        RdDeliverableStatus.PENDING.value: "draft",
        RdDeliverableStatus.SUBMITTED.value: "pending",
        RdDeliverableStatus.APPROVED.value: "effective",
        RdDeliverableStatus.REJECTED.value: "rejected",
    }
    return mapping.get((status or "").strip().upper(), "draft")


def deliverable_version_policy_row(ver: Any) -> Dict[str, Any]:
    return {
        "id": getattr(ver, "id", None),
        "deliverable_id": getattr(ver, "deliverable_id", None),
        "version": getattr(ver, "version", None),
        "status": getattr(ver, "status", None),
        "is_effective": bool(getattr(ver, "is_effective", False)),
        "is_latest_effective": bool(getattr(ver, "is_effective", False)),
        "created_by": getattr(ver, "created_by", None),
        "name": getattr(ver, "name", None),
    }
