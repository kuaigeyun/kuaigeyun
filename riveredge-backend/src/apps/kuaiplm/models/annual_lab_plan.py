"""R-07 年度实验计划（快研发通用）。"""

from tortoise import fields

from core.models.base import BaseModel

# 月度领料审批链：实验室 → 部门经理 → 销售 → 计划
ISSUE_STATUS_NONE = "none"
ISSUE_STATUS_PENDING_DEPT = "pending_dept"
ISSUE_STATUS_PENDING_SALES = "pending_sales"
ISSUE_STATUS_PENDING_PLAN = "pending_plan"
ISSUE_STATUS_APPROVED = "approved"
ISSUE_STATUS_REJECTED = "rejected"
ISSUE_STATUSES = frozenset(
    {
        ISSUE_STATUS_NONE,
        ISSUE_STATUS_PENDING_DEPT,
        ISSUE_STATUS_PENDING_SALES,
        ISSUE_STATUS_PENDING_PLAN,
        ISSUE_STATUS_APPROVED,
        ISSUE_STATUS_REJECTED,
    }
)

MONTH_STATUS_PENDING = "pending"
MONTH_STATUS_IN_PROGRESS = "in_progress"
MONTH_STATUS_COMPLETED = "completed"
MONTH_STATUSES = frozenset(
    {MONTH_STATUS_PENDING, MONTH_STATUS_IN_PROGRESS, MONTH_STATUS_COMPLETED}
)

PLAN_STATUS_DRAFT = "draft"
PLAN_STATUS_PENDING = "pending"
PLAN_STATUS_APPROVED = "approved"
PLAN_STATUS_REJECTED = "rejected"
PLAN_STATUS_CLOSED = "closed"
PLAN_STATUSES = frozenset(
    {
        PLAN_STATUS_DRAFT,
        PLAN_STATUS_PENDING,
        PLAN_STATUS_APPROVED,
        PLAN_STATUS_REJECTED,
        PLAN_STATUS_CLOSED,
    }
)


class AnnualLabPlan(BaseModel):
    """年度例试计划头。"""

    class Meta:
        table = "apps_kuaiplm_annual_lab_plans"
        table_description = "快研发 - 年度实验计划"
        unique_together = [("tenant_id", "plan_code")]
        indexes = [
            ("tenant_id", "plan_year"),
            ("tenant_id", "status"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    plan_code = fields.CharField(max_length=50, description="计划单号")
    plan_year = fields.IntField(description="计划年度 YYYY")
    title = fields.CharField(max_length=200, description="计划标题")
    status = fields.CharField(
        max_length=30,
        default=PLAN_STATUS_DRAFT,
        description="draft/pending/approved/rejected/closed",
    )
    plan_file_uuid = fields.CharField(max_length=36, null=True, description="年度计划附件")
    plan_file_name = fields.CharField(max_length=255, null=True)
    owner_user_id = fields.IntField(null=True, description="责任人")
    owner_user_name = fields.CharField(max_length=100, null=True)
    submitted_at = fields.DatetimeField(null=True)
    approved_at = fields.DatetimeField(null=True)
    approved_by = fields.IntField(null=True)
    approved_by_name = fields.CharField(max_length=100, null=True)
    rejected_at = fields.DatetimeField(null=True)
    reject_reason = fields.TextField(null=True)
    closed_at = fields.DatetimeField(null=True)
    remarks = fields.TextField(null=True)
    created_by = fields.IntField(null=True)
    created_by_name = fields.CharField(max_length=100, null=True)
    updated_by = fields.IntField(null=True)
    updated_by_name = fields.CharField(max_length=100, null=True)
    deleted_at = fields.DatetimeField(null=True)


class AnnualLabPlanMonth(BaseModel):
    """年度计划月度执行台账。"""

    class Meta:
        table = "apps_kuaiplm_annual_lab_plan_months"
        table_description = "快研发 - 年度实验计划月度台账"
        unique_together = [("tenant_id", "plan_id", "year_month")]
        indexes = [
            ("tenant_id", "plan_id"),
            ("tenant_id", "year_month"),
            ("tenant_id", "month_status"),
            ("tenant_id", "issue_status"),
            ("uuid",),
        ]

    id = fields.IntField(pk=True)
    plan_id = fields.IntField(description="年度计划ID")
    year_month = fields.CharField(max_length=7, description="YYYY-MM")
    month_no = fields.IntField(description="1-12")
    title = fields.CharField(max_length=200, null=True, description="本月任务标题")
    month_status = fields.CharField(
        max_length=30,
        default=MONTH_STATUS_PENDING,
        description="pending/in_progress/completed",
    )
    owner_user_id = fields.IntField(null=True)
    owner_user_name = fields.CharField(max_length=100, null=True)
    due_at = fields.DatetimeField(null=True, description="本月任务到期时刻")
    material_desc = fields.TextField(null=True, description="领料说明")
    issue_status = fields.CharField(
        max_length=30,
        default=ISSUE_STATUS_NONE,
        description="none/pending_dept/pending_sales/pending_plan/approved/rejected",
    )
    issue_submitted_at = fields.DatetimeField(null=True)
    issue_approved_at = fields.DatetimeField(null=True)
    issue_reject_reason = fields.TextField(null=True)
    lab_request_id = fields.IntField(null=True, description="关联实验委托")
    lab_request_code = fields.CharField(max_length=50, null=True)
    report_file_uuid = fields.CharField(max_length=36, null=True)
    report_url = fields.CharField(max_length=500, null=True)
    defect_desc = fields.TextField(null=True, description="当月不良描述")
    treatment_result = fields.TextField(null=True, description="处理结果")
    completed_at = fields.DatetimeField(null=True)
    remarks = fields.TextField(null=True)
    deleted_at = fields.DatetimeField(null=True)
