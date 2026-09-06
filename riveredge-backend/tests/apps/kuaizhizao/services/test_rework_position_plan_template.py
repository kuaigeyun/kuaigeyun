"""返工排位策划模板常量冒烟。"""

from core.config.code_rule_entity_models import ENTITY_MODEL_BY_RULE_CODE


def test_rework_position_plan_template_code_rule_registered():
    assert "REWORK_POSITION_PLAN_TEMPLATE_CODE" in ENTITY_MODEL_BY_RULE_CODE
    module_path, class_name = ENTITY_MODEL_BY_RULE_CODE["REWORK_POSITION_PLAN_TEMPLATE_CODE"]
    assert module_path.endswith("rework_position_plan_template")
    assert class_name == "ReworkPositionPlanTemplate"


def test_rework_position_plan_template_models_importable():
    from apps.kuaizhizao.models.rework_position_plan_template import (
        ReworkPositionPlanTemplate,
        ReworkPositionPlanTemplateItem,
    )

    assert ReworkPositionPlanTemplate.Meta.table == "apps_kuaizhizao_rework_position_plan_templates"
    assert ReworkPositionPlanTemplateItem.Meta.table.endswith("template_items")
