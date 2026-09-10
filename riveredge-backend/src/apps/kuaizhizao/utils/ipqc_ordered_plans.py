"""有序多过程检验方案：下一方案判定与放行数量。"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional, Sequence

from apps.kuaizhizao.services.inspection_policy_service import ipqc_inspection_passed_for_transfer
from apps.kuaizhizao.services.operation_transfer_service import is_rework_verification_process_inspection
from apps.kuaizhizao.utils.route_step_ipqc import ipqc_plan_ids_from_wo_operation, normalize_inspection_plan_ids


def _insp_plan_id(insp: Any) -> Optional[int]:
    raw = getattr(insp, "inspection_plan_id", None)
    if raw is None or raw == "":
        return None
    try:
        pid = int(raw)
    except (TypeError, ValueError):
        return None
    return pid if pid > 0 else None


def group_inspections_by_plan_id(
    inspections: Sequence[Any],
    *,
    fallback_plan_id: Optional[int] = None,
) -> Dict[Optional[int], List[Any]]:
    """按方案分组；无 plan_id 的历史单归入 fallback（通常为首方案）。"""
    grouped: Dict[Optional[int], List[Any]] = {}
    for insp in inspections:
        if is_rework_verification_process_inspection(insp):
            continue
        pid = _insp_plan_id(insp)
        if pid is None:
            pid = fallback_plan_id
        grouped.setdefault(pid, []).append(insp)
    return grouped


async def sum_passed_qty_for_plan(
    tenant_id: int,
    inspections: Sequence[Any],
    *,
    audit_required: Optional[bool] = None,
) -> Decimal:
    total = Decimal("0")
    for insp in inspections:
        if await ipqc_inspection_passed_for_transfer(
            tenant_id, insp, audit_required=audit_required
        ):
            total += Decimal(str(getattr(insp, "qualified_quantity", None) or 0))
    return total


async def resolve_ordered_plan_transfer_qualified(
    tenant_id: int,
    inspections: Sequence[Any],
    required_plan_ids: Sequence[int],
    *,
    audit_required: Optional[bool] = None,
) -> Decimal:
    """
    有序多方案放行数量：各方案已放行合格量取最小值。

    单方案或未配置列表时，退化为对全部检验单求和（与历史口径一致）。
    """
    plan_ids = normalize_inspection_plan_ids(required_plan_ids)
    if len(plan_ids) <= 1:
        total = Decimal("0")
        for insp in inspections:
            if is_rework_verification_process_inspection(insp):
                continue
            if await ipqc_inspection_passed_for_transfer(
                tenant_id, insp, audit_required=audit_required
            ):
                total += Decimal(str(getattr(insp, "qualified_quantity", None) or 0))
        return total

    grouped = group_inspections_by_plan_id(
        inspections, fallback_plan_id=plan_ids[0]
    )
    mins: List[Decimal] = []
    for pid in plan_ids:
        qty = await sum_passed_qty_for_plan(
            tenant_id, grouped.get(pid, []), audit_required=audit_required
        )
        mins.append(qty)
    return min(mins) if mins else Decimal("0")


def has_pending_for_plan(inspections: Sequence[Any], plan_id: Optional[int]) -> bool:
    for insp in inspections:
        if is_rework_verification_process_inspection(insp):
            continue
        if str(getattr(insp, "status", "") or "").strip() != "待检验":
            continue
        pid = _insp_plan_id(insp)
        if plan_id is None:
            return True
        if pid is None or pid == int(plan_id):
            return True
    return False


async def resolve_next_ipqc_plan_id(
    tenant_id: int,
    wo_op: Any,
    inspections: Sequence[Any],
    *,
    audit_required: Optional[bool] = None,
) -> Optional[int]:
    """
    返回下一步应建的过程检验方案 ID。

    规则：按有序 plan_ids，跳过已有待检的步骤；首个「尚无放行合格量」的方案即下一步。
    若任一步有待检，则不新建（返回 None）。
    """
    plan_ids = ipqc_plan_ids_from_wo_operation(wo_op)
    if not plan_ids:
        return None

    for insp in inspections:
        if is_rework_verification_process_inspection(insp):
            continue
        if str(getattr(insp, "status", "") or "").strip() == "待检验":
            return None

    grouped = group_inspections_by_plan_id(inspections, fallback_plan_id=plan_ids[0])
    for pid in plan_ids:
        passed = await sum_passed_qty_for_plan(
            tenant_id, grouped.get(pid, []), audit_required=audit_required
        )
        if passed <= 0:
            return int(pid)
    return None
