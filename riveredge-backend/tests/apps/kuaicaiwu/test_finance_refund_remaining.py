"""剩余应收/应付须计入退款冲回。"""

from decimal import Decimal

from apps.kuaicaiwu.services.finance_refund_utils import (
    compute_open_balance_after_refund,
    resolve_ar_status_after_amounts,
)


def test_remaining_after_collect_and_full_refund_of_partial_receipt():
    # 应收 1 万，收 5000 后退 5000 → 剩余应收应回到 1 万
    remaining = compute_open_balance_after_refund(
        Decimal("10000"),
        Decimal("5000"),
        Decimal("5000"),
    )
    assert remaining == Decimal("10000.00")
    status = resolve_ar_status_after_amounts(
        total_amount=Decimal("10000"),
        received_amount=Decimal("0"),  # 净已收
        remaining_amount=remaining,
    )
    assert status == "未收款"


def test_remaining_after_full_collect_then_partial_refund():
    # 收满 1 万后退 5000 → 剩余 5000
    remaining = compute_open_balance_after_refund(
        Decimal("10000"),
        Decimal("10000"),
        Decimal("5000"),
    )
    assert remaining == Decimal("5000.00")


def test_remaining_without_refund_equals_total_minus_collected():
    remaining = compute_open_balance_after_refund(
        Decimal("10000"),
        Decimal("3000"),
        Decimal("0"),
    )
    assert remaining == Decimal("7000.00")
