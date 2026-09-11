"""
销售/采购退货 → 可退款收/付款单解析（唯一真源）。

按退货关联的出库/入库/订单 → 应收应付/预收预付 → 已确认且可退余额的收/付款单，
供前端跳转收款退款/付款退款取单。
"""

from __future__ import annotations

from typing import Any, Dict, List, Set

from tortoise.expressions import Q

from apps.kuaicaiwu.constants.finance_source_types import (
    PAYABLE_SOURCE_PURCHASE_INVOICE,
    PAYABLE_SOURCE_PURCHASE_RECEIPT,
    RECEIVABLE_SOURCE_SALES_DELIVERY,
    RECEIVABLE_SOURCE_SALES_INVOICE,
)
from apps.kuaicaiwu.models.payable import Payable
from apps.kuaicaiwu.models.payment import Payment
from apps.kuaicaiwu.models.purchase_invoice import PurchaseInvoice
from apps.kuaicaiwu.models.receipt import Receipt
from apps.kuaicaiwu.models.receivable import Receivable
from apps.kuaicaiwu.models.settlement import SettlementRecord
from apps.kuaicaiwu.services.finance_refund_utils import quantize_money
from apps.kuaicaiwu.services.payment_refund_service import PaymentRefundService
from apps.kuaicaiwu.services.receipt_refund_service import ReceiptRefundService
from apps.kuaizhizao.models.document_relation import DocumentRelation
from apps.kuaizhizao.models.purchase_receipt import PurchaseReceipt
from apps.kuaizhizao.models.purchase_receipt_item import PurchaseReceiptItem
from apps.kuaizhizao.models.purchase_return import PurchaseReturn
from apps.kuaizhizao.models.purchase_return_item import PurchaseReturnItem
from apps.kuaizhizao.models.sales_delivery import SalesDelivery
from apps.kuaizhizao.models.sales_delivery_item import SalesDeliveryItem
from apps.kuaizhizao.models.sales_return import SalesReturn
from apps.kuaizhizao.models.sales_return_item import SalesReturnItem
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError

_RETURNED_STATUSES = frozenset({"已退货", "completed", "已完成", "RETURNED"})

_SALES_DELIVERY_REL_TYPES = frozenset({"sales_delivery", "销售出库"})
_SALES_ORDER_REL_TYPES = frozenset({"sales_order", "销售订单"})
_SALES_INVOICE_REL_TYPES = frozenset({"sales_invoice", "SalesInvoice", "销售发票"})
_SALES_RETURN_REL_TYPES = frozenset({"sales_return", "销售退货"})

_PURCHASE_RECEIPT_REL_TYPES = frozenset({"purchase_receipt", "采购入库"})
_PURCHASE_ORDER_REL_TYPES = frozenset({"purchase_order", "采购订单"})
_PURCHASE_INVOICE_REL_TYPES = frozenset({"purchase_invoice", "PurchaseInvoice", "采购发票"})
_PURCHASE_RETURN_REL_TYPES = frozenset({"purchase_return", "采购退货"})


def _norm_status(value: Any) -> str:
    return str(value or "").strip()


def _is_returned(status: Any) -> bool:
    return _norm_status(status) in _RETURNED_STATUSES


def _add_positive_ids(target: Set[int], *raw_ids: Any) -> None:
    for raw in raw_ids:
        if raw is None:
            continue
        try:
            sid = int(raw)
        except (TypeError, ValueError):
            continue
        if sid > 0:
            target.add(sid)


async def _expand_sales_deliveries_for_orders(
    tenant_id: int,
    order_ids: Set[int],
    delivery_ids: Set[int],
) -> None:
    """退货仅挂销售订单时，补齐该订单下出库单，才能定位按出库生成的应收/收款。"""
    if not order_ids:
        return
    rows = await SalesDelivery.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        sales_order_id__in=list(order_ids),
    ).values_list("id", flat=True)
    _add_positive_ids(delivery_ids, *rows)


async def _expand_purchase_receipts_for_orders(
    tenant_id: int,
    order_ids: Set[int],
    receipt_ids: Set[int],
) -> None:
    """退货仅挂采购订单时，补齐该订单下入库单，才能定位按入库生成的应付/付款。"""
    if not order_ids:
        return
    rows = await PurchaseReceipt.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        purchase_order_id__in=list(order_ids),
    ).values_list("id", flat=True)
    _add_positive_ids(receipt_ids, *rows)


async def _expand_purchase_invoice_ids_for_orders(
    tenant_id: int,
    order_ids: Set[int],
    invoice_ids: Set[int],
) -> None:
    """应付常由采购发票生成；按订单直查进项发票，避免仅有订单关联时断链。"""
    if not order_ids:
        return
    rows = await PurchaseInvoice.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        purchase_order_id__in=list(order_ids),
    ).values_list("id", flat=True)
    _add_positive_ids(invoice_ids, *rows)


class ReturnRefundBridgeService:
    async def resolve_receipts_for_sales_return(
        self,
        tenant_id: int,
        sales_return_id: int,
    ) -> Dict[str, Any]:
        ret = await SalesReturn.get_or_none(
            tenant_id=tenant_id,
            id=sales_return_id,
            deleted_at__isnull=True,
        )
        if not ret:
            raise NotFoundError(f"销售退货单不存在: {sales_return_id}")
        if not _is_returned(ret.status):
            raise BusinessLogicError("仅已完成的销售退货单可发起退款")

        delivery_ids: Set[int] = set()
        order_ids: Set[int] = set()
        _add_positive_ids(delivery_ids, ret.sales_delivery_id)
        _add_positive_ids(order_ids, ret.sales_order_id)

        inbound_rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type__in=list(_SALES_RETURN_REL_TYPES),
            target_id=sales_return_id,
        ).all()
        for rel in inbound_rels:
            st = str(rel.source_type or "").strip()
            if st in _SALES_DELIVERY_REL_TYPES:
                _add_positive_ids(delivery_ids, rel.source_id)
            elif st in _SALES_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        items = await SalesReturnItem.filter(
            tenant_id=tenant_id,
            return_id=sales_return_id,
        ).all()
        delivery_item_ids = {
            int(it.sales_delivery_item_id)
            for it in items
            if it.sales_delivery_item_id
        }
        if delivery_item_ids:
            delivery_rows = await SalesDeliveryItem.filter(
                tenant_id=tenant_id,
                id__in=list(delivery_item_ids),
            ).all()
            for row in delivery_rows:
                _add_positive_ids(delivery_ids, row.delivery_id)

        await _expand_sales_deliveries_for_orders(tenant_id, order_ids, delivery_ids)

        if not delivery_ids and not order_ids:
            raise BusinessLogicError("退货单未关联销售出库或销售订单，无法定位对应收款单")

        receipt_ids = await self._collect_receipt_ids_for_sources(
            tenant_id,
            delivery_ids=delivery_ids,
            order_ids=order_ids,
        )
        if not receipt_ids:
            raise BusinessLogicError(
                "关联业务单据尚无已确认且可退余额的收款单，请先完成收款后再退款"
            )

        customer_id = int(ret.customer_id or 0)
        refund_svc = ReceiptRefundService()
        reserved_map = await refund_svc._sum_reserved_refund_by_source(
            tenant_id, list(receipt_ids)
        )
        receipts = await Receipt.filter(
            tenant_id=tenant_id,
            id__in=list(receipt_ids),
            deleted_at__isnull=True,
        ).all()
        receipt_map = {int(r.id): r for r in receipts}

        eligible_ids: List[int] = []
        codes: List[str] = []
        for rid in sorted(receipt_ids):
            receipt = receipt_map.get(rid)
            if not receipt:
                continue
            if customer_id > 0 and int(receipt.customer_id or 0) != customer_id:
                continue
            if not refund_svc._source_allowed(receipt):
                continue
            item = await refund_svc._build_preview_item(
                tenant_id,
                receipt,
                reserved_refund=reserved_map.get(rid),
            )
            if quantize_money(item["max_push_quantity"]) <= 0:
                continue
            eligible_ids.append(rid)
            codes.append(str(receipt.receipt_code or rid))

        if not eligible_ids:
            raise BusinessLogicError(
                "关联业务单据尚无已确认且可退余额的收款单，请先完成收款后再退款"
            )

        return {
            "sales_return_id": sales_return_id,
            "sales_return_code": str(ret.return_code or ""),
            "customer_id": customer_id or None,
            "customer_name": str(ret.customer_name or ""),
            "source_ids": eligible_ids,
            "source_codes": codes,
        }

    async def resolve_payments_for_purchase_return(
        self,
        tenant_id: int,
        purchase_return_id: int,
    ) -> Dict[str, Any]:
        ret = await PurchaseReturn.get_or_none(
            tenant_id=tenant_id,
            id=purchase_return_id,
            deleted_at__isnull=True,
        )
        if not ret:
            raise NotFoundError(f"采购退货单不存在: {purchase_return_id}")
        if not _is_returned(ret.status):
            raise BusinessLogicError("仅已完成的采购退货单可发起退款")

        receipt_ids: Set[int] = set()
        order_ids: Set[int] = set()
        _add_positive_ids(receipt_ids, ret.purchase_receipt_id)
        _add_positive_ids(order_ids, ret.purchase_order_id)

        inbound_rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type__in=list(_PURCHASE_RETURN_REL_TYPES),
            target_id=purchase_return_id,
        ).all()
        for rel in inbound_rels:
            st = str(rel.source_type or "").strip()
            if st in _PURCHASE_RECEIPT_REL_TYPES:
                _add_positive_ids(receipt_ids, rel.source_id)
            elif st in _PURCHASE_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        items = await PurchaseReturnItem.filter(
            tenant_id=tenant_id,
            return_id=purchase_return_id,
        ).all()
        receipt_item_ids = {
            int(it.purchase_receipt_item_id)
            for it in items
            if getattr(it, "purchase_receipt_item_id", None)
        }
        if receipt_item_ids:
            receipt_rows = await PurchaseReceiptItem.filter(
                tenant_id=tenant_id,
                id__in=list(receipt_item_ids),
            ).all()
            for row in receipt_rows:
                _add_positive_ids(receipt_ids, row.receipt_id)

        await _expand_purchase_receipts_for_orders(tenant_id, order_ids, receipt_ids)

        if not receipt_ids and not order_ids:
            raise BusinessLogicError("退货单未关联采购入库或采购订单，无法定位对应付款单")

        payment_ids = await self._collect_payment_ids_for_sources(
            tenant_id,
            purchase_receipt_ids=receipt_ids,
            order_ids=order_ids,
        )
        if not payment_ids:
            raise BusinessLogicError(
                "关联业务单据尚无已确认且可退余额的付款单，请先完成付款后再退款"
            )

        supplier_id = int(ret.supplier_id or 0)
        refund_svc = PaymentRefundService()
        reserved_map = await refund_svc._sum_reserved_refund_by_source(
            tenant_id, list(payment_ids)
        )
        payments = await Payment.filter(
            tenant_id=tenant_id,
            id__in=list(payment_ids),
            deleted_at__isnull=True,
        ).all()
        payment_map = {int(p.id): p for p in payments}

        eligible_ids: List[int] = []
        codes: List[str] = []
        for pid in sorted(payment_ids):
            payment = payment_map.get(pid)
            if not payment:
                continue
            if supplier_id > 0 and int(payment.supplier_id or 0) != supplier_id:
                continue
            if not refund_svc._source_allowed(payment):
                continue
            item = await refund_svc._build_preview_item(
                tenant_id,
                payment,
                reserved_refund=reserved_map.get(pid),
            )
            if quantize_money(item["max_push_quantity"]) <= 0:
                continue
            eligible_ids.append(pid)
            codes.append(str(payment.payment_code or pid))

        if not eligible_ids:
            raise BusinessLogicError(
                "关联业务单据尚无已确认且可退余额的付款单，请先完成付款后再退款"
            )

        return {
            "purchase_return_id": purchase_return_id,
            "purchase_return_code": str(ret.return_code or ""),
            "supplier_id": supplier_id or None,
            "supplier_name": str(ret.supplier_name or ""),
            "source_ids": eligible_ids,
            "source_codes": codes,
        }

    async def _collect_receipt_ids_for_sources(
        self,
        tenant_id: int,
        *,
        delivery_ids: Set[int],
        order_ids: Set[int],
    ) -> Set[int]:
        receipt_ids: Set[int] = set()
        receivable_ids: Set[int] = set()
        invoice_ids: Set[int] = set()

        source_q = Q()
        if delivery_ids:
            source_q |= Q(
                source_type__in=list(_SALES_DELIVERY_REL_TYPES),
                source_id__in=list(delivery_ids),
            )
        if order_ids:
            source_q |= Q(
                source_type__in=list(_SALES_ORDER_REL_TYPES),
                source_id__in=list(order_ids),
            )
        if source_q:
            for rel in await DocumentRelation.filter(tenant_id=tenant_id).filter(source_q).all():
                tt = str(rel.target_type or "").strip()
                if tt == "receipt":
                    _add_positive_ids(receipt_ids, rel.target_id)
                elif tt == "receivable":
                    _add_positive_ids(receivable_ids, rel.target_id)
                elif tt in _SALES_INVOICE_REL_TYPES:
                    _add_positive_ids(invoice_ids, rel.target_id)

        recv_q = Q()
        if delivery_ids:
            recv_q |= Q(
                source_type=RECEIVABLE_SOURCE_SALES_DELIVERY,
                source_id__in=list(delivery_ids),
            )
        if order_ids:
            recv_q |= Q(source_type__in=["销售订单", "sales_order"], source_id__in=list(order_ids))
        if recv_q:
            for row in await Receivable.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
            ).filter(recv_q).all():
                _add_positive_ids(receivable_ids, row.id)

        if invoice_ids:
            for rel in await DocumentRelation.filter(
                tenant_id=tenant_id,
                source_type__in=list(_SALES_INVOICE_REL_TYPES),
                source_id__in=list(invoice_ids),
                target_type="receivable",
            ).all():
                _add_positive_ids(receivable_ids, rel.target_id)
            for row in await Receivable.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                source_type=RECEIVABLE_SOURCE_SALES_INVOICE,
                source_id__in=list(invoice_ids),
            ).all():
                _add_positive_ids(receivable_ids, row.id)

        if receivable_ids:
            for rel in await DocumentRelation.filter(
                tenant_id=tenant_id,
                source_type="receivable",
                source_id__in=list(receivable_ids),
                target_type="receipt",
            ).all():
                _add_positive_ids(receipt_ids, rel.target_id)
            for st in await SettlementRecord.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                is_active=True,
                debit_doc_type="Receivable",
                debit_doc_id__in=list(receivable_ids),
                credit_doc_type="Receipt",
            ).all():
                _add_positive_ids(receipt_ids, st.credit_doc_id)

        return receipt_ids

    async def _collect_payment_ids_for_sources(
        self,
        tenant_id: int,
        *,
        purchase_receipt_ids: Set[int],
        order_ids: Set[int],
    ) -> Set[int]:
        payment_ids: Set[int] = set()
        payable_ids: Set[int] = set()
        invoice_ids: Set[int] = set()

        source_q = Q()
        if purchase_receipt_ids:
            source_q |= Q(
                source_type__in=list(_PURCHASE_RECEIPT_REL_TYPES),
                source_id__in=list(purchase_receipt_ids),
            )
        if order_ids:
            source_q |= Q(
                source_type__in=list(_PURCHASE_ORDER_REL_TYPES),
                source_id__in=list(order_ids),
            )
        if source_q:
            for rel in await DocumentRelation.filter(tenant_id=tenant_id).filter(source_q).all():
                tt = str(rel.target_type or "").strip()
                if tt == "payment":
                    _add_positive_ids(payment_ids, rel.target_id)
                elif tt == "payable":
                    _add_positive_ids(payable_ids, rel.target_id)
                elif tt in _PURCHASE_INVOICE_REL_TYPES:
                    _add_positive_ids(invoice_ids, rel.target_id)

        await _expand_purchase_invoice_ids_for_orders(tenant_id, order_ids, invoice_ids)

        pay_q = Q()
        if purchase_receipt_ids:
            pay_q |= Q(
                source_type=PAYABLE_SOURCE_PURCHASE_RECEIPT,
                source_id__in=list(purchase_receipt_ids),
            )
        if order_ids:
            pay_q |= Q(source_type__in=["采购订单", "purchase_order"], source_id__in=list(order_ids))
        if pay_q:
            for row in await Payable.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
            ).filter(pay_q).all():
                _add_positive_ids(payable_ids, row.id)

        if invoice_ids:
            for rel in await DocumentRelation.filter(
                tenant_id=tenant_id,
                source_type__in=list(_PURCHASE_INVOICE_REL_TYPES),
                source_id__in=list(invoice_ids),
                target_type="payable",
            ).all():
                _add_positive_ids(payable_ids, rel.target_id)
            for row in await Payable.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                source_type=PAYABLE_SOURCE_PURCHASE_INVOICE,
                source_id__in=list(invoice_ids),
            ).all():
                _add_positive_ids(payable_ids, row.id)

        if payable_ids:
            for rel in await DocumentRelation.filter(
                tenant_id=tenant_id,
                source_type="payable",
                source_id__in=list(payable_ids),
                target_type="payment",
            ).all():
                _add_positive_ids(payment_ids, rel.target_id)
            for st in await SettlementRecord.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                is_active=True,
                debit_doc_type="Payable",
                debit_doc_id__in=list(payable_ids),
                credit_doc_type="Payment",
            ).all():
                _add_positive_ids(payment_ids, st.credit_doc_id)

        return payment_ids
