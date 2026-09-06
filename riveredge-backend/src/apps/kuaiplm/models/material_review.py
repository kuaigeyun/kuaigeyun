"""物料评审（R-15 #37）

从物料库选择物料并标注优先使用 / 限用 / 禁止使用。
"""

from tortoise import fields

from core.models.base import BaseModel

USAGE_PREFERRED = "preferred"
USAGE_LIMITED = "limited"
USAGE_FORBIDDEN = "forbidden"
USAGE_STATUSES = frozenset({USAGE_PREFERRED, USAGE_LIMITED, USAGE_FORBIDDEN})


class MaterialReview(BaseModel):
    """物料评审单头。"""

    class Meta:
        table = "apps_kuaiplm_material_reviews"
        table_description = "快研发 - 物料评审"
        unique_together = [("tenant_id", "review_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "status"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    review_code = fields.CharField(max_length=50, description="评审单号")
    project_id = fields.IntField(description="研发项目ID")
    project_code = fields.CharField(max_length=50, description="项目代号快照")
    project_name = fields.CharField(max_length=200, description="项目名称快照")
    title = fields.CharField(max_length=200, description="标题")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/rejected",
    )
    remarks = fields.TextField(null=True, description="备注")
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    deleted_at = fields.DatetimeField(null=True)


class MaterialReviewLine(BaseModel):
    """物料评审明细行。"""

    class Meta:
        table = "apps_kuaiplm_material_review_lines"
        table_description = "快研发 - 物料评审明细"
        indexes = [("tenant_id", "review_id"), ("uuid",)]

    id = fields.IntField(pk=True)
    review_id = fields.IntField(description="评审单ID")
    line_no = fields.IntField(default=1, description="行号")
    material_id = fields.IntField(null=True, description="物料ID")
    material_code = fields.CharField(max_length=80, description="物料编码快照")
    material_name = fields.CharField(max_length=200, description="物料名称快照")
    usage_status = fields.CharField(
        max_length=20,
        description="preferred/limited/forbidden",
    )
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)
