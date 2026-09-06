"""实验委托判定引擎单元测试。"""

from apps.kuaiplm.services.lab_judgment_engine import (
    aggregate_header_judgment,
    evaluate_measure_judgment,
    resolve_final_judgment,
)


def test_range_pass_and_fail():
    ok, ver, snap = evaluate_measure_judgment(
        compare_type="range",
        measured_value="5",
        standard_min="1",
        standard_max="10",
        standard_value=None,
        unit="mm",
    )
    assert ok == "pass"
    assert snap["auto_judgment"] == "pass"
    assert snap["measured_value"] == "5"
    assert "lab_range_v1" in ver

    bad, _, snap2 = evaluate_measure_judgment(
        compare_type="range",
        measured_value="12",
        standard_min="1",
        standard_max="10",
        standard_value=None,
    )
    assert bad == "fail"
    assert snap2["rule_version"] == snap2["rule_version"]


def test_empty_measured_is_na():
    j, _, snap = evaluate_measure_judgment(
        compare_type="range",
        measured_value="  ",
        standard_min="0",
        standard_max="1",
        standard_value=None,
    )
    assert j == "na"
    assert snap["auto_judgment"] == "na"


def test_aggregate_and_manual_priority():
    assert aggregate_header_judgment(["pass", "fail", "na"]) == "fail"
    assert aggregate_header_judgment(["pass", "ng"]) == "ng"
    assert resolve_final_judgment("pass", "ng") == "ng"
    assert resolve_final_judgment("fail", None) == "fail"
