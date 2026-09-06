"""R-11 返工单会签 / 物料需求 / 报废 / 排位策划子表（通用码，禁止客户专名）。"""

from tortoise import fields

from core.models.base import BaseModel


class ReworkOrderSignoff(BaseModel):
    """多部门会签结果行。"""

    class Meta:
        table = "apps_kuaizhizao_rework_order_signoffs"
        table_description = "快制造 - 返工单会签行"
        indexes = [("tenant_id", "rework_order_id"), ("uuid",)]
        unique_together = [("tenant_id", "rework_order_id", "dept_code")]

    id = fields.IntField(pk=True)
    rework_order_id = fields.IntField(description="返工单ID")
    dept_code = fields.CharField(max_length=50, description="部门代码")
    dept_name = fields.CharField(max_length=100, description="部门名称快照")
    sort_order = fields.IntField(default=0)
    status = fields.CharField(
        max_length=20,
        default="pending",
        description="pending/signed/skipped",
    )
    result = fields.CharField(max_length=20, null=True, description="agree/disagree")
    signer_id = fields.IntField(null=True)
    signer_name = fields.CharField(max_length=100, null=True)
    signed_at = fields.DatetimeField(null=True)
    notes = fields.TextField(null=True)
    deleted_at = fields.DatetimeField(null=True)


class ReworkOrderMaterialReq(BaseModel):
    """返工物料需求行（分项到位时间）。"""

    class Meta:
        table = "apps_kuaizhizao_rework_order_material_reqs"
        table_description = "快制造 - 返工单物料需求行"
        indexes = [("tenant_id", "rework_order_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    rework_order_id = fields.IntField(description="返工单ID")
    line_no = fields.IntField(default=1)
    material_id = fields.IntField(null=True)
    material_code = fields.CharField(max_length=80)
    material_name = fields.CharField(max_length=200)
    qty = fields.DecimalField(max_digits=18, decimal_places=4)
    unit = fields.CharField(max_length=20, null=True)
    required_at = fields.DatetimeField(null=True, description="要求到位时间")
    arrived_at = fields.DatetimeField(null=True, description="实际到位时间")
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)


class ReworkOrderScrapLine(BaseModel):
    """返工报废明细行。"""

    class Meta:
        table = "apps_kuaizhizao_rework_order_scrap_lines"
        table_description = "快制造 - 返工单报废明细"
        indexes = [("tenant_id", "rework_order_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    rework_order_id = fields.IntField(description="返工单ID")
    line_no = fields.IntField(default=1)
    material_id = fields.IntField(null=True)
    material_code = fields.CharField(max_length=80)
    material_name = fields.CharField(max_length=200)
    qty = fields.DecimalField(max_digits=18, decimal_places=4)
    unit = fields.CharField(max_length=20, null=True)
    scrap_reason = fields.CharField(max_length=500, null=True)
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)


class ReworkOrderPositionPlan(BaseModel):
    """排位策划行（与制造执行工序路由正交，禁止混字段）。"""

    class Meta:
        table = "apps_kuaizhizao_rework_order_position_plans"
        table_description = "快制造 - 返工单排位策划"
        indexes = [("tenant_id", "rework_order_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    rework_order_id = fields.IntField(description="返工单ID")
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
    planned_start_at = fields.DatetimeField(null=True, description="计划开始")
    planned_end_at = fields.DatetimeField(null=True, description="计划完成")
    planned_qty = fields.DecimalField(max_digits=18, decimal_places=4, null=True)
    owner_user_id = fields.IntField(null=True)
    owner_user_name = fields.CharField(max_length=100, null=True, description="责任班组/主管")
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)
