from datetime import date

from apps.kuaicaiwu.services.tax.vat_ledger_service import _period_date_bounds


def test_period_date_bounds_uses_real_month_end():
    assert _period_date_bounds(2026, 9) == (date(2026, 9, 1), date(2026, 9, 30))
    assert _period_date_bounds(2026, 2) == (date(2026, 2, 1), date(2026, 2, 28))
    assert _period_date_bounds(2024, 2) == (date(2024, 2, 1), date(2024, 2, 29))
    assert _period_date_bounds(2026, 1) == (date(2026, 1, 1), date(2026, 1, 31))
