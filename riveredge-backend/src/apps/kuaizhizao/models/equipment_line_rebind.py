"""设备换线绑定与强制初检（R-10 WP-10.7）。"""

from tortoise import fields

from core.models.base import BaseModel


class EquipmentLineRebind(BaseModel):
    """换线绑定单：选定目标产线后扫码纳入设备，完成后写回产线并强制初检。"""

    class Meta:
        table = "apps_kuaizhizao_equipment_line_rebinds"
        table_description = "快格轻制造 - 设备换线绑定"
        unique_together = [("tenant_id", "document_no")]
        indexes = [
            ("tenant_id",),
            ("status",),
            ("production_line_id",),
        ]

    id = fields.IntField(pk=True)
    document_no = fields.CharField(max_length=64, description="换线单号")
    production_line_id = fields.IntField(description="目标产线ID")
    production_line_code = fields.CharField(max_length=50, null=True)
    production_line_name = fields.CharField(max_length=200, null=True)
    force_spot_overdue_hours = fields.IntField(default=4, description="换线后未初检超时小时")
    status = fields.CharField(max_length=32, default="进行中", description="进行中/已完成/已取消")
    completed_at = fields.DatetimeField(null=True)
    completed_by = fields.IntField(null=True)
    completed_by_name = fields.CharField(max_length=100, null=True)
    remark = fields.TextField(null=True)
    deleted_at = fields.DatetimeField(null=True)


class EquipmentLineRebindItem(BaseModel):
    """换线绑定明细：扫描纳入的设备及原产线快照。"""

    class Meta:
        table = "apps_kuaizhizao_equipment_line_rebind_items"
        table_description = "快格轻制造 - 设备换线绑定明细"
        unique_together = [("tenant_id", "rebind_id", "equipment_id")]
        indexes = [
            ("tenant_id",),
            ("rebind_id",),
            ("equipment_id",),
        ]

    id = fields.IntField(pk=True)
    rebind_id = fields.IntField(description="换线单ID")
    equipment_id = fields.IntField()
    equipment_uuid = fields.CharField(max_length=36)
    equipment_code = fields.CharField(max_length=50, null=True)
    equipment_name = fields.CharField(max_length=200, null=True)
    from_production_line_id = fields.IntField(null=True)
    from_production_line_code = fields.CharField(max_length=50, null=True)
    from_production_line_name = fields.CharField(max_length=200, null=True)
    scanned_at = fields.DatetimeField()
    force_spot_cleared_at = fields.DatetimeField(null=True)
    deleted_at = fields.DatetimeField(null=True)
