"""往来对账层级：退货冲减应付/应收挂在蓝字单之下。"""

from __future__ import annotations

from types import SimpleNamespace
from typing import Any, Dict, List
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from apps.kuaicaiwu.services.finance_refund_utils import SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET
from apps.kuaicaiwu.services.finance_settlement_hierarchy import order_lines_by_settlement_hierarchy


class _AsyncList:
    def __init__(self, rows: List[Any]):
        self._rows = rows

    def __await__(self):
        async def _coro():
            return self._rows

        return _coro().__await__()


def _filter_all(rows: List[Any]) -> MagicMock:
    q = MagicMock()
    q.all = MagicMock(return_value=_AsyncList(rows))
    return q


@pytest.mark.asyncio
async def test_purchase_return_offset_nests_under_blue_payable():
    lines = [
        {
            "date": "2026-09-11",
            "sort_date": "2026-09-11",
            "doc_type": "应付单",
            "doc_code": "PY-BLUE",
            "doc_id": 100,
            "debit": 1000.0,
            "credit": 0.0,
        },
        {
            "date": "2026-09-11",
            "sort_date": "2026-09-11",
            "doc_type": "付款单",
            "doc_code": "PK-1",
            "doc_id": 200,
            "debit": 0.0,
            "credit": 500.0,
        },
        {
            "date": "2026-09-11",
            "sort_date": "2026-09-11",
            "doc_type": "采购退货",
            "doc_code": "PY-RED",
            "doc_id": 300,
            "offset_source_id": 50,
            "debit": 0.0,
            "credit": 200.0,
        },
    ]

    payment_settle = SimpleNamespace(
        debit_doc_id=100,
        credit_doc_id=200,
        amount=500,
    )
    offset_settle = SimpleNamespace(
        debit_doc_id=100,
        credit_doc_id=50,
        amount=200,
    )

    def settlement_filter(**kwargs):
        credit_type = kwargs.get("credit_doc_type")
        if credit_type == "Payment":
            return _filter_all([payment_settle])
        if credit_type == SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET:
            return _filter_all([offset_settle])
        if kwargs.get("debit_doc_type") == "Payment":
            return _filter_all([])
        return _filter_all([])

    with patch(
        "apps.kuaizhizao.models.document_relation.DocumentRelation.filter",
        return_value=_filter_all([]),
    ), patch(
        "apps.kuaicaiwu.models.settlement.SettlementRecord.filter",
        side_effect=settlement_filter,
    ):
        ordered = await order_lines_by_settlement_hierarchy(
            1,
            lines,
            parent_doc_types={"应付单"},
            child_doc_types={"付款单", "付款退款"},
            rel_source="payable",
            rel_target="payment",
            debit_doc_type="Payable",
            credit_doc_type="Payment",
            return_offset_child_doc_types={"采购退货"},
            return_offset_credit_doc_type=SETTLEMENT_CREDIT_PURCHASE_RETURN_OFFSET,
        )

    assert [ln["doc_code"] for ln in ordered] == ["PY-BLUE", "PK-1", "PY-RED"]
    assert ordered[0]["tree_level"] == 0
    assert ordered[1]["tree_level"] == 1
    assert ordered[1]["parent_doc_id"] == 100
    assert ordered[2]["tree_level"] == 1
    assert ordered[2]["parent_doc_id"] == 100
