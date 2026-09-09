"""发票价税拆分测试。"""

from decimal import Decimal

from apps.kuaicaiwu.services.finance_tax import (
    compute_tax_from_excluding,
    compute_tax_from_including,
    resolve_invoice_amounts_for_create,
)


def test_compute_tax_from_including_60000_at_13_percent():
    excl, tax, total = compute_tax_from_including(Decimal("60000"), Decimal("13"))
    assert total == Decimal("60000.00")
    assert excl == Decimal("53097.35")
    assert tax == Decimal("6902.65")


def test_excluding_path_drifts_one_cent_on_roundtrip():
    _, _, total = compute_tax_from_excluding(Decimal("53097.35"), Decimal("13"))
    assert total == Decimal("60000.01")


def test_resolve_invoice_amounts_uses_total_when_inclusive_entry():
    excl, tax, total = resolve_invoice_amounts_for_create(
        Decimal("53097.35"),
        Decimal("13"),
        Decimal("60000"),
    )
    assert total == Decimal("60000.00")
    assert excl == Decimal("53097.35")
    assert tax == Decimal("6902.65")


def test_resolve_invoice_amounts_excludes_total_when_exclusive_entry():
    excl, tax, total = resolve_invoice_amounts_for_create(
        Decimal("53097.35"),
        Decimal("13"),
        None,
    )
    assert excl == Decimal("53097.35")
    assert total == Decimal("60000.01")


def test_money_exceeds_max_treats_equal_quantized_as_not_exceed():
    from apps.kuaicaiwu.services.finance_tax import money_exceeds_max

    assert money_exceeds_max(Decimal("65044.25"), Decimal("65044.25")) is False
    assert money_exceeds_max(Decimal("100000.00"), Decimal("100000.00")) is False
    assert money_exceeds_max(Decimal("100000.01"), Decimal("100000.00")) is True


def test_excluding_roundtrip_one_cent_matches_known_case():
    """88495.58 × 1.13 分位正算为 100000.01，与可开票 100000.00 差 0.01。"""
    _, _, total = compute_tax_from_excluding(Decimal("88495.58"), Decimal("13"))
    assert total == Decimal("100000.01")
    excl, _, total_from_incl = compute_tax_from_including(Decimal("100000.00"), Decimal("13"))
    assert total_from_incl == Decimal("100000.00")
    assert excl == Decimal("88495.58")
