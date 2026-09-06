"""培训周期提醒（INF-03 / R-12）。

规则（站点时区）：
- 每年 11 月 1–30 每周一 10:00：部门培训申请窗口
- 每年 12 月 1–25 每周一 10:00：年度培训计划窗口
- 培训内容记录逾期：每周一 10:00，直至人力确认
- 每年 6 月 1–25 每 8 天 10:00：特殊作业资格窗口（非工作日顺延）
"""

from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from typing import Literal
from zoneinfo import ZoneInfo

from loguru import logger

from apps.kuaioa.models.training import (
    KuaioaDeptTrainingApplication,
    KuaioaSpecialWorkQualification,
    KuaioaTrainingPlan,
    KuaioaTrainingRecord,
    KuaioaWorkLicense,
)
from apps.kuaioa.services.kuaioa_training_notification import (
    ACTION_ANNUAL_PLAN_WINDOW,
    ACTION_CONTENT_DUE,
    ACTION_DEPT_APPLICATION_WINDOW,
    ACTION_LICENSE_EXPIRING,
    ACTION_SPECIAL_WORK_WINDOW,
    dispatch_kuaioa_training_notification,
)
from core.models.application import Application
from core.models.reminder_event import ReminderEvent
from core.services.business.reminder_dispatch_service import (
    register_reminder_handler,
    register_reminder_preparer,
)
from core.services.business.reminder_event_service import ReminderEventService
from core.services.business.workday_service import next_workday
from core.utils.timezone_utils import site_timezone_name, to_api_isoformat, to_site_date, resolve_business_datetime

RULE_PREFIX = "kuaioa.training"
RULE_DEPT_WINDOW = f"{RULE_PREFIX}.dept_application_window"
RULE_ANNUAL_WINDOW = f"{RULE_PREFIX}.annual_plan_window"
RULE_CONTENT_DUE = f"{RULE_PREFIX}.content_due"
RULE_SPECIAL_WINDOW = f"{RULE_PREFIX}.special_work_window"
RULE_LICENSE_EXPIRING = f"{RULE_PREFIX}.license_expiring"

ENTITY_CAMPAIGN = "training_campaign"
ENTITY_RECORD = "training_record"
ENTITY_LICENSE = "work_license"
CHANNEL_INTERNAL = "internal"


def _site_day_at_hour_utc(day: date, *, hour: int = 10) -> datetime:
    tz = ZoneInfo(site_timezone_name())
    local = datetime(day.year, day.month, day.day, hour, 0, 0, tzinfo=tz)
    return local.astimezone(timezone.utc)


def _mondays_in_range(start: date, end: date) -> list[date]:
    days: list[date] = []
    cursor = start
    while cursor <= end:
        if cursor.weekday() == 0:
            days.append(cursor)
        cursor += timedelta(days=1)
    return days


def _every_n_days(start: date, end: date, n: int) -> list[date]:
    days: list[date] = []
    cursor = start
    while cursor <= end:
        days.append(cursor)
        cursor += timedelta(days=n)
    return days


class TrainingReminderService:
    @staticmethod
    async def stop_dept_application_campaign(tenant_id: int, plan_year: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_CAMPAIGN,
            entity_id=plan_year * 100 + 11,
            reason=reason,
        )

    @staticmethod
    async def stop_annual_plan_campaign(tenant_id: int, plan_year: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_CAMPAIGN,
            entity_id=plan_year * 100 + 12,
            reason=reason,
        )

    @staticmethod
    async def stop_special_work_campaign(tenant_id: int, year: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_CAMPAIGN,
            entity_id=year * 100 + 6,
            reason=reason,
        )

    @staticmethod
    async def stop_content_due(tenant_id: int, record_id: int, *, reason: str) -> int:
        return await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_RECORD,
            entity_id=record_id,
            reason=reason,
        )

    @staticmethod
    async def schedule_dept_application_window(tenant_id: int, plan_year: int) -> None:
        if await KuaioaTrainingPlan.filter(
            tenant_id=tenant_id,
            plan_year=plan_year,
            status__in=["approved", "distributed"],
            deleted_at__isnull=True,
        ).exists():
            return
        start = date(plan_year, 11, 1)
        end = date(plan_year, 11, 30)
        entity_id = plan_year * 100 + 11
        for day in _mondays_in_range(start, end):
            await ReminderEventService.ensure_event(
                tenant_id,
                rule_id=f"{RULE_DEPT_WINDOW}:{plan_year}:{day.isoformat()}",
                rule_code=RULE_DEPT_WINDOW,
                entity_type=ENTITY_CAMPAIGN,
                entity_id=entity_id,
                entity_uuid=f"dept-{plan_year}",
                planned_at=_site_day_at_hour_utc(day),
                channel=CHANNEL_INTERNAL,
                payload={"plan_year": plan_year, "window": "nov", "day": day.isoformat()},
            )

    @staticmethod
    async def schedule_annual_plan_window(tenant_id: int, plan_year: int) -> None:
        if await KuaioaTrainingPlan.filter(
            tenant_id=tenant_id,
            plan_year=plan_year,
            status__in=["approved", "distributed"],
            deleted_at__isnull=True,
        ).exists():
            return
        start = date(plan_year, 12, 1)
        end = date(plan_year, 12, 25)
        entity_id = plan_year * 100 + 12
        for day in _mondays_in_range(start, end):
            await ReminderEventService.ensure_event(
                tenant_id,
                rule_id=f"{RULE_ANNUAL_WINDOW}:{plan_year}:{day.isoformat()}",
                rule_code=RULE_ANNUAL_WINDOW,
                entity_type=ENTITY_CAMPAIGN,
                entity_id=entity_id,
                entity_uuid=f"annual-{plan_year}",
                planned_at=_site_day_at_hour_utc(day),
                channel=CHANNEL_INTERNAL,
                payload={"plan_year": plan_year, "window": "dec", "day": day.isoformat()},
            )

    @staticmethod
    async def schedule_special_work_window(tenant_id: int, year: int) -> None:
        if await KuaioaSpecialWorkQualification.filter(
            tenant_id=tenant_id,
            qualification_year=year,
            status="approved",
            deleted_at__isnull=True,
        ).exists():
            return
        start = date(year, 6, 1)
        end = date(year, 6, 25)
        entity_id = year * 100 + 6
        for raw_day in _every_n_days(start, end, 8):
            day = await next_workday(tenant_id, raw_day)
            if day > end:
                continue
            await ReminderEventService.ensure_event(
                tenant_id,
                rule_id=f"{RULE_SPECIAL_WINDOW}:{year}:{day.isoformat()}",
                rule_code=RULE_SPECIAL_WINDOW,
                entity_type=ENTITY_CAMPAIGN,
                entity_id=entity_id,
                entity_uuid=f"special-{year}",
                planned_at=_site_day_at_hour_utc(day),
                channel=CHANNEL_INTERNAL,
                payload={"qualification_year": year, "window": "jun", "day": day.isoformat()},
            )

    @staticmethod
    async def schedule_content_due(tenant_id: int, record: KuaioaTrainingRecord) -> None:
        await TrainingReminderService.stop_content_due(
            tenant_id, int(record.id), reason="培训记录更新"
        )
        if record.hr_confirmed_at:
            return
        if not record.due_date:
            return
        today = to_site_date(resolve_business_datetime())
        # 从到期日起每周一提醒，预排 12 周
        first = record.due_date
        if first < today:
            first = today
        # 对齐到周一
        while first.weekday() != 0:
            first += timedelta(days=1)
        for i in range(12):
            day = first + timedelta(weeks=i)
            await ReminderEventService.ensure_event(
                tenant_id,
                rule_id=f"{RULE_CONTENT_DUE}:{record.id}:{day.isoformat()}",
                rule_code=RULE_CONTENT_DUE,
                entity_type=ENTITY_RECORD,
                entity_id=int(record.id),
                entity_uuid=str(record.uuid),
                planned_at=_site_day_at_hour_utc(day),
                channel=CHANNEL_INTERNAL,
                payload={
                    "record_code": record.record_code,
                    "training_name": record.training_name,
                    "due_date": record.due_date.isoformat(),
                },
            )

    @staticmethod
    async def schedule_license_expiring(tenant_id: int, license_row: KuaioaWorkLicense) -> None:
        await ReminderEventService.stop_future_for_entity(
            tenant_id,
            entity_type=ENTITY_LICENSE,
            entity_id=int(license_row.id),
            reason="上岗证更新",
        )
        if not license_row.expiry_date or license_row.status != "active":
            return
        remind_days = int(license_row.reminder_days or 30)
        day = license_row.expiry_date - timedelta(days=remind_days)
        await ReminderEventService.ensure_event(
            tenant_id,
            rule_id=f"{RULE_LICENSE_EXPIRING}:{license_row.id}:{license_row.expiry_date.isoformat()}",
            rule_code=RULE_LICENSE_EXPIRING,
            entity_type=ENTITY_LICENSE,
            entity_id=int(license_row.id),
            entity_uuid=str(license_row.uuid),
            planned_at=_site_day_at_hour_utc(day),
            channel=CHANNEL_INTERNAL,
            payload={
                "license_code": license_row.license_code,
                "license_name": license_row.license_name,
                "holder_name": license_row.holder_name,
                "expiry_date": license_row.expiry_date.isoformat(),
            },
        )


async def prepare_training_reminders() -> None:
    tenant_ids = (
        await Application.filter(
            code="kuaioa",
            is_installed=True,
            deleted_at__isnull=True,
        )
        .distinct()
        .values_list("tenant_id", flat=True)
    )
    today = to_site_date(resolve_business_datetime())
    years = {today.year}
    if today.month >= 10:
        years.add(today.year + 1)
    if today.month <= 2:
        years.add(today.year - 1)

    for tenant_id in tenant_ids:
        tid = int(tenant_id)
        try:
            for year in years:
                await TrainingReminderService.schedule_dept_application_window(tid, year)
                await TrainingReminderService.schedule_annual_plan_window(tid, year)
                await TrainingReminderService.schedule_special_work_window(tid, year)

            records = await KuaioaTrainingRecord.filter(
                tenant_id=tid,
                deleted_at__isnull=True,
                due_date__isnull=False,
                hr_confirmed_at__isnull=True,
            ).all()
            for row in records:
                await TrainingReminderService.schedule_content_due(tid, row)

            licenses = await KuaioaWorkLicense.filter(
                tenant_id=tid,
                deleted_at__isnull=True,
                status="active",
                expiry_date__isnull=False,
            ).all()
            for lic in licenses:
                await TrainingReminderService.schedule_license_expiring(tid, lic)
        except Exception as exc:
            logger.error("准备培训提醒失败 tenant={}: {}", tid, exc)


async def dispatch_training_reminder(
    tenant_id: int, event: ReminderEvent
) -> Literal["sent", "stopped"]:
    rule_code = str(event.rule_code or "")
    payload = event.payload or {}

    if rule_code == RULE_DEPT_WINDOW:
        plan_year = int(payload.get("plan_year") or 0)
        if plan_year and await KuaioaTrainingPlan.filter(
            tenant_id=tenant_id,
            plan_year=plan_year,
            status__in=["approved", "distributed"],
            deleted_at__isnull=True,
        ).exists():
            await ReminderEventService.mark_stopped(tenant_id, event.id, "年度计划已批准")
            return "stopped"
        open_depts = await KuaioaDeptTrainingApplication.filter(
            tenant_id=tenant_id,
            plan_year=plan_year,
            status="draft",
            deleted_at__isnull=True,
        ).count()
        sent = await dispatch_kuaioa_training_notification(
            tenant_id,
            trigger_action=ACTION_DEPT_APPLICATION_WINDOW,
            variables={
                "plan_year": str(plan_year),
                "open_draft_count": str(open_depts),
                "detail_path": "/apps/kuaioa/hr/dept-training-applications",
                "due_at": to_api_isoformat(event.planned_at) or "—",
            },
        )
        return "sent" if sent else "sent"

    if rule_code == RULE_ANNUAL_WINDOW:
        plan_year = int(payload.get("plan_year") or 0)
        if plan_year and await KuaioaTrainingPlan.filter(
            tenant_id=tenant_id,
            plan_year=plan_year,
            status__in=["approved", "distributed"],
            deleted_at__isnull=True,
        ).exists():
            await ReminderEventService.mark_stopped(tenant_id, event.id, "年度计划已批准")
            return "stopped"
        sent = await dispatch_kuaioa_training_notification(
            tenant_id,
            trigger_action=ACTION_ANNUAL_PLAN_WINDOW,
            variables={
                "plan_year": str(plan_year),
                "detail_path": "/apps/kuaioa/hr/training-plans",
                "due_at": to_api_isoformat(event.planned_at) or "—",
            },
        )
        return "sent" if sent else "sent"

    if rule_code == RULE_SPECIAL_WINDOW:
        year = int(payload.get("qualification_year") or 0)
        if year and await KuaioaSpecialWorkQualification.filter(
            tenant_id=tenant_id,
            qualification_year=year,
            status="approved",
            deleted_at__isnull=True,
        ).exists():
            await ReminderEventService.mark_stopped(tenant_id, event.id, "特殊作业资格已批准")
            return "stopped"
        sent = await dispatch_kuaioa_training_notification(
            tenant_id,
            trigger_action=ACTION_SPECIAL_WORK_WINDOW,
            variables={
                "qualification_year": str(year),
                "detail_path": "/apps/kuaioa/hr/special-work-qualifications",
                "due_at": to_api_isoformat(event.planned_at) or "—",
            },
        )
        return "sent" if sent else "sent"

    if rule_code == RULE_CONTENT_DUE:
        row = await KuaioaTrainingRecord.filter(
            tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
        ).first()
        if not row:
            await ReminderEventService.mark_stopped(tenant_id, event.id, "培训记录已删除")
            return "stopped"
        if row.hr_confirmed_at:
            await ReminderEventService.mark_stopped(tenant_id, event.id, "人力已确认")
            return "stopped"
        sent = await dispatch_kuaioa_training_notification(
            tenant_id,
            trigger_action=ACTION_CONTENT_DUE,
            variables={
                "record_code": row.record_code or "—",
                "training_name": row.training_name or "—",
                "due_date": row.due_date.isoformat() if row.due_date else "—",
                "detail_path": f"/apps/kuaioa/hr/training-records?id={row.id}",
            },
            context={"creator_user_id": row.created_by},
        )
        return "sent" if sent else "sent"

    if rule_code == RULE_LICENSE_EXPIRING:
        lic = await KuaioaWorkLicense.filter(
            tenant_id=tenant_id, id=event.entity_id, deleted_at__isnull=True
        ).first()
        if not lic or lic.status != "active":
            await ReminderEventService.mark_stopped(tenant_id, event.id, "上岗证不可用")
            return "stopped"
        sent = await dispatch_kuaioa_training_notification(
            tenant_id,
            trigger_action=ACTION_LICENSE_EXPIRING,
            variables={
                "license_code": lic.license_code or "—",
                "license_name": lic.license_name or "—",
                "holder_name": lic.holder_name or "—",
                "expiry_date": lic.expiry_date.isoformat() if lic.expiry_date else "—",
                "detail_path": f"/apps/kuaioa/hr/work-licenses?id={lic.id}",
            },
        )
        return "sent" if sent else "sent"

    await ReminderEventService.mark_stopped(tenant_id, event.id, f"未知培训提醒规则: {rule_code}")
    return "stopped"


register_reminder_handler(RULE_PREFIX, dispatch_training_reminder)
register_reminder_preparer(prepare_training_reminders)
