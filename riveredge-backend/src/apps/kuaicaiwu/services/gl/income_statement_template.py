"""小企业会计准则利润表行次模板（对标标准 Excel 利润表格式）。"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, Iterable, List, Literal, Optional, Sequence

LineKind = Literal["account", "formula"]


@dataclass(frozen=True)
class IncomeStatementLineDef:
    line_no: int
    line_key: str
    label: str
    kind: LineKind = "account"
    account_codes: Sequence[str] = ()
    include_cost_accounts: bool = False
    formula_key: Optional[str] = None
    is_total: bool = False
    indent: bool = False


# 行次与项目名称与标准模板一致
INCOME_STATEMENT_TEMPLATE: List[IncomeStatementLineDef] = [
    IncomeStatementLineDef(1, "line_1", "一、营业收入", account_codes=("6001", "6011", "6021", "6031", "6041", "6051")),
    IncomeStatementLineDef(2, "line_2", "减：营业成本", account_codes=("6401", "6402"), include_cost_accounts=True),
    IncomeStatementLineDef(3, "line_3", "营业税金及附加", account_codes=("6403",)),
    IncomeStatementLineDef(4, "line_4", "其中：消费税", account_codes=("640301",), indent=True),
    IncomeStatementLineDef(5, "line_5", "营业税", account_codes=("640302",), indent=True),
    IncomeStatementLineDef(6, "line_6", "城市维护建设税", account_codes=("640303",), indent=True),
    IncomeStatementLineDef(7, "line_7", "资源税", account_codes=("640304",), indent=True),
    IncomeStatementLineDef(8, "line_8", "土地增值税", account_codes=("640305",), indent=True),
    IncomeStatementLineDef(
        9,
        "line_9",
        "城镇土地使用税、房产税、车船税、印花税",
        account_codes=("640306", "640307", "640308", "640309"),
        indent=True,
    ),
    IncomeStatementLineDef(
        10,
        "line_10",
        "教育费附加、矿产资源补偿费、排污费",
        account_codes=("640310", "640311", "640312"),
        indent=True,
    ),
    IncomeStatementLineDef(11, "line_11", "销售费用", account_codes=("6601",)),
    IncomeStatementLineDef(12, "line_12", "其中：商品维修费", account_codes=("660101",), indent=True),
    IncomeStatementLineDef(13, "line_13", "广告费和业务宣传费", account_codes=("660102",), indent=True),
    IncomeStatementLineDef(14, "line_14", "管理费用", account_codes=("6602",)),
    IncomeStatementLineDef(15, "line_15", "其中：开办费", account_codes=("660201",), indent=True),
    IncomeStatementLineDef(16, "line_16", "业务招待费", account_codes=("660202",), indent=True),
    IncomeStatementLineDef(17, "line_17", "研究费用", account_codes=("660203", "5301"), indent=True),
    IncomeStatementLineDef(18, "line_18", "财务费用", account_codes=("6603",)),
    IncomeStatementLineDef(
        19,
        "line_19",
        "其中：利息费用（收入以“-”号填列）",
        account_codes=("660301", "660302"),
        indent=True,
    ),
    IncomeStatementLineDef(20, "line_20", "资产减值损失", account_codes=("6701",)),
    IncomeStatementLineDef(21, "line_21", "加：投资收益（损失以“-”号填列）", account_codes=("6111", "6101")),
    IncomeStatementLineDef(
        22,
        "line_22",
        "二、营业利润（亏损以“-”号填列）",
        kind="formula",
        formula_key="operating_profit",
        is_total=True,
    ),
    IncomeStatementLineDef(23, "line_23", "加：营业外收入", account_codes=("6301",)),
    IncomeStatementLineDef(24, "line_24", "其中：政府补助", account_codes=("630101",), indent=True),
    IncomeStatementLineDef(25, "line_25", "减：营业外支出", account_codes=("6711",)),
    IncomeStatementLineDef(26, "line_26", "其中：坏账损失", account_codes=("671101",), indent=True),
    IncomeStatementLineDef(
        27,
        "line_27",
        "无法收回的长期债券投资损失",
        account_codes=("671102",),
        indent=True,
    ),
    IncomeStatementLineDef(
        28,
        "line_28",
        "无法收回的长期股权投资损失",
        account_codes=("671103",),
        indent=True,
    ),
    IncomeStatementLineDef(
        29,
        "line_29",
        "自然灾害等不可抗力因素造成的损失",
        account_codes=("671104",),
        indent=True,
    ),
    IncomeStatementLineDef(30, "line_30", "税收滞纳金", account_codes=("671105",), indent=True),
    IncomeStatementLineDef(
        31,
        "line_31",
        "三、利润总额（亏损总额以“-”号填列）",
        kind="formula",
        formula_key="total_profit",
        is_total=True,
    ),
    IncomeStatementLineDef(32, "line_32", "减：所得税费用", account_codes=("6801",)),
    IncomeStatementLineDef(34, "line_34", "专项储备", account_codes=("4301",)),
    IncomeStatementLineDef(
        35,
        "line_35",
        "四、净利润（净亏损以“-”号填列）",
        kind="formula",
        formula_key="net_profit",
        is_total=True,
    ),
]


def _d(v: Any) -> Decimal:
    return Decimal(str(v or 0))


def _sum_codes(
    amounts: Dict[str, Dict[str, Decimal]],
    codes: Iterable[str],
) -> Dict[str, Decimal]:
    period = Decimal("0")
    year = Decimal("0")
    for code in codes:
        bucket = amounts.get(code)
        if not bucket:
            continue
        period += bucket.get("period", Decimal("0"))
        year += bucket.get("year", Decimal("0"))
    return {"period": period, "year": year}


def build_account_amount_index(
    balance_rows: List[Dict[str, Any]],
    *,
    signed_amount_fn,
) -> Dict[str, Dict[str, Decimal]]:
    """account_code -> {period, year} 已按损益方向轧差。"""
    index: Dict[str, Dict[str, Decimal]] = {}
    for row in balance_rows:
        code = str(row.get("account_code") or "").strip()
        if not code:
            continue
        direction = str(row.get("balance_direction") or "debit")
        account_type = str(row.get("account_type") or "")
        period = signed_amount_fn(row["period_debit"], row["period_credit"], direction)
        year_amt = signed_amount_fn(row["year_debit"], row["year_credit"], direction)
        if account_type == "cost":
            period = _d(row["period_debit"]) - _d(row["period_credit"])
            year_amt = _d(row["year_debit"]) - _d(row["year_credit"])
        bucket = index.setdefault(code, {"period": Decimal("0"), "year": Decimal("0")})
        bucket["period"] += period
        bucket["year"] += year_amt
    return index


def _extra_operating_revenue(
    balance_rows: List[Dict[str, Any]],
    *,
    signed_amount_fn,
    mapped_codes: set[str],
) -> Dict[str, Decimal]:
    """未映射的 60 段贷方损益科目并入营业收入。"""
    period = Decimal("0")
    year_amt = Decimal("0")
    for row in balance_rows:
        code = str(row.get("account_code") or "").strip()
        if not code or code in mapped_codes:
            continue
        if str(row.get("account_type") or "") != "profit_loss":
            continue
        if str(row.get("balance_direction") or "debit") != "credit":
            continue
        if not code.startswith("60"):
            continue
        period += signed_amount_fn(row["period_debit"], row["period_credit"], "credit")
        year_amt += signed_amount_fn(row["year_debit"], row["year_credit"], "credit")
    return {"period": period, "year": year_amt}


def _amt_pair(a: Dict[str, Decimal], b: Dict[str, Decimal], op: str) -> Dict[str, Decimal]:
    if op == "add":
        return {"period": a["period"] + b["period"], "year": a["year"] + b["year"]}
    return {"period": a["period"] - b["period"], "year": a["year"] - b["year"]}


def _sum_pairs(*pairs: Dict[str, Decimal]) -> Dict[str, Decimal]:
    out = {"period": Decimal("0"), "year": Decimal("0")}
    for pair in pairs:
        out = _amt_pair(out, pair, "add")
    return out


def _subtract_pairs(base: Dict[str, Decimal], *pairs: Dict[str, Decimal]) -> Dict[str, Decimal]:
    out = base
    for pair in pairs:
        out = _amt_pair(out, pair, "sub")
    return out


def build_income_statement_rows(
    balance_rows: List[Dict[str, Any]],
    *,
    signed_amount_fn,
) -> List[Dict[str, Any]]:
    amounts = build_account_amount_index(balance_rows, signed_amount_fn=signed_amount_fn)
    mapped_codes: set[str] = set()
    for item in INCOME_STATEMENT_TEMPLATE:
        mapped_codes.update(item.account_codes)

    line_values: Dict[str, Dict[str, Decimal]] = {}
    rows: List[Dict[str, Any]] = []

    for item in INCOME_STATEMENT_TEMPLATE:
        if item.kind == "formula":
            continue
        total = _sum_codes(amounts, item.account_codes)
        if item.include_cost_accounts:
            for code, bucket in amounts.items():
                if len(code) == 4 and code.startswith(("5001", "5101", "5201", "5301")):
                    total["period"] += bucket["period"]
                    total["year"] += bucket["year"]
        if item.line_key == "line_1":
            extra = _extra_operating_revenue(
                balance_rows, signed_amount_fn=signed_amount_fn, mapped_codes=mapped_codes
            )
            total["period"] += extra["period"]
            total["year"] += extra["year"]
        line_values[item.line_key] = total
        rows.append(_to_row(item, total))

    def _val(key: str) -> Dict[str, Decimal]:
        return line_values.get(key, {"period": Decimal("0"), "year": Decimal("0")})

    def _compute_formula(formula_key: str) -> Dict[str, Decimal]:
        if formula_key == "operating_profit":
            return _subtract_pairs(
                _sum_pairs(_val("line_1"), _val("line_21")),
                _val("line_2"),
                _val("line_3"),
                _val("line_11"),
                _val("line_14"),
                _val("line_18"),
                _val("line_20"),
            )
        if formula_key == "total_profit":
            return _subtract_pairs(_sum_pairs(_val("line_22"), _val("line_23")), _val("line_25"))
        if formula_key == "net_profit":
            return _subtract_pairs(_val("line_31"), _val("line_32"), _val("line_34"))
        raise ValueError(f"unknown income statement formula: {formula_key}")

    final_rows: List[Dict[str, Any]] = []
    for item in INCOME_STATEMENT_TEMPLATE:
        if item.kind == "formula" and item.formula_key:
            total = _compute_formula(item.formula_key)
            line_values[item.line_key] = total
            final_rows.append(_to_row(item, total))
        else:
            existing = next((r for r in rows if r["line_key"] == item.line_key), None)
            if existing:
                final_rows.append(existing)

    return final_rows


def _to_row(item: IncomeStatementLineDef, total: Dict[str, Decimal]) -> Dict[str, Any]:
    period = total.get("period", Decimal("0"))
    year_amt = total.get("year", Decimal("0"))
    return {
        "line_key": item.line_key,
        "line_no": item.line_no,
        "label": item.label,
        "indent": item.indent,
        "is_total": item.is_total,
        "period_amount": float(period),
        "year_amount": float(year_amt),
        "amount": float(period),
    }
