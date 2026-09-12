"""轻财务固定资产模型。"""

from tortoise import fields

from core.models.base import BaseModel


class FaCategory(BaseModel):
    """资产类别（默认折旧方法、残值率、科目）。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    category_code = fields.CharField(max_length=50, description="类别编码")
    category_name = fields.CharField(max_length=200, description="类别名称")
    depreciation_method = fields.CharField(
        max_length=30, default="straight_line", description="折旧方法"
    )
    useful_life_months = fields.IntField(default=60, description="使用月数")
    residual_rate = fields.DecimalField(
        max_digits=8, decimal_places=4, default=0.05, description="残值率"
    )
    asset_account_code = fields.CharField(max_length=20, default="1601", description="固定资产科目")
    accumulated_depreciation_account_code = fields.CharField(
        max_length=20, default="1602", description="累计折旧科目"
    )
    expense_account_code = fields.CharField(
        max_length=20, default="6602", description="折旧费用科目"
    )
    is_active = fields.BooleanField(default=True, description="启用")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_categories"
        table_description = "轻财务 - 固定资产类别"
        unique_together = (("tenant_id", "category_code"),)
        indexes = [("tenant_id", "is_active")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaAsset(BaseModel):
    """固定资产卡片。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    asset_code = fields.CharField(max_length=50, description="资产编号")
    asset_name = fields.CharField(max_length=200, description="资产名称")
    category_id = fields.IntField(null=True, description="类别ID")
    category_name = fields.CharField(max_length=200, null=True, description="类别名称")
    quantity = fields.DecimalField(max_digits=20, decimal_places=4, default=1, description="数量")
    unit = fields.CharField(max_length=20, null=True, description="单位")
    change_method = fields.CharField(max_length=50, null=True, description="变动方式")
    department_id = fields.IntField(null=True, description="使用部门ID")
    department_name = fields.CharField(max_length=100, null=True, description="使用部门")
    user_id = fields.IntField(null=True, description="使用人ID")
    user_name = fields.CharField(max_length=100, null=True, description="使用人")
    status = fields.CharField(max_length=30, default="active", description="状态")
    location = fields.CharField(max_length=200, null=True, description="存放地点")
    start_use_date = fields.DateField(null=True, description="开始使用日期")
    entry_date = fields.DateField(null=True, description="入账日期")
    specification = fields.CharField(max_length=500, null=True, description="规格型号")
    notes = fields.TextField(null=True, description="备注")
    attachment_uuids = fields.JSONField(default=list, description="附件UUID列表")

    depreciation_method = fields.CharField(
        max_length=30, default="straight_line", description="折旧方法"
    )
    original_value = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="原值"
    )
    impairment_value = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="减值准备"
    )
    useful_life_months = fields.IntField(default=60, description="使用月数")
    depreciated_periods = fields.IntField(default=0, description="已折旧期间数")
    accumulated_depreciation = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="累计折旧"
    )
    residual_rate = fields.DecimalField(
        max_digits=8, decimal_places=4, default=0.05, description="残值率"
    )
    monthly_depreciation = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="月折旧额"
    )
    asset_account_code = fields.CharField(max_length=20, default="1601", description="固定资产科目")
    accumulated_depreciation_account_code = fields.CharField(
        max_length=20, default="1602", description="累计折旧科目"
    )
    expense_account_code = fields.CharField(
        max_length=20, default="6602", description="折旧费用科目"
    )

    source_kuaioa_asset_id = fields.IntField(null=True, description="来源OA资产ID")
    source_purchase_id = fields.IntField(null=True, description="来源采买申请ID")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_assets"
        table_description = "轻财务 - 固定资产卡片"
        unique_together = (("tenant_id", "asset_code"),)
        indexes = [
            ("tenant_id", "status"),
            ("tenant_id", "category_id"),
            ("tenant_id", "source_kuaioa_asset_id"),
            ("tenant_id", "source_purchase_id"),
        ]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaChange(BaseModel):
    """资产变动单。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    change_code = fields.CharField(max_length=50, description="变动单号")
    asset_id = fields.IntField(description="资产ID")
    asset_code = fields.CharField(max_length=50, null=True, description="资产编号")
    asset_name = fields.CharField(max_length=200, null=True, description="资产名称")
    change_type = fields.CharField(max_length=50, description="变动类型")
    change_date = fields.DateField(description="变动日期")
    before_snapshot = fields.JSONField(default=dict, description="变动前快照")
    after_snapshot = fields.JSONField(default=dict, description="变动后快照")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_changes"
        table_description = "轻财务 - 资产变动"
        unique_together = (("tenant_id", "change_code"),)
        indexes = [("tenant_id", "asset_id"), ("tenant_id", "status")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaDisposal(BaseModel):
    """资产清理单。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    disposal_code = fields.CharField(max_length=50, description="清理单号")
    asset_id = fields.IntField(description="资产ID")
    asset_code = fields.CharField(max_length=50, null=True, description="资产编号")
    asset_name = fields.CharField(max_length=200, null=True, description="资产名称")
    disposal_date = fields.DateField(description="清理日期")
    disposal_type = fields.CharField(max_length=50, description="清理方式")
    disposal_amount = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="清理收入"
    )
    status = fields.CharField(max_length=30, default="draft", description="状态")
    voucher_id = fields.IntField(null=True, description="凭证ID")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_disposals"
        table_description = "轻财务 - 资产清理"
        unique_together = (("tenant_id", "disposal_code"),)
        indexes = [("tenant_id", "asset_id"), ("tenant_id", "status")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaDepreciationRun(BaseModel):
    """折旧计提批次。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    run_code = fields.CharField(max_length=50, description="计提批次号")
    period_year = fields.IntField(description="会计年")
    period_month = fields.IntField(description="会计月")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    total_amount = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="计提合计"
    )
    confirmed_at = fields.DatetimeField(null=True, description="确认时间")
    confirmed_by = fields.IntField(null=True, description="确认人")
    confirmed_by_name = fields.CharField(max_length=100, null=True, description="确认人姓名")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_depr_runs"
        table_description = "轻财务 - 折旧计提批次"
        unique_together = (("tenant_id", "run_code"),)
        indexes = [("tenant_id", "period_year", "period_month"), ("tenant_id", "status")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaDepreciationRunLine(BaseModel):
    """折旧计提明细（金额可二次修改）。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    run_id = fields.IntField(description="计提批次ID")
    asset_id = fields.IntField(description="资产ID")
    asset_code = fields.CharField(max_length=50, null=True, description="资产编号")
    asset_name = fields.CharField(max_length=200, null=True, description="资产名称")
    calculated_amount = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="系统计算金额"
    )
    final_amount = fields.DecimalField(
        max_digits=20, decimal_places=4, default=0, description="最终计提金额"
    )
    adjusted_by = fields.IntField(null=True, description="调整人")
    adjusted_by_name = fields.CharField(max_length=100, null=True, description="调整人姓名")
    adjusted_at = fields.DatetimeField(null=True, description="调整时间")
    accounting_event_id = fields.IntField(null=True, description="会计事件ID")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_depr_run_lines"
        table_description = "轻财务 - 折旧计提明细"
        indexes = [("tenant_id", "run_id"), ("tenant_id", "asset_id")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaDepreciationAdjustment(BaseModel):
    """折旧调整单。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    adjustment_code = fields.CharField(max_length=50, description="调整单号")
    asset_id = fields.IntField(description="资产ID")
    asset_code = fields.CharField(max_length=50, null=True, description="资产编号")
    asset_name = fields.CharField(max_length=200, null=True, description="资产名称")
    period_year = fields.IntField(description="会计年")
    period_month = fields.IntField(description="会计月")
    adjustment_amount = fields.DecimalField(
        max_digits=20, decimal_places=4, description="调整金额"
    )
    reason = fields.TextField(null=True, description="调整原因")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_depr_adjustments"
        table_description = "轻财务 - 折旧调整"
        unique_together = (("tenant_id", "adjustment_code"),)
        indexes = [("tenant_id", "asset_id"), ("tenant_id", "status")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class FaPeriodClose(BaseModel):
    """资产结账期间锁。"""

    id = fields.IntField(pk=True)
    tenant_id = fields.IntField(description="租户ID")
    period_year = fields.IntField(description="会计年")
    period_month = fields.IntField(description="会计月")
    closed_at = fields.DatetimeField(description="结账时间")
    closed_by = fields.IntField(null=True, description="结账人")
    closed_by_name = fields.CharField(max_length=100, null=True, description="结账人姓名")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaicaiwu_fa_period_closes"
        table_description = "轻财务 - 资产结账"
        unique_together = (("tenant_id", "period_year", "period_month"),)

    class PydanticMeta:
        exclude = ["deleted_at"]
