"""销售订单删除 capabilities：下游单据门禁。"""

from types import SimpleNamespace

from apps.kuaizhizao.services.document_action_policy.sales_order import (
    derive_sales_order_capabilities,
)


def test_draft_sales_order_with_downstream_cannot_delete():
    order = SimpleNamespace(status="草稿", review_status="PENDING")
    caps = derive_sales_order_capabilities(order, has_downstream_documents=True)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "sales_order.delete.has_downstream"


def test_submitted_sales_order_without_downstream_can_delete():
    order = SimpleNamespace(status="已提交", review_status="APPROVED")
    caps = derive_sales_order_capabilities(order, has_downstream_documents=False)
    assert caps.delete.allowed is True


def test_audited_sales_order_cannot_delete():
    order = SimpleNamespace(status="已审核", review_status="APPROVED")
    caps = derive_sales_order_capabilities(order, has_downstream_documents=False)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "sales_order.delete.not_allowed"
