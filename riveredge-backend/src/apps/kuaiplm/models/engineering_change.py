"""工程变更单（R-04 / ECN）：多物料对照 + ERP 稽核闭环骨架。"""

from tortoise import fields

from core.models.base import BaseModel

# change_kind：驱动后续必填字段校验（首版仅存档，不按客户硬编码分支）
CHANGE_KIND_MATERIAL = "material"
CHANGE_KIND_PROCESS = "process"
CHANGE_KIND_DRAWING = "drawing"
CHANGE_KIND_OTHER = "other"
CHANGE_KINDS = frozenset(
    {
        CHANGE_KIND_MATERIAL,
        CHANGE_KIND_PROCESS,
        CHANGE_KIND_DRAWING,
        CHANGE_KIND_OTHER,
    }
)

DISPOSITION_SCRAP = "scrap"
DISPOSITION_USE_UP = "use_up"
DISPOSITION_REWORK = "rework"
DISPOSITION_RETURN = "return"
DISPOSITION_OTHER = "other"
DISPOSITIONS = frozenset(
    {
        DISPOSITION_SCRAP,
        DISPOSITION_USE_UP,
        DISPOSITION_REWORK,
        DISPOSITION_RETURN,
        DISPOSITION_OTHER,
    }
)


class EngineeringChange(BaseModel):
    """工程变更单头（ECN）。"""

    class Meta:
        table = "apps_kuaiplm_engineering_changes"
        table_description = "快研发 - 工程变更单"
        unique_together = [("tenant_id", "ecn_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "change_kind"),
            ("tenant_id", "status"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    ecn_code = fields.CharField(max_length=50, description="工程变更单号")
    project_id = fields.IntField(null=True, description="研发项目ID（可选）")
    project_code = fields.CharField(max_length=50, null=True, description="项目代号快照")
    project_name = fields.CharField(max_length=200, null=True, description="项目名称快照")
    change_kind = fields.CharField(
        max_length=20,
        description="material/process/drawing/other",
    )
    title = fields.CharField(max_length=200, description="标题")
    change_reason = fields.TextField(null=True, description="变更原因")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/erp_pending/erp_failed/closed",
    )
    erp_ecn_no = fields.CharField(max_length=80, null=True, description="ERP ECN 回填号")
    erp_audit_status = fields.CharField(
        max_length=20,
        null=True,
        description="pending/pass/fail",
    )
    erp_audit_notes = fields.TextField(null=True, description="ERP 稽核说明")
    remarks = fields.TextField(null=True, description="备注")
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    closed_at = fields.DatetimeField(null=True)
    deleted_at = fields.DatetimeField(null=True)


class EngineeringChangeMaterialLine(BaseModel):
    """工程变更物料对照行。"""

    class Meta:
        table = "apps_kuaiplm_ecn_material_lines"
        table_description = "快研发 - 工程变更物料行"
        indexes = [("tenant_id", "ecn_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    ecn_id = fields.IntField(description="工程变更单ID")
    line_no = fields.IntField(default=1, description="行号")
    material_id = fields.IntField(null=True, description="物料ID")
    material_code = fields.CharField(max_length=80, description="物料编码快照")
    material_name = fields.CharField(max_length=200, description="物料名称快照")
    before_desc = fields.CharField(max_length=500, null=True, description="变更前")
    after_desc = fields.CharField(max_length=500, null=True, description="变更后")
    stock_qty = fields.DecimalField(max_digits=18, decimal_places=4, null=True)
    unit_price = fields.DecimalField(max_digits=18, decimal_places=6, null=True)
    cost_amount = fields.DecimalField(max_digits=18, decimal_places=4, null=True)
    disposition = fields.CharField(
        max_length=20,
        null=True,
        description="scrap/use_up/rework/return/other",
    )
    owner_user_id = fields.IntField(null=True, description="行会签负责人快照")
    owner_user_name = fields.CharField(max_length=100, null=True)
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)


class EngineeringChangeSignoff(BaseModel):
    """部门会签结果行（条件加签后续扩展）。"""

    class Meta:
        table = "apps_kuaiplm_ecn_signoffs"
        table_description = "快研发 - 工程变更会签行"
        indexes = [("tenant_id", "ecn_id"), ("uuid",)]
        unique_together = [("tenant_id", "ecn_id", "dept_code")]

    id = fields.IntField(pk=True)
    ecn_id = fields.IntField(description="工程变更单ID")
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
