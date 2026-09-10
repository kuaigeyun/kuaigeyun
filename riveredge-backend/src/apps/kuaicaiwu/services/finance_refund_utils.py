"""收/付款退款执行态计算（写路径唯一真源）。"""

from __future__ import annotations

import json
from decimal import Decimal
from typing import List, Optional, Sequence, Tuple

REFUND_STATUS_NONE = "未退款"
REFUND_STATUS_PARTIAL = "部分退款"
REFUND_STATUS_FULL = "全部退款"

# 退货未付款冲减核销贷方类型（SettlementRecord.credit_doc_type）
SETTLEMENT_CREDIT_SALES_RETURN_OFFSET = "SalesReturnOffset"
SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET = "PurchaseReturnOffset"

_MONEY = Decimal("0.01")
_ALLOC_KEY = "allocated_amount"


def quantize_money(value: Decimal | float | str) -> Decimal:
    return Decimal(str(value or 0)).quantize(_MONEY)


def compute_refund_execution_status(total_amount: Decimal, refunded_amount: Decimal) -> str:
    total = quantize_money(total_amount)
    refunded = quantize_money(refunded_amount)
    if refunded <= Decimal("0"):
        return REFUND_STATUS_NONE
    if refunded >= total:
        return REFUND_STATUS_FULL
    return REFUND_STATUS_PARTIAL


def compute_refundable_balance(
    total_amount: Decimal,
    refunded_amount: Decimal,
    reserved_refund_amount: Decimal = Decimal("0"),
) -> Decimal:
    total = quantize_money(total_amount)
    refunded = quantize_money(refunded_amount)
    reserved = quantize_money(reserved_refund_amount)
    return max(Decimal("0"), total - refunded - reserved)


def compute_open_balance_after_refund(
    total_amount: Decimal,
    collected_amount: Decimal,
    refunded_amount: Decimal,
    goods_offset_amount: Decimal = Decimal("0"),
) -> Decimal:
    """
    往来未结清余额：有效总额 - 净已收/已付。
    有效总额 = 总额 - 退货未付款冲减（货物退回抵减，非现金退款）。
    净已收/已付 = 已收(付)合计 - 已确认现金退款冲回合计。
    现金退款须加回剩余应收/应付；退货冲减须从可收/可付中扣减。
    """
    total = quantize_money(total_amount)
    collected = quantize_money(collected_amount)
    refunded = quantize_money(refunded_amount)
    goods_offset = quantize_money(goods_offset_amount)
    if goods_offset < Decimal("0"):
        goods_offset = Decimal("0")
    if goods_offset > total:
        goods_offset = total
    effective_total = quantize_money(total - goods_offset)
    net_collected = collected - refunded
    if net_collected < Decimal("0"):
        net_collected = Decimal("0")
    remaining = effective_total - net_collected
    if remaining < Decimal("0"):
        return Decimal("0.00")
    if remaining > effective_total:
        return effective_total
    return remaining


def resolve_ar_status_after_amounts(
    *,
    total_amount: Decimal,
    received_amount: Decimal,
    remaining_amount: Decimal,
) -> str:
    received = quantize_money(received_amount)
    remaining = quantize_money(remaining_amount)
    if remaining <= Decimal("0"):
        return "已结清"
    if received <= Decimal("0"):
        return "未收款"
    return "部分收款"


def resolve_ap_status_after_amounts(
    *,
    total_amount: Decimal,
    paid_amount: Decimal,
    remaining_amount: Decimal,
) -> str:
    paid = quantize_money(paid_amount)
    remaining = quantize_money(remaining_amount)
    if remaining <= Decimal("0"):
        return "已结清"
    if paid <= Decimal("0"):
        return "未付款"
    return "部分付款"


def encode_refund_allocation_notes(amount: Decimal) -> str:
    return json.dumps({_ALLOC_KEY: str(quantize_money(amount))}, ensure_ascii=False)


def parse_refund_allocation_notes(notes: Optional[str]) -> Optional[Decimal]:
    raw = (notes or "").strip()
    if not raw:
        return None
    try:
        payload = json.loads(raw)
    except (TypeError, ValueError, json.JSONDecodeError):
        return None
    if not isinstance(payload, dict) or _ALLOC_KEY not in payload:
        return None
    return quantize_money(payload[_ALLOC_KEY])


def allocate_refund_across_sources(
    source_caps: Sequence[Tuple[int, Decimal]],
    total_amount: Decimal,
) -> List[Tuple[int, Decimal]]:
    """
    按源单顺序（调用方已排好）贪心分摊退款金额，每单不超过其可退余额。
    source_caps: [(source_id, max_refundable), ...]
    """
    total = quantize_money(total_amount)
    if total <= 0:
        raise ValueError("退款金额须大于 0")
    cap_sum = quantize_money(sum((cap for _, cap in source_caps), Decimal("0")))
    if total > cap_sum:
        raise ValueError(f"退款金额 {total} 超过可退合计 {cap_sum}")
    remaining = total
    result: List[Tuple[int, Decimal]] = []
    for source_id, cap in source_caps:
        if remaining <= 0:
            break
        chunk = min(quantize_money(cap), remaining)
        if chunk <= 0:
            continue
        result.append((int(source_id), chunk))
        remaining = quantize_money(remaining - chunk)
    if remaining > 0:
        raise ValueError("退款金额分摊失败，仍有未分配余额")
    return result
