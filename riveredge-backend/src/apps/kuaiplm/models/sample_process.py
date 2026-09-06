"""样品加工（R-15 #33）

通用单据：申请种类 + 附件类型由行业扩展 profile 驱动；
未启用电子包时仅「通用加工」与中性物料编码/版本。
"""

from tortoise import fields

from core.models.base import BaseModel


class SampleProcessApplication(BaseModel):
    """研发项目样品加工。"""

    class Meta:
        table = "apps_kuaiplm_sample_process_applications"
        table_description = "快研发 - 样品加工"
        unique_together = [("tenant_id", "application_code")]
        indexes = [
            ("tenant_id", "project_id"),
            ("tenant_id", "status"),
            ("tenant_id", "request_kind"),
            ("tenant_id", "material_code"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    application_code = fields.CharField(max_length=50, description="申请单号")
    project_id = fields.IntField(description="研发项目ID")
    project_code = fields.CharField(max_length=50, description="项目代号快照")
    project_name = fields.CharField(max_length=200, description="项目名称快照")
    request_kind = fields.CharField(
        max_length=30,
        default="general",
        description="申请种类 code（来自 profile）",
    )
    title = fields.CharField(max_length=200, description="申请标题")
    material_code = fields.CharField(
        max_length=100, null=True, description="物料编码（行业包可改展示为 PCB 料号）"
    )
    material_version = fields.CharField(
        max_length=50, null=True, description="物料版本"
    )
    release_date = fields.DateField(null=True, description="资料发布日期")
    purpose = fields.TextField(null=True, description="申请原因/用途")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/approved/rejected/closed",
    )
    # [{attachment_type, file_uuid, file_name}]
    attachments = fields.JSONField(default=list, description="附件清单")
    remarks = fields.TextField(null=True, description="备注")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    approved_at = fields.DatetimeField(null=True, description="审核通过时间")
    closed_at = fields.DatetimeField(null=True, description="关闭时间")
    deleted_at = fields.DatetimeField(null=True, description="软删除")
