"""R-02 实验判定规则主数据（版本化；写入实测行时冻结快照）。"""

from tortoise import fields

from core.models.base import BaseModel


class LabJudgmentRule(BaseModel):
    """实验判定规则：同一 rule_code 可多版本并存。"""

    class Meta:
        table = "apps_kuaiplm_lab_judgment_rules"
        table_description = "快研发 - 实验判定规则"
        unique_together = [("tenant_id", "rule_code", "version")]
        indexes = [
            ("tenant_id", "is_active"),
            ("tenant_id", "rule_code"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    rule_code = fields.CharField(max_length=50, description="规则编码")
    rule_name = fields.CharField(max_length=200, description="规则名称")
    version = fields.CharField(max_length=40, default="1", description="版本号")
    compare_type = fields.CharField(
        max_length=20,
        default="range",
        description="range/eq/gte/lte/na",
    )
    standard_min = fields.CharField(max_length=80, null=True)
    standard_max = fields.CharField(max_length=80, null=True)
    standard_value = fields.CharField(max_length=80, null=True)
    unit = fields.CharField(max_length=40, null=True)
    item_name = fields.CharField(
        max_length=200, null=True, description="默认试验项名称（选用时预填）"
    )
    is_active = fields.BooleanField(default=True, description="是否启用")
    remarks = fields.TextField(null=True)
    created_by = fields.IntField(null=True)
    created_by_name = fields.CharField(max_length=100, null=True)
    updated_by = fields.IntField(null=True)
    updated_by_name = fields.CharField(max_length=100, null=True)
    deleted_at = fields.DatetimeField(null=True)
