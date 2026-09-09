"""采购入库撤回须回冲序列号，否则再确认会因「已在库」失败并卡在待入库。"""

from contextlib import asynccontextmanager
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from apps.kuaizhizao.services.warehouse_service import PurchaseReceiptService


@asynccontextmanager
async def _noop_tx():
    conn = MagicMock()
    conn.execute_query = AsyncMock(return_value=None)
    yield conn


@pytest.mark.asyncio
async def test_withdraw_receipt_passes_serial_nos_to_decrease():
    receipt = SimpleNamespace(
        id=7,
        status="已入库",
        receipt_code="CGSD1",
        purchase_order_id=0,
        warehouse_id=3,
    )
    item = SimpleNamespace(
        id=11,
        material_id=5,
        receipt_quantity=1,
        material_unit="个",
        batch_number=None,
        serial_numbers=["SN-A"],
        warehouse_id=3,
    )
    decrease = AsyncMock(return_value=True)

    svc = PurchaseReceiptService()
    svc.get_user_info = AsyncMock(return_value={"name": "t"})
    svc.get_purchase_receipt_by_id = AsyncMock(return_value=MagicMock())

    with (
        patch(
            "apps.kuaizhizao.services.warehouse_service.PurchaseReceipt.get_or_none",
            AsyncMock(return_value=receipt),
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service.PurchaseReceipt.get",
            AsyncMock(return_value=receipt),
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service.PurchaseReceiptItem.filter",
            MagicMock(
                return_value=SimpleNamespace(
                    all=AsyncMock(return_value=[item]),
                    update=AsyncMock(),
                )
            ),
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service.PurchaseReceipt.filter",
            MagicMock(return_value=SimpleNamespace(update=AsyncMock())),
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service._load_materials_by_ids",
            AsyncMock(return_value={5: SimpleNamespace(id=5)}),
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service._convert_line_quantity_to_base",
            lambda **kwargs: kwargs["quantity"],
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service._resolve_purchase_receipt_line_warehouse_id_for_stock",
            AsyncMock(return_value=3),
        ),
        patch(
            "apps.kuaizhizao.services.inventory_service.InventoryService._decrease_stock_no_atomic",
            decrease,
        ),
        patch(
            "apps.kuaizhizao.utils.stock_posting._stock_transaction",
            _noop_tx,
        ),
        patch(
            "apps.kuaizhizao.services.warehouse_service.in_transaction",
            _noop_tx,
        ),
    ):
        await svc.withdraw_receipt_confirmation(tenant_id=1, receipt_id=7, updated_by=9)

    assert decrease.await_count == 1
    kwargs = decrease.await_args.kwargs
    assert kwargs.get("serial_nos") == ["SN-A"]
    assert kwargs.get("idempotency_key") == "purchase_receipt:7:revoke:11"
