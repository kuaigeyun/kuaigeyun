"""法定三大报表轧差与科目汇总。"""

from decimal import Decimal

from apps.kuaicaiwu.services.gl.income_statement_template import build_income_statement_rows
from apps.kuaicaiwu.services.gl.statement_service import (
    aggregate_balances_by_account,
    signed_amount,
)


def test_signed_amount_debit_and_credit():
    assert signed_amount(120, 20, "debit") == Decimal("100")
    assert signed_amount(20, 120, "credit") == Decimal("100")
    assert signed_amount(50, 50, "debit") == Decimal("0")


def test_aggregate_balances_by_account_merges_aux_rows():
    rows = [
        {
            "account_id": 1,
            "account_code": "1001",
            "account_name": "库存现金",
            "account_type": "asset",
            "ending_debit": 80,
            "ending_credit": 0,
            "opening_debit": 0,
            "opening_credit": 0,
            "period_debit": 80,
            "period_credit": 0,
            "year_debit": 80,
            "year_credit": 0,
        },
        {
            "account_id": 1,
            "account_code": "1001",
            "account_name": "库存现金",
            "account_type": "asset",
            "ending_debit": 20,
            "ending_credit": 0,
            "opening_debit": 0,
            "opening_credit": 0,
            "period_debit": 20,
            "period_credit": 0,
            "year_debit": 20,
            "year_credit": 0,
        },
    ]
    merged = aggregate_balances_by_account(rows)
    assert len(merged) == 1
    assert merged[0]["ending_debit"] == 100.0


def test_income_statement_template_rows_and_formulas():
    balance_rows = [
        {
            "account_id": 1,
            "account_code": "6001",
            "account_name": "主营业务收入",
            "account_type": "profit_loss",
            "balance_direction": "credit",
            "period_debit": 0,
            "period_credit": 1000,
            "year_debit": 0,
            "year_credit": 5000,
        },
        {
            "account_id": 2,
            "account_code": "6401",
            "account_name": "主营业务成本",
            "account_type": "profit_loss",
            "balance_direction": "debit",
            "period_debit": 600,
            "period_credit": 0,
            "year_debit": 3000,
            "year_credit": 0,
        },
        {
            "account_id": 3,
            "account_code": "6602",
            "account_name": "管理费用",
            "account_type": "profit_loss",
            "balance_direction": "debit",
            "period_debit": 100,
            "period_credit": 0,
            "year_debit": 200,
            "year_credit": 0,
        },
        {
            "account_id": 4,
            "account_code": "6801",
            "account_name": "所得税费用",
            "account_type": "profit_loss",
            "balance_direction": "debit",
            "period_debit": 75,
            "period_credit": 0,
            "year_debit": 450,
            "year_credit": 0,
        },
    ]
    rows = build_income_statement_rows(balance_rows, signed_amount_fn=signed_amount)
    assert len(rows) == 34
    by_key = {row["line_key"]: row for row in rows}
    assert by_key["line_1"]["line_no"] == 1
    assert by_key["line_1"]["period_amount"] == 1000.0
    assert by_key["line_2"]["period_amount"] == 600.0
    assert by_key["line_22"]["period_amount"] == 300.0
    assert by_key["line_35"]["period_amount"] == 225.0


def test_unclosed_profit_uses_credit_minus_debit():
    income_ending = signed_amount(0, 300, "credit")
    expense_ending = signed_amount(80, 0, "debit")
    unclosed = (Decimal("300") - Decimal("0")) + (Decimal("0") - Decimal("80"))
    assert income_ending == Decimal("300")
    assert expense_ending == Decimal("80")
    assert unclosed == Decimal("220")
