"""开模合同 / 打样订单（R-15 #71）

文员上传 → 审批（前期采购/总经理由审批流配置）→ 打印用印 → 存档。
"""

from tortoise import fields

from core.models.base import BaseModel


class MoldSampleOrder(BaseModel):
    """开模合同或打样订单。"""

    class Meta:
        table = "apps_kuaiplm_mold_sample_orders"
        table_description = "快研发 - 开模合同与打样订单"
        unique_together = [("tenant_id", "order_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "status"),
            ("tenant_id", "doc_kind"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    order_code = fields.CharField(max_length=50, description="合同/订单单号")
    project_id = fields.IntField(description="研发项目ID")
    project_code = fields.CharField(max_length=50, description="项目代号快照")
    project_name = fields.CharField(max_length=200, description="项目名称快照")
    doc_kind = fields.CharField(
        max_length=32,
        description="mold_contract=开模合同 / sample_order=打样订单",
    )
    title = fields.CharField(max_length=200, description="标题")
    contract_no = fields.CharField(max_length=80, null=True, description="外部合同号/订单号")
    party_name = fields.CharField(max_length=200, null=True, description="对方单位")
    file_uuid = fields.CharField(max_length=36, null=True, description="合同/订单文件 UUID")
    file_name = fields.CharField(max_length=200, null=True, description="文件名快照")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/sealed/archived/rejected",
    )
    remarks = fields.TextField(null=True)
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    sealed_at = fields.DatetimeField(null=True)
    sealed_by = fields.IntField(null=True)
    sealed_by_name = fields.CharField(max_length=100, null=True)
    archived_at = fields.DatetimeField(null=True)
    archived_by = fields.IntField(null=True)
    archived_by_name = fields.CharField(max_length=100, null=True)
    deleted_at = fields.DatetimeField(null=True)
