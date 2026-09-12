"""生产领料过账口径：正式发料 (GI) vs 线边备料转移（主仓→线边）。

线边备料单 / 补料申请 = 仅备料转移，不算工单耗用。
生产领料单确认 = 正式发料（扣减所选仓库库存），须回写明细已领数量。
历史补料曾误生成「已领料」领料单并做转移；靠备注识别并排除出 GI/齐套「已领」累计。
"""

from __future__ import annotations

from decimal import Decimal
from typing import Iterable, List, Optional, Sequence

from apps.kuaizhizao.utils.mrp_quantity import MRP_QTY_STEP, mrp_qty

# 防超发容差：允许在 BOM 上限基础上略超 1%（与历史口径一致，但用 Decimal 计算）
OVERPICK_TOLERANCE_RATIO = Decimal("1.01")

# 正式发料完成态（生产领料确认、退料选取、成本核算、报表等唯一口径）
PRODUCTION_PICKING_COST_ELIGIBLE_STATUSES = frozenset(
    {"已领料", "已确认", "picked", "confirmed", "已完成"}
)

# 历史叫料完成自动生成领料单的备注特征（主仓→线边转移，非正式发料）
_STAGING_PICKING_NOTE_MARKERS = (
    "主仓→线边",
    "叫料单",
)


def is_staging_transfer_picking_notes(notes: Optional[str]) -> bool:
    text = (notes or "").strip()
    if not text:
        return False
    return any(marker in text for marker in _STAGING_PICKING_NOTE_MARKERS)


def filter_gi_picking_ids(
    pickings: Sequence[object],
) -> List[int]:
    """从领料单列表中筛出正式发料单 ID（排除备料转移型历史单据）。"""
    result: List[int] = []
    for p in pickings:
        pid = getattr(p, "id", None)
        if pid is None:
            continue
        if is_staging_transfer_picking_notes(getattr(p, "notes", None)):
            continue
        result.append(int(pid))
    return result


def exclude_staging_picking_ids(
    picking_ids: Iterable[int],
    staging_ids: Iterable[int],
) -> List[int]:
    staging = {int(x) for x in staging_ids}
    return [int(x) for x in picking_ids if int(x) not in staging]


def resolve_work_order_pick_limit(
    allowed_bom: Decimal,
    over_issue_allowance_ratio: Decimal,
) -> Decimal:
    """
    工单领料上限 = BOM 配方毛需求 × (1 + 组织允许超发比例)。
    over_issue_allowance_ratio 取值 0～1，默认 0 与历史口径一致。
    """
    ratio = mrp_qty(over_issue_allowance_ratio)
    if ratio < 0:
        ratio = Decimal("0")
    if ratio > 1:
        ratio = Decimal("1")
    base = mrp_qty(allowed_bom)
    return mrp_qty(base * (Decimal("1") + ratio))


def exceeds_work_order_pick_limit(total_attempt: Decimal, allowed: Decimal) -> bool:
    """
    工单领料是否超出 BOM 配方上限（含 1% 容差）。

    全程 Decimal + mrp_qty，避免 float(0.29) * 1.01 与 0.29 比较误拦。
    """
    total = mrp_qty(total_attempt)
    limit = mrp_qty(allowed)
    if limit <= 0:
        return total > 0
    cap = mrp_qty(limit * OVERPICK_TOLERANCE_RATIO)
    if total <= cap:
        return False
    # 超出容差但在 1 个数量步长内：视为显示精度内相等，不拦截
    if total - cap <= MRP_QTY_STEP:
        return False
    return True


def format_pick_limit_qty(value: Decimal) -> str:
    """防超发提示数量：去尾零，最多四位小数。"""
    q = mrp_qty(value)
    text = format(q, "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text or "0"


def picking_item_belongs_to_work_order(
    item: object,
    picking: object,
    work_order_id: int,
) -> bool:
    item_wo = getattr(item, "work_order_id", None)
    if item_wo is not None and int(item_wo or 0) > 0:
        return int(item_wo) == int(work_order_id)
    return int(getattr(picking, "work_order_id", 0) or 0) == int(work_order_id)


async def list_work_order_cost_pickings(tenant_id: int, work_order_id: int) -> List[object]:
    """工单已正式发料的领料单（头表或明细挂工单，排除备料转移型）。"""
    from apps.kuaizhizao.models.production_picking import ProductionPicking
    from apps.kuaizhizao.models.production_picking_item import ProductionPickingItem

    statuses = list(PRODUCTION_PICKING_COST_ELIGIBLE_STATUSES)
    by_id: dict[int, object] = {}

    header_rows = await ProductionPicking.filter(
        tenant_id=tenant_id,
        work_order_id=work_order_id,
        status__in=statuses,
        deleted_at__isnull=True,
    ).all()
    for row in header_rows:
        by_id[int(row.id)] = row

    item_picking_ids = await ProductionPickingItem.filter(
        tenant_id=tenant_id,
        work_order_id=work_order_id,
        deleted_at__isnull=True,
    ).values_list("picking_id", flat=True)
    extra_ids = sorted({int(pid) for pid in item_picking_ids if pid})
    if extra_ids:
        extra_rows = await ProductionPicking.filter(
            tenant_id=tenant_id,
            id__in=extra_ids,
            status__in=statuses,
            deleted_at__isnull=True,
        ).all()
        for row in extra_rows:
            by_id[int(row.id)] = row

    if not by_id:
        return []
    gi_ids = set(filter_gi_picking_ids(list(by_id.values())))
    return [p for p in by_id.values() if int(getattr(p, "id")) in gi_ids]
