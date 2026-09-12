"""小企业会计准则现金流量表行次模板（对标标准 Excel 格式）。"""

from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal
from typing import Any, Dict, List, Literal, Optional, Sequence

LineKind = Literal["account", "formula", "header", "cf_item"]


@dataclass(frozen=True)
class CashFlowLineDef:
    line_no: Optional[int]
    line_key: str
    label: str
    kind: LineKind = "cf_item"
    cf_item_codes: Sequence[str] = ()
    account_codes: Sequence[str] = ()
    formula_key: Optional[str] = None
    is_total: bool = False
    indent: bool = False


CASH_FLOW_TEMPLATE: List[CashFlowLineDef] = [
    CashFlowLineDef(None, "hdr_operating", "一、经营活动产生的现金流量：", kind="header"),
    CashFlowLineDef(
        1,
        "cf_01",
        "销售产成品、商品、提供劳务收到的现金",
        cf_item_codes=("CF01", "OA01"),
    ),
    CashFlowLineDef(
        2,
        "cf_02",
        "收到其他与经营活动有关的现金",
        cf_item_codes=("CF02",),
    ),
    CashFlowLineDef(
        3,
        "cf_03",
        "购买原材料、商品、接受劳务支付的现金",
        cf_item_codes=("CF03", "OA02"),
    ),
    CashFlowLineDef(4, "cf_04", "支付的职工薪酬", cf_item_codes=("CF04", "OA03")),
    CashFlowLineDef(5, "cf_05", "支付的税费", cf_item_codes=("CF05",)),
    CashFlowLineDef(6, "cf_06", "支付其他与经营活动有关的现金", cf_item_codes=("CF06",)),
    CashFlowLineDef(
        7,
        "cf_07",
        "经营活动产生的现金流量净额",
        kind="formula",
        formula_key="operating_net",
        is_total=True,
    ),
    CashFlowLineDef(None, "hdr_investing", "二、投资活动产生的现金流量：", kind="header"),
    CashFlowLineDef(
        8,
        "cf_08",
        "收回短期投资、长期债券投资和长期股权投资收到的现金",
        cf_item_codes=("CF08", "IA01"),
    ),
    CashFlowLineDef(9, "cf_09", "取得投资收益收到的现金", cf_item_codes=("CF09",)),
    CashFlowLineDef(
        10,
        "cf_10",
        "处置固定资产、无形资产和其他非流动资产收回的现金净额",
        cf_item_codes=("CF10",),
    ),
    CashFlowLineDef(
        11,
        "cf_11",
        "短期投资、长期债券投资和长期股权投资支付的现金",
        cf_item_codes=("CF11",),
    ),
    CashFlowLineDef(
        12,
        "cf_12",
        "购建固定资产、无形资产和其他非流动资产支付的现金",
        cf_item_codes=("CF12", "IA02"),
    ),
    CashFlowLineDef(
        13,
        "cf_13",
        "投资活动产生的现金流量净额",
        kind="formula",
        formula_key="investing_net",
        is_total=True,
    ),
    CashFlowLineDef(None, "hdr_financing", "三、筹资活动产生的现金流量：", kind="header"),
    CashFlowLineDef(14, "cf_14", "取得借款收到的现金", cf_item_codes=("CF14",)),
    CashFlowLineDef(
        15,
        "cf_15",
        "吸收投资者投资收到的现金",
        cf_item_codes=("CF15", "FA01"),
    ),
    CashFlowLineDef(16, "cf_16", "偿还借款本金支付的现金", cf_item_codes=("CF16", "FA02")),
    CashFlowLineDef(17, "cf_17", "偿还借款利息支付的现金", cf_item_codes=("CF17",)),
    CashFlowLineDef(18, "cf_18", "分配利润支付的现金", cf_item_codes=("CF18",)),
    CashFlowLineDef(
        19,
        "cf_19",
        "筹资活动产生的现金流量净额",
        kind="formula",
        formula_key="financing_net",
        is_total=True,
    ),
    CashFlowLineDef(20, "cf_20", "四、现金净增加额", kind="formula", formula_key="net_increase", is_total=True),
    CashFlowLineDef(
        21,
        "cf_21",
        "加：期初现金余额",
        kind="account",
        account_codes=("1001", "1002", "1012"),
    ),
    CashFlowLineDef(
        22,
        "cf_22",
        "五、期末现金余额",
        kind="formula",
        formula_key="ending_cash",
        is_total=True,
    ),
]

DEFAULT_CASH_FLOW_SEED: List[Dict[str, Any]] = [
    {
        "item_code": "CF01",
        "item_name": "销售产成品、商品、提供劳务收到的现金",
        "category": "operating",
        "direction": "inflow",
        "sort_order": 10,
    },
    {
        "item_code": "CF02",
        "item_name": "收到其他与经营活动有关的现金",
        "category": "operating",
        "direction": "inflow",
        "sort_order": 20,
    },
    {
        "item_code": "CF03",
        "item_name": "购买原材料、商品、接受劳务支付的现金",
        "category": "operating",
        "direction": "outflow",
        "sort_order": 30,
    },
    {
        "item_code": "CF04",
        "item_name": "支付的职工薪酬",
        "category": "operating",
        "direction": "outflow",
        "sort_order": 40,
    },
    {
        "item_code": "CF05",
        "item_name": "支付的税费",
        "category": "operating",
        "direction": "outflow",
        "sort_order": 50,
    },
    {
        "item_code": "CF06",
        "item_name": "支付其他与经营活动有关的现金",
        "category": "operating",
        "direction": "outflow",
        "sort_order": 60,
    },
    {
        "item_code": "CF08",
        "item_name": "收回短期投资、长期债券投资和长期股权投资收到的现金",
        "category": "investing",
        "direction": "inflow",
        "sort_order": 70,
    },
    {
        "item_code": "CF09",
        "item_name": "取得投资收益收到的现金",
        "category": "investing",
        "direction": "inflow",
        "sort_order": 80,
    },
    {
        "item_code": "CF10",
        "item_name": "处置固定资产、无形资产和其他非流动资产收回的现金净额",
        "category": "investing",
        "direction": "inflow",
        "sort_order": 90,
    },
    {
        "item_code": "CF11",
        "item_name": "短期投资、长期债券投资和长期股权投资支付的现金",
        "category": "investing",
        "direction": "outflow",
        "sort_order": 100,
    },
    {
        "item_code": "CF12",
        "item_name": "购建固定资产、无形资产和其他非流动资产支付的现金",
        "category": "investing",
        "direction": "outflow",
        "sort_order": 110,
    },
    {
        "item_code": "CF14",
        "item_name": "取得借款收到的现金",
        "category": "financing",
        "direction": "inflow",
        "sort_order": 120,
    },
    {
        "item_code": "CF15",
        "item_name": "吸收投资者投资收到的现金",
        "category": "financing",
        "direction": "inflow",
        "sort_order": 130,
    },
    {
        "item_code": "CF16",
        "item_name": "偿还借款本金支付的现金",
        "category": "financing",
        "direction": "outflow",
        "sort_order": 140,
    },
    {
        "item_code": "CF17",
        "item_name": "偿还借款利息支付的现金",
        "category": "financing",
        "direction": "outflow",
        "sort_order": 150,
    },
    {
        "item_code": "CF18",
        "item_name": "分配利润支付的现金",
        "category": "financing",
        "direction": "outflow",
        "sort_order": 160,
    },
]


def _d(v: Any) -> Decimal:
    return Decimal(str(v or 0))


def _pair_add(a: Dict[str, Decimal], b: Dict[str, Decimal]) -> Dict[str, Decimal]:
    return {"period": a["period"] + b["period"], "year": a["year"] + b["year"]}


def _pair_sub(a: Dict[str, Decimal], b: Dict[str, Decimal]) -> Dict[str, Decimal]:
    return {"period": a["period"] - b["period"], "year": a["year"] - b["year"]}


def _sum_pairs(*pairs: Dict[str, Decimal]) -> Dict[str, Decimal]:
    out = {"period": Decimal("0"), "year": Decimal("0")}
    for pair in pairs:
        out = _pair_add(out, pair)
    return out


def _subtract_pairs(base: Dict[str, Decimal], *pairs: Dict[str, Decimal]) -> Dict[str, Decimal]:
    out = base
    for pair in pairs:
        out = _pair_sub(out, pair)
    return out


def _to_row(item: CashFlowLineDef, total: Dict[str, Decimal]) -> Dict[str, Any]:
    period = total.get("period", Decimal("0"))
    year_amt = total.get("year", Decimal("0"))
    return {
        "line_key": item.line_key,
        "line_no": item.line_no,
        "label": item.label,
        "indent": item.indent,
        "is_total": item.is_total,
        "is_header": item.kind == "header",
        "period_amount": float(period),
        "year_amount": float(year_amt),
        "amount": float(period),
    }


def build_cash_flow_rows(
    *,
    cf_period_by_code: Dict[str, Decimal],
    cf_year_by_code: Dict[str, Decimal],
    cash_opening: Dict[str, Decimal],
    cash_ending: Dict[str, Decimal],
) -> List[Dict[str, Any]]:
    line_values: Dict[str, Dict[str, Decimal]] = {}

    def _cf_amount(codes: Sequence[str]) -> Dict[str, Decimal]:
        period = Decimal("0")
        year_amt = Decimal("0")
        for code in codes:
            period += cf_period_by_code.get(code, Decimal("0"))
            year_amt += cf_year_by_code.get(code, Decimal("0"))
        return {"period": period, "year": year_amt}

    for item in CASH_FLOW_TEMPLATE:
        if item.kind == "cf_item":
            line_values[item.line_key] = _cf_amount(item.cf_item_codes)

    line_values["cf_21"] = cash_opening

    def _val(key: str) -> Dict[str, Decimal]:
        return line_values.get(key, {"period": Decimal("0"), "year": Decimal("0")})

    line_values["cf_07"] = _sum_pairs(
        _val("cf_01"),
        _val("cf_02"),
        _val("cf_03"),
        _val("cf_04"),
        _val("cf_05"),
        _val("cf_06"),
    )
    line_values["cf_13"] = _sum_pairs(
        _val("cf_08"),
        _val("cf_09"),
        _val("cf_10"),
        _val("cf_11"),
        _val("cf_12"),
    )
    line_values["cf_19"] = _sum_pairs(
        _val("cf_14"),
        _val("cf_15"),
        _val("cf_16"),
        _val("cf_17"),
        _val("cf_18"),
    )
    line_values["cf_20"] = _sum_pairs(_val("cf_07"), _val("cf_13"), _val("cf_19"))
    line_values["cf_22"] = _pair_add(_val("cf_20"), _val("cf_21"))
    # 若科目期末余额有值，期末现金行与科目对齐
    if cash_ending["period"] != 0 or cash_ending["year"] != 0:
        line_values["cf_22"] = cash_ending

    rows: List[Dict[str, Any]] = []
    for item in CASH_FLOW_TEMPLATE:
        if item.kind == "header":
            rows.append(_to_row(item, {"period": Decimal("0"), "year": Decimal("0")}))
        else:
            rows.append(_to_row(item, _val(item.line_key)))
    return rows
