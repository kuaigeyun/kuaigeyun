"""年度实验计划服务（R-07）。"""

from __future__ import annotations

from calendar import monthrange
from datetime import datetime, timezone
from typing import List, Optional
from zoneinfo import ZoneInfo

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.common.base_service import AppBaseService
from apps.kuaiplm.models.annual_lab_plan import (
    ISSUE_STATUS_APPROVED,
    ISSUE_STATUS_NONE,
    ISSUE_STATUS_PENDING_DEPT,
    ISSUE_STATUS_PENDING_PLAN,
    ISSUE_STATUS_PENDING_SALES,
    ISSUE_STATUS_REJECTED,
    MONTH_STATUS_COMPLETED,
    MONTH_STATUS_IN_PROGRESS,
    MONTH_STATUS_PENDING,
    MONTH_STATUSES,
    PLAN_STATUS_APPROVED,
    PLAN_STATUS_CLOSED,
    PLAN_STATUS_DRAFT,
    PLAN_STATUS_PENDING,
    PLAN_STATUS_REJECTED,
    PLAN_STATUSES,
    AnnualLabPlan,
    AnnualLabPlanMonth,
)
from apps.kuaiplm.schemas.annual_lab_plan import (
    AnnualLabPlanCreate,
    AnnualLabPlanIssueRejectRequest,
    AnnualLabPlanListResponse,
    AnnualLabPlanMonthInput,
    AnnualLabPlanMonthResponse,
    AnnualLabPlanMonthUpdate,
    AnnualLabPlanRejectRequest,
    AnnualLabPlanResponse,
    AnnualLabPlanUpdate,
)
from core.utils.timezone_utils import resolve_business_datetime, site_timezone_name
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User


class AnnualLabPlanService(AppBaseService[AnnualLabPlan]):
    code_field = "plan_code"
    rule_code = "KUAI_PLM_ANNUAL_LAB_PLAN_CODE"
    code_prefix = "ALP"

    def __init__(self) -> None:
        super().__init__(AnnualLabPlan)
        self.model = AnnualLabPlan

    def _user_name(self, user: User) -> str:
        return (
            getattr(user, "full_name", None)
            or getattr(user, "username", None)
            or str(user.id)
        )

    async def _ensure_code(self, tenant_id: int, code: Optional[str]) -> str:
        raw = (code or "").strip()
        if raw:
            exists = await AnnualLabPlan.filter(
                tenant_id=tenant_id, plan_code=raw, deleted_at__isnull=True
            ).exists()
            if exists:
                raise ValidationError(f"计划单号已存在: {raw}")
            return raw
        return await self.generate_code(tenant_id, self.rule_code, prefix=self.code_prefix)

    async def _get_row(self, tenant_id: int, plan_id: int) -> AnnualLabPlan:
        row = await AnnualLabPlan.filter(
            tenant_id=tenant_id, id=plan_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError("年度实验计划不存在")
        return row

    async def _get_month(
        self, tenant_id: int, plan_id: int, month_id: int
    ) -> AnnualLabPlanMonth:
        row = await AnnualLabPlanMonth.filter(
            tenant_id=tenant_id,
            plan_id=plan_id,
            id=month_id,
            deleted_at__isnull=True,
        ).first()
        if not row:
            raise NotFoundError("月度台账不存在")
        return row

    async def _list_months(
        self, tenant_id: int, plan_id: int
    ) -> List[AnnualLabPlanMonth]:
        return (
            await AnnualLabPlanMonth.filter(
                tenant_id=tenant_id, plan_id=plan_id, deleted_at__isnull=True
            )
            .order_by("month_no", "id")
        )

    async def _to_response(self, row: AnnualLabPlan) -> AnnualLabPlanResponse:
        months = await self._list_months(row.tenant_id, row.id)
        payload = AnnualLabPlanResponse.model_validate(row)
        payload.months = [
            AnnualLabPlanMonthResponse.model_validate(m) for m in months
        ]
        payload.total_months = len(months)
        payload.completed_months = sum(
            1 for m in months if m.month_status == MONTH_STATUS_COMPLETED
        )
        return payload

    def _site_tz(self) -> ZoneInfo:
        return ZoneInfo(site_timezone_name())

    async def _month_due_at(
        self, tenant_id: int, plan_year: int, month_no: int
    ) -> datetime:
        """当月最后一天站点墙钟 23:59:59 → UTC。"""
        del tenant_id
        tz = self._site_tz()
        last_day = monthrange(plan_year, month_no)[1]
        local_end = datetime(
            plan_year, month_no, last_day, 23, 59, 59, tzinfo=tz
        )
        return local_end.astimezone(timezone.utc)

    def _validate_month_status(self, raw: Optional[str]) -> str:
        status = (raw or MONTH_STATUS_PENDING).strip().lower()
        if status not in MONTH_STATUSES:
            raise ValidationError(f"非法月度状态: {raw}")
        return status

    async def _seed_months(
        self,
        tenant_id: int,
        plan: AnnualLabPlan,
        months: Optional[List[AnnualLabPlanMonthInput]],
        user: User,
    ) -> None:
        now = resolve_business_datetime()
        existing = await AnnualLabPlanMonth.filter(
            tenant_id=tenant_id, plan_id=plan.id, deleted_at__isnull=True
        ).all()
        for old in existing:
            old.deleted_at = now
            await old.save()

        by_month: dict[int, AnnualLabPlanMonthInput] = {}
        for raw in months or []:
            no = raw.month_no
            if no is None and raw.year_month:
                try:
                    no = int(str(raw.year_month).split("-")[1])
                except (IndexError, ValueError):
                    no = None
            if no is None or no < 1 or no > 12:
                raise ValidationError("月度行 month_no 须为 1-12")
            by_month[no] = raw

        for month_no in range(1, 13):
            raw = by_month.get(month_no)
            year_month = f"{plan.plan_year:04d}-{month_no:02d}"
            title = None
            owner_id = plan.owner_user_id
            owner_name = plan.owner_user_name
            material_desc = None
            remarks = None
            if raw:
                title = (raw.title or "").strip() or None
                if raw.owner_user_id is not None:
                    owner_id = raw.owner_user_id
                if raw.owner_user_name is not None:
                    owner_name = (raw.owner_user_name or "").strip() or None
                material_desc = (raw.material_desc or "").strip() or None
                remarks = (raw.remarks or "").strip() or None
                if raw.year_month:
                    year_month = raw.year_month.strip()
            due_at = await self._month_due_at(tenant_id, plan.plan_year, month_no)
            if raw and raw.due_at is not None:
                due_at = raw.due_at
            row = AnnualLabPlanMonth(
                tenant_id=tenant_id,
                plan_id=plan.id,
                year_month=year_month,
                month_no=month_no,
                title=title or f"{plan.plan_year}年{month_no}月例试",
                month_status=MONTH_STATUS_PENDING,
                owner_user_id=owner_id,
                owner_user_name=owner_name,
                due_at=due_at,
                material_desc=material_desc,
                issue_status=ISSUE_STATUS_NONE,
                remarks=remarks,
            )
            await row.save()

    async def create(
        self, tenant_id: int, data: AnnualLabPlanCreate, current_user: User
    ) -> AnnualLabPlanResponse:
        title = (data.title or "").strip()
        if not title:
            raise ValidationError("计划标题不能为空")
        code = await self._ensure_code(tenant_id, data.plan_code)
        clash_year = await AnnualLabPlan.filter(
            tenant_id=tenant_id,
            plan_year=data.plan_year,
            status__in=[PLAN_STATUS_DRAFT, PLAN_STATUS_PENDING, PLAN_STATUS_APPROVED],
            deleted_at__isnull=True,
        ).exists()
        if clash_year:
            raise BusinessLogicError(
                f"{data.plan_year} 年已存在未关闭的年度实验计划，请先关闭或驳回"
            )
        row = AnnualLabPlan(
            tenant_id=tenant_id,
            plan_code=code,
            plan_year=data.plan_year,
            title=title,
            status=PLAN_STATUS_DRAFT,
            plan_file_uuid=(data.plan_file_uuid or "").strip() or None,
            plan_file_name=(data.plan_file_name or "").strip() or None,
            owner_user_id=data.owner_user_id,
            owner_user_name=(data.owner_user_name or "").strip() or None,
            remarks=(data.remarks or "").strip() or None,
        )
        apply_create_audit(row, current_user)
        await row.save()
        await self._seed_months(tenant_id, row, data.months, current_user)
        return await self._to_response(row)

    async def list(
        self,
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 20,
        keyword: Optional[str] = None,
        status: Optional[str] = None,
        plan_year: Optional[int] = None,
    ) -> AnnualLabPlanListResponse:
        query = AnnualLabPlan.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            st = status.strip().lower()
            if st not in PLAN_STATUSES:
                raise ValidationError(f"非法状态: {status}")
            query = query.filter(status=st)
        if plan_year is not None:
            query = query.filter(plan_year=plan_year)
        if keyword:
            kw = keyword.strip()
            query = query.filter(
                Q(plan_code__icontains=kw)
                | Q(title__icontains=kw)
                | Q(owner_user_name__icontains=kw)
            )
        total = await query.count()
        rows = await query.order_by("-plan_year", "-created_at").offset(skip).limit(limit)
        data = [await self._to_response(r) for r in rows]
        return AnnualLabPlanListResponse(data=data, total=total, success=True)

    async def get(self, tenant_id: int, plan_id: int) -> AnnualLabPlanResponse:
        return await self._to_response(await self._get_row(tenant_id, plan_id))

    async def update(
        self,
        tenant_id: int,
        plan_id: int,
        data: AnnualLabPlanUpdate,
        current_user: User,
    ) -> AnnualLabPlanResponse:
        row = await self._get_row(tenant_id, plan_id)
        if row.status not in (PLAN_STATUS_DRAFT, PLAN_STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或已驳回状态可编辑计划头")
        payload = data.model_dump(exclude_unset=True, exclude={"months"})
        if "title" in payload:
            title = (payload.get("title") or "").strip()
            if not title:
                raise ValidationError("计划标题不能为空")
            row.title = title
        for field in ("plan_file_uuid", "plan_file_name", "owner_user_name", "remarks"):
            if field in payload:
                val = payload.get(field)
                setattr(row, field, (val or "").strip() or None if isinstance(val, str) or val is None else val)
        if "owner_user_id" in payload:
            row.owner_user_id = payload.get("owner_user_id")
        apply_update_audit(row, current_user)
        await row.save()
        if data.months is not None:
            await self._seed_months(tenant_id, row, data.months, current_user)
        return await self._to_response(row)

    async def submit(
        self, tenant_id: int, plan_id: int, current_user: User
    ) -> AnnualLabPlanResponse:
        row = await self._get_row(tenant_id, plan_id)
        if row.status not in (PLAN_STATUS_DRAFT, PLAN_STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或已驳回状态可提交")
        months = await self._list_months(tenant_id, plan_id)
        if len(months) < 1:
            raise ValidationError("请先维护月度台账")
        row.status = PLAN_STATUS_PENDING
        row.submitted_at = resolve_business_datetime()
        row.reject_reason = None
        row.rejected_at = None
        apply_update_audit(row, current_user)
        await row.save()
        return await self._to_response(row)

    async def approve(
        self, tenant_id: int, plan_id: int, current_user: User
    ) -> AnnualLabPlanResponse:
        row = await self._get_row(tenant_id, plan_id)
        if row.status != PLAN_STATUS_PENDING:
            raise BusinessLogicError("仅待审计划可批准")
        now = resolve_business_datetime()
        row.status = PLAN_STATUS_APPROVED
        row.approved_at = now
        row.approved_by = current_user.id
        row.approved_by_name = self._user_name(current_user)
        row.reject_reason = None
        row.rejected_at = None
        apply_update_audit(row, current_user)
        await row.save()
        return await self._to_response(row)

    async def reject(
        self,
        tenant_id: int,
        plan_id: int,
        data: AnnualLabPlanRejectRequest,
        current_user: User,
    ) -> AnnualLabPlanResponse:
        row = await self._get_row(tenant_id, plan_id)
        if row.status != PLAN_STATUS_PENDING:
            raise BusinessLogicError("仅待审计划可驳回")
        reason = (data.reason or "").strip()
        if not reason:
            raise ValidationError("驳回原因不能为空")
        row.status = PLAN_STATUS_REJECTED
        row.rejected_at = resolve_business_datetime()
        row.reject_reason = reason
        apply_update_audit(row, current_user)
        await row.save()
        return await self._to_response(row)

    async def close(
        self, tenant_id: int, plan_id: int, current_user: User
    ) -> AnnualLabPlanResponse:
        row = await self._get_row(tenant_id, plan_id)
        if row.status != PLAN_STATUS_APPROVED:
            raise BusinessLogicError("仅已批准计划可关闭")
        row.status = PLAN_STATUS_CLOSED
        row.closed_at = resolve_business_datetime()
        apply_update_audit(row, current_user)
        await row.save()
        return await self._to_response(row)

    async def delete(
        self, tenant_id: int, plan_id: int, current_user: User
    ) -> None:
        row = await self._get_row(tenant_id, plan_id)
        if row.status not in (PLAN_STATUS_DRAFT, PLAN_STATUS_REJECTED):
            raise BusinessLogicError("仅草稿或已驳回状态可删除")
        now = resolve_business_datetime()
        row.deleted_at = now
        apply_update_audit(row, current_user)
        await row.save()
        months = await self._list_months(tenant_id, plan_id)
        for m in months:
            m.deleted_at = now
            await m.save()

    def _assert_plan_executable(self, plan: AnnualLabPlan) -> None:
        if plan.status != PLAN_STATUS_APPROVED:
            raise BusinessLogicError("仅已批准计划可维护月度执行与领料")

    async def update_month(
        self,
        tenant_id: int,
        plan_id: int,
        month_id: int,
        data: AnnualLabPlanMonthUpdate,
        current_user: User,
    ) -> AnnualLabPlanResponse:
        plan = await self._get_row(tenant_id, plan_id)
        self._assert_plan_executable(plan)
        month = await self._get_month(tenant_id, plan_id, month_id)
        payload = data.model_dump(exclude_unset=True)
        if "month_status" in payload and payload["month_status"] is not None:
            new_status = self._validate_month_status(payload["month_status"])
            month.month_status = new_status
            if new_status == MONTH_STATUS_COMPLETED:
                month.completed_at = resolve_business_datetime()
            elif new_status != MONTH_STATUS_COMPLETED:
                month.completed_at = None
        for field in (
            "title",
            "owner_user_name",
            "material_desc",
            "lab_request_code",
            "report_file_uuid",
            "report_url",
            "defect_desc",
            "treatment_result",
            "remarks",
        ):
            if field in payload:
                val = payload.get(field)
                setattr(
                    month,
                    field,
                    (val or "").strip() or None if isinstance(val, str) or val is None else val,
                )
        if "owner_user_id" in payload:
            month.owner_user_id = payload.get("owner_user_id")
        if "lab_request_id" in payload:
            month.lab_request_id = payload.get("lab_request_id")
        if "due_at" in payload:
            month.due_at = payload.get("due_at")
        if month.month_status == MONTH_STATUS_PENDING and (
            month.defect_desc or month.treatment_result or month.report_url or month.report_file_uuid
        ):
            month.month_status = MONTH_STATUS_IN_PROGRESS
        await month.save()
        apply_update_audit(plan, current_user)
        await plan.save()
        return await self._to_response(plan)

    async def submit_issue(
        self, tenant_id: int, plan_id: int, month_id: int, current_user: User
    ) -> AnnualLabPlanResponse:
        plan = await self._get_row(tenant_id, plan_id)
        self._assert_plan_executable(plan)
        month = await self._get_month(tenant_id, plan_id, month_id)
        if month.issue_status not in (ISSUE_STATUS_NONE, ISSUE_STATUS_REJECTED):
            raise BusinessLogicError("当前领料已在审批中或已批准")
        if not (month.material_desc or "").strip():
            raise ValidationError("提交领料审批前须填写领料说明")
        month.issue_status = ISSUE_STATUS_PENDING_DEPT
        month.issue_submitted_at = resolve_business_datetime()
        month.issue_reject_reason = None
        month.issue_approved_at = None
        if month.month_status == MONTH_STATUS_PENDING:
            month.month_status = MONTH_STATUS_IN_PROGRESS
        await month.save()
        apply_update_audit(plan, current_user)
        await plan.save()
        return await self._to_response(plan)

    async def approve_issue(
        self, tenant_id: int, plan_id: int, month_id: int, current_user: User
    ) -> AnnualLabPlanResponse:
        plan = await self._get_row(tenant_id, plan_id)
        self._assert_plan_executable(plan)
        month = await self._get_month(tenant_id, plan_id, month_id)
        chain = {
            ISSUE_STATUS_PENDING_DEPT: ISSUE_STATUS_PENDING_SALES,
            ISSUE_STATUS_PENDING_SALES: ISSUE_STATUS_PENDING_PLAN,
            ISSUE_STATUS_PENDING_PLAN: ISSUE_STATUS_APPROVED,
        }
        nxt = chain.get(month.issue_status)
        if not nxt:
            raise BusinessLogicError("当前领料状态不可批准")
        month.issue_status = nxt
        if nxt == ISSUE_STATUS_APPROVED:
            month.issue_approved_at = resolve_business_datetime()
        await month.save()
        apply_update_audit(plan, current_user)
        await plan.save()
        return await self._to_response(plan)

    async def reject_issue(
        self,
        tenant_id: int,
        plan_id: int,
        month_id: int,
        data: AnnualLabPlanIssueRejectRequest,
        current_user: User,
    ) -> AnnualLabPlanResponse:
        plan = await self._get_row(tenant_id, plan_id)
        self._assert_plan_executable(plan)
        month = await self._get_month(tenant_id, plan_id, month_id)
        if month.issue_status not in (
            ISSUE_STATUS_PENDING_DEPT,
            ISSUE_STATUS_PENDING_SALES,
            ISSUE_STATUS_PENDING_PLAN,
        ):
            raise BusinessLogicError("仅审批中领料可驳回")
        reason = (data.reason or "").strip()
        if not reason:
            raise ValidationError("领料驳回原因不能为空")
        month.issue_status = ISSUE_STATUS_REJECTED
        month.issue_reject_reason = reason
        await month.save()
        apply_update_audit(plan, current_user)
        await plan.save()
        return await self._to_response(plan)
