"""采购申请删除门禁：已转采购订单不可删。"""

from types import SimpleNamespace

from apps.kuaizhizao.services.document_action_policy.purchase_requisition import (
    derive_purchase_requisition_capabilities,
)


def test_draft_without_linked_po_can_delete():
    req = SimpleNamespace(status="DRAFT", review_status="PENDING")
    caps = derive_purchase_requisition_capabilities(req, has_linked_purchase_order=False)
    assert caps.delete.allowed is True


def test_draft_with_linked_po_cannot_delete():
    req = SimpleNamespace(status="DRAFT", review_status="PENDING")
    caps = derive_purchase_requisition_capabilities(req, has_linked_purchase_order=True)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "purchase_requisition.delete.has_purchase_order"


def test_partial_converted_status_cannot_delete_even_without_flag():
    req = SimpleNamespace(status="PARTIAL_CONVERTED", review_status="APPROVED")
    caps = derive_purchase_requisition_capabilities(req, has_linked_purchase_order=False)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "purchase_requisition.delete.has_purchase_order"
