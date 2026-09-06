"""Run with INVENTORY_TEST_DATABASE_URL pointing to a disposable PostgreSQL database."""
import asyncio
import os
from decimal import Decimal
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from tortoise import Tortoise
from tortoise.exceptions import IntegrityError
from tortoise.transactions import in_transaction

from apps.kuaizhizao.models.line_side_inventory import LineSideInventory
from apps.kuaizhizao.models.material_stock_movement import MaterialStockMovement
from apps.kuaizhizao.services.inventory_service import InventoryService


@pytest_asyncio.fixture
async def stock(monkeypatch):
    url = os.environ.get("INVENTORY_TEST_DATABASE_URL")
    if not url:
        pytest.skip("requires a disposable PostgreSQL database")
    if not url.rsplit("/", 1)[-1].startswith("codex_stock_test"):
        pytest.fail("use a dedicated codex_stock_test database; fixture deletes its rows")
    await Tortoise.init(db_url=url, modules={"models": [
        "apps.kuaizhizao.models.line_side_inventory",
        "apps.kuaizhizao.models.material_stock_movement",
    ]})
    await Tortoise.generate_schemas()
    await MaterialStockMovement.all().delete()
    await LineSideInventory.all().delete()
    from apps.master_data.models.material import Material
    from apps.master_data.models.warehouse import Warehouse
    from apps.kuaizhizao.services import work_order_readiness_service
    from apps.kuaizhizao.utils import inventory_helper
    monkeypatch.setattr(Material, "get_or_none", AsyncMock(return_value=SimpleNamespace(code="M1", main_code="M1", name="fixture", batch_managed=False)))
    monkeypatch.setattr(Warehouse, "get_or_none", AsyncMock(return_value=SimpleNamespace(warehouse_type="line_side", name="fixture")))
    monkeypatch.setattr(InventoryService, "_get_warehouse_management_flags", AsyncMock(return_value=(False, False)))
    monkeypatch.setattr(InventoryService, "_get_allow_negative_inventory", AsyncMock(return_value=False))
    monkeypatch.setattr(inventory_helper, "assert_outbound_warehouse_stock_available", AsyncMock())
    monkeypatch.setattr(work_order_readiness_service, "notify_inventory_changed", lambda *a: None)
    row = await LineSideInventory.create(tenant_id=1, warehouse_id=1, material_id=1, material_code="M1", material_name="fixture", quantity=100)
    try:
        yield row
    finally:
        await Tortoise.close_connections()


def post(direction, key="fixture:1"):
    fn = InventoryService.increase_stock if direction == 1 else InventoryService.decrease_stock
    return fn(tenant_id=1, material_id=1, quantity=Decimal(5), warehouse_id=1,
              movement_type="transfer", source_doc_id=1, operator_id=1,
              operator_name="fixture", idempotency_key=key)


@pytest.mark.asyncio
@pytest.mark.parametrize("direction", [1, -1])
@pytest.mark.parametrize("concurrent", [False, True])
async def test_duplicate_posting_changes_balance_and_ledger_once(stock, direction, concurrent):
    if concurrent:
        await asyncio.gather(*(post(direction) for _ in range(8)))
    else:
        await post(direction)
        await post(direction)
    await stock.refresh_from_db()
    assert stock.quantity == 100 + direction * 5
    assert await MaterialStockMovement.all().count() == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("error", [RuntimeError, IntegrityError])
async def test_failed_ledger_rolls_back_balance_and_allows_retry(stock, monkeypatch, error):
    original = MaterialStockMovement.create
    monkeypatch.setattr(MaterialStockMovement, "create", AsyncMock(side_effect=error("fixture ledger failure")))
    with pytest.raises(error):
        await post(1)
    await stock.refresh_from_db()
    assert stock.quantity == 100
    monkeypatch.setattr(MaterialStockMovement, "create", original)
    await post(1)
    await stock.refresh_from_db()
    assert stock.quantity == 105


@pytest.mark.asyncio
async def test_negative_fifo_first_movement_also_marks_operation_complete(stock):
    await MaterialStockMovement.create(tenant_id=1, material_id=1, movement_type="transfer",
                                       quantity=-5, idempotency_key="fixture:1#neg0")
    await post(-1)
    await stock.refresh_from_db()
    assert stock.quantity == 100
    assert await MaterialStockMovement.all().count() == 1


def document_actions():
    from apps.kuaizhizao.utils.stock_posting import serialize_stock_document

    @serialize_stock_document("fixture", "document_id")
    async def confirm(tenant_id, document_id):
        # Existing document services already contain an explicit transaction.
        async with in_transaction():
            document = await LineSideInventory.get(id=document_id)
            if document.source_type == "confirmed":
                raise ValueError("already confirmed")
            await post(-1)
            await LineSideInventory.filter(id=document_id).update(source_type="confirmed")

    @serialize_stock_document("fixture", "document_id")
    async def withdraw(tenant_id, document_id):
        document = await LineSideInventory.get(id=document_id)
        if document.source_type != "confirmed":
            raise ValueError("not confirmed")
        await post(1, "fixture:withdraw")
        await LineSideInventory.filter(id=document_id).update(source_type="draft")
    return confirm, withdraw


@pytest.mark.asyncio
async def test_repeated_confirmation_withdrawal_has_distinct_postings(stock):
    confirm, withdraw = document_actions()
    for _ in range(2):
        await confirm(1, stock.id)
        await withdraw(1, stock.id)
    await stock.refresh_from_db()
    assert stock.quantity == 100
    assert await MaterialStockMovement.all().count() == 4


@pytest.mark.asyncio
async def test_concurrent_document_confirmation_rechecks_status_under_lock(stock):
    confirm, _ = document_actions()
    results = await asyncio.gather(*(confirm(1, stock.id) for _ in range(8)), return_exceptions=True)
    assert sum(isinstance(result, ValueError) for result in results) == 7
    await stock.refresh_from_db()
    assert stock.quantity == 95
    assert await MaterialStockMovement.all().count() == 1
