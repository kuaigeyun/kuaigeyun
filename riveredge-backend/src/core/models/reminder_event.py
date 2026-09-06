"""提醒事件账本（INF-03）。

唯一键：租户 + 规则 + 业务对象 + 计划触发时刻(UTC) + 渠道。
防止 worker 重启或重复扫描造成重复发送。
"""

from tortoise import fields

from .base import BaseModel


class ReminderEvent(BaseModel):
    """提醒事件账本。"""

    id = fields.IntField(pk=True, description="主键")
    rule_id = fields.CharField(max_length=100, description="提醒规则ID")
    rule_code = fields.CharField(max_length=100, null=True, description="提醒规则编码")
    entity_type = fields.CharField(max_length=100, description="业务实体类型")
    entity_id = fields.IntField(description="业务实体ID")
    entity_uuid = fields.CharField(max_length=36, null=True, description="业务实体UUID")
    channel = fields.CharField(max_length=20, description="渠道：internal/email/sms/push")
    planned_at = fields.DatetimeField(description="计划触发时刻（UTC）")
    status = fields.CharField(
        max_length=20,
        default="pending",
        description="pending/claimed/sent/failed/cancelled/stopped",
    )
    attempt_count = fields.IntField(default=0, description="尝试次数")
    last_error = fields.TextField(null=True, description="最近失败原因")
    sent_at = fields.DatetimeField(null=True, description="成功发送时刻（UTC）")
    stopped_reason = fields.CharField(max_length=200, null=True, description="停止原因")
    payload = fields.JSONField(null=True, description="发送上下文快照")
    deleted_at = fields.DatetimeField(null=True, description="软删除")

    class Meta:
        table = "core_reminder_events"
        unique_together = [
            ("tenant_id", "rule_id", "entity_type", "entity_id", "planned_at", "channel")
        ]
        indexes = [
            ("tenant_id", "status", "planned_at"),
            ("tenant_id", "entity_type", "entity_id"),
            ("uuid",),
        ]
