"""质量体系文件版本链（INF-05）。

QmsSystemDocument 保留当前生效头表字段；历史/升版记录写入本表。
"""

from tortoise import fields

from core.models.base import BaseModel


class QmsSystemDocumentVersion(BaseModel):
    class Meta:
        table = "apps_kuaizhizao_qms_system_document_versions"
        table_description = "快格轻制造 - 质量体系文件版本链"
        unique_together = [("tenant_id", "document_id", "version")]
        indexes = [
            ("tenant_id", "document_id", "status"),
            ("tenant_id", "document_id", "is_effective"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    document_id = fields.IntField(description="体系文件头表 ID")
    document_code = fields.CharField(max_length=50, description="文件编码快照")
    version = fields.CharField(max_length=30, description="版本号")
    status = fields.CharField(
        max_length=20,
        default="draft",
        description="draft/pending/effective/obsolete/rejected",
    )
    is_effective = fields.BooleanField(default=False, description="是否当前生效版")
    title = fields.CharField(max_length=200, description="标题快照")
    content = fields.TextField(null=True, description="内容摘要")
    file_uuid = fields.CharField(max_length=36, null=True, description="core file UUID")
    file_url = fields.CharField(max_length=500, null=True, description="附件或外链（过渡）")
    change_summary = fields.TextField(null=True, description="升版说明")
    effective_at = fields.DatetimeField(null=True, description="生效时间")
    obsolete_at = fields.DatetimeField(null=True, description="作废时间")
    created_by = fields.IntField(null=True, description="制定人")
    created_by_name = fields.CharField(max_length=100, null=True, description="制定人姓名快照")
    updated_by = fields.IntField(null=True, description="更新人")
    updated_by_name = fields.CharField(max_length=100, null=True, description="更新人姓名快照")
    deleted_at = fields.DatetimeField(null=True, description="软删除")
