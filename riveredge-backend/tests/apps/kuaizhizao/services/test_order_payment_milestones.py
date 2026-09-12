"""购销订单付款/收款里程碑服务与自动生单逻辑。"""

from __future__ import annotations

from datetime import date
from decimal import Decimal
from types import SimpleNamespace

import pytest

from apps.kuaizhizao.services.contract_milestone_billing_service import ContractMilestoneBillingService


@pytest.mark.asyncio
async def test_auto_generate_receivables_skips_prepayment_and_delivery(monkeypatch):
    svc = ContractMilestoneBillingService()
    rows = [
        SimpleNamespace(id=1, billing_trigger="milestone", is_prepayment=False),
        SimpleNamespace(id=2, billing_trigger="delivery", is_prepayment=False),
        SimpleNamespace(id=3, billing_trigger="milestone", is_prepayment=True),
    ]
    calls: list[int] = []

    class FakeQuery:
        def order_by(self, *_args, **_kwargs):
            return self

        def __await__(self):
            async def _resolve():
                return [r for r in rows if not r.is_prepayment]

            return _resolve().__await__()

    async def fake_generate(_tenant_id, _order_id, milestone_id, _created_by, *, force=False):
        calls.append(milestone_id)
        return SimpleNamespace(id=milestone_id)

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.SalesOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )
    monkeypatch.setattr(svc, "generate_receivable_for_order_milestone", fake_generate)

    count = await svc.auto_generate_receivables_for_sales_order(1, 100, 9)
    assert count == 1
    assert calls == [1]


@pytest.mark.asyncio
async def test_auto_generate_payables_skips_delivery(monkeypatch):
    svc = ContractMilestoneBillingService()
    rows = [
        SimpleNamespace(id=10, billing_trigger="milestone", is_prepayment=False),
        SimpleNamespace(id=11, billing_trigger="delivery", is_prepayment=False),
    ]
    calls: list[int] = []

    class FakeQuery:
        def order_by(self, *_args, **_kwargs):
            return self

        def __await__(self):
            async def _resolve():
                return list(rows)

            return _resolve().__await__()

    async def fake_generate(_tenant_id, _order_id, milestone_id, _created_by):
        calls.append(milestone_id)
        return SimpleNamespace(id=milestone_id)

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.PurchaseOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )
    monkeypatch.setattr(svc, "generate_payable_for_order_milestone", fake_generate)

    count = await svc.auto_generate_payables_for_purchase_order(1, 200, 9)
    assert count == 1
    assert calls == [10]


@pytest.mark.asyncio
async def test_should_skip_shipment_when_order_has_delivery_milestones(monkeypatch):
    svc = ContractMilestoneBillingService()

    class FakeQuery:
        async def exists(self):
            return True

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.SalesOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )

    skip = await svc.should_skip_shipment_receivable_for_order(
        1, customer_id=1, contract_id=None, sales_order_id=100
    )
    assert skip is True


@pytest.mark.asyncio
async def test_should_skip_receipt_payable_when_po_has_delivery_milestones(monkeypatch):
    svc = ContractMilestoneBillingService()

    class FakeQuery:
        async def exists(self):
            return True

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.PurchaseOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )

    skip = await svc.should_skip_receipt_payable_for_order(1, supplier_id=1, purchase_order_id=200)
    assert skip is True


@pytest.mark.asyncio
async def test_delivery_milestone_receivable_one_per_shipment(monkeypatch):
    svc = ContractMilestoneBillingService()
    pending = SimpleNamespace(id=7, billing_trigger="delivery", is_prepayment=False)

    class FakeQuery:
        def order_by(self, *_args, **_kwargs):
            return self

        async def first(self):
            return pending

    calls: list[int] = []

    async def fake_generate(_tenant_id, _order_id, milestone_id, _created_by, *, force=False):
        calls.append(milestone_id)
        return SimpleNamespace(id=99)

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.SalesOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )
    monkeypatch.setattr(svc, "generate_receivable_for_order_milestone", fake_generate)

    count = await svc.auto_generate_delivery_milestone_receivables_on_shipment(1, 100, 9)
    assert count == 1
    assert calls == [7]


@pytest.mark.asyncio
async def test_delivery_milestone_payable_one_per_receipt(monkeypatch):
    svc = ContractMilestoneBillingService()
    pending = SimpleNamespace(id=8, billing_trigger="delivery", is_prepayment=False)

    class FakeQuery:
        def order_by(self, *_args, **_kwargs):
            return self

        async def first(self):
            return pending

    calls: list[int] = []

    async def fake_generate(_tenant_id, _order_id, milestone_id, _created_by):
        calls.append(milestone_id)
        return SimpleNamespace(id=88)

    monkeypatch.setattr(
        "apps.kuaizhizao.services.contract_milestone_billing_service.PurchaseOrderMilestone.filter",
        lambda *_a, **_k: FakeQuery(),
    )
    monkeypatch.setattr(svc, "generate_payable_for_order_milestone", fake_generate)

    count = await svc.auto_generate_delivery_milestone_payables_on_receipt(1, 200, 9)
    assert count == 1
    assert calls == [8]
