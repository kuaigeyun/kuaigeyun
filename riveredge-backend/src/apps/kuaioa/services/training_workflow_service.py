"""培训审批扩展：部门申请、特殊作业资格、年度计划审批。"""

from __future__ import annotations

from typing import Any, Optional

from apps.kuaioa.models.training import (
    KuaioaDeptTrainingApplication,
    KuaioaSpecialWorkQualification,
    KuaioaTrainingPlan,
)
from apps.kuaioa.schemas.training import (
    DeptTrainingApplicationCreate,
    DeptTrainingApplicationUpdate,
    SpecialWorkQualificationCreate,
    SpecialWorkQualificationUpdate,
    TrainingPlanCreate,
    TrainingPlanUpdate,
)
from apps.kuaioa.services.kuaioa_approval_doc_service import (
    KuaioaApprovalDocConfig,
    KuaioaApprovalDocService,
    apply_approval_decision,
)
from apps.kuaioa.services.kuaioa_list_core import parse_optional_date, touch_updated
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.models.user import User


_DEPT_APP = KuaioaApprovalDocConfig(
    model=KuaioaDeptTrainingApplication,
    code_field="request_code",
    code_prefix="DTA",
    entity_type="kuaioa_dept_training_application",
    audit_node_key="kuaioa_dept_training_application",
    title_prefix="部门培训申请",
    keyword_fields=("request_code", "title", "department_name"),
    not_found_message="部门培训申请不存在",
)

_SPECIAL_WORK = KuaioaApprovalDocConfig(
    model=KuaioaSpecialWorkQualification,
    code_field="request_code",
    code_prefix="SWQ",
    entity_type="kuaioa_special_work_qualification",
    audit_node_key="kuaioa_special_work_qualification",
    title_prefix="特殊作业资格确认",
    keyword_fields=("request_code", "title", "holder_name", "job_type"),
    not_found_message="特殊作业资格确认不存在",
)

_ANNUAL_PLAN = KuaioaApprovalDocConfig(
    model=KuaioaTrainingPlan,
    code_field="plan_code",
    code_prefix="TP",
    entity_type="kuaioa_training_plan",
    audit_node_key="kuaioa_training_plan",
    title_prefix="年度培训计划",
    keyword_fields=("plan_code", "plan_name", "department_name"),
    not_found_message="培训计划不存在",
)


class DeptTrainingApplicationService:
    def __init__(self) -> None:
        self._svc = KuaioaApprovalDocService(_DEPT_APP)

    async def list_requests(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        return await self._svc.list_rows(tenant_id, keyword=keyword, status=status)

    async def get_request(self, tenant_id: int, request_id: int) -> dict[str, Any]:
        return await self._svc.get_row(tenant_id, request_id)

    async def create_request(
        self, tenant_id: int, data: DeptTrainingApplicationCreate, user: User
    ) -> dict[str, Any]:
        return await self._svc.create_row(
            tenant_id,
            {
                "title": data.title.strip(),
                "plan_year": data.plan_year,
                "department_name": data.department_name,
                "training_content": data.training_content,
                "notes": data.notes,
            },
            user,
        )

    async def update_request(
        self, tenant_id: int, request_id: int, data: DeptTrainingApplicationUpdate, user: User
    ) -> dict[str, Any]:
        return await self._svc.update_row(
            tenant_id, request_id, data.model_dump(exclude_unset=True), user.id
        )

    async def delete_request(self, tenant_id: int, request_id: int, user: User) -> None:
        await self._svc.delete_row(tenant_id, request_id, user.id)

    async def submit_request(self, tenant_id: int, request_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.submit_row(
            tenant_id,
            request_id,
            user_id,
            title_getter=lambda r: r.title,
            content_getter=lambda r: r.training_content or r.title,
        )

    async def revoke_request(self, tenant_id: int, request_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.revoke_row(tenant_id, request_id, user_id)


async def apply_dept_training_application_decision(
    tenant_id: int, request_id: int, approved: bool, user_id: int
) -> None:
    await apply_approval_decision(
        KuaioaDeptTrainingApplication, tenant_id, request_id, approved, user_id
    )


class SpecialWorkQualificationService:
    def __init__(self) -> None:
        self._svc = KuaioaApprovalDocService(_SPECIAL_WORK)

    async def list_requests(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        return await self._svc.list_rows(tenant_id, keyword=keyword, status=status)

    async def get_request(self, tenant_id: int, request_id: int) -> dict[str, Any]:
        return await self._svc.get_row(tenant_id, request_id)

    async def create_request(
        self, tenant_id: int, data: SpecialWorkQualificationCreate, user: User
    ) -> dict[str, Any]:
        return await self._svc.create_row(
            tenant_id,
            {
                "title": data.title.strip(),
                "qualification_year": data.qualification_year,
                "holder_id": data.holder_id,
                "holder_name": data.holder_name,
                "job_type": data.job_type,
                "confirmation_content": data.confirmation_content,
                "department_name": data.department_name,
                "notes": data.notes,
            },
            user,
        )

    async def update_request(
        self, tenant_id: int, request_id: int, data: SpecialWorkQualificationUpdate, user: User
    ) -> dict[str, Any]:
        return await self._svc.update_row(
            tenant_id, request_id, data.model_dump(exclude_unset=True), user.id
        )

    async def delete_request(self, tenant_id: int, request_id: int, user: User) -> None:
        await self._svc.delete_row(tenant_id, request_id, user.id)

    async def submit_request(self, tenant_id: int, request_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.submit_row(
            tenant_id,
            request_id,
            user_id,
            title_getter=lambda r: r.title,
            content_getter=lambda r: r.confirmation_content or r.title,
        )

    async def revoke_request(self, tenant_id: int, request_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.revoke_row(tenant_id, request_id, user_id)


async def apply_special_work_qualification_decision(
    tenant_id: int, request_id: int, approved: bool, user_id: int
) -> None:
    await apply_approval_decision(
        KuaioaSpecialWorkQualification, tenant_id, request_id, approved, user_id
    )
    if approved:
        from apps.kuaioa.services.training_reminder_service import (
            TrainingReminderService,
        )

        row = await KuaioaSpecialWorkQualification.get_or_none(
            id=request_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if row:
            await TrainingReminderService.stop_special_work_campaign(
                tenant_id, int(row.qualification_year), reason="特殊作业资格已批准"
            )


class AnnualTrainingPlanService:
    """年度培训计划：复用计划表 + 审批引擎。"""

    def __init__(self) -> None:
        self._svc = KuaioaApprovalDocService(_ANNUAL_PLAN)

    async def list_plans(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        return await self._svc.list_rows(tenant_id, keyword=keyword, status=status)

    async def get_plan(self, tenant_id: int, plan_id: int) -> dict[str, Any]:
        return await self._svc.get_row(tenant_id, plan_id)

    async def create_plan(
        self, tenant_id: int, data: TrainingPlanCreate, user: User
    ) -> dict[str, Any]:
        today = to_site_date(resolve_business_datetime())
        return await self._svc.create_row(
            tenant_id,
            {
                "plan_name": data.plan_name.strip(),
                "plan_type": data.plan_type,
                "plan_year": data.plan_year or today.year,
                "department_name": data.department_name,
                "planned_start_date": parse_optional_date(data.planned_start_date),
                "planned_end_date": parse_optional_date(data.planned_end_date),
                "due_date": parse_optional_date(data.due_date),
                "source_application_id": data.source_application_id,
                "description": data.description,
                "reminder_days": data.reminder_days,
            },
            user,
            title_field="plan_name",
        )

    async def update_plan(
        self, tenant_id: int, plan_id: int, data: TrainingPlanUpdate, user: User
    ) -> dict[str, Any]:
        payload = data.model_dump(exclude_unset=True)
        for key in ("planned_start_date", "planned_end_date", "due_date"):
            if key in payload:
                payload[key] = parse_optional_date(payload[key])
        return await self._svc.update_row(tenant_id, plan_id, payload, user.id)

    async def delete_plan(self, tenant_id: int, plan_id: int, user: User) -> None:
        await self._svc.delete_row(tenant_id, plan_id, user.id)

    async def submit_plan(self, tenant_id: int, plan_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.submit_row(
            tenant_id,
            plan_id,
            user_id,
            title_getter=lambda r: r.plan_name,
            content_getter=lambda r: r.description or r.plan_name,
        )

    async def revoke_plan(self, tenant_id: int, plan_id: int, user_id: int) -> dict[str, Any]:
        return await self._svc.revoke_row(tenant_id, plan_id, user_id)


async def apply_training_plan_decision(
    tenant_id: int, plan_id: int, approved: bool, user_id: int
) -> None:
    await apply_approval_decision(KuaioaTrainingPlan, tenant_id, plan_id, approved, user_id)
    if not approved:
        return
    row = await KuaioaTrainingPlan.get_or_none(
        id=plan_id, tenant_id=tenant_id, deleted_at__isnull=True
    )
    if not row:
        return
    row.distributed_at = resolve_business_datetime()
    await touch_updated(row, user_id)
    await row.save()
    from apps.kuaioa.services.training_reminder_service import TrainingReminderService

    if row.plan_year:
        await TrainingReminderService.stop_dept_application_campaign(
            tenant_id, int(row.plan_year), reason="年度培训计划已批准下发"
        )
        await TrainingReminderService.stop_annual_plan_campaign(
            tenant_id, int(row.plan_year), reason="年度培训计划已批准下发"
        )
