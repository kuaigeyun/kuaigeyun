"""工艺路线 / 产品工艺工序行：过程检验（IPQC）解析与工单落章。

支持有序多方案：inspection_plan_ids = [外观, 尺寸, ...]；
首项同步写入 inspection_plan_id 以兼容单方案解析。
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional, Tuple

from apps.kuaizhizao.services.inspection_policy_service import (
    normalize_inspection_mode,
    normalize_operation_inspection_stages,
    normalize_stage_policy,
)


def _first_present(data: Dict[str, Any], *keys: str) -> Any:
    for key in keys:
        if key in data and data.get(key) is not None:
            return data.get(key)
    return None


def normalize_inspection_plan_ids(raw: Any) -> List[int]:
    """将任意来源规范为有序、去重（保序）的方案 ID 列表。"""
    if raw is None or raw == "":
        return []
    items: List[Any]
    if isinstance(raw, (list, tuple)):
        items = list(raw)
    else:
        items = [raw]
    out: List[int] = []
    seen: set[int] = set()
    for item in items:
        try:
            pid = int(item)
        except (TypeError, ValueError):
            continue
        if pid <= 0 or pid in seen:
            continue
        seen.add(pid)
        out.append(pid)
    return out


def route_step_has_ipqc_keys(extra: Optional[dict]) -> bool:
    """路线步骤是否显式写入了过程检验字段（含 inspection_stages.ipqc）。"""
    data = extra if isinstance(extra, dict) else {}
    if any(
        k in data
        for k in (
            "inspection_mode",
            "inspectionMode",
            "inspection_plan_id",
            "inspectionPlanId",
            "inspection_plan_ids",
            "inspectionPlanIds",
        )
    ):
        return True
    stages = data.get("inspection_stages") or data.get("inspectionStages")
    if isinstance(stages, dict) and ("ipqc" in stages):
        return True
    return False


def parse_route_step_ipqc(
    extra: Optional[dict],
    *,
    operation: Any = None,
) -> Dict[str, Any]:
    """
    从路线步骤 JSON 解析 IPQC；步骤未写时回落工序主数据。

    Returns:
        {
          inspection_mode,
          inspection_plan_id,       # 首方案（兼容）
          inspection_plan_ids,      # 有序多方案
          inspection_plan_name?,
          inspection_plan_names?,
          source,
        }
    """
    data = extra if isinstance(extra, dict) else {}

    if route_step_has_ipqc_keys(data):
        stages = data.get("inspection_stages") or data.get("inspectionStages")
        plan_ids: List[int] = []
        mode = "none"
        if isinstance(stages, dict) and stages.get("ipqc") is not None:
            pol = normalize_stage_policy(stages.get("ipqc"))
            mode = pol["mode"]
            if pol.get("plan_id"):
                plan_ids = [int(pol["plan_id"])]
            extra_ids = normalize_inspection_plan_ids(
                _first_present(stages.get("ipqc") if isinstance(stages.get("ipqc"), dict) else {}, "plan_ids", "planIds")
                if isinstance(stages.get("ipqc"), dict)
                else None
            )
            if extra_ids:
                plan_ids = extra_ids
        else:
            mode = normalize_inspection_mode(
                _first_present(data, "inspection_mode", "inspectionMode")
            )
            plan_ids = normalize_inspection_plan_ids(
                _first_present(data, "inspection_plan_ids", "inspectionPlanIds")
            )
            if not plan_ids:
                plan_raw = _first_present(data, "inspection_plan_id", "inspectionPlanId")
                plan_ids = normalize_inspection_plan_ids(plan_raw)
        if mode != "plan":
            plan_ids = []
        elif mode == "plan" and not plan_ids:
            # 方案质检但未选方案：保持 plan 模式，建单时再报错
            pass
        names_raw = _first_present(data, "inspection_plan_names", "inspectionPlanNames")
        names: List[str] = []
        if isinstance(names_raw, (list, tuple)):
            names = [str(n).strip() for n in names_raw if str(n).strip()]
        single_name = _first_present(data, "inspection_plan_name", "inspectionPlanName")
        name_str = str(single_name).strip() if single_name else (names[0] if names else None)
        return {
            "inspection_mode": mode,
            "inspection_plan_id": plan_ids[0] if plan_ids else None,
            "inspection_plan_ids": plan_ids,
            "inspection_plan_name": name_str if mode == "plan" else None,
            "inspection_plan_names": names if mode == "plan" else [],
            "source": "route_step",
        }

    if operation is not None:
        stages = normalize_operation_inspection_stages(
            getattr(operation, "inspection_stages", None),
            legacy_mode=getattr(operation, "inspection_mode", None),
            legacy_plan_id=getattr(operation, "default_inspection_plan_id", None),
        )
        pol = normalize_stage_policy(stages.get("ipqc"))
        plan_ids = normalize_inspection_plan_ids(pol.get("plan_id") if pol["mode"] == "plan" else None)
        return {
            "inspection_mode": pol["mode"],
            "inspection_plan_id": plan_ids[0] if plan_ids else None,
            "inspection_plan_ids": plan_ids,
            "inspection_plan_name": None,
            "inspection_plan_names": [],
            "source": "operation",
        }

    return {
        "inspection_mode": "none",
        "inspection_plan_id": None,
        "inspection_plan_ids": [],
        "inspection_plan_name": None,
        "inspection_plan_names": [],
        "source": "default_none",
    }


def ipqc_plan_ids_from_wo_operation(wo_op: Any) -> List[int]:
    """工单工序落章的有序方案 ID；无多方案字段时回落单值。"""
    ids = normalize_inspection_plan_ids(getattr(wo_op, "inspection_plan_ids", None))
    if ids:
        return ids
    return normalize_inspection_plan_ids(getattr(wo_op, "inspection_plan_id", None))


def ipqc_policy_from_wo_operation(
    wo_op: Any,
) -> Optional[Tuple[str, Optional[int], str]]:
    """
    工单工序落章的过程检验策略；无落章字段时返回 None（调用方回落工序主数据）。

    plan_id 取有序列表首项（兼容单方案调用方）。
    """
    raw_mode = getattr(wo_op, "inspection_mode", None)
    if raw_mode is None:
        return None
    if isinstance(raw_mode, str) and not raw_mode.strip():
        return None
    mode = normalize_inspection_mode(raw_mode)
    plan_ids = ipqc_plan_ids_from_wo_operation(wo_op) if mode == "plan" else []
    plan_id = plan_ids[0] if plan_ids else None
    return mode, plan_id if mode == "plan" else None, "work_order_operation"
