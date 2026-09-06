"""培训与上岗证服务。"""

from __future__ import annotations

from typing import Any, Optional

from apps.kuaioa.models.training import (
    KuaioaTrainingRecord,
    KuaioaTrainingTemplate,
    KuaioaWorkLicense,
)
from apps.kuaioa.schemas.training import (
    TrainingRecordCreate,
    TrainingRecordUpdate,
    TrainingTemplateCreate,
    TrainingTemplateUpdate,
    WorkLicenseCreate,
    WorkLicenseUpdate,
)
from apps.kuaioa.services.kuaioa_list_core import (
    apply_create_audit_by_user_id,
    build_keyword_q,
    generate_daily_code,
    model_to_dict,
    parse_optional_date,
    touch_updated,
)
from apps.kuaioa.services.training_workflow_service import AnnualTrainingPlanService
from core.utils.timezone_utils import resolve_business_datetime, to_site_date
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError
from infra.models.user import User

# 年度计划审批走 workflow；对外仍暴露 TrainingPlanService 名称
TrainingPlanService = AnnualTrainingPlanService


class TrainingRecordService:
    async def list_records(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        plan_id: Optional[int] = None,
        record_kind: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        q = KuaioaTrainingRecord.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if plan_id:
            q = q.filter(plan_id=plan_id)
        if record_kind:
            q = q.filter(record_kind=record_kind)
        if keyword:
            q = q.filter(build_keyword_q(keyword, "record_code", "training_name", "trainee_name"))
        rows = await q.order_by("-created_at", "-id")
        return [model_to_dict(row) for row in rows]

    async def get_record(self, tenant_id: int, record_id: int) -> dict[str, Any]:
        row = await KuaioaTrainingRecord.get_or_none(
            id=record_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训记录不存在")
        return model_to_dict(row)

    async def create_record(
        self, tenant_id: int, data: TrainingRecordCreate, user_id: int
    ) -> dict[str, Any]:
        record_code = await generate_daily_code(
            KuaioaTrainingRecord, tenant_id, "TR", code_field="record_code"
        )
        create_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "record_code": record_code,
            "plan_id": data.plan_id,
            "training_name": data.training_name.strip(),
            "record_kind": data.record_kind or "production",
            "trainee_id": data.trainee_id,
            "trainee_name": data.trainee_name,
            "trainer_name": data.trainer_name,
            "training_date": parse_optional_date(data.training_date),
            "due_date": parse_optional_date(data.due_date),
            "theory_score": data.theory_score,
            "practice_score": data.practice_score,
            "is_passed": data.is_passed,
            "content_summary": data.content_summary,
            "attachment_file_uuid": data.attachment_file_uuid,
            "template_id": data.template_id,
            "notes": data.notes,
            "status": "completed" if data.is_passed else "draft",
        }
        await apply_create_audit_by_user_id(create_payload, user_id)
        row = await KuaioaTrainingRecord.create(**create_payload)
        if row.is_passed:
            await self._maybe_create_work_license(tenant_id, row, user_id)
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.schedule_content_due(tenant_id, row)
        return model_to_dict(row)

    async def update_record(
        self, tenant_id: int, record_id: int, data: TrainingRecordUpdate, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaTrainingRecord.get_or_none(
            id=record_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训记录不存在")
        payload = data.model_dump(exclude_unset=True)
        for key in ("training_date", "due_date"):
            if key in payload:
                payload[key] = parse_optional_date(payload[key])
        for key, value in payload.items():
            setattr(row, key, value)
        if row.is_passed:
            row.status = "completed"
        await touch_updated(row, user_id)
        await row.save()
        if row.is_passed:
            await self._maybe_create_work_license(tenant_id, row, user_id)
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.schedule_content_due(tenant_id, row)
        return model_to_dict(row)

    async def confirm_hr(self, tenant_id: int, record_id: int, user: User) -> dict[str, Any]:
        row = await KuaioaTrainingRecord.get_or_none(
            id=record_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训记录不存在")
        if row.hr_confirmed_at:
            raise BusinessLogicError("该培训记录已确认")
        row.hr_confirmed_at = resolve_business_datetime()
        row.hr_confirmed_by = user.id
        row.hr_confirmed_by_name = getattr(user, "name", None) or getattr(user, "username", None)
        if row.status == "draft":
            row.status = "completed"
        await touch_updated(row, user.id)
        await row.save()
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.stop_content_due(
            tenant_id, int(row.id), reason="人力已确认培训内容"
        )
        return model_to_dict(row)

    async def delete_record(self, tenant_id: int, record_id: int, user_id: int) -> None:
        row = await KuaioaTrainingRecord.get_or_none(
            id=record_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训记录不存在")
        row.deleted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.stop_content_due(
            tenant_id, int(row.id), reason="培训记录已删除"
        )

    async def _maybe_create_work_license(
        self, tenant_id: int, record: KuaioaTrainingRecord, user_id: int
    ) -> None:
        if not record.trainee_name:
            return
        exists = await KuaioaWorkLicense.filter(
            tenant_id=tenant_id,
            holder_name=record.trainee_name,
            license_name=record.training_name,
            deleted_at__isnull=True,
        ).exists()
        if exists:
            return
        license_code = await generate_daily_code(
            KuaioaWorkLicense, tenant_id, "WL", code_field="license_code"
        )
        wl_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "license_code": license_code,
            "license_name": record.training_name,
            "license_type": "special" if record.record_kind == "qc" else "work",
            "holder_id": record.trainee_id,
            "holder_name": record.trainee_name,
            "issue_date": record.training_date or to_site_date(resolve_business_datetime()),
            "status": "active",
        }
        await apply_create_audit_by_user_id(wl_payload, user_id)
        lic = await KuaioaWorkLicense.create(**wl_payload)
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.schedule_license_expiring(tenant_id, lic)


class WorkLicenseService:
    async def list_licenses(
        self, tenant_id: int, *, keyword: Optional[str] = None, status: Optional[str] = None
    ) -> list[dict[str, Any]]:
        q = KuaioaWorkLicense.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            q = q.filter(status=status)
        if keyword:
            q = q.filter(build_keyword_q(keyword, "license_code", "license_name", "holder_name"))
        rows = await q.order_by("expiry_date", "-updated_at")
        return [model_to_dict(row) for row in rows]

    async def get_license(self, tenant_id: int, license_id: int) -> dict[str, Any]:
        row = await KuaioaWorkLicense.get_or_none(
            id=license_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("上岗证不存在")
        return model_to_dict(row)

    async def create_license(
        self, tenant_id: int, data: WorkLicenseCreate, user_id: int
    ) -> dict[str, Any]:
        license_code = await generate_daily_code(
            KuaioaWorkLicense, tenant_id, "WL", code_field="license_code"
        )
        create_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "license_code": license_code,
            "license_name": data.license_name.strip(),
            "license_type": data.license_type,
            "holder_id": data.holder_id,
            "holder_name": data.holder_name,
            "department_name": data.department_name,
            "issue_date": parse_optional_date(data.issue_date),
            "expiry_date": parse_optional_date(data.expiry_date),
            "reminder_days": data.reminder_days,
            "notes": data.notes,
            "status": "active",
        }
        await apply_create_audit_by_user_id(create_payload, user_id)
        row = await KuaioaWorkLicense.create(**create_payload)
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.schedule_license_expiring(tenant_id, row)
        return model_to_dict(row)

    async def update_license(
        self, tenant_id: int, license_id: int, data: WorkLicenseUpdate, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaWorkLicense.get_or_none(
            id=license_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("上岗证不存在")
        payload = data.model_dump(exclude_unset=True)
        for key in ("issue_date", "expiry_date"):
            if key in payload:
                payload[key] = parse_optional_date(payload[key])
        for key, value in payload.items():
            setattr(row, key, value)
        await touch_updated(row, user_id)
        await row.save()
        from apps.kuaioa.services.training_reminder_service import TrainingReminderService

        await TrainingReminderService.schedule_license_expiring(tenant_id, row)
        return model_to_dict(row)

    async def delete_license(self, tenant_id: int, license_id: int, user_id: int) -> None:
        row = await KuaioaWorkLicense.get_or_none(
            id=license_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("上岗证不存在")
        row.deleted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()

    async def list_expiring(self, tenant_id: int, within_days: int = 30) -> list[dict[str, Any]]:
        today = to_site_date(resolve_business_datetime())
        rows = await KuaioaWorkLicense.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            expiry_date__isnull=False,
            status="active",
        ).order_by("expiry_date")
        result = []
        for row in rows:
            if not row.expiry_date:
                continue
            delta = (row.expiry_date - today).days
            reminder = row.reminder_days or within_days
            if delta <= reminder:
                item = model_to_dict(row)
                item["days_until_expiry"] = delta
                result.append(item)
        return result

    async def build_print_payload(self, tenant_id: int, license_id: int) -> dict[str, Any]:
        row = await self.get_license(tenant_id, license_id)
        return {
            "document_type": "work_license",
            "title": "上岗证",
            "fields": [
                {"label": "证书编号", "value": row.get("license_code")},
                {"label": "证书名称", "value": row.get("license_name")},
                {"label": "类型", "value": row.get("license_type")},
                {"label": "持有人", "value": row.get("holder_name")},
                {"label": "部门", "value": row.get("department_name")},
                {"label": "发证日期", "value": row.get("issue_date")},
                {"label": "到期日期", "value": row.get("expiry_date")},
            ],
            "record": row,
        }


class TrainingTemplateService:
    async def list_templates(
        self,
        tenant_id: int,
        *,
        keyword: Optional[str] = None,
        template_kind: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        q = KuaioaTrainingTemplate.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if template_kind:
            q = q.filter(template_kind=template_kind)
        if keyword:
            q = q.filter(build_keyword_q(keyword, "template_code", "template_name"))
        rows = await q.order_by("-updated_at", "-id")
        return [model_to_dict(row) for row in rows]

    async def get_template(self, tenant_id: int, template_id: int) -> dict[str, Any]:
        row = await KuaioaTrainingTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训模板不存在")
        return model_to_dict(row)

    async def create_template(
        self, tenant_id: int, data: TrainingTemplateCreate, user_id: int
    ) -> dict[str, Any]:
        kind = (data.template_kind or "").strip()
        if kind not in {"exam_paper", "training_record"}:
            raise BusinessLogicError("模板类型仅支持 exam_paper 或 training_record")
        template_code = await generate_daily_code(
            KuaioaTrainingTemplate, tenant_id, "TT", code_field="template_code"
        )
        create_payload: dict[str, Any] = {
            "tenant_id": tenant_id,
            "template_code": template_code,
            "template_name": data.template_name.strip(),
            "template_kind": kind,
            "content_body": data.content_body,
            "is_active": data.is_active,
            "notes": data.notes,
        }
        await apply_create_audit_by_user_id(create_payload, user_id)
        row = await KuaioaTrainingTemplate.create(**create_payload)
        return model_to_dict(row)

    async def update_template(
        self, tenant_id: int, template_id: int, data: TrainingTemplateUpdate, user_id: int
    ) -> dict[str, Any]:
        row = await KuaioaTrainingTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训模板不存在")
        payload = data.model_dump(exclude_unset=True)
        if "template_kind" in payload:
            kind = str(payload["template_kind"] or "").strip()
            if kind not in {"exam_paper", "training_record"}:
                raise BusinessLogicError("模板类型仅支持 exam_paper 或 training_record")
            payload["template_kind"] = kind
        for key, value in payload.items():
            setattr(row, key, value)
        await touch_updated(row, user_id)
        await row.save()
        return model_to_dict(row)

    async def delete_template(self, tenant_id: int, template_id: int, user_id: int) -> None:
        row = await KuaioaTrainingTemplate.get_or_none(
            id=template_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("培训模板不存在")
        row.deleted_at = resolve_business_datetime()
        await touch_updated(row, user_id)
        await row.save()
