"""出入库 Hub 头表数量：同单位合计 / 异单位种类。"""

import asyncio

from apps.kuaizhizao.services.document_action_policy.enricher import (
    batch_document_item_homogeneous_units,
)


def test_homogeneous_unit_aggregation_rule():
    units_by_parent = {
        1: {"托"},
        2: {"托", "千克"},
        3: {""},
    }
    out = {
        pid: (next(iter(units)) if len(units) == 1 else None)
        for pid, units in units_by_parent.items()
    }
    assert out[1] == "托"
    assert out[2] is None
    assert out[3] == ""


def test_batch_homogeneous_units_empty_parent_ids():
    assert asyncio.run(batch_document_item_homogeneous_units(1, object, "picking_id", [])) == {}
