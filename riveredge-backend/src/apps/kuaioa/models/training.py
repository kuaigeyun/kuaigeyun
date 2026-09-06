"""培训与上岗证模型。"""

from tortoise import fields

from core.models.base import BaseModel


class KuaioaTrainingPlan(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    plan_code = fields.CharField(max_length=50, description="计划编号")
    plan_name = fields.CharField(max_length=200, description="计划名称")
    plan_type = fields.CharField(max_length=50, default="quality", description="计划类型")
    plan_year = fields.IntField(null=True, description="计划年度")
    department_name = fields.CharField(max_length=100, null=True, description="部门")
    planned_start_date = fields.DateField(null=True, description="计划开始")
    planned_end_date = fields.DateField(null=True, description="计划结束")
    due_date = fields.DateField(null=True, description="要求完成期限")
    source_application_id = fields.IntField(null=True, description="来源部门申请")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    description = fields.TextField(null=True, description="说明")
    reminder_days = fields.IntField(default=7, description="提醒天数")
    applicant_id = fields.IntField(null=True, description="编制人")
    applicant_name = fields.CharField(max_length=100, null=True, description="编制人姓名")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    distributed_at = fields.DatetimeField(null=True, description="下发时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_training_plans"
        table_description = "轻办公 - 培训计划"
        unique_together = (("tenant_id", "plan_code"),)
        indexes = [
            ("tenant_id", "status"),
            ("tenant_id", "plan_type"),
            ("tenant_id", "plan_year"),
            ("tenant_id", "due_date"),
        ]

    class PydanticMeta:
        exclude = ["deleted_at"]


class KuaioaTrainingRecord(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    record_code = fields.CharField(max_length=50, description="记录编号")
    plan_id = fields.IntField(null=True, description="关联计划")
    training_name = fields.CharField(max_length=200, description="培训名称")
    record_kind = fields.CharField(
        max_length=30, default="production", description="记录类型 content/production/qc"
    )
    trainee_id = fields.IntField(null=True, description="参训人")
    trainee_name = fields.CharField(max_length=100, null=True, description="参训人姓名")
    trainer_name = fields.CharField(max_length=100, null=True, description="讲师")
    training_date = fields.DateField(null=True, description="培训日期")
    due_date = fields.DateField(null=True, description="要求完成期限")
    theory_score = fields.DecimalField(max_digits=8, decimal_places=2, null=True, description="理论成绩")
    practice_score = fields.DecimalField(max_digits=8, decimal_places=2, null=True, description="实操成绩")
    is_passed = fields.BooleanField(default=False, description="是否通过")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    content_summary = fields.TextField(null=True, description="培训内容摘要")
    attachment_file_uuid = fields.CharField(max_length=36, null=True, description="附件")
    template_id = fields.IntField(null=True, description="模板ID")
    hr_confirmed_at = fields.DatetimeField(null=True, description="人力确认时间")
    hr_confirmed_by = fields.IntField(null=True, description="人力确认人")
    hr_confirmed_by_name = fields.CharField(max_length=100, null=True, description="人力确认人姓名")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_training_records"
        table_description = "轻办公 - 培训记录"
        unique_together = (("tenant_id", "record_code"),)
        indexes = [
            ("tenant_id", "plan_id"),
            ("tenant_id", "trainee_id"),
            ("tenant_id", "due_date"),
            ("tenant_id", "record_kind"),
        ]

    class PydanticMeta:
        exclude = ["deleted_at"]


class KuaioaWorkLicense(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    license_code = fields.CharField(max_length=50, description="证书编号")
    license_name = fields.CharField(max_length=200, description="证书名称")
    license_type = fields.CharField(max_length=50, default="work", description="类型 work/special")
    holder_id = fields.IntField(null=True, description="持有人")
    holder_name = fields.CharField(max_length=100, null=True, description="持有人姓名")
    department_name = fields.CharField(max_length=100, null=True, description="部门")
    issue_date = fields.DateField(null=True, description="发证日期")
    expiry_date = fields.DateField(null=True, description="到期日期")
    status = fields.CharField(max_length=30, default="active", description="状态")
    reminder_days = fields.IntField(default=30, description="到期提醒天数")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_work_licenses"
        table_description = "轻办公 - 上岗证"
        unique_together = (("tenant_id", "license_code"),)
        indexes = [("tenant_id", "holder_id"), ("tenant_id", "expiry_date")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class KuaioaDeptTrainingApplication(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    request_code = fields.CharField(max_length=50, description="申请单号")
    title = fields.CharField(max_length=200, description="标题")
    plan_year = fields.IntField(description="申请年度")
    department_name = fields.CharField(max_length=100, null=True, description="申请部门")
    training_content = fields.TextField(null=True, description="培训内容")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    applicant_id = fields.IntField(null=True, description="申请人")
    applicant_name = fields.CharField(max_length=100, null=True, description="申请人姓名")
    notes = fields.TextField(null=True, description="备注")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_dept_training_applications"
        table_description = "轻办公 - 部门培训申请"
        unique_together = (("tenant_id", "request_code"),)
        indexes = [("tenant_id", "status"), ("tenant_id", "plan_year")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class KuaioaSpecialWorkQualification(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    request_code = fields.CharField(max_length=50, description="单号")
    title = fields.CharField(max_length=200, description="标题")
    qualification_year = fields.IntField(description="认定年度")
    holder_id = fields.IntField(null=True, description="作业人")
    holder_name = fields.CharField(max_length=100, null=True, description="作业人姓名")
    job_type = fields.CharField(max_length=100, null=True, description="特殊作业类型")
    confirmation_content = fields.TextField(null=True, description="资格确认内容")
    status = fields.CharField(max_length=30, default="draft", description="状态")
    applicant_id = fields.IntField(null=True, description="申请人")
    applicant_name = fields.CharField(max_length=100, null=True, description="申请人姓名")
    department_name = fields.CharField(max_length=100, null=True, description="部门")
    notes = fields.TextField(null=True, description="备注")
    submitted_at = fields.DatetimeField(null=True, description="提交时间")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_special_work_qualifications"
        table_description = "轻办公 - 特殊作业资格确认"
        unique_together = (("tenant_id", "request_code"),)
        indexes = [("tenant_id", "status"), ("tenant_id", "qualification_year")]

    class PydanticMeta:
        exclude = ["deleted_at"]


class KuaioaTrainingTemplate(BaseModel):
    tenant_id = fields.IntField(description="租户ID")
    template_code = fields.CharField(max_length=50, description="模板编号")
    template_name = fields.CharField(max_length=200, description="模板名称")
    template_kind = fields.CharField(max_length=30, description="模板类型 exam_paper/training_record")
    content_body = fields.TextField(null=True, description="模板正文")
    is_active = fields.BooleanField(default=True, description="启用")
    notes = fields.TextField(null=True, description="备注")
    deleted_at = fields.DatetimeField(null=True)

    class Meta:
        table = "apps_kuaioa_training_templates"
        table_description = "轻办公 - 培训试卷与记录模板"
        unique_together = (("tenant_id", "template_code"),)
        indexes = [("tenant_id", "template_kind", "is_active")]

    class PydanticMeta:
        exclude = ["deleted_at"]
