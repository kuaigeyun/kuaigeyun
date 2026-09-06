"""BOM 协同（R-15 #65）

项目发起；多分区并行填写且互不覆盖（分区 key 稳定，展示名由行业扩展 profile 驱动）；
审核后文员录入主数据 BOM。不复制工程 BOM 主表，仅协同稿 + 录入回写引用。
"""

from tortoise import fields

from core.models.base import BaseModel

SECTION_ELECTRONICS = "electronics"
SECTION_STRUCTURE = "structure"
BOM_COLLAB_SECTIONS = frozenset({SECTION_ELECTRONICS, SECTION_STRUCTURE})


class BomCollaboration(BaseModel):
    """BOM 协同单头。"""

    class Meta:
        table = "apps_kuaiplm_bom_collaborations"
        table_description = "快研发 - BOM 协同"
        unique_together = [("tenant_id", "collab_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "status"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    collab_code = fields.CharField(max_length=50, description="协同单号")
    project_id = fields.IntField(description="研发项目ID")
    project_code = fields.CharField(max_length=50, description="项目代号快照")
    project_name = fields.CharField(max_length=200, description="项目名称快照")
    title = fields.CharField(max_length=200, description="标题")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/entered/rejected",
    )
    # 分区填写状态：draft / ready（有行且已保存）
    electronics_status = fields.CharField(max_length=20, default="draft")
    structure_status = fields.CharField(max_length=20, default="draft")
    remarks = fields.TextField(null=True)
    # 文员录入后回写主数据 BOM 引用（不复制 BOM 行）
    master_bom_id = fields.IntField(null=True, description="主数据 BOM ID")
    master_bom_code = fields.CharField(max_length=80, null=True, description="主数据 BOM 编码快照")
    entered_by = fields.IntField(null=True)
    entered_by_name = fields.CharField(max_length=100, null=True)
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    entered_at = fields.DatetimeField(null=True)
    deleted_at = fields.DatetimeField(null=True)


class BomCollaborationLine(BaseModel):
    """BOM 协同明细（按分区隔离）。"""

    class Meta:
        table = "apps_kuaiplm_bom_collaboration_lines"
        table_description = "快研发 - BOM 协同明细"
        indexes = [
            ("tenant_id", "collab_id"),
            ("tenant_id", "collab_id", "section"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    collab_id = fields.IntField(description="协同单ID")
    section = fields.CharField(max_length=20, description="electronics/structure")
    line_no = fields.IntField(default=1)
    material_id = fields.IntField(null=True)
    material_code = fields.CharField(max_length=80)
    material_name = fields.CharField(max_length=200)
    qty = fields.DecimalField(max_digits=18, decimal_places=4, null=True)
    unit = fields.CharField(max_length=20, null=True)
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)
