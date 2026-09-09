"""
收/付款单纠错门禁与过账回滚（唯一真源）。

无退款的已确认单：可作废 / 撤回确认 / 删除；须先冲回往来核销与银行流水。
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Literal, Optional

from infra.exceptions.exceptions import BusinessLogicError, ValidationError
from core.utils.timezone_utils import now_utc

VoucherKind = Literal["receipt", "payment"]


def quantize_money(value: Any) -> Decimal:
    return Decimal(str(value or 0)).quantize(Decimal("0.01"))


def assert_voucher_correction_allowed(voucher: Any, *, action: str) -> None:
    """
    action: cancel | unconfirm | delete | update
    """
    status = str(getattr(voucher, "status", "") or "").strip()
    settlement_type = str(getattr(voucher, "settlement_type", "") or "normal").strip() or "normal"
    refunded = quantize_money(getattr(voucher, "refunded_amount", 0))
    refund_exec = str(getattr(voucher, "refund_execution_status", "") or "").strip()

    if settlement_type == "refund":
        if action == "update" and status == "Draft":
            return
        if action == "delete" and status in ("Draft", "Cancelled"):
            return
        raise BusinessLogicError("退款单请在收款退款/付款退款菜单处理，不可按普通收付款纠错")

    if refunded > 0 or refund_exec in ("部分退款", "全部退款"):
        raise BusinessLogicError("已有退款记录，不可直接纠错；请先处理退款单据")

    if action == "update":
        if status != "Draft":
            raise BusinessLogicError("仅草稿状态可修改；已确认请先撤回确认")
        return

    if action == "unconfirm":
        if status != "Confirmed":
            raise BusinessLogicError("仅已确认单据可撤回确认")
        return

    if action == "cancel":
        if status == "Cancelled":
            raise BusinessLogicError("单据已作废")
        if status not in ("Draft", "Confirmed"):
            raise BusinessLogicError("当前状态不可作废")
        return

    if action == "delete":
        if status in ("Draft", "Cancelled", "Confirmed"):
            return
        raise BusinessLogicError("当前状态不可删除")

    raise ValueError(f"unknown voucher correction action: {action}")


async def unwind_voucher_settlements(
    tenant_id: int,
    *,
    voucher_type: VoucherKind,
    voucher_id: int,
    operator_id: Optional[int] = None,
) -> None:
    """冲回收/付款单关联的往来核销，并重置单据已核销/待核销金额。"""
    from apps.kuaicaiwu.models.payment import Payment
    from apps.kuaicaiwu.models.payable import Payable
    from apps.kuaicaiwu.models.receipt import Receipt
    from apps.kuaicaiwu.models.receivable import Receivable
    from apps.common.audit_actor import operator_name_from_user
    from apps.kuaicaiwu.models.settlement import SettlementRecord
    from infra.models.user import User

    user_name = ""
    if operator_id:
        user = await User.filter(id=operator_id).first()
        if user:
            user_name = operator_name_from_user(user)

    if voucher_type == "receipt":
        voucher = await Receipt.get_or_none(
            tenant_id=tenant_id, id=voucher_id, deleted_at__isnull=True
        )
        if not voucher:
            raise ValidationError(f"收款单不存在: {voucher_id}")
        settlements = await SettlementRecord.filter(
            tenant_id=tenant_id,
            credit_doc_type="Receipt",
            credit_doc_id=voucher_id,
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        for settlement in settlements:
            amount = quantize_money(settlement.amount)
            if amount <= 0:
                continue
            if str(settlement.debit_doc_type or "") != "Receivable":
                raise BusinessLogicError(
                    f"收款单存在非应收核销记录（{settlement.debit_doc_type}），无法自动纠错"
                )
            receivable = await Receivable.get_or_none(
                tenant_id=tenant_id, id=int(settlement.debit_doc_id)
            )
            if not receivable:
                raise BusinessLogicError(f"核销关联应收单不存在: {settlement.debit_doc_id}")
            new_received = quantize_money(receivable.received_amount) - amount
            if new_received < 0:
                new_received = Decimal("0.00")
            from apps.kuaicaiwu.services.finance_refund_utils import (
                compute_open_balance_after_refund,
                resolve_ar_status_after_amounts,
            )

            refunded = quantize_money(getattr(receivable, "refunded_amount", 0) or 0)
            new_remaining = compute_open_balance_after_refund(
                receivable.total_amount,
                new_received,
                refunded,
            )
            net_received = quantize_money(new_received - refunded)
            if net_received < Decimal("0.00"):
                net_received = Decimal("0.00")
            ar_status = resolve_ar_status_after_amounts(
                total_amount=receivable.total_amount,
                received_amount=net_received,
                remaining_amount=new_remaining,
            )
            await Receivable.filter(tenant_id=tenant_id, id=receivable.id).update(
                received_amount=new_received,
                remaining_amount=new_remaining,
                status=ar_status,
                updated_by=operator_id,
                updated_by_name=user_name or None,
            )
            settlement.is_active = False
            settlement.deleted_at = now_utc()
            await settlement.save()

        total = quantize_money(voucher.total_amount)
        await Receipt.filter(tenant_id=tenant_id, id=voucher_id).update(
            settled_amount=Decimal("0.00"),
            unsettled_amount=total,
            updated_by=operator_id,
            updated_by_name=user_name or None,
        )
        return

    voucher = await Payment.get_or_none(
        tenant_id=tenant_id, id=voucher_id, deleted_at__isnull=True
    )
    if not voucher:
        raise ValidationError(f"付款单不存在: {voucher_id}")
    settlements = await SettlementRecord.filter(
        tenant_id=tenant_id,
        credit_doc_type="Payment",
        credit_doc_id=voucher_id,
        is_active=True,
        deleted_at__isnull=True,
    ).all()
    for settlement in settlements:
        amount = quantize_money(settlement.amount)
        if amount <= 0:
            continue
        if str(settlement.debit_doc_type or "") != "Payable":
            raise BusinessLogicError(
                f"付款单存在非应付核销记录（{settlement.debit_doc_type}），无法自动纠错"
            )
        payable = await Payable.get_or_none(
            tenant_id=tenant_id, id=int(settlement.debit_doc_id)
        )
        if not payable:
            raise BusinessLogicError(f"核销关联应付单不存在: {settlement.debit_doc_id}")
            new_paid = quantize_money(payable.paid_amount) - amount
            if new_paid < 0:
                new_paid = Decimal("0.00")
            from apps.kuaicaiwu.services.finance_refund_utils import (
                compute_open_balance_after_refund,
                resolve_ap_status_after_amounts,
            )

            refunded = quantize_money(getattr(payable, "refunded_amount", 0) or 0)
            new_remaining = compute_open_balance_after_refund(
                payable.total_amount,
                new_paid,
                refunded,
            )
            net_paid = quantize_money(new_paid - refunded)
            if net_paid < Decimal("0.00"):
                net_paid = Decimal("0.00")
            ap_status = resolve_ap_status_after_amounts(
                total_amount=payable.total_amount,
                paid_amount=net_paid,
                remaining_amount=new_remaining,
            )
            await Payable.filter(tenant_id=tenant_id, id=payable.id).update(
                paid_amount=new_paid,
                remaining_amount=new_remaining,
                status=ap_status,
                updated_by=operator_id,
                updated_by_name=user_name or None,
            )
        settlement.is_active = False
        settlement.deleted_at = now_utc()
        await settlement.save()

    total = quantize_money(voucher.total_amount)
    await Payment.filter(tenant_id=tenant_id, id=voucher_id).update(
        settled_amount=Decimal("0.00"),
        unsettled_amount=total,
        updated_by=operator_id,
        updated_by_name=user_name or None,
    )


async def reverse_voucher_bank_if_needed(
    tenant_id: int,
    *,
    voucher_type: VoucherKind,
    voucher_id: int,
    operator_id: Optional[int] = None,
) -> None:
    from apps.kuaicaiwu.services.bank_account_service import BankAccountService

    await BankAccountService().reverse_from_voucher(
        tenant_id,
        voucher_type=voucher_type,
        voucher_id=voucher_id,
        operator_id=operator_id,
    )


async def apply_confirmed_voucher_unpost(
    tenant_id: int,
    *,
    voucher_type: VoucherKind,
    voucher_id: int,
    operator_id: Optional[int] = None,
) -> None:
    """已确认单据纠错前：冲回核销 + 冲回银行流水。"""
    await unwind_voucher_settlements(
        tenant_id,
        voucher_type=voucher_type,
        voucher_id=voucher_id,
        operator_id=operator_id,
    )
    await reverse_voucher_bank_if_needed(
        tenant_id,
        voucher_type=voucher_type,
        voucher_id=voucher_id,
        operator_id=operator_id,
    )
