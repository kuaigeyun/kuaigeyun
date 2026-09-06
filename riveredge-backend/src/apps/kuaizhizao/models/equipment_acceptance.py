"""设备工装验收（R-10 / #20）。

按设备或工装维护验收目录与履历：时限、验收单、延期异常、提交审核批准。
"""

from tortoise import fields

from infra.models.base import BaseModel


class EquipmentAcceptance(BaseModel):
    """设备/工装验收目录与履历。"""

    class Meta:
        table = "apps_kuaizhizao_equipment_acceptances"
        table_description = "快格轻制造 - 设备工装验收"
        unique_together = [("tenant_id", "acceptance_no")]
        indexes = [
            ("tenant_id", "status"),
            ("tenant_id", "target_type", "target_id"),
            ("tenant_id", "due_date"),
            ("tenant_id", "category"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True, description="主键")
    acceptance_no = fields.CharField(max_length=64, description="验收单号")
    target_type = fields.CharField(max_length=20, description="对象类型 equipment/tool")
    target_id = fields.IntField(description="设备或工装主键")
    target_uuid = fields.CharField(max_length=36, description="设备或工装 UUID")
    target_code = fields.CharField(max_length=50, null=True, description="对象编码快照")
    target_name = fields.CharField(max_length=200, null=True, description="对象名称快照")
    category = fields.CharField(max_length=100, null=True, description="验收分类目录")
    due_date = fields.DateField(description="要求完成验收时限")
    accepted_at = fields.DateField(null=True, description="实际验收日期")
    result = fields.CharField(max_length=32, null=True, description="验收结果 合格/不合格/延期异常")
    exception_problem = fields.TextField(null=True, description="无法及时验收时的异常问题")
    solution = fields.TextField(null=True, description="解决方案")
    handled_at = fields.DatetimeField(null=True, description="异常处理时间")
    applicant_id = fields.IntField(null=True, description="申请人ID")
    applicant_name = fields.CharField(max_length=100, null=True, description="申请人姓名")
    status = fields.CharField(max_length=32, default="草稿", description="草稿/已提交/已批准/已驳回")
    approver_id = fields.IntField(null=True, description="批准人ID")
    approver_name = fields.CharField(max_length=100, null=True, description="批准人姓名")
    approved_at = fields.DatetimeField(null=True, description="批准时间")
    reject_reason = fields.TextField(null=True, description="驳回原因")
    attachments = fields.JSONField(null=True, description="验收单扫描件")
    remark = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True, description="软删除")
