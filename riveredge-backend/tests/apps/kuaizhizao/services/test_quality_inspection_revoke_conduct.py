from types import SimpleNamespace

from apps.kuaizhizao.services.inspection_step_spec import strip_inspection_template_conduct
from apps.kuaizhizao.services.quality_inspection_lifecycle import (
    build_quality_inspection_revoke_conduct_fields,
)


def test_strip_inspection_template_conduct_keeps_plan_items():
    template = {
        "plan_id": 12,
        "plan_code": "YPZJ001",
        "plan_name": "样品质检",
        "items": [{"name": "外观", "value_type": "boolean"}],
        "conduct_step_results": {"step_0": {"judgment": "pass"}},
        "conduct_measurement_data": {"a": 1},
    }
    preserved = strip_inspection_template_conduct(template)
    assert preserved["plan_name"] == "样品质检"
    assert len(preserved["items"]) == 1
    assert "conduct_step_results" not in preserved
    assert "conduct_measurement_data" not in preserved


def test_revoke_conduct_preserves_incoming_plan_template():
    inspection = SimpleNamespace(
        other_checks={
            "plan_id": 12,
            "plan_code": "YPZJ001",
            "plan_name": "样品质检",
            "items": [{"name": "外观", "value_type": "boolean"}],
            "conduct_step_results": {"step_0": {"judgment": "pass"}},
        }
    )
    fields = build_quality_inspection_revoke_conduct_fields(
        entity_type="incoming_inspection",
        updated_by=1,
        updated_by_name="tester",
        inspection=inspection,
    )
    assert fields["status"] == "待检验"
    assert fields["other_checks"]["plan_name"] == "样品质检"
    assert len(fields["other_checks"]["items"]) == 1
    assert "conduct_step_results" not in fields["other_checks"]
    assert fields["appearance_check"] is None


def test_revoke_conduct_preserves_process_quality_characteristics():
    inspection = SimpleNamespace(
        quality_characteristics={
            "plan_id": 3,
            "plan_name": "过程方案",
            "items": [{"name": "尺寸", "value_type": "number"}],
            "conduct_step_results": {"step_0": {"value": 1.2}},
        },
        measurement_data={"legacy": 1},
    )
    fields = build_quality_inspection_revoke_conduct_fields(
        entity_type="process_inspection",
        updated_by=1,
        updated_by_name="tester",
        inspection=inspection,
    )
    assert fields["quality_characteristics"]["plan_name"] == "过程方案"
    assert "conduct_step_results" not in fields["quality_characteristics"]
    assert fields["measurement_data"] is None
