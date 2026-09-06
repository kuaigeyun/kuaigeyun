"""标签工位引擎模型（R-16 通用）。"""

from tortoise import fields

from core.models.base import BaseModel


class LabelModelConfig(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    model_code = fields.CharField(max_length=80, description="型号编码")
    model_name = fields.CharField(max_length=200, description="型号名称")
    template_uuid = fields.CharField(max_length=36, description="打印模板UUID")
    template_version = fields.IntField(null=True, description="模板版本")
    qty_per_box = fields.IntField(default=1, description="每箱数量")
    print_copies = fields.IntField(default=1, description="打印份数")
    device_uuid = fields.CharField(max_length=36, null=True, description="默认打印设备")
    validation_hooks = fields.JSONField(default=list, description="校验钩子 code 列表")
    policy_config = fields.JSONField(
        default=dict,
        description="策略参数（如箱号周期唯一天数）；由配置/行业包声明，禁止客户名常量",
    )
    is_active = fields.BooleanField(default=True, description="启用")
    remarks = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_model_configs"
        unique_together = (("tenant_id", "model_code"),)
        indexes = [("tenant_id", "is_active")]


class LabelStation(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    station_code = fields.CharField(max_length=50, description="工位编码")
    station_name = fields.CharField(max_length=200, description="工位名称")
    model_config_id = fields.IntField(null=True, description="默认型号配置")
    default_mode = fields.CharField(max_length=20, default="work", description="默认模式")
    device_uuid = fields.CharField(max_length=36, null=True, description="打印设备")
    unlock_requires_password = fields.BooleanField(default=False, description="解锁须二次校验密码")
    is_active = fields.BooleanField(default=True, description="启用")
    remarks = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_stations"
        unique_together = (("tenant_id", "station_code"),)
        indexes = [("tenant_id", "is_active")]


class LabelStationSession(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    station_id = fields.IntField(description="工位ID")
    station_code = fields.CharField(max_length=50, description="工位编码快照")
    mode = fields.CharField(max_length=20, default="work", description="work/reprint/admin")
    status = fields.CharField(max_length=20, default="active", description="active/locked/closed")
    model_config_id = fields.IntField(null=True, description="当前型号配置")
    model_code = fields.CharField(max_length=80, null=True, description="当前型号")
    current_box_id = fields.IntField(null=True, description="当前开箱")
    locked_reason = fields.CharField(max_length=200, null=True, description="锁定原因")
    locked_at = fields.DatetimeField(null=True, description="锁定时间")
    operator_id = fields.IntField(null=True, description="操作人")
    operator_name = fields.CharField(max_length=100, null=True, description="操作人姓名")
    opened_at = fields.DatetimeField(description="开会话时间")
    closed_at = fields.DatetimeField(null=True, description="关会话时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_station_sessions"
        indexes = [("tenant_id", "station_id", "status")]


class LabelOuterBox(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    box_no = fields.CharField(max_length=80, description="箱号")
    session_id = fields.IntField(null=True, description="会话ID")
    station_id = fields.IntField(null=True, description="工位ID")
    model_config_id = fields.IntField(null=True, description="型号配置")
    model_code = fields.CharField(max_length=80, description="型号编码")
    qty_target = fields.IntField(description="目标数量")
    qty_current = fields.IntField(default=0, description="已绑数量")
    status = fields.CharField(max_length=20, default="open", description="open/full/unbound")
    print_job_id = fields.IntField(null=True, description="打印任务ID")
    print_job_code = fields.CharField(max_length=80, null=True, description="打印任务号")
    closed_at = fields.DatetimeField(null=True, description="满箱时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_outer_boxes"
        unique_together = (("tenant_id", "box_no"),)
        indexes = [
            ("tenant_id", "session_id", "status"),
            ("tenant_id", "model_code", "status"),
        ]


class LabelBoxItem(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    box_id = fields.IntField(description="外箱ID")
    barcode = fields.CharField(max_length=200, description="条码")
    model_code = fields.CharField(max_length=80, null=True, description="型号")
    status = fields.CharField(max_length=20, default="bound", description="bound/unbound")
    scanned_at = fields.DatetimeField(description="扫描时间")
    unbound_at = fields.DatetimeField(null=True, description="解绑时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_box_items"
        indexes = [("tenant_id", "box_id", "status")]


class LabelScanEvent(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    session_id = fields.IntField(null=True, description="会话ID")
    station_id = fields.IntField(null=True, description="工位ID")
    box_id = fields.IntField(null=True, description="外箱ID")
    barcode = fields.CharField(max_length=200, description="条码")
    result = fields.CharField(max_length=20, description="ok/reject/lock")
    message = fields.CharField(max_length=500, null=True, description="结果说明")
    payload = fields.JSONField(null=True, description="扩展载荷")
    occurred_at = fields.DatetimeField(description="发生时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_scan_events"
        indexes = [("tenant_id", "session_id", "occurred_at")]


class LabelLockEvent(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    session_id = fields.IntField(description="会话ID")
    station_id = fields.IntField(null=True, description="工位ID")
    action = fields.CharField(max_length=20, description="lock/unlock")
    reason = fields.CharField(max_length=200, null=True, description="原因")
    operator_id = fields.IntField(null=True, description="操作人")
    operator_name = fields.CharField(max_length=100, null=True, description="操作人姓名")
    occurred_at = fields.DatetimeField(description="发生时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_lock_events"
        indexes = [("tenant_id", "session_id", "occurred_at")]


class LabelUnbindRecord(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    box_id = fields.IntField(description="外箱ID")
    box_no = fields.CharField(max_length=80, description="箱号")
    item_id = fields.IntField(null=True, description="明细ID")
    barcode = fields.CharField(max_length=200, null=True, description="条码")
    reason = fields.CharField(max_length=200, null=True, description="原因")
    operator_id = fields.IntField(null=True, description="操作人")
    operator_name = fields.CharField(max_length=100, null=True, description="操作人姓名")
    occurred_at = fields.DatetimeField(description="发生时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_unbind_records"
        indexes = [("tenant_id", "box_id", "occurred_at")]


class LabelCleanupRun(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    before_at = fields.DatetimeField(description="清理截止时刻")
    summary = fields.JSONField(default=dict, description="清理摘要")
    operator_id = fields.IntField(null=True, description="操作人")
    operator_name = fields.CharField(max_length=100, null=True, description="操作人姓名")
    occurred_at = fields.DatetimeField(description="执行时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaizhizao_label_cleanup_runs"
