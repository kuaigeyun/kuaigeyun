from types import SimpleNamespace

from apps.kuaizhizao.services.sales_order_service import SalesOrderService


def _material(*, base_unit: str = "克", units=None):
    return SimpleNamespace(
        id=1,
        main_code="YCL0008",
        code="YCL0008",
        name="野山梨",
        specification="",
        base_unit=base_unit,
        units=units or {
            "scenarios": {"sale": "千克"},
            "units": [
                {"unit": "千克", "numerator": 1000, "denominator": 1},
            ],
        },
    )


def test_material_fields_prefers_payload_unit_over_base_unit():
    material = _material()
    item = SimpleNamespace(
        material_id=1,
        material_unit="千克",
        material_code="",
        material_name="",
        material_spec=None,
    )
    code, name, spec, unit = SalesOrderService._material_fields_from_master_or_payload(
        item, {1: material}
    )
    assert code == "YCL0008"
    assert name == "野山梨"
    assert unit == "千克"


def test_material_fields_falls_back_to_sale_scenario_unit():
    material = _material()
    item = SimpleNamespace(
        material_id=1,
        material_unit="",
        material_code="",
        material_name="",
        material_spec=None,
    )
    _, _, _, unit = SalesOrderService._material_fields_from_master_or_payload(
        item, {1: material}
    )
    assert unit == "千克"


def test_material_fields_without_master_uses_payload_unit():
    item = SimpleNamespace(
        material_id=0,
        material_unit="千克",
        material_code="YCL0008",
        material_name="野山梨",
        material_spec=None,
    )
    _, _, _, unit = SalesOrderService._material_fields_from_master_or_payload(item, {})
    assert unit == "千克"
