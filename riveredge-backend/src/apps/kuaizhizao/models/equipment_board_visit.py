"""设备看板参观展示覆盖（仅展示层，不改业务真源）。"""

from tortoise import fields

from core.models.base import BaseModel


class EquipmentBoardVisitOverride(BaseModel):
    """当前生效的参观展示指标覆盖。"""

    class Meta:
        table = "apps_kuaizhizao_equipment_board_visit_overrides"
        table_description = "快制造 - 设备看板参观展示覆盖"
        indexes = [
            ("tenant_id", "board_domain", "plant_id", "is_active"),
        ]

    id = fields.IntField(pk=True)
    board_domain = fields.CharField(
        max_length=32, default="equipment", description="equipment/esd"
    )
    plant_id = fields.IntField(null=True, description="厂区ID；空=总览")
    metric_key = fields.CharField(max_length=64, description="可覆盖指标键")
    metric_value = fields.FloatField(description="展示层数值")
    reason = fields.TextField(null=True, description="修订原因")
    is_active = fields.BooleanField(default=True)
    deleted_at = fields.DatetimeField(null=True)


class EquipmentBoardVisitAudit(BaseModel):
    """参观展示修订审计（只追加）。"""

    class Meta:
        table = "apps_kuaizhizao_equipment_board_visit_audits"
        table_description = "快制造 - 设备看板参观展示修订审计"
        indexes = [
            ("tenant_id", "board_domain", "plant_id", "created_at"),
        ]

    id = fields.IntField(pk=True)
    board_domain = fields.CharField(max_length=32, default="equipment")
    plant_id = fields.IntField(null=True)
    action = fields.CharField(max_length=32, description="set/clear/clear_all")
    metric_key = fields.CharField(max_length=64, null=True)
    before_value = fields.FloatField(null=True)
    after_value = fields.FloatField(null=True)
    reason = fields.TextField(null=True)
    operator_id = fields.IntField(null=True)
    operator_name = fields.CharField(max_length=100, null=True)
    payload = fields.JSONField(null=True)
    deleted_at = fields.DatetimeField(null=True)
