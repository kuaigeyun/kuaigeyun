"""凭证号整理辅助逻辑。"""

from datetime import date
from types import SimpleNamespace

from apps.kuaicaiwu.services.voucher_code_utils import (
    build_voucher_code,
    order_vouchers_for_reorganize,
    parse_voucher_sequence,
    voucher_code_prefix,
)


def _v(code: str, voucher_date: date, vid: int) -> SimpleNamespace:
    return SimpleNamespace(voucher_code=code, voucher_date=voucher_date, id=vid)


def test_voucher_code_prefix_and_sequence():
    prefix = voucher_code_prefix("记", 2026, 9)
    assert prefix == "记202609"
    assert parse_voucher_sequence("记2026090048", prefix) == 48
    assert build_voucher_code(prefix, 3) == "记2026090003"


def test_order_shift_gaps_closes_gap():
    prefix = voucher_code_prefix("记", 2026, 9)
    d = date(2026, 9, 1)
    vouchers = [
        _v("记2026090001", d, 1),
        _v("记2026090003", d, 3),
        _v("记2026090004", d, 4),
    ]
    ordered = order_vouchers_for_reorganize(vouchers, prefix=prefix, method="shift_gaps")
    codes = [build_voucher_code(prefix, i) for i, _ in enumerate(ordered, start=1)]
    assert codes == ["记2026090001", "记2026090002", "记2026090003"]


def test_order_by_date_renumbers_chronologically():
    prefix = voucher_code_prefix("记", 2026, 9)
    vouchers = [
        _v("记2026090003", date(2026, 9, 3), 3),
        _v("记2026090001", date(2026, 9, 1), 1),
        _v("记2026090002", date(2026, 9, 2), 2),
    ]
    ordered = order_vouchers_for_reorganize(vouchers, prefix=prefix, method="by_date")
    assert [v.id for v in ordered] == [1, 2, 3]
    codes = [build_voucher_code(prefix, i) for i, _ in enumerate(ordered, start=1)]
    assert codes == ["记2026090001", "记2026090002", "记2026090003"]
