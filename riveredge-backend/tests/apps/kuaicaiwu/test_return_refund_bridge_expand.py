"""采购/销售退货退款桥接：订单须展开到入库/出库后再定位收付款单。"""

from __future__ import annotations

from typing import List
from unittest.mock import MagicMock, patch

import pytest

from apps.kuaicaiwu.services.return_refund_bridge_service import (
    _add_positive_ids,
    _expand_purchase_invoice_ids_for_orders,
    _expand_purchase_receipts_for_orders,
    _expand_sales_deliveries_for_orders,
)


def test_add_positive_ids_ignores_invalid():
    target: set[int] = set()
    _add_positive_ids(target, None, 0, -1, "x", 12, "34")
    assert target == {12, 34}


class _ValuesList:
    def __init__(self, ids: List[int]):
        self._ids = ids

    def __await__(self):
        async def _coro():
            return self._ids

        return _coro().__await__()


def _filter_mock(ids: List[int]) -> MagicMock:
    q = MagicMock()
    q.values_list = MagicMock(return_value=_ValuesList(ids))
    return q


@pytest.mark.asyncio
async def test_expand_purchase_receipts_for_orders_merges_ids():
    receipt_ids = {9}
    with patch(
        "apps.kuaicaiwu.services.return_refund_bridge_service.PurchaseReceipt.filter",
        return_value=_filter_mock([101, 102]),
    ) as flt:
        await _expand_purchase_receipts_for_orders(1, {55}, receipt_ids)
        flt.assert_called_once()
    assert receipt_ids == {9, 101, 102}


@pytest.mark.asyncio
async def test_expand_purchase_receipts_noop_without_orders():
    receipt_ids = {9}
    with patch(
        "apps.kuaicaiwu.services.return_refund_bridge_service.PurchaseReceipt.filter"
    ) as flt:
        await _expand_purchase_receipts_for_orders(1, set(), receipt_ids)
        flt.assert_not_called()
    assert receipt_ids == {9}


@pytest.mark.asyncio
async def test_expand_purchase_invoices_for_orders():
    invoice_ids: set[int] = set()
    with patch(
        "apps.kuaicaiwu.services.return_refund_bridge_service.PurchaseInvoice.filter",
        return_value=_filter_mock([7]),
    ):
        await _expand_purchase_invoice_ids_for_orders(1, {3}, invoice_ids)
    assert invoice_ids == {7}


@pytest.mark.asyncio
async def test_expand_sales_deliveries_for_orders():
    delivery_ids: set[int] = set()
    with patch(
        "apps.kuaicaiwu.services.return_refund_bridge_service.SalesDelivery.filter",
        return_value=_filter_mock([88]),
    ):
        await _expand_sales_deliveries_for_orders(1, {4}, delivery_ids)
    assert delivery_ids == {88}
