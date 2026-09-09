"""发票税额：后端统一按未税金额 × 税率计算。"""

from __future__ import annotations

from decimal import Decimal

_MONEY_SCALE = Decimal("0.01")


def quantize_money(value: Decimal | str | int | float) -> Decimal:
    return Decimal(str(value)).quantize(_MONEY_SCALE)


def money_exceeds_max(total_incl: Decimal, max_total_incl: Decimal) -> bool:
    """价税合计是否超过可开票上限（两侧先量化到分）。"""
    return quantize_money(total_incl) > quantize_money(max_total_incl)


def money_to_json_float(value: Decimal) -> float:
    """分位金额序列化为 JSON number，经 str 避免二进制浮点毛刺。"""
    return float(str(quantize_money(value)))


def compute_tax_from_excluding(
    amount_excl: Decimal,
    tax_rate_percent: Decimal,
) -> tuple[Decimal, Decimal, Decimal]:
    """
    按未税金额与税率（百分比 0–100）计算税额与价税合计。

    销项发票 API 入参 tax_rate 为百分比；进项发票 PurchaseInvoice.tax_rate 同为百分比。
    销项落库 Invoice.tax_rate 为小数（API 层除以 100），本函数仅处理百分比口径。
    """
    excl = quantize_money(amount_excl)
    rate = Decimal(tax_rate_percent) / Decimal("100")
    tax = (excl * rate).quantize(_MONEY_SCALE)
    total = (excl + tax).quantize(_MONEY_SCALE)
    return excl, tax, total


def compute_tax_from_including(
    amount_incl: Decimal,
    tax_rate_percent: Decimal,
) -> tuple[Decimal, Decimal, Decimal]:
    """按价税合计与税率（百分比 0–100）反算未税金额与税额。"""
    total = quantize_money(amount_incl)
    factor = Decimal("1") + Decimal(tax_rate_percent) / Decimal("100")
    excl = (total / factor).quantize(_MONEY_SCALE)
    tax = (total - excl).quantize(_MONEY_SCALE)
    return excl, tax, total


def resolve_invoice_amounts_for_create(
    invoice_amount: Decimal,
    tax_rate_percent: Decimal,
    total_amount: Decimal | None = None,
) -> tuple[Decimal, Decimal, Decimal]:
    """
    开票价税拆分。

    含税录入时客户端显式传入价税合计，以合计为真源反算未税/税额，避免
    「先除税率再乘税率」产生 0.01 漂移（如 60000/1.13→53097.35→60000.01）。
    不含税录入时按未税金额正算。
    """
    if total_amount is not None:
        return compute_tax_from_including(total_amount, tax_rate_percent)
    return compute_tax_from_excluding(invoice_amount, tax_rate_percent)
