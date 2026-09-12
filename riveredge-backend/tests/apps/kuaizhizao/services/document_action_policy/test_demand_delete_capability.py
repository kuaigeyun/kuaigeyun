"""需求计划删除 capabilities。"""

from types import SimpleNamespace

from apps.kuaizhizao.services.document_action_policy.demand import derive_demand_capabilities


def test_demand_plan_draft_can_delete():
    demand = SimpleNamespace(demand_type="demand_plan", status="DRAFT", review_status="PENDING")
    caps = derive_demand_capabilities(demand)
    assert caps.delete.allowed is True


def test_synced_sales_order_demand_cannot_delete():
    demand = SimpleNamespace(demand_type="sales_order", status="DRAFT", review_status="PENDING")
    caps = derive_demand_capabilities(demand)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "demand.delete.synced_upstream"


def test_audited_demand_plan_cannot_delete():
    demand = SimpleNamespace(demand_type="demand_plan", status="AUDITED", review_status="APPROVED")
    caps = derive_demand_capabilities(demand)
    assert caps.delete.allowed is False
    assert caps.delete.reason == "demand.delete.not_allowed"
