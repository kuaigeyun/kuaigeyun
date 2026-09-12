"""采购订单下推状态门禁与 ORDER_PUSHABLE_STATUSES 对齐。"""

from types import SimpleNamespace

from apps.kuaizhizao.services.document_action_policy.purchase_order import (
    derive_purchase_order_capabilities,
)


def test_in_progress_order_can_push_receipt_notice_when_qty_remains():
    order = SimpleNamespace(status="IN_PROGRESS", review_status="APPROVED", supplier_id=101)
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_outstanding=True,
        has_pushable_notice_outstanding=True,
    )
    assert caps.push_receipt_notice.allowed is True


def test_draft_order_cannot_push_receipt_notice():
    order = SimpleNamespace(status="DRAFT", review_status="PENDING")
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_outstanding=True,
        has_pushable_notice_outstanding=True,
    )
    assert caps.push_receipt_notice.allowed is False


def test_confirmed_order_without_supplier_cannot_push_receipt_notice():
    order = SimpleNamespace(status="CONFIRMED", review_status="APPROVED", supplier_id=0)
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_outstanding=True,
        has_pushable_notice_outstanding=True,
    )
    assert caps.push_receipt_notice.allowed is False
    assert caps.push_receipt_notice.reason == "purchase_order.push.no_supplier"


def test_confirmed_order_without_supplier_cannot_push_receipt_or_invoice():
    order = SimpleNamespace(status="CONFIRMED", review_status="APPROVED", supplier_id=0)
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_outstanding=True,
        has_pushable_receipt_outstanding=True,
        has_received=True,
        has_returnable=True,
    )
    assert caps.push_receipt.allowed is False
    assert caps.push_receipt.reason == "purchase_order.push.no_supplier"
    assert caps.push_invoice.allowed is False
    assert caps.push_invoice.reason == "purchase_order.push.no_supplier"
    assert caps.push_purchase_return.allowed is False
    assert caps.push_purchase_return.reason == "purchase_order.push.no_supplier"


def test_draft_order_with_downstream_cannot_delete():
    order = SimpleNamespace(status="DRAFT", review_status="PENDING", supplier_id=101)
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_downstream=True,
    )
    assert caps.delete.allowed is False
    assert caps.delete.reason == "purchase_order.delete.has_downstream"


def test_draft_order_without_downstream_can_delete():
    order = SimpleNamespace(status="DRAFT", review_status="PENDING", supplier_id=101)
    caps = derive_purchase_order_capabilities(
        order,
        has_items=True,
        has_downstream=False,
    )
    assert caps.delete.allowed is True
