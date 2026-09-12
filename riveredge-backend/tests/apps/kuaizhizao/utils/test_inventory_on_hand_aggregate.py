"""在库汇总口径：线边可用 = 现存量 - 预留。"""

from decimal import Decimal

from apps.kuaizhizao.utils.inventory_helper import _decimal_or_zero


def test_line_side_net_quantity_subtracts_reserved():
    gross = _decimal_or_zero(100)
    reserved = _decimal_or_zero(35)
    net = gross - reserved
    assert net == Decimal("65")


def test_line_side_net_quantity_non_negative_clamp():
    gross = _decimal_or_zero(10)
    reserved = _decimal_or_zero(25)
    net = gross - reserved
    assert net == Decimal("-15")
    assert max(net, Decimal("0")) == Decimal("0")
