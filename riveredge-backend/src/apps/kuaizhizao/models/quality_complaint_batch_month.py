"""R-05 质量投诉总批次月录入（手工分母，非投诉副本）。"""

from tortoise import fields

from core.models.base import BaseModel


class QualityComplaintBatchMonth(BaseModel):
    """按月录入的总批次数量，供投诉率分母使用。"""

    class Meta:
        table = "apps_kuaizhizao_quality_complaint_batch_months"
        table_description = "快制造 - 质量投诉总批次月录入"
        unique_together = [("tenant_id", "year_month")]
        indexes = [("tenant_id", "year_month"), ("uuid",)]

    id = fields.IntField(pk=True)
    year_month = fields.CharField(max_length=7, description="统计月 YYYY-MM")
    total_batch_count = fields.IntField(description="当月总批次数")
    remarks = fields.CharField(max_length=500, null=True)
    deleted_at = fields.DatetimeField(null=True)
