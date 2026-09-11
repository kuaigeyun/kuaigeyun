"""销售退货行金额：数量×单价在显式总额为 0 时优先。"""

from __future__ import annotations

from decimal import Decimal


def _sales_return_line_amount(qty, unit_price, total_amount=None) -> Decimal:
    """与 SalesReturnService._sales_return_line_amount 同算法（避免重依赖导入 warehouse_service）。"""
    q = Decimal(str(qty or 0))
    p = Decimal(str(unit_price or 0))
    computed = (q * p).quantize(Decimal("0.01"))
    if total_amount is None:
        return computed
    given = Decimal(str(total_amount or 0)).quantize(Decimal("0.01"))
    if given == 0 and computed != 0:
        return computed
    return given


def test_sales_return_line_amount_prefers_qty_times_price_when_given_zero():
    assert _sales_return_line_amount(10, "20.5", 0) == Decimal("205.00")


def test_sales_return_line_amount_keeps_explicit_when_nonzero():
    assert _sales_return_line_amount(10, "20", "150") == Decimal("150.00")


def test_sales_return_line_amount_none_total_uses_computed():
    assert _sales_return_line_amount(2, "15.5") == Decimal("31.00")
