"""打印工位桥接任务（INF-07）。

打印成功以设备桥接回执为准；同一幂等键不重复打印。
"""

from tortoise import fields

from .base import BaseModel


class PrintJob(BaseModel):
    id = fields.IntField(pk=True, description="主键")
    idempotency_key = fields.CharField(max_length=120, description="幂等键")
    template_uuid = fields.CharField(max_length=36, description="打印模板 UUID")
    template_version = fields.IntField(null=True, description="模板版本")
    device_uuid = fields.CharField(max_length=36, null=True, description="打印设备 UUID")
    copies = fields.IntField(default=1, description="份数")
    entity_type = fields.CharField(max_length=100, null=True, description="业务实体类型")
    entity_id = fields.IntField(null=True, description="业务实体 ID")
    entity_uuid = fields.CharField(max_length=36, null=True, description="业务实体 UUID")
    payload_snapshot = fields.JSONField(description="标签数据快照")
    status = fields.CharField(
        max_length=20,
        default="pending",
        description="pending/sent/success/failed/cancelled",
    )
    is_reprint = fields.BooleanField(default=False, description="是否补打")
    source_job_id = fields.IntField(null=True, description="补打来源任务")
    bridge_receipt = fields.JSONField(null=True, description="桥接回执")
    error_message = fields.TextField(null=True, description="失败原因")
    requested_by = fields.IntField(null=True, description="操作人")
    requested_by_name = fields.CharField(max_length=100, null=True, description="操作人姓名快照")
    completed_at = fields.DatetimeField(null=True, description="完成时刻")
    deleted_at = fields.DatetimeField(null=True, description="软删除")

    class Meta:
        table = "core_print_jobs"
        unique_together = [("tenant_id", "idempotency_key")]
        indexes = [
            ("tenant_id", "status"),
            ("tenant_id", "entity_type", "entity_id"),
            ("uuid",),
        ]
