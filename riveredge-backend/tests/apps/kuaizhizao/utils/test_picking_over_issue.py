"""生产领料防超发 Decimal 比较单元测试。"""

from decimal import Decimal

from apps.kuaizhizao.utils.picking_posting import (
    PRODUCTION_PICKING_COST_ELIGIBLE_STATUSES,
    exceeds_work_order_pick_limit,
    filter_gi_picking_ids,
    format_pick_limit_qty,
    is_staging_transfer_picking_notes,
    picking_item_belongs_to_work_order,
    resolve_work_order_pick_limit,
)
from types import SimpleNamespace


def test_exceeds_pick_limit_equal_decimal_qty_not_blocked():
    assert exceeds_work_order_pick_limit(Decimal("0.29"), Decimal("0.29")) is False
    assert exceeds_work_order_pick_limit(Decimal("1.71"), Decimal("1.71")) is False


def test_exceeds_pick_limit_float_bom_drift_not_blocked_when_display_equal():
    # BOM float 乘 1.01 曾导致 0.29 误拦；量化后应放行
    allowed = Decimal(str(0.287128712871287))
    total = Decimal("0.29")
    assert exceeds_work_order_pick_limit(total, allowed) is False


def test_exceeds_pick_limit_blocks_material_over_cap():
    assert exceeds_work_order_pick_limit(Decimal("1.00"), Decimal("0.50")) is True


def test_format_pick_limit_qty_strips_trailing_zeros():
    assert format_pick_limit_qty(Decimal("0.2900")) == "0.29"
    assert format_pick_limit_qty(Decimal("1.7100")) == "1.71"


def test_resolve_work_order_pick_limit_with_ratio():
    assert resolve_work_order_pick_limit(Decimal("10"), Decimal("0")) == Decimal("10")
    assert resolve_work_order_pick_limit(Decimal("10"), Decimal("0.2")) == Decimal("12")


def test_exceeds_pick_limit_with_over_issue_ratio_allows_extra():
    allowed = resolve_work_order_pick_limit(Decimal("10"), Decimal("0.2"))
    assert exceeds_work_order_pick_limit(Decimal("12"), allowed) is False
    assert exceeds_work_order_pick_limit(Decimal("13"), allowed) is True


def test_production_picking_cost_eligible_statuses_include_picked():
    assert "已领料" in PRODUCTION_PICKING_COST_ELIGIBLE_STATUSES
    assert "已完成" in PRODUCTION_PICKING_COST_ELIGIBLE_STATUSES


def test_filter_gi_picking_ids_excludes_staging_transfer_notes():
    gi = SimpleNamespace(id=1, notes="批量合并领料：2 张工单")
    staging = SimpleNamespace(id=2, notes="叫料单 MC001 完成：主仓→线边")
    assert filter_gi_picking_ids([gi, staging]) == [1]


def test_picking_item_belongs_to_work_order_item_level():
    picking = SimpleNamespace(work_order_id=100)
    item = SimpleNamespace(work_order_id=200)
    assert picking_item_belongs_to_work_order(item, picking, 200) is True
    assert picking_item_belongs_to_work_order(item, picking, 100) is False


def test_picking_item_belongs_to_work_order_falls_back_to_header():
    picking = SimpleNamespace(work_order_id=100)
    item = SimpleNamespace(work_order_id=None)
    assert picking_item_belongs_to_work_order(item, picking, 100) is True
    assert picking_item_belongs_to_work_order(item, picking, 200) is False


def test_is_staging_transfer_picking_notes():
    assert is_staging_transfer_picking_notes("叫料单 MC001") is True
    assert is_staging_transfer_picking_notes("批量合并领料") is False
