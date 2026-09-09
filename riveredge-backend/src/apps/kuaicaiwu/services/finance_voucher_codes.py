"""
快财务收付款单据编码分配。

禁止再使用 Receipt/Payment.filter().count()+1 拼号：多租户全局唯一、软删、并发都会撞号。
真源：编码规则 RECEIPT_CODE / PAYMENT_CODE（及退款规则），经 CodeGenerationService 占号。
"""

from __future__ import annotations

from apps.common.base_service import AppBaseService
from core.services.business.code_rule_service import CodeRuleService
from core.services.default.default_values_service import DefaultValuesService
from core.utils.timezone_utils import today_site_str

_RECEIPT_PAGE = "kuaicaiwu-finance-receipt"
_PAYMENT_PAGE = "kuaicaiwu-finance-payment"
_RECEIPT_REFUND_PAGE = "kuaicaiwu-finance-receipt-refund"
_PAYMENT_REFUND_PAGE = "kuaicaiwu-finance-payment-refund"

RECEIPT_RULE = "RECEIPT_CODE"
PAYMENT_RULE = "PAYMENT_CODE"
RECEIPT_REFUND_RULE = "RECEIPT_REFUND_CODE"
PAYMENT_REFUND_RULE = "PAYMENT_REFUND_CODE"


async def _ensure_rule(tenant_id: int, rule_code: str, page_code: str) -> None:
    rule, _ = await CodeRuleService.resolve_rule_by_code(
        tenant_id, rule_code, active_only=True
    )
    if rule:
        return
    await DefaultValuesService.restore_preset_for_page(tenant_id, page_code)


async def allocate_receipt_code(tenant_id: int) -> str:
    """普通收款单号（SK + YYYYMMDD + 序号）。"""
    await _ensure_rule(tenant_id, RECEIPT_RULE, _RECEIPT_PAGE)
    today = today_site_str()
    return await AppBaseService().generate_code(
        tenant_id, RECEIPT_RULE, prefix=f"SK{today}"
    )


async def allocate_receipt_refund_code(tenant_id: int) -> str:
    """收款退款单号（TK + YYYYMMDD + 序号）。"""
    await _ensure_rule(tenant_id, RECEIPT_REFUND_RULE, _RECEIPT_REFUND_PAGE)
    today = today_site_str()
    return await AppBaseService().generate_code(
        tenant_id, RECEIPT_REFUND_RULE, prefix=f"TK{today}"
    )


async def allocate_payment_code(tenant_id: int) -> str:
    """普通付款单号（PK + YYYYMMDD + 序号）。"""
    await _ensure_rule(tenant_id, PAYMENT_RULE, _PAYMENT_PAGE)
    today = today_site_str()
    return await AppBaseService().generate_code(
        tenant_id, PAYMENT_RULE, prefix=f"PK{today}"
    )


async def allocate_payment_refund_code(tenant_id: int) -> str:
    """付款退款单号（TP + YYYYMMDD + 序号）。"""
    await _ensure_rule(tenant_id, PAYMENT_REFUND_RULE, _PAYMENT_REFUND_PAGE)
    today = today_site_str()
    return await AppBaseService().generate_code(
        tenant_id, PAYMENT_REFUND_RULE, prefix=f"TP{today}"
    )
