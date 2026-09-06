"""R-11 返工排位策划模板主数据（与执行工序路由正交，禁止客户专名）。"""

from tortoise import fields

from core.models.base import BaseModel


class ReworkPositionPlanTemplate(BaseModel):
    """返工排位策划模板头。"""

    class Meta:
        table = "apps_kuaizhizao_rework_position_plan_templates"
        table_description = "快制造 - 返工排位策划模板"
        indexes = [
            ("tenant_id",),
            ("template_code",),
            ("is_active",),
            ("created_at",),
        ]
        unique_together = [("tenant_id", "template_code")]

    id = fields.IntField(pk=True)
    template_code = fields.CharField(max_length=50, description="模板编码")
    template_name = fields.CharField(max_length=200, description="模板名称")
    product_line_code = fields.CharField(
        max_length=50, null=True, description="产品线代码（可选，字典）"
    )
    is_active = fields.BooleanField(default=True, description="是否启用")
    total_items = fields.IntField(default=0, description="排位行数")
    remarks = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)


class ReworkPositionPlanTemplateItem(BaseModel):
    """返工排位策划模板明细（字段与单据排位行对齐）。"""

    class Meta:
        table = "apps_kuaizhizao_rework_position_plan_template_items"
        table_description = "快制造 - 返工排位策划模板明细"
        indexes = [("tenant_id", "template_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    template_id = fields.IntField(description="模板ID")
    line_no = fields.IntField(default=1)
    sequence = fields.IntField(default=1, description="工序序号")
    station_name = fields.CharField(max_length=100, description="工序名称")
    section_name = fields.CharField(max_length=100, null=True, description="工段/产线")
    station_code = fields.CharField(max_length=50, null=True, description="工位/设备")
    planned_headcount = fields.DecimalField(
        max_digits=18, decimal_places=4, null=True, description="计划人数"
    )
    standard_minutes = fields.DecimalField(
        max_digits=18, decimal_places=4, null=True, description="标准工时（分钟）"
    )
    planned_qty = fields.DecimalField(
        max_digits=18, decimal_places=4, null=True, description="计划数量"
    )
    owner_user_id = fields.IntField(null=True)
    owner_user_name = fields.CharField(max_length=100, null=True, description="责任班组/主管")
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)
