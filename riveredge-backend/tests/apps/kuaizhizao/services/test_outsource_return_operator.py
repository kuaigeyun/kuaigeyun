from contextlib import asynccontextmanager
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from apps.kuaizhizao.services import outsource_product_return_service as module
from apps.kuaizhizao.services.inventory_service import InventoryService
from apps.kuaizhizao.services.document_action_policy import outsource_work_order as policy


@pytest.mark.asyncio
async def test_return_uses_same_operator_for_document_and_stock(monkeypatch):
    @asynccontextmanager
    async def transaction():
        yield None
    monkeypatch.setattr(module, "in_transaction", transaction)
    work = SimpleNamespace(product_id=1, received_quantity=Decimal(10), qualified_quantity=Decimal(10), save=AsyncMock())
    query = MagicMock(); query.first = AsyncMock(return_value=work)
    monkeypatch.setattr(module.OutsourceWorkOrder, "filter", lambda **kw: query)
    returns = MagicMock(); returns.first = AsyncMock(return_value=None)
    monkeypatch.setattr(module.OutsourceProductReturn, "filter", lambda **kw: returns)
    product_return = SimpleNamespace(id=9, refresh_from_db=AsyncMock())
    create = AsyncMock(return_value=product_return)
    monkeypatch.setattr(module.OutsourceProductReturn, "create", create)
    monkeypatch.setattr(module.OutsourceProductReturnResponse, "model_validate", lambda obj: obj)
    monkeypatch.setattr(policy, "assert_outsource_work_order_capability", lambda *a: None)
    decrease = AsyncMock()
    monkeypatch.setattr(InventoryService, "decrease_stock", decrease)
    obj = module.OutsourceProductReturnService()
    monkeypatch.setattr(obj, "_resolve_receipt_for_return", AsyncMock(return_value=SimpleNamespace(id=8, warehouse_id=1, batch_number="batch")))
    monkeypatch.setattr(obj, "_validate_return_quantity", AsyncMock())
    monkeypatch.setattr(obj, "get_user_info", AsyncMock(return_value={"name": "退货经办人"}))
    data = SimpleNamespace(code="fixture", outsource_work_order_id=1, outsource_work_order_code="fixture", quantity=Decimal(2), unit="pcs", return_reason="fixture", remarks="fixture")
    result = await obj.create_product_return(1, data, 7)
    assert result is product_return
    assert decrease.call_args.kwargs["operator_id"] == 7
    assert decrease.call_args.kwargs["operator_name"] == create.call_args.kwargs["created_by_name"] == "退货经办人"
    assert decrease.call_args.kwargs["quantity"] == 2
    assert work.received_quantity == work.qualified_quantity == 8
