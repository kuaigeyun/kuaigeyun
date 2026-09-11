"""WorkOrderOperationResponse：未落章 inspection_mode 响应契约。"""

from datetime import datetime
from decimal import Decimal

from apps.kuaizhizao.schemas.work_order import WorkOrderOperationResponse


def _minimal_payload(**overrides):
    base = {
        "id": 1,
        "uuid": "wo-op-uuid",
        "tenant_id": 1,
        "work_order_code": "GD202609110001",
        "operation_id": 10,
        "operation_code": "OP01",
        "operation_name": "选果",
        "sequence": 1,
        "status": "pending",
        "completed_quantity": Decimal("0"),
        "qualified_quantity": Decimal("0"),
        "unqualified_quantity": Decimal("0"),
        "max_reportable_quantity": Decimal("100"),
        "created_at": datetime(2026, 9, 11, 8, 0, 0),
        "updated_at": datetime(2026, 9, 11, 8, 0, 0),
    }
    base.update(overrides)
    return base


def test_inspection_mode_none_coerces_to_none_literal():
    """派工/开始等用 getattr 带入 None 时不得校验失败。"""
    resp = WorkOrderOperationResponse.model_validate(_minimal_payload(inspection_mode=None))
    assert resp.inspection_mode == "none"


def test_inspection_mode_plan_preserved():
    resp = WorkOrderOperationResponse.model_validate(_minimal_payload(inspection_mode="plan"))
    assert resp.inspection_mode == "plan"
