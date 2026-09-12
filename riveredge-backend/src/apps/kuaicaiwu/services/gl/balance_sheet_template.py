"""小企业会计准则资产负债表行次模板（对标标准 Excel 格式）。"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, Iterable, List, Literal, Optional, Sequence, Tuple

SideKind = Literal["account", "formula", "header"]
SideName = Literal["asset", "liability_equity"]


@dataclass(frozen=True)
class BalanceSheetSideDef:
    line_no: Optional[int]
    line_key: str
    label: str
    side: SideName
    kind: SideKind = "account"
    account_codes: Sequence[str] = ()
    subtract_codes: Sequence[str] = ()
    formula_key: Optional[str] = None
    is_total: bool = False
    indent: bool = False


@dataclass(frozen=True)
class BalanceSheetPairDef:
    asset: Optional[BalanceSheetSideDef] = None
    liability_equity: Optional[BalanceSheetSideDef] = None


def _side(
    line_no: Optional[int],
    line_key: str,
    label: str,
    side: SideName,
    *,
    kind: SideKind = "account",
    account_codes: Sequence[str] = (),
    subtract_codes: Sequence[str] = (),
    formula_key: Optional[str] = None,
    is_total: bool = False,
    indent: bool = False,
) -> BalanceSheetSideDef:
    return BalanceSheetSideDef(
        line_no=line_no,
        line_key=line_key,
        label=label,
        side=side,
        kind=kind,
        account_codes=account_codes,
        subtract_codes=subtract_codes,
        formula_key=formula_key,
        is_total=is_total,
        indent=indent,
    )


# 左右对照行次与 Excel 模板一致
BALANCE_SHEET_TEMPLATE: List[BalanceSheetPairDef] = [
    BalanceSheetPairDef(
        asset=_side(None, "a_hdr_current", "流动资产：", "asset", kind="header"),
        liability_equity=_side(None, "l_hdr_current", "流动负债：", "liability_equity", kind="header"),
    ),
    BalanceSheetPairDef(
        asset=_side(1, "a_01", "货币资金", "asset", account_codes=("1001", "1002", "1012")),
        liability_equity=_side(31, "l_31", "短期借款", "liability_equity", account_codes=("2001",)),
    ),
    BalanceSheetPairDef(
        asset=_side(2, "a_02", "短期投资", "asset", account_codes=("1101",)),
        liability_equity=_side(32, "l_32", "应付票据", "liability_equity", account_codes=("2201",)),
    ),
    BalanceSheetPairDef(
        asset=_side(3, "a_03", "应收票据", "asset", account_codes=("1121",)),
        liability_equity=_side(33, "l_33", "应付账款", "liability_equity", account_codes=("2202",)),
    ),
    BalanceSheetPairDef(
        asset=_side(
            4,
            "a_04",
            "应收账款",
            "asset",
            account_codes=("1122",),
            subtract_codes=("1231",),
        ),
        liability_equity=_side(34, "l_34", "预收账款", "liability_equity", account_codes=("2203",)),
    ),
    BalanceSheetPairDef(
        asset=_side(5, "a_05", "预付账款", "asset", account_codes=("1123",)),
        liability_equity=_side(35, "l_35", "应付职工薪酬", "liability_equity", account_codes=("2211",)),
    ),
    BalanceSheetPairDef(
        asset=_side(6, "a_06", "应收股利", "asset", account_codes=("1131",)),
        liability_equity=_side(36, "l_36", "应交税费", "liability_equity", account_codes=("2221",)),
    ),
    BalanceSheetPairDef(
        asset=_side(7, "a_07", "应收利息", "asset", account_codes=("1132",)),
        liability_equity=_side(37, "l_37", "应付利息", "liability_equity", account_codes=("2231",)),
    ),
    BalanceSheetPairDef(
        asset=_side(8, "a_08", "其他应收款", "asset", account_codes=("1221",)),
        liability_equity=_side(38, "l_38", "应付利润", "liability_equity", account_codes=("2232",)),
    ),
    BalanceSheetPairDef(
        asset=_side(
            9,
            "a_09",
            "存货",
            "asset",
            account_codes=(
                "1401",
                "1402",
                "1403",
                "1404",
                "1405",
                "1406",
                "1407",
                "1408",
                "1411",
                "1412",
                "1421",
            ),
            subtract_codes=("1471",),
        ),
        liability_equity=_side(39, "l_39", "其他应付款", "liability_equity", account_codes=("2241",)),
    ),
    BalanceSheetPairDef(
        asset=_side(10, "a_10", "其中：原材料", "asset", account_codes=("1403",), indent=True),
        liability_equity=_side(40, "l_40", "其他流动负债", "liability_equity", account_codes=("2101", "2242")),
    ),
    BalanceSheetPairDef(
        asset=_side(11, "a_11", "在产品", "asset", account_codes=("1412",), indent=True),
        liability_equity=_side(
            41,
            "l_41",
            "流动负债合计",
            "liability_equity",
            kind="formula",
            formula_key="current_liabilities_total",
            is_total=True,
        ),
    ),
    BalanceSheetPairDef(
        asset=_side(12, "a_12", "库存商品", "asset", account_codes=("1405",), indent=True),
        liability_equity=_side(None, "l_hdr_noncurrent", "非流动负债：", "liability_equity", kind="header"),
    ),
    BalanceSheetPairDef(
        asset=_side(13, "a_13", "周转材料", "asset", account_codes=("1411",), indent=True),
        liability_equity=_side(42, "l_42", "长期借款", "liability_equity", account_codes=("2501",)),
    ),
    BalanceSheetPairDef(
        asset=_side(14, "a_14", "其他流动资产", "asset", account_codes=("1901",)),
        liability_equity=_side(43, "l_43", "长期应付款", "liability_equity", account_codes=("2701",)),
    ),
    BalanceSheetPairDef(
        asset=_side(
            15,
            "a_15",
            "流动资产合计",
            "asset",
            kind="formula",
            formula_key="current_assets_total",
            is_total=True,
        ),
        liability_equity=_side(44, "l_44", "递延收益", "liability_equity", account_codes=("2401",)),
    ),
    BalanceSheetPairDef(
        asset=_side(None, "a_hdr_noncurrent", "非流动资产：", "asset", kind="header"),
        liability_equity=_side(45, "l_45", "其他非流动负债", "liability_equity", account_codes=("2801", "2901")),
    ),
    BalanceSheetPairDef(
        asset=_side(16, "a_16", "长期债券投资", "asset", account_codes=("1501", "1503")),
        liability_equity=_side(
            46,
            "l_46",
            "非流动负债合计",
            "liability_equity",
            kind="formula",
            formula_key="noncurrent_liabilities_total",
            is_total=True,
        ),
    ),
    BalanceSheetPairDef(
        asset=_side(17, "a_17", "长期股权投资", "asset", account_codes=("1511",)),
        liability_equity=_side(
            47,
            "l_47",
            "负债合计",
            "liability_equity",
            kind="formula",
            formula_key="liabilities_total",
            is_total=True,
        ),
    ),
    BalanceSheetPairDef(
        asset=_side(18, "a_18", "固定资产原价", "asset", account_codes=("1601",)),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(19, "a_19", "减：累计折旧", "asset", account_codes=("1602",), indent=True),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(
            20,
            "a_20",
            "固定资产账面价值",
            "asset",
            kind="formula",
            formula_key="fixed_asset_net",
            is_total=True,
        ),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(21, "a_21", "在建工程", "asset", account_codes=("1604",)),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(22, "a_22", "工程物资", "asset", account_codes=("1605",)),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(23, "a_23", "固定资产清理", "asset", account_codes=("1606",)),
        liability_equity=None,
    ),
    BalanceSheetPairDef(
        asset=_side(
            24,
            "a_24",
            "生产性生物资产",
            "asset",
            account_codes=("1621",),
            subtract_codes=("1622",),
        ),
        liability_equity=_side(None, "e_hdr", "所有者权益（或股东权益）：", "liability_equity", kind="header"),
    ),
    BalanceSheetPairDef(
        asset=_side(
            25,
            "a_25",
            "无形资产",
            "asset",
            account_codes=("1701",),
            subtract_codes=("1702", "1703"),
        ),
        liability_equity=_side(48, "l_48", "实收资本（或股本）", "liability_equity", account_codes=("4001",)),
    ),
    BalanceSheetPairDef(
        asset=_side(26, "a_26", "开发支出", "asset", account_codes=("5301", "4403")),
        liability_equity=_side(49, "l_49", "资本公积", "liability_equity", account_codes=("4002",)),
    ),
    BalanceSheetPairDef(
        asset=_side(27, "a_27", "长期待摊费用", "asset", account_codes=("1801",)),
        liability_equity=_side(50, "l_50", "盈余公积", "liability_equity", account_codes=("4101",)),
    ),
    BalanceSheetPairDef(
        asset=_side(28, "a_28", "其他非流动资产", "asset", account_codes=("1811", "1521", "1531", "1711")),
        liability_equity=_side(
            51,
            "l_51",
            "未分配利润",
            "liability_equity",
            kind="formula",
            formula_key="retained_earnings",
        ),
    ),
    BalanceSheetPairDef(
        asset=_side(
            29,
            "a_29",
            "非流动资产合计",
            "asset",
            kind="formula",
            formula_key="noncurrent_assets_total",
            is_total=True,
        ),
        liability_equity=_side(
            52,
            "l_52",
            "所有者权益（或股东权益）合计",
            "liability_equity",
            kind="formula",
            formula_key="equity_total",
            is_total=True,
        ),
    ),
    BalanceSheetPairDef(
        asset=_side(
            30,
            "a_30",
            "资产总计",
            "asset",
            kind="formula",
            formula_key="assets_total",
            is_total=True,
        ),
        liability_equity=_side(
            53,
            "l_53",
            "负债和所有者权益（或股东权益）总计",
            "liability_equity",
            kind="formula",
            formula_key="liabilities_equity_total",
            is_total=True,
        ),
    ),
]

def _d(v: Any) -> Decimal:
    return Decimal(str(v or 0))


def build_balance_amount_index(
    balance_rows: List[Dict[str, Any]],
    *,
    signed_amount_fn,
) -> Dict[str, Dict[str, Decimal]]:
    """account_code -> {ending, opening} 已按余额方向轧差。"""
    index: Dict[str, Dict[str, Decimal]] = {}
    for row in balance_rows:
        code = str(row.get("account_code") or "").strip()
        if not code:
            continue
        direction = str(row.get("balance_direction") or "debit")
        ending = signed_amount_fn(row["ending_debit"], row["ending_credit"], direction)
        opening = signed_amount_fn(row["opening_debit"], row["opening_credit"], direction)
        bucket = index.setdefault(code, {"ending": Decimal("0"), "opening": Decimal("0")})
        bucket["ending"] += ending
        bucket["opening"] += opening
    return index


def _sum_codes(
    amounts: Dict[str, Dict[str, Decimal]],
    codes: Iterable[str],
    *,
    subtract_codes: Iterable[str] = (),
) -> Dict[str, Decimal]:
    ending = Decimal("0")
    opening = Decimal("0")
    for code in codes:
        bucket = amounts.get(code)
        if not bucket:
            continue
        ending += bucket.get("ending", Decimal("0"))
        opening += bucket.get("opening", Decimal("0"))
    for code in subtract_codes:
        bucket = amounts.get(code)
        if not bucket:
            continue
        ending -= bucket.get("ending", Decimal("0"))
        opening -= bucket.get("opening", Decimal("0"))
    return {"ending": ending, "opening": opening}


def _pair_add(a: Dict[str, Decimal], b: Dict[str, Decimal]) -> Dict[str, Decimal]:
    return {"ending": a["ending"] + b["ending"], "opening": a["opening"] + b["opening"]}


def _pair_sub(a: Dict[str, Decimal], b: Dict[str, Decimal]) -> Dict[str, Decimal]:
    return {"ending": a["ending"] - b["ending"], "opening": a["opening"] - b["opening"]}


def _compute_unclosed(
    balance_rows: List[Dict[str, Any]],
    mapped_codes: set[str],
) -> Dict[str, Decimal]:
    ending = Decimal("0")
    opening = Decimal("0")
    for row in balance_rows:
        code = str(row.get("account_code") or "").strip()
        if code in mapped_codes:
            continue
        account_type = str(row.get("account_type") or "")
        if account_type not in ("profit_loss", "cost"):
            continue
        ending += _d(row["ending_credit"]) - _d(row["ending_debit"])
        opening += _d(row["opening_credit"]) - _d(row["opening_debit"])
    return {"ending": ending, "opening": opening}


def _side_payload(side: BalanceSheetSideDef, amounts: Dict[str, Decimal]) -> Dict[str, Any]:
    ending = amounts.get("ending", Decimal("0"))
    opening = amounts.get("opening", Decimal("0"))
    return {
        "line_key": side.line_key,
        "line_no": side.line_no,
        "label": side.label,
        "side": side.side,
        "kind": side.kind,
        "indent": side.indent,
        "is_total": side.is_total,
        "is_header": side.kind == "header",
        "ending_amount": float(ending),
        "opening_amount": float(opening),
        "amount": float(ending),
    }


def build_balance_sheet_rows(
    balance_rows: List[Dict[str, Any]],
    *,
    signed_amount_fn,
) -> Tuple[List[Dict[str, Any]], Dict[str, Decimal]]:
    amounts = build_balance_amount_index(balance_rows, signed_amount_fn=signed_amount_fn)

    mapped_codes: set[str] = set()
    for pair in BALANCE_SHEET_TEMPLATE:
        for side in (pair.asset, pair.liability_equity):
            if not side or side.kind != "account":
                continue
            mapped_codes.update(side.account_codes)
            mapped_codes.update(side.subtract_codes)

    unclosed = _compute_unclosed(balance_rows, mapped_codes)
    line_values: Dict[str, Dict[str, Decimal]] = {}

    for pair in BALANCE_SHEET_TEMPLATE:
        for side in (pair.asset, pair.liability_equity):
            if not side or side.kind != "account":
                continue
            total = _sum_codes(
                amounts,
                side.account_codes,
                subtract_codes=side.subtract_codes,
            )
            if side.line_key == "a_19":
                total = {"ending": abs(total["ending"]), "opening": abs(total["opening"])}
            line_values[side.line_key] = total

    def _val(key: str) -> Dict[str, Decimal]:
        return line_values.get(key, {"ending": Decimal("0"), "opening": Decimal("0")})

    def _sum_keys(keys: Sequence[str]) -> Dict[str, Decimal]:
        out = {"ending": Decimal("0"), "opening": Decimal("0")}
        for key in keys:
            out = _pair_add(out, _val(key))
        return out

    dep_impair = _sum_codes(amounts, ("1603",))
    line_values["a_20"] = _pair_sub(_pair_sub(_val("a_18"), _val("a_19")), dep_impair)
    line_values["a_15"] = _sum_keys(
        [f"a_{i:02d}" for i in (1, 2, 3, 4, 5, 6, 7, 8, 9, 14)]
    )
    line_values["a_29"] = _sum_keys(["a_16", "a_17", "a_20", "a_21", "a_22", "a_23", "a_24", "a_25", "a_26", "a_27", "a_28"])
    line_values["a_30"] = _pair_add(_val("a_15"), _val("a_29"))

    line_values["l_41"] = _sum_keys([f"l_{i}" for i in (31, 32, 33, 34, 35, 36, 37, 38, 39, 40)])
    line_values["l_46"] = _sum_keys(["l_42", "l_43", "l_44", "l_45"])
    line_values["l_47"] = _pair_add(_val("l_41"), _val("l_46"))

    retained = _pair_add(_sum_codes(amounts, ("4103", "4104")), unclosed)
    line_values["l_51"] = retained
    line_values["l_52"] = _pair_add(_sum_keys(["l_48", "l_49", "l_50"]), _val("l_51"))
    line_values["l_53"] = _pair_add(_val("l_47"), _val("l_52"))

    rows: List[Dict[str, Any]] = []
    for pair in BALANCE_SHEET_TEMPLATE:
        row: Dict[str, Any] = {"line_key": f"pair_{pair.asset.line_key if pair.asset else pair.liability_equity.line_key}"}
        if pair.asset:
            if pair.asset.kind == "formula" and pair.asset.formula_key:
                payload = _side_payload(pair.asset, _val(pair.asset.line_key))
            elif pair.asset.kind == "header":
                payload = _side_payload(pair.asset, {"ending": Decimal("0"), "opening": Decimal("0")})
            else:
                payload = _side_payload(pair.asset, _val(pair.asset.line_key))
            row["asset"] = payload
        if pair.liability_equity:
            if pair.liability_equity.kind == "formula":
                payload = _side_payload(pair.liability_equity, _val(pair.liability_equity.line_key))
            elif pair.liability_equity.kind == "header":
                payload = _side_payload(pair.liability_equity, {"ending": Decimal("0"), "opening": Decimal("0")})
            else:
                payload = _side_payload(pair.liability_equity, _val(pair.liability_equity.line_key))
            row["liability_equity"] = payload
        rows.append(row)

    totals = {
        "total_assets": line_values["a_30"]["ending"],
        "total_liabilities": line_values["l_47"]["ending"],
        "total_equity": line_values["l_52"]["ending"],
        "total_liabilities_and_equity": line_values["l_53"]["ending"],
        "unclosed_profit": unclosed["ending"],
    }
    return rows, totals
