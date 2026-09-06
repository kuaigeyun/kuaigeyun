from contextlib import asynccontextmanager
from datetime import date
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from apps.common.base_service import AppBaseService
from apps.kuaizhizao.services import sales_order_service as module
from apps.kuaizhizao.schemas.sales_order import SalesOrderUpdate, SalesOrderItemCreate
from apps.kuaizhizao.services.document_relation_service import DocumentRelationService
from apps.kuaizhizao.services.demand_change_event_service import DemandChangeEventService
from apps.kuaizhizao.models.work_order import WorkOrder


@pytest.mark.asyncio
@pytest.mark.parametrize("submitted,stored,expected", [(None, "tax_exclusive", "tax_exclusive"), ("", "tax_exclusive", "tax_exclusive"), (None, None, module.DEFAULT_SALES_PRICE_TYPE), ("tax_inclusive", "tax_exclusive", "tax_inclusive")])
async def test_item_update_resolves_price_type_and_persists(monkeypatch, submitted, stored, expected):
    @asynccontextmanager
    async def transaction():
        yield None
    monkeypatch.setattr(module, "in_transaction", transaction)
    fields = dict.fromkeys(["order_date", "delivery_date", "customer_contact", "customer_phone", "salesman_name", "shipping_address", "shipping_method", "payment_terms", "notes"])
    order = SimpleNamespace(**fields, customer_name="fixture", total_quantity=1, total_amount=10, price_type=stored, status="草稿", order_code="fixture")
    monkeypatch.setattr(module.SalesOrder, "get_or_none", AsyncMock(return_value=order))
    query = MagicMock(); query.update = AsyncMock(); query.delete = AsyncMock()
    monkeypatch.setattr(module.SalesOrder, "filter", lambda **kw: query)
    monkeypatch.setattr(module.SalesOrderItem, "filter", lambda **kw: query)
    create = AsyncMock()
    monkeypatch.setattr(module.SalesOrderItem, "create", create)
    monkeypatch.setattr(AppBaseService, "get_user_name", AsyncMock(return_value="fixture"))
    monkeypatch.setattr(DocumentRelationService, "apply_upstream_change_impact", AsyncMock())
    monkeypatch.setattr(DemandChangeEventService, "create_event", AsyncMock())
    works = MagicMock(); works.values_list = AsyncMock(return_value=[])
    monkeypatch.setattr(WorkOrder, "filter", lambda **kw: works)
    monkeypatch.setattr(module, "SalesOrderResponse", lambda **kw: SimpleNamespace(**kw))
    obj = module.SalesOrderService()
    monkeypatch.setattr(obj, "_assert_sales_order_capability_for_order", AsyncMock())
    monkeypatch.setattr(obj, "_load_material_master_map", AsyncMock(return_value={}))
    monkeypatch.setattr(obj, "get_sales_order_by_id", AsyncMock(return_value=SimpleNamespace(model_dump=lambda: {"id": 1})))
    monkeypatch.setattr(obj, "_log_state_transition", AsyncMock())
    monkeypatch.setattr(obj, "_sync_demand_if_exists", AsyncMock(return_value=False))
    pricing = MagicMock(wraps=obj._process_sales_order_item_pricing)
    monkeypatch.setattr(obj, "_process_sales_order_item_pricing", pricing)
    item = SalesOrderItemCreate(material_id=1, material_code="M1", material_name="fixture", required_quantity=2, delivery_date=date(2026, 9, 7), unit_price=10, tax_rate=0)
    data = SalesOrderUpdate(items=[item], **({"price_type": submitted} if submitted is not None else {}))
    result = await obj.update_sales_order(1, 1, data, 7)
    assert result.id == 1
    assert pricing.call_args.kwargs["price_type"] == expected
    if submitted is not None:
        assert query.update.call_args_list[0].kwargs["price_type"] == expected
    assert create.call_args.kwargs["order_quantity"] == Decimal(2)
    assert create.call_args.kwargs["total_amount"] == Decimal(20)
