"""
销售/采购退货确认后，冲减关联蓝字应收/应付未结余额（写路径唯一真源）。

场景：退货发生在收/付款之前时，原单「可收/可付」须扣减退货金额；
对账仍保留红字应收/应付贷方行。已全额收/付的部分不在此冲减，走现金退款。
"""

from __future__ import annotations

import json
from decimal import Decimal
from typing import Any, List, Optional, Set

from tortoise.expressions import Q
from tortoise.transactions import in_transaction

from apps.kuaicaiwu.constants.finance_source_types import (
    PAYABLE_SOURCE_PURCHASE_INVOICE,
    PAYABLE_SOURCE_PURCHASE_RECEIPT,
    RECEIVABLE_SOURCE_SALES_DELIVERY,
    RECEIVABLE_SOURCE_SALES_INVOICE,
    RECEIVABLE_SOURCE_SALES_RETURN,
    is_purchase_return_offset_payable,
    is_sales_return_offset_receivable,
)
from apps.kuaicaiwu.models.payable import Payable
from apps.kuaicaiwu.models.purchase_invoice import PurchaseInvoice
from apps.kuaicaiwu.models.receivable import Receivable
from apps.kuaicaiwu.models.settlement import SettlementRecord
from apps.kuaicaiwu.services.finance_refund_utils import (
    SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
    SETTLEMENT_CREDIT_SALES_RETURN_OFFSET,
    compute_open_balance_after_refund,
    quantize_money,
)
from apps.kuaizhizao.models.document_relation import DocumentRelation
from apps.kuaizhizao.models.purchase_receipt import PurchaseReceipt
from apps.kuaizhizao.models.purchase_receipt_item import PurchaseReceiptItem
from apps.kuaizhizao.models.purchase_return import PurchaseReturn
from apps.kuaizhizao.models.purchase_return_item import PurchaseReturnItem
from apps.kuaizhizao.models.sales_delivery import SalesDelivery
from apps.kuaizhizao.models.sales_delivery_item import SalesDeliveryItem
from apps.kuaizhizao.models.sales_return import SalesReturn
from apps.kuaizhizao.models.sales_return_item import SalesReturnItem
from core.utils.timezone_utils import now_utc, resolve_business_datetime
from infra.exceptions.exceptions import NotFoundError
from loguru import logger

_SALES_DELIVERY_REL_TYPES = frozenset({"sales_delivery", "销售出库"})
_SALES_ORDER_REL_TYPES = frozenset({"sales_order", "销售订单"})
_SALES_INVOICE_REL_TYPES = frozenset({"sales_invoice", "SalesInvoice", "销售发票"})
_SALES_RETURN_REL_TYPES = frozenset({"sales_return", "销售退货"})

_PURCHASE_RECEIPT_REL_TYPES = frozenset({"purchase_receipt", "采购入库"})
_PURCHASE_ORDER_REL_TYPES = frozenset({"purchase_order", "采购订单"})
_PURCHASE_INVOICE_REL_TYPES = frozenset({"purchase_invoice", "PurchaseInvoice", "采购发票"})
_PURCHASE_RETURN_REL_TYPES = frozenset({"purchase_return", "采购退货"})


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


async def sum_goods_offset_for_receivable(tenant_id: int, receivable_id: int) -> Decimal:
    rows = await SettlementRecord.filter(
        tenant_id=tenant_id,
        debit_doc_type="Receivable",
        debit_doc_id=int(receivable_id),
        credit_doc_type=SETTLEMENT_CREDIT_SALES_RETURN_OFFSET,
        is_active=True,
        deleted_at__isnull=True,
    ).all()
    return quantize_money(sum((quantize_money(r.amount) for r in rows), Decimal("0")))


async def sum_goods_offset_for_payable(tenant_id: int, payable_id: int) -> Decimal:
    rows = await SettlementRecord.filter(
        tenant_id=tenant_id,
        debit_doc_type="Payable",
        debit_doc_id=int(payable_id),
        credit_doc_type=SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
        is_active=True,
        deleted_at__isnull=True,
    ).all()
    return quantize_money(sum((quantize_money(r.amount) for r in rows), Decimal("0")))


class ReturnOpenBalanceOffsetService:
    async def apply_sales_return_offset(
        self,
        tenant_id: int,
        sales_return_id: int,
        *,
        operator_id: int,
        red_receivable_id: Optional[int] = None,
    ) -> Decimal:
        """确认销售退货后冲减蓝字应收未结余额；幂等。"""
        ret = await SalesReturn.get_or_none(
            tenant_id=tenant_id, id=sales_return_id, deleted_at__isnull=True
        )
        if not ret:
            raise NotFoundError(f"销售退货单不存在: {sales_return_id}")

        existing = await SettlementRecord.filter(
            tenant_id=tenant_id,
            credit_doc_type=SETTLEMENT_CREDIT_SALES_RETURN_OFFSET,
            credit_doc_id=int(sales_return_id),
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        if existing:
            applied = quantize_money(
                sum((quantize_money(r.amount) for r in existing), Decimal("0"))
            )
            # 历史可能已冲减蓝字但未生成红字冲减应收行
            if red_receivable_id is None:
                ensure_amt = applied if applied > 0 else quantize_money(ret.total_amount)
                if ensure_amt <= 0:
                    for it in await SalesReturnItem.filter(
                        tenant_id=tenant_id, return_id=int(sales_return_id)
                    ).all():
                        qty = Decimal(str(it.return_quantity or 0))
                        price = Decimal(str(it.unit_price or 0))
                        given = quantize_money(it.total_amount)
                        computed = quantize_money(qty * price)
                        chunk = computed if given <= 0 and computed > 0 else (given or computed)
                        ensure_amt = quantize_money(ensure_amt + chunk)
                await self._ensure_sales_return_red_receivable(
                    tenant_id,
                    ret,
                    return_amount=ensure_amt,
                    operator_id=operator_id,
                )
            return applied

        return_amount = quantize_money(ret.total_amount)
        if return_amount <= 0:
            # 头表金额未同步时按明细重算，避免确认后既无冲减行也不减蓝字余额
            line_items = await SalesReturnItem.filter(
                tenant_id=tenant_id, return_id=int(sales_return_id)
            ).all()
            line_sum = Decimal("0.00")
            for it in line_items:
                qty = Decimal(str(it.return_quantity or 0))
                price = Decimal(str(it.unit_price or 0))
                given = quantize_money(it.total_amount)
                computed = quantize_money(qty * price)
                line_sum = quantize_money(line_sum + (computed if given <= 0 and computed > 0 else given or computed))
            if line_sum > 0:
                return_amount = line_sum
                await SalesReturn.filter(tenant_id=tenant_id, id=int(sales_return_id)).update(
                    total_amount=return_amount,
                )
                ret.total_amount = return_amount
        if return_amount <= 0:
            return Decimal("0.00")

        if red_receivable_id is None:
            red_receivable_id = await self._ensure_sales_return_red_receivable(
                tenant_id,
                ret,
                return_amount=return_amount,
                operator_id=operator_id,
            )

        blue_ids = await self._collect_blue_receivable_ids(tenant_id, ret)
        if not blue_ids:
            logger.info(
                "销售退货 {} 未定位到蓝字应收，跳过未结冲减",
                ret.return_code or sales_return_id,
            )
            return Decimal("0.00")

        receivables = await Receivable.filter(
            tenant_id=tenant_id,
            id__in=list(blue_ids),
            deleted_at__isnull=True,
        ).order_by("id").all()
        blues = [
            r
            for r in receivables
            if not is_sales_return_offset_receivable(getattr(r, "source_type", None))
        ]
        if not blues:
            return Decimal("0.00")

        from apps.kuaicaiwu.services.finance_service import AccountSettlementService

        settlement_svc = AccountSettlementService()
        user_name = await settlement_svc.get_user_name(operator_id)
        today = resolve_business_datetime()
        remaining_to_apply = return_amount
        applied_total = Decimal("0.00")

        async with in_transaction():
            for ar in blues:
                if remaining_to_apply <= 0:
                    break
                goods_offset = await sum_goods_offset_for_receivable(tenant_id, int(ar.id))
                open_bal = compute_open_balance_after_refund(
                    ar.total_amount,
                    ar.received_amount,
                    getattr(ar, "refunded_amount", 0) or 0,
                    goods_offset,
                )
                if open_bal <= 0:
                    continue
                chunk = min(remaining_to_apply, open_bal)
                code = await settlement_svc.generate_code(
                    tenant_id, "SETTLEMENT_CODE", prefix=f"HX{today.strftime('%Y%m%d')}"
                )
                await SettlementRecord.create(
                    tenant_id=tenant_id,
                    settlement_code=code,
                    partner_id=ar.customer_id,
                    partner_name=ar.customer_name,
                    debit_doc_type="Receivable",
                    debit_doc_id=int(ar.id),
                    debit_doc_code=str(ar.receivable_code or ar.id),
                    credit_doc_type=SETTLEMENT_CREDIT_SALES_RETURN_OFFSET,
                    credit_doc_id=int(sales_return_id),
                    credit_doc_code=str(ret.return_code or sales_return_id),
                    amount=chunk,
                    currency="CNY",
                    settlement_date=today.date(),
                    operator_id=operator_id,
                    operator_name=user_name,
                    notes=json.dumps(
                        {
                            "goods_return_offset": True,
                            "sales_return_id": int(sales_return_id),
                            "red_receivable_id": red_receivable_id,
                        },
                        ensure_ascii=False,
                    ),
                )
                await settlement_svc.sync_receivable_amounts_from_settlements(
                    tenant_id,
                    int(ar.id),
                    operator_id=operator_id,
                    user_name=user_name,
                )
                remaining_to_apply = quantize_money(remaining_to_apply - chunk)
                applied_total = quantize_money(applied_total + chunk)

        if remaining_to_apply > 0:
            logger.info(
                "销售退货 {} 冲减蓝字应收后仍余 {}，超出未结部分请走收款退款",
                ret.return_code or sales_return_id,
                remaining_to_apply,
            )
        return applied_total

    async def reverse_sales_return_offset(
        self,
        tenant_id: int,
        sales_return_id: int,
        *,
        operator_id: int,
    ) -> Decimal:
        """撤回销售退货确认时，作废退货冲减核销并重算蓝字应收。"""
        rows = await SettlementRecord.filter(
            tenant_id=tenant_id,
            credit_doc_type=SETTLEMENT_CREDIT_SALES_RETURN_OFFSET,
            credit_doc_id=int(sales_return_id),
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        if not rows:
            return Decimal("0.00")

        from apps.kuaicaiwu.services.finance_service import AccountSettlementService

        settlement_svc = AccountSettlementService()
        user_name = await settlement_svc.get_user_name(operator_id)
        ar_ids = {int(r.debit_doc_id) for r in rows if r.debit_doc_id}
        reversed_total = Decimal("0.00")

        async with in_transaction():
            for row in rows:
                reversed_total = quantize_money(reversed_total + quantize_money(row.amount))
                row.is_active = False
                row.deleted_at = now_utc()
                await row.save()
            for ar_id in ar_ids:
                await settlement_svc.sync_receivable_amounts_from_settlements(
                    tenant_id,
                    ar_id,
                    operator_id=operator_id,
                    user_name=user_name,
                )
        return reversed_total

    async def apply_purchase_return_offset(
        self,
        tenant_id: int,
        purchase_return_id: int,
        *,
        operator_id: int,
        red_payable_id: Optional[int] = None,
    ) -> Decimal:
        """确认采购退货后冲减蓝字应付未结余额；幂等。"""
        ret = await PurchaseReturn.get_or_none(
            tenant_id=tenant_id, id=purchase_return_id, deleted_at__isnull=True
        )
        if not ret:
            raise NotFoundError(f"采购退货单不存在: {purchase_return_id}")

        existing = await SettlementRecord.filter(
            tenant_id=tenant_id,
            credit_doc_type=SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
            credit_doc_id=int(purchase_return_id),
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        if existing:
            return quantize_money(sum((quantize_money(r.amount) for r in existing), Decimal("0")))

        return_amount = quantize_money(ret.total_amount)
        if return_amount <= 0:
            return Decimal("0.00")

        blue_ids = await self._collect_blue_payable_ids(tenant_id, ret)
        if not blue_ids:
            logger.info(
                "采购退货 {} 未定位到蓝字应付，跳过未结冲减",
                ret.return_code or purchase_return_id,
            )
            return Decimal("0.00")

        payables = await Payable.filter(
            tenant_id=tenant_id,
            id__in=list(blue_ids),
            deleted_at__isnull=True,
        ).order_by("id").all()
        blues = [
            p
            for p in payables
            if not is_purchase_return_offset_payable(getattr(p, "source_type", None))
        ]
        if not blues:
            return Decimal("0.00")

        from apps.kuaicaiwu.services.finance_service import AccountSettlementService

        settlement_svc = AccountSettlementService()
        user_name = await settlement_svc.get_user_name(operator_id)
        today = resolve_business_datetime()
        remaining_to_apply = return_amount
        applied_total = Decimal("0.00")

        async with in_transaction():
            for ap in blues:
                if remaining_to_apply <= 0:
                    break
                goods_offset = await sum_goods_offset_for_payable(tenant_id, int(ap.id))
                open_bal = compute_open_balance_after_refund(
                    ap.total_amount,
                    ap.paid_amount,
                    getattr(ap, "refunded_amount", 0) or 0,
                    goods_offset,
                )
                if open_bal <= 0:
                    continue
                chunk = min(remaining_to_apply, open_bal)
                code = await settlement_svc.generate_code(
                    tenant_id, "SETTLEMENT_CODE", prefix=f"HX{today.strftime('%Y%m%d')}"
                )
                await SettlementRecord.create(
                    tenant_id=tenant_id,
                    settlement_code=code,
                    partner_id=ap.supplier_id,
                    partner_name=ap.supplier_name,
                    debit_doc_type="Payable",
                    debit_doc_id=int(ap.id),
                    debit_doc_code=str(ap.payable_code or ap.id),
                    credit_doc_type=SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
                    credit_doc_id=int(purchase_return_id),
                    credit_doc_code=str(ret.return_code or purchase_return_id),
                    amount=chunk,
                    currency="CNY",
                    settlement_date=today.date(),
                    operator_id=operator_id,
                    operator_name=user_name,
                    notes=json.dumps(
                        {
                            "goods_return_offset": True,
                            "purchase_return_id": int(purchase_return_id),
                            "red_payable_id": red_payable_id,
                        },
                        ensure_ascii=False,
                    ),
                )
                await settlement_svc.sync_payable_amounts_from_settlements(
                    tenant_id,
                    int(ap.id),
                    operator_id=operator_id,
                    user_name=user_name,
                )
                remaining_to_apply = quantize_money(remaining_to_apply - chunk)
                applied_total = quantize_money(applied_total + chunk)

        if remaining_to_apply > 0:
            logger.info(
                "采购退货 {} 冲减蓝字应付后仍余 {}，超出未结部分请走付款退款",
                ret.return_code or purchase_return_id,
                remaining_to_apply,
            )
        return applied_total

    async def reverse_purchase_return_offset(
        self,
        tenant_id: int,
        purchase_return_id: int,
        *,
        operator_id: int,
    ) -> Decimal:
        rows = await SettlementRecord.filter(
            tenant_id=tenant_id,
            credit_doc_type=SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
            credit_doc_id=int(purchase_return_id),
            is_active=True,
            deleted_at__isnull=True,
        ).all()
        if not rows:
            return Decimal("0.00")

        from apps.kuaicaiwu.services.finance_service import AccountSettlementService

        settlement_svc = AccountSettlementService()
        user_name = await settlement_svc.get_user_name(operator_id)
        ap_ids = {int(r.debit_doc_id) for r in rows if r.debit_doc_id}
        reversed_total = Decimal("0.00")

        async with in_transaction():
            for row in rows:
                reversed_total = quantize_money(reversed_total + quantize_money(row.amount))
                row.is_active = False
                row.deleted_at = now_utc()
                await row.save()
            for ap_id in ap_ids:
                await settlement_svc.sync_payable_amounts_from_settlements(
                    tenant_id,
                    ap_id,
                    operator_id=operator_id,
                    user_name=user_name,
                )
        return reversed_total

    async def _ensure_sales_return_red_receivable(
        self,
        tenant_id: int,
        ret: SalesReturn,
        *,
        return_amount: Decimal,
        operator_id: int,
    ) -> Optional[int]:
        """确认后若尚无红字冲减应收则补建（幂等）；供冲减写路径与历史补齐共用。"""
        existing = await Receivable.get_or_none(
            tenant_id=tenant_id,
            source_type=RECEIVABLE_SOURCE_SALES_RETURN,
            source_id=int(ret.id),
            deleted_at__isnull=True,
        )
        if existing:
            return int(existing.id)

        cust_id = int(ret.customer_id) if ret.customer_id else None
        if return_amount <= 0 or not cust_id:
            return None

        from infra.services.business_config_service import BusinessConfigService

        if not await BusinessConfigService().should_auto_generate_receivable_on_sales_return(
            tenant_id, cust_id
        ):
            return None

        from apps.kuaicaiwu.schemas.finance import ReceivableCreate
        from apps.kuaicaiwu.services.finance_due_date import resolve_partner_due_date
        from apps.kuaicaiwu.services.finance_service import ReceivableService
        from core.utils.timezone_utils import to_site_date

        try:
            receivable_service = ReceivableService()
            biz_date = to_site_date(resolve_business_datetime())
            due_date = await resolve_partner_due_date(
                tenant_id, "customer", cust_id, biz_date
            )
            amount = float(return_amount)
            receivable_data = ReceivableCreate(
                source_type=RECEIVABLE_SOURCE_SALES_RETURN,
                source_id=int(ret.id),
                source_code=ret.return_code,
                customer_id=ret.customer_id,
                customer_name=ret.customer_name,
                total_amount=amount,
                received_amount=0.0,
                remaining_amount=0.0,
                due_date=due_date,
                business_date=biz_date,
                status="已冲减",
                notes=f"销售退货冲减-由销售退货单 {ret.return_code} 自动生成",
            )
            try:
                receivable = await receivable_service.create_receivable(
                    tenant_id=tenant_id,
                    receivable_data=receivable_data,
                    created_by=operator_id,
                )
            except Exception:
                receivable = await receivable_service.create_receivable(
                    tenant_id=tenant_id,
                    receivable_data=receivable_data,
                    created_by=operator_id,
                    submit_review=False,
                )
                await Receivable.filter(tenant_id=tenant_id, id=receivable.id).update(
                    review_status="已审核",
                    status="已冲减",
                    remaining_amount=0,
                )
            return int(receivable.id)
        except Exception as exc:
            logger.warning(
                "销售退货 %s 补建红字应收失败: %s",
                ret.return_code or ret.id,
                exc,
            )
            return None

    async def ensure_offsets_for_receivable(
        self,
        tenant_id: int,
        receivable_id: int,
        *,
        operator_id: int,
    ) -> None:
        """拉收款前：补齐已确认销售退货对应该蓝字应收的冲减（幂等）。"""
        ar = await Receivable.get_or_none(
            tenant_id=tenant_id, id=receivable_id, deleted_at__isnull=True
        )
        if not ar or is_sales_return_offset_receivable(getattr(ar, "source_type", None)):
            return
        return_ids = await self._find_confirmed_sales_return_ids_for_receivable(tenant_id, ar)
        for rid in return_ids:
            try:
                await self.apply_sales_return_offset(
                    tenant_id, rid, operator_id=operator_id
                )
            except Exception as exc:
                logger.warning("补齐销售退货冲减失败 return_id=%s: %s", rid, exc)

    async def ensure_offsets_for_payable(
        self,
        tenant_id: int,
        payable_id: int,
        *,
        operator_id: int,
    ) -> None:
        ap = await Payable.get_or_none(
            tenant_id=tenant_id, id=payable_id, deleted_at__isnull=True
        )
        if not ap or is_purchase_return_offset_payable(getattr(ap, "source_type", None)):
            return
        return_ids = await self._find_confirmed_purchase_return_ids_for_payable(tenant_id, ap)
        for rid in return_ids:
            try:
                await self.apply_purchase_return_offset(
                    tenant_id, rid, operator_id=operator_id
                )
            except Exception as exc:
                logger.warning("补齐采购退货冲减失败 return_id=%s: %s", rid, exc)

    async def _collect_blue_receivable_ids(self, tenant_id: int, ret: SalesReturn) -> Set[int]:
        delivery_ids: Set[int] = set()
        order_ids: Set[int] = set()
        _add_positive_ids(delivery_ids, ret.sales_delivery_id)
        _add_positive_ids(order_ids, ret.sales_order_id)

        inbound_rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type__in=list(_SALES_RETURN_REL_TYPES),
            target_id=int(ret.id),
        ).all()
        for rel in inbound_rels:
            st = str(rel.source_type or "").strip()
            if st in _SALES_DELIVERY_REL_TYPES:
                _add_positive_ids(delivery_ids, rel.source_id)
            elif st in _SALES_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        items = await SalesReturnItem.filter(tenant_id=tenant_id, return_id=int(ret.id)).all()
        delivery_item_ids = {
            int(it.sales_delivery_item_id)
            for it in items
            if getattr(it, "sales_delivery_item_id", None)
        }
        if delivery_item_ids:
            for row in await SalesDeliveryItem.filter(
                tenant_id=tenant_id, id__in=list(delivery_item_ids)
            ).all():
                _add_positive_ids(delivery_ids, row.delivery_id)

        if order_ids:
            for did in await SalesDelivery.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                sales_order_id__in=list(order_ids),
            ).values_list("id", flat=True):
                _add_positive_ids(delivery_ids, did)

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
                if tt == "receivable":
                    _add_positive_ids(receivable_ids, rel.target_id)
                elif tt in _SALES_INVOICE_REL_TYPES:
                    _add_positive_ids(invoice_ids, rel.target_id)

        recv_q = Q()
        if delivery_ids:
            recv_q |= Q(
                source_type__in=list(_SALES_DELIVERY_REL_TYPES),
                source_id__in=list(delivery_ids),
            )
        if order_ids:
            recv_q |= Q(
                source_type__in=["销售订单", "sales_order"],
                source_id__in=list(order_ids),
            )
        if recv_q:
            for row in await Receivable.filter(
                tenant_id=tenant_id, deleted_at__isnull=True
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

        return receivable_ids

    async def _collect_blue_payable_ids(self, tenant_id: int, ret: PurchaseReturn) -> Set[int]:
        receipt_ids: Set[int] = set()
        order_ids: Set[int] = set()
        _add_positive_ids(receipt_ids, ret.purchase_receipt_id)
        _add_positive_ids(order_ids, ret.purchase_order_id)

        inbound_rels = await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type__in=list(_PURCHASE_RETURN_REL_TYPES),
            target_id=int(ret.id),
        ).all()
        for rel in inbound_rels:
            st = str(rel.source_type or "").strip()
            if st in _PURCHASE_RECEIPT_REL_TYPES:
                _add_positive_ids(receipt_ids, rel.source_id)
            elif st in _PURCHASE_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        items = await PurchaseReturnItem.filter(tenant_id=tenant_id, return_id=int(ret.id)).all()
        receipt_item_ids = {
            int(it.purchase_receipt_item_id)
            for it in items
            if getattr(it, "purchase_receipt_item_id", None)
        }
        if receipt_item_ids:
            for row in await PurchaseReceiptItem.filter(
                tenant_id=tenant_id, id__in=list(receipt_item_ids)
            ).all():
                _add_positive_ids(receipt_ids, row.receipt_id)

        if order_ids:
            for rid in await PurchaseReceipt.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                purchase_order_id__in=list(order_ids),
            ).values_list("id", flat=True):
                _add_positive_ids(receipt_ids, rid)

        payable_ids: Set[int] = set()
        invoice_ids: Set[int] = set()
        source_q = Q()
        if receipt_ids:
            source_q |= Q(
                source_type__in=list(_PURCHASE_RECEIPT_REL_TYPES),
                source_id__in=list(receipt_ids),
            )
        if order_ids:
            source_q |= Q(
                source_type__in=list(_PURCHASE_ORDER_REL_TYPES),
                source_id__in=list(order_ids),
            )
        if source_q:
            for rel in await DocumentRelation.filter(tenant_id=tenant_id).filter(source_q).all():
                tt = str(rel.target_type or "").strip()
                if tt == "payable":
                    _add_positive_ids(payable_ids, rel.target_id)
                elif tt in _PURCHASE_INVOICE_REL_TYPES:
                    _add_positive_ids(invoice_ids, rel.target_id)

        if order_ids:
            for iid in await PurchaseInvoice.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                purchase_order_id__in=list(order_ids),
            ).values_list("id", flat=True):
                _add_positive_ids(invoice_ids, iid)

        pay_q = Q()
        if receipt_ids:
            pay_q |= Q(
                source_type=PAYABLE_SOURCE_PURCHASE_RECEIPT,
                source_id__in=list(receipt_ids),
            )
        if order_ids:
            pay_q |= Q(
                source_type__in=["采购订单", "purchase_order"],
                source_id__in=list(order_ids),
            )
        if pay_q:
            for row in await Payable.filter(
                tenant_id=tenant_id, deleted_at__isnull=True
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

        return payable_ids

    async def _find_confirmed_sales_return_ids_for_receivable(
        self, tenant_id: int, ar: Receivable
    ) -> List[int]:
        """由蓝字应收反查已确认销售退货（用于历史补冲减）。"""
        delivery_ids: Set[int] = set()
        order_ids: Set[int] = set()
        st = str(ar.source_type or "").strip()
        if st == RECEIVABLE_SOURCE_SALES_DELIVERY or st in _SALES_DELIVERY_REL_TYPES:
            _add_positive_ids(delivery_ids, ar.source_id)
        if st in ("销售订单", "sales_order") or st in _SALES_ORDER_REL_TYPES:
            _add_positive_ids(order_ids, ar.source_id)

        for rel in await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type="receivable",
            target_id=int(ar.id),
        ).all():
            rst = str(rel.source_type or "").strip()
            if rst in _SALES_DELIVERY_REL_TYPES:
                _add_positive_ids(delivery_ids, rel.source_id)
            elif rst in _SALES_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        return_ids: Set[int] = set()
        if delivery_ids:
            for row in await SalesReturn.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                sales_delivery_id__in=list(delivery_ids),
                status__in=["已退货", "completed", "已完成", "RETURNED"],
            ).all():
                _add_positive_ids(return_ids, row.id)
        if order_ids:
            for row in await SalesReturn.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                sales_order_id__in=list(order_ids),
                status__in=["已退货", "completed", "已完成", "RETURNED"],
            ).all():
                _add_positive_ids(return_ids, row.id)
        return sorted(return_ids)

    async def _find_confirmed_purchase_return_ids_for_payable(
        self, tenant_id: int, ap: Payable
    ) -> List[int]:
        receipt_ids: Set[int] = set()
        order_ids: Set[int] = set()
        st = str(ap.source_type or "").strip()
        if st == PAYABLE_SOURCE_PURCHASE_RECEIPT or st in _PURCHASE_RECEIPT_REL_TYPES:
            _add_positive_ids(receipt_ids, ap.source_id)
        if st in ("采购订单", "purchase_order") or st in _PURCHASE_ORDER_REL_TYPES:
            _add_positive_ids(order_ids, ap.source_id)

        for rel in await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type="payable",
            target_id=int(ap.id),
        ).all():
            rst = str(rel.source_type or "").strip()
            if rst in _PURCHASE_RECEIPT_REL_TYPES:
                _add_positive_ids(receipt_ids, rel.source_id)
            elif rst in _PURCHASE_ORDER_REL_TYPES:
                _add_positive_ids(order_ids, rel.source_id)

        return_ids: Set[int] = set()
        if receipt_ids:
            for row in await PurchaseReturn.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                purchase_receipt_id__in=list(receipt_ids),
                status__in=["已退货", "completed", "已完成", "RETURNED"],
            ).all():
                _add_positive_ids(return_ids, row.id)
        if order_ids:
            for row in await PurchaseReturn.filter(
                tenant_id=tenant_id,
                deleted_at__isnull=True,
                purchase_order_id__in=list(order_ids),
                status__in=["已退货", "completed", "已完成", "RETURNED"],
            ).all():
                _add_positive_ids(return_ids, row.id)
        return sorted(return_ids)
