"""生产日报模板与单据（R-13）。"""

from tortoise import fields

from core.models.base import BaseModel


class ProductionDailyTemplate(BaseModel):
    """可配置日报业务类型（字段 schema 驱动）。"""

    class Meta:
        table = "apps_kuaizhizao_production_daily_templates"
        table_description = "快制造 - 生产日报模板"
        unique_together = (("tenant_id", "template_code"),)
        indexes = [("tenant_id", "is_active", "sort_order")]

    tenant_id = fields.IntField(description="租户ID")
    template_code = fields.CharField(max_length=50, description="模板编码")
    template_name = fields.CharField(max_length=200, description="模板名称")
    description = fields.TextField(null=True, description="说明")
    field_schema = fields.JSONField(default=list, description="字段定义列表")
    sort_order = fields.IntField(default=0, description="排序")
    is_active = fields.BooleanField(default=True, description="启用")
    is_system = fields.BooleanField(default=False, description="系统预置")
    deleted_at = fields.DatetimeField(null=True)

    class PydanticMeta:
        exclude = ["deleted_at"]


class ProductionDailyReport(BaseModel):
    """班组按模板录入的生产日报。"""

    class Meta:
        table = "apps_kuaizhizao_production_daily_reports"
        table_description = "快制造 - 生产日报"
        unique_together = (("tenant_id", "code"),)
        indexes = [
            ("tenant_id", "report_date"),
            ("tenant_id", "template_code", "report_date"),
            ("tenant_id", "team_name"),
            ("tenant_id", "status"),
        ]

    tenant_id = fields.IntField(description="租户ID")
    code = fields.CharField(max_length=50, description="日报单号")
    template_id = fields.IntField(description="模板ID")
    template_code = fields.CharField(max_length=50, description="模板编码快照")
    template_name = fields.CharField(max_length=200, description="模板名称快照")
    report_date = fields.DateField(description="日报日期")
    team_name = fields.CharField(max_length=100, null=True, description="班组")
    shift_name = fields.CharField(max_length=50, null=True, description="班次")
    workshop_name = fields.CharField(max_length=100, null=True, description="车间")
    plant_name = fields.CharField(max_length=100, null=True, description="厂区")
    field_values = fields.JSONField(default=dict, description="模板字段值")
    status = fields.CharField(max_length=30, default="draft", description="draft/submitted")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    remarks = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class PydanticMeta:
        exclude = ["deleted_at"]
