from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from apps.kuaizhizao.services.inventory_service import InventoryService
from apps.master_data.models.material_serial import MaterialSerial
from infra.exceptions.exceptions import BusinessLogicError


@pytest.mark.asyncio
@pytest.mark.parametrize("record,message", [
    (None, "不存在"),
    (SimpleNamespace(material_id=2, status="in_stock"), "不属于"),
    (SimpleNamespace(material_id=1, status="out_stock"), "不在库"),
])
async def test_invalid_serial_reports_business_error(monkeypatch, record, message):
    query = MagicMock(); query.first = AsyncMock(return_value=record)
    monkeypatch.setattr(MaterialSerial, "filter", lambda **kw: query)
    with pytest.raises(BusinessLogicError, match=message):
        await InventoryService._mark_serials_out_stock(1, 1, ["SN-1"])


@pytest.mark.asyncio
async def test_valid_serial_is_marked_out_of_stock(monkeypatch):
    record = SimpleNamespace(material_id=1, status="in_stock", save=AsyncMock())
    query = MagicMock(); query.first = AsyncMock(return_value=record)
    monkeypatch.setattr(MaterialSerial, "filter", lambda **kw: query)
    await InventoryService._mark_serials_out_stock(1, 1, ["SN-1"])
    assert record.status == "out_stock"
    record.save.assert_awaited_once()
