"""法定三大报表：资产负债表 / 利润表。现金流量表仍走 GlPhase2Service。"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional

from apps.kuaicaiwu.models.chart_of_account import ChartOfAccount
from apps.kuaicaiwu.services.gl.balance_service import BalanceService
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
        rows = await self._period_balances(
            tenant_id, year, month, include_unposted=include_unposted
        )
        asset_lines: List[Dict[str, Any]] = []
        liability_lines: List[Dict[str, Any]] = []
        equity_lines: List[Dict[str, Any]] = []
        unclosed = Decimal("0")

        for row in rows:
            account_type = str(row.get("account_type") or "")
            direction = str(row.get("balance_direction") or "debit")
            ending = signed_amount(row["ending_debit"], row["ending_credit"], direction)
            if ending == 0:
                continue
            if account_type == "asset":
                asset_lines.append(
                    _line(
                        line_key=f"asset-{row['account_id']}",
                        label=str(row["account_name"]),
                        section="asset",
                        amount=ending,
                        account_code=str(row.get("account_code") or ""),
                        account_id=int(row["account_id"]),
                    )
                )
            elif account_type == "liability":
                liability_lines.append(
                    _line(
                        line_key=f"liability-{row['account_id']}",
                        label=str(row["account_name"]),
                        section="liability",
                        amount=ending,
                        account_code=str(row.get("account_code") or ""),
                        account_id=int(row["account_id"]),
                    )
                )
            elif account_type == "equity":
                equity_lines.append(
                    _line(
                        line_key=f"equity-{row['account_id']}",
                        label=str(row["account_name"]),
                        section="equity",
                        amount=ending,
                        account_code=str(row.get("account_code") or ""),
                        account_id=int(row["account_id"]),
                    )
                )
            elif account_type in ("profit_loss", "cost"):
                # 未结转损益按贷-借计入权益，与资产负债表恒等式一致
                unclosed += _d(row["ending_credit"]) - _d(row["ending_debit"])

        total_assets = sum((_d(line["amount"]) for line in asset_lines), Decimal("0"))
        total_liabilities = sum((_d(line["amount"]) for line in liability_lines), Decimal("0"))
        total_equity = sum((_d(line["amount"]) for line in equity_lines), Decimal("0"))
        if unclosed != 0:
            equity_lines.append(
                _line(
                    line_key="unclosed-pl",
                    label="未结转损益",
                    section="equity",
                    amount=unclosed,
                )
            )
            total_equity += unclosed
        total_liab_equity = total_liabilities + total_equity

        lines = [
            _line(line_key="asset-header", label="资产", section="asset", amount=Decimal("0"), is_total=True),
            *asset_lines,
            _line(line_key="asset-total", label="资产合计", section="asset", amount=total_assets, is_total=True),
            _line(
                line_key="liability-header",
                label="负债",
                section="liability",
                amount=Decimal("0"),
                is_total=True,
            ),
            *liability_lines,
            _line(
                line_key="liability-total",
                label="负债合计",
                section="liability",
                amount=total_liabilities,
                is_total=True,
            ),
            _line(line_key="equity-header", label="所有者权益", section="equity", amount=Decimal("0"), is_total=True),
            *equity_lines,
            _line(
                line_key="equity-total",
                label="所有者权益合计",
                section="equity",
                amount=total_equity,
                is_total=True,
            ),
            _line(
                line_key="liab-equity-total",
                label="负债和所有者权益合计",
                section="equity",
                amount=total_liab_equity,
                is_total=True,
            ),
        ]
        return {
            "year": year,
            "month": month,
            "statement_type": "balance_sheet",
            "total_assets": float(total_assets),
            "total_liabilities": float(total_liabilities),
            "total_equity": float(total_equity),
            "total_liabilities_and_equity": float(total_liab_equity),
            "balanced": total_assets == total_liab_equity,
            "unclosed_profit": float(unclosed),
            "rows": lines,
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
