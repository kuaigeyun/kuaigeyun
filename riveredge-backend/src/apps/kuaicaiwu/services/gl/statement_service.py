"""法定三大报表：资产负债表 / 利润表 / 现金流量表。"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional

from apps.kuaicaiwu.models.chart_of_account import ChartOfAccount
from apps.kuaicaiwu.models.gl_cash_flow_item import GlCashFlowItem
from apps.kuaicaiwu.models.voucher import Voucher
from apps.kuaicaiwu.models.voucher_line import VoucherLine
from apps.kuaicaiwu.services.gl.balance_service import BalanceService
from apps.kuaicaiwu.services.gl.balance_sheet_template import build_balance_sheet_rows
from apps.kuaicaiwu.services.gl.cash_flow_statement_template import build_cash_flow_rows
from apps.kuaicaiwu.services.gl.income_statement_template import build_income_statement_rows

BALANCE_FIELDS = (
    "opening_debit",
    "opening_credit",
    "period_debit",
    "period_credit",
    "year_debit",
    "year_credit",
    "ending_debit",
    "ending_credit",
)


def _d(v: Any) -> Decimal:
    return Decimal(str(v or 0))


def signed_amount(debit: Any, credit: Any, balance_direction: str) -> Decimal:
    """按科目余额方向轧差：借方科目借-贷，贷方科目贷-借。"""
    if str(balance_direction or "debit").lower() == "credit":
        return _d(credit) - _d(debit)
    return _d(debit) - _d(credit)


def aggregate_balances_by_account(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """法定报表按科目汇总，去掉辅助核算拆行。"""
    by_account: Dict[int, Dict[str, Any]] = {}
    for row in rows:
        account_id = int(row.get("account_id") or 0)
        if not account_id:
            continue
        item = by_account.get(account_id)
        if not item:
            item = {
                "account_id": account_id,
                "account_code": row.get("account_code"),
                "account_name": row.get("account_name") or "",
                "account_type": row.get("account_type") or "",
                **{field: 0.0 for field in BALANCE_FIELDS},
            }
            by_account[account_id] = item
        for field in BALANCE_FIELDS:
            item[field] = float(_d(item[field]) + _d(row.get(field)))
    result = list(by_account.values())
    result.sort(key=lambda x: str(x.get("account_code") or ""))
    return result


def _line(
    *,
    line_key: str,
    label: str,
    section: str,
    amount: Decimal,
    period_amount: Optional[Decimal] = None,
    year_amount: Optional[Decimal] = None,
    is_total: bool = False,
    account_code: Optional[str] = None,
    account_id: Optional[int] = None,
) -> Dict[str, Any]:
    return {
        "line_key": line_key,
        "label": label,
        "section": section,
        "account_code": account_code,
        "account_id": account_id,
        "amount": float(amount),
        "period_amount": float(period_amount if period_amount is not None else amount),
        "year_amount": float(year_amount if year_amount is not None else amount),
        "is_total": is_total,
    }


class StatementService:
    def __init__(self) -> None:
        self._balances = BalanceService()

    async def _account_map(self, tenant_id: int) -> Dict[int, ChartOfAccount]:
        rows = await ChartOfAccount.filter(tenant_id=tenant_id, deleted_at__isnull=True).all()
        return {int(row.id): row for row in rows}

    async def _period_balances(
        self,
        tenant_id: int,
        year: int,
        month: int,
        *,
        include_unposted: bool = False,
    ) -> List[Dict[str, Any]]:
        raw = await self._balances.account_balance_sheet(
            tenant_id, year, month, include_unposted=include_unposted
        )
        aggregated = aggregate_balances_by_account(raw)
        accounts = await self._account_map(tenant_id)
        result: List[Dict[str, Any]] = []
        for row in aggregated:
            account = accounts.get(int(row["account_id"]))
            if not account or not account.is_leaf:
                continue
            row["account_name"] = account.account_name
            row["account_type"] = account.account_type
            row["balance_direction"] = account.balance_direction
            result.append(row)
        return result

    async def balance_sheet(
        self,
        tenant_id: int,
        year: int,
        month: int,
        *,
        include_unposted: bool = False,
    ) -> Dict[str, Any]:
        balance_rows = await self._period_balances(
            tenant_id, year, month, include_unposted=include_unposted
        )
        lines, totals = build_balance_sheet_rows(
            balance_rows,
            signed_amount_fn=signed_amount,
        )
        total_assets = totals["total_assets"]
        total_liab_equity = totals["total_liabilities_and_equity"]
        return {
            "year": year,
            "month": month,
            "statement_type": "balance_sheet",
            "total_assets": float(total_assets),
            "total_liabilities": float(totals["total_liabilities"]),
            "total_equity": float(totals["total_equity"]),
            "total_liabilities_and_equity": float(total_liab_equity),
            "balanced": total_assets == total_liab_equity,
            "unclosed_profit": float(totals["unclosed_profit"]),
            "rows": lines,
        }

    async def _aggregate_cash_flow_by_item_code(
        self,
        tenant_id: int,
        year: int,
        month: int,
    ) -> tuple[Dict[str, Decimal], Dict[str, Decimal]]:
        items = await GlCashFlowItem.filter(
            tenant_id=tenant_id, is_active=True, deleted_at__isnull=True
        ).all()
        code_by_id = {int(item.id): str(item.item_code) for item in items}
        period_totals: Dict[str, Decimal] = {}
        year_totals: Dict[str, Decimal] = {}

        vouchers = await Voucher.filter(
            tenant_id=tenant_id,
            period_year=year,
            period_month__lte=month,
            status="posted",
            deleted_at__isnull=True,
        ).all()
        for voucher in vouchers:
            is_period = int(voucher.period_month) == int(month)
            lines = await VoucherLine.filter(tenant_id=tenant_id, voucher_id=voucher.id).all()
            for line in lines:
                account = await ChartOfAccount.get_or_none(
                    tenant_id=tenant_id, id=line.account_id, deleted_at__isnull=True
                )
                if not account or not (account.is_cash_journal or account.is_bank_journal):
                    continue
                cf_id = int(line.cash_flow_item_id or 0)
                item_code = code_by_id.get(cf_id)
                if not item_code:
                    continue
                item = next((row for row in items if row.id == cf_id), None)
                if not item:
                    continue
                if item.direction == "outflow":
                    amt = _d(line.credit_amount) or _d(line.debit_amount)
                    signed = -amt
                else:
                    amt = _d(line.debit_amount) or _d(line.credit_amount)
                    signed = amt
                year_totals[item_code] = year_totals.get(item_code, Decimal("0")) + signed
                if is_period:
                    period_totals[item_code] = period_totals.get(item_code, Decimal("0")) + signed
        return period_totals, year_totals

    async def cash_flow_statement(
        self,
        tenant_id: int,
        year: int,
        month: int,
    ) -> Dict[str, Any]:
        cf_period, cf_year = await self._aggregate_cash_flow_by_item_code(tenant_id, year, month)
        balance_rows = await self._period_balances(tenant_id, year, month, include_unposted=False)
        jan_rows = (
            balance_rows
            if month == 1
            else await self._period_balances(tenant_id, year, 1, include_unposted=False)
        )
        cash_codes = ("1001", "1002", "1012")

        def _cash_balance(rows: List[Dict[str, Any]], *, measure: str) -> Decimal:
            total = Decimal("0")
            for row in rows:
                code = str(row.get("account_code") or "")
                if code not in cash_codes:
                    continue
                direction = str(row.get("balance_direction") or "debit")
                if measure == "opening":
                    total += signed_amount(row["opening_debit"], row["opening_credit"], direction)
                else:
                    total += signed_amount(row["ending_debit"], row["ending_credit"], direction)
            return total

        period_opening = _cash_balance(balance_rows, measure="opening")
        year_opening = _cash_balance(jan_rows, measure="opening")
        period_ending = _cash_balance(balance_rows, measure="ending")
        year_ending = period_ending

        rows = build_cash_flow_rows(
            cf_period_by_code=cf_period,
            cf_year_by_code=cf_year,
            cash_opening={"period": period_opening, "year": year_opening},
            cash_ending={"period": period_ending, "year": year_ending},
        )
        by_key = {row["line_key"]: row for row in rows}
        operating_net = _d(by_key.get("cf_07", {}).get("period_amount"))
        investing_net = _d(by_key.get("cf_13", {}).get("period_amount"))
        financing_net = _d(by_key.get("cf_19", {}).get("period_amount"))
        net_increase = _d(by_key.get("cf_20", {}).get("period_amount"))
        return {
            "year": year,
            "month": month,
            "statement_type": "cash_flow",
            "rows": rows,
            "operating_net": float(operating_net),
            "investing_net": float(investing_net),
            "financing_net": float(financing_net),
            "net_increase": float(net_increase),
        }

    async def income_statement(
        self,
        tenant_id: int,
        year: int,
        month: int,
        *,
        include_unposted: bool = False,
    ) -> Dict[str, Any]:
        balance_rows = await self._period_balances(
            tenant_id, year, month, include_unposted=include_unposted
        )
        lines = build_income_statement_rows(
            balance_rows,
            signed_amount_fn=signed_amount,
        )
        net_line = next((line for line in lines if line.get("line_key") == "line_35"), None)
        period_profit = _d(net_line["period_amount"]) if net_line else Decimal("0")
        year_profit = _d(net_line["year_amount"]) if net_line else Decimal("0")
        line_1 = next((line for line in lines if line.get("line_key") == "line_1"), None)
        line_2 = next((line for line in lines if line.get("line_key") == "line_2"), None)
        period_income = _d(line_1["period_amount"]) if line_1 else Decimal("0")
        year_income = _d(line_1["year_amount"]) if line_1 else Decimal("0")
        period_cost = _d(line_2["period_amount"]) if line_2 else Decimal("0")
        year_cost = _d(line_2["year_amount"]) if line_2 else Decimal("0")
        expense_keys = ("line_3", "line_11", "line_14", "line_18", "line_20", "line_25", "line_32")
        period_expense = Decimal("0")
        year_expense = Decimal("0")
        for line in lines:
            if line.get("line_key") in expense_keys:
                period_expense += _d(line.get("period_amount"))
                year_expense += _d(line.get("year_amount"))
        return {
            "year": year,
            "month": month,
            "statement_type": "income",
            "period_income": float(period_income),
            "period_cost": float(period_cost),
            "period_expense": float(period_expense),
            "period_profit": float(period_profit),
            "year_income": float(year_income),
            "year_cost": float(year_cost),
            "year_expense": float(year_expense),
            "year_profit": float(year_profit),
            "rows": lines,
        }
