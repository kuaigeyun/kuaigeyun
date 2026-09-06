"""项目建议书（R-15 #68）

销售发起 → 采购填写供应商 → 审批 → 下发研发。
"""

from tortoise import fields

from core.models.base import BaseModel


class ProjectProposal(BaseModel):
    """项目建议书。"""

    class Meta:
        table = "apps_kuaiplm_project_proposals"
        table_description = "快研发 - 项目建议书"
        unique_together = [("tenant_id", "proposal_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "status"),
            ("tenant_id", "supplier_id"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    proposal_code = fields.CharField(max_length=50, description="建议书单号")
    project_id = fields.IntField(description="研发项目ID")
    project_code = fields.CharField(max_length=50, description="项目代号快照")
    project_name = fields.CharField(max_length=200, description="项目名称快照")
    title = fields.CharField(max_length=200, description="标题")
    summary = fields.TextField(null=True, description="建议内容摘要")
    customer_name = fields.CharField(max_length=200, null=True, description="客户名称")
    expected_date = fields.DateField(null=True, description="期望推进日期")
    # 采购填写
    supplier_id = fields.IntField(null=True, description="供应商ID")
    supplier_code = fields.CharField(max_length=80, null=True, description="供应商编码快照")
    supplier_name = fields.CharField(max_length=200, null=True, description="供应商名称快照")
    supplier_contact = fields.CharField(max_length=200, null=True, description="供应商联系方式")
    supplier_remark = fields.TextField(null=True, description="采购备注")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/issued/rejected",
    )
    remarks = fields.TextField(null=True)
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    issued_at = fields.DatetimeField(null=True)
    issued_by = fields.IntField(null=True)
    issued_by_name = fields.CharField(max_length=100, null=True)
    deleted_at = fields.DatetimeField(null=True)
