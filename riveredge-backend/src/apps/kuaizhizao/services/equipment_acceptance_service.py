"""设备工装验收服务（R-10 WP-10.3）。"""

from __future__ import annotations

from typing import List, Optional

from apps.common.audit_actor import (
    apply_create_audit,
    apply_update_audit,
    operator_name_from_user,
)
from apps.kuaizhizao.models.equipment import Equipment
from apps.kuaizhizao.models.equipment_acceptance import EquipmentAcceptance
from apps.kuaizhizao.models.tool import Tool
from apps.kuaizhizao.schemas.equipment_acceptance import (
    EquipmentAcceptanceCreate,
    EquipmentAcceptanceUpdate,
)
from core.services.business.code_generation_service import CodeGenerationService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User

RULE_CODE = "EQUIPMENT_ACCEPTANCE_CODE"


class EquipmentAcceptanceService:
    @staticmethod
    async def _resolve_target(tenant_id: int, target_type: str, target_id: int):
        if target_type == "equipment":
            row = await Equipment.filter(
                tenant_id=tenant_id, id=target_id, deleted_at__isnull=True
            ).first()
            if not row:
                raise NotFoundError(f"设备不存在: {target_id}")
            return row
        row = await Tool.filter(
            tenant_id=tenant_id, id=target_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError(f"工装不存在: {target_id}")
        return row

    @staticmethod
    def _assert_submit_ready(row: EquipmentAcceptance) -> None:
        attachments = list(row.attachments or [])
        has_form = bool(attachments) and row.accepted_at is not None
        has_exception = bool(
            (row.exception_problem or "").strip()
            and (row.solution or "").strip()
            and row.handled_at is not None
        )
        if not has_form and not has_exception:
            raise ValidationError(
                "提交前须上传验收单并填写实际验收日期，或完整填写延期异常（问题、方案、处理时间）"
            )
        if has_form and not row.result:
            row.result = "合格"
        if has_exception and not has_form:
            row.result = "延期异常"

    @staticmethod
    async def create(
        tenant_id: int,
        data: EquipmentAcceptanceCreate,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentAcceptance:
        target = await EquipmentAcceptanceService._resolve_target(
            tenant_id, data.target_type, data.target_id
        )
        acceptance_no = await CodeGenerationService.generate_code(
            tenant_id=tenant_id,
            rule_code=RULE_CODE,
            context=None,
        )
        row = EquipmentAcceptance(
            tenant_id=tenant_id,
            acceptance_no=acceptance_no,
            target_type=data.target_type,
            target_id=target.id,
            target_uuid=str(target.uuid),
            target_code=getattr(target, "code", None),
            target_name=getattr(target, "name", None),
            category=(data.category or "").strip() or None,
            due_date=data.due_date,
            accepted_at=data.accepted_at,
            result=data.result,
            exception_problem=data.exception_problem,
            solution=data.solution,
            handled_at=data.handled_at,
            attachments=data.attachments,
            remark=data.remark,
            status="草稿",
            applicant_id=getattr(current_user, "id", None) if current_user else None,
            applicant_name=operator_name_from_user(current_user) or None,
        )
        apply_create_audit(row, current_user)
        await row.save()
        return row

    @staticmethod
    async def get(tenant_id: int, row_id: int) -> EquipmentAcceptance:
        row = await EquipmentAcceptance.filter(
            tenant_id=tenant_id, id=row_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError(f"验收记录不存在: {row_id}")
        return row

    @staticmethod
    async def list(
        tenant_id: int,
        *,
        skip: int = 0,
        limit: int = 100,
        target_type: Optional[str] = None,
        target_id: Optional[int] = None,
        category: Optional[str] = None,
        status: Optional[str] = None,
        keyword: Optional[str] = None,
        search: Optional[str] = None,
        order_by: Optional[str] = None,
        due_start_date: Optional[str] = None,
        due_end_date: Optional[str] = None,
        created_start_date: Optional[str] = None,
        created_end_date: Optional[str] = None,
        updated_start_date: Optional[str] = None,
        updated_end_date: Optional[str] = None,
    ) -> tuple[List[EquipmentAcceptance], int]:
        from apps.kuaizhizao.services.equipment_list_core import (
            apply_asset_workflow_list_filters,
        )

        qs = EquipmentAcceptance.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if target_type:
            qs = qs.filter(target_type=target_type.strip().lower())
        if target_id is not None:
            qs = qs.filter(target_id=target_id)
        if category:
            qs = qs.filter(category=category)
        if status:
            qs = qs.filter(status=status)
        qs, order_clause = apply_asset_workflow_list_filters(
            qs,
            keyword=keyword,
            search=search,
            order_by=order_by,
            allowed_fields=frozenset(
                {
                    "acceptance_no",
                    "target_code",
                    "target_name",
                    "category",
                    "due_date",
                    "status",
                    "created_at",
                    "updated_at",
                }
            ),
            keyword_fields=[
                "acceptance_no",
                "target_code",
                "target_name",
                "category",
                "exception_problem",
            ],
            date_field="due_date",
            date_start=due_start_date,
            date_end=due_end_date,
            created_start_date=created_start_date,
            created_end_date=created_end_date,
            updated_start_date=updated_start_date,
            updated_end_date=updated_end_date,
        )
        total = await qs.count()
        rows = await qs.order_by(order_clause).offset(skip).limit(limit)
        return list(rows), total

    @staticmethod
    async def update(
        tenant_id: int,
        row_id: int,
        data: EquipmentAcceptanceUpdate,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentAcceptance:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        if row.status != "草稿":
            raise ValidationError("仅草稿状态可编辑")
        for key, value in data.model_dump(exclude_unset=True).items():
            setattr(row, key, value)
        if row.category is not None:
            row.category = str(row.category).strip() or None
        apply_update_audit(row, current_user)
        await row.save()
        return row

    @staticmethod
    async def submit(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentAcceptance:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        if row.status != "草稿":
            raise ValidationError("仅草稿状态可提交")
        EquipmentAcceptanceService._assert_submit_ready(row)
        row.status = "已提交"
        apply_update_audit(row, current_user)
        await row.save()
        return row

    @staticmethod
    async def approve(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentAcceptance:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        if row.status != "已提交":
            raise ValidationError("仅已提交状态可批准")
        row.status = "已批准"
        row.approver_id = getattr(current_user, "id", None) if current_user else None
        row.approver_name = operator_name_from_user(current_user) or None
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, current_user)
        await row.save()
        return row

    @staticmethod
    async def reject(
        tenant_id: int,
        row_id: int,
        *,
        reject_reason: str,
        current_user: Optional[User] = None,
    ) -> EquipmentAcceptance:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        if row.status != "已提交":
            raise ValidationError("仅已提交状态可驳回")
        reason = (reject_reason or "").strip()
        if not reason:
            raise ValidationError("驳回原因不能为空")
        row.status = "已驳回"
        row.reject_reason = reason
        row.approver_id = getattr(current_user, "id", None) if current_user else None
        row.approver_name = operator_name_from_user(current_user) or None
        row.approved_at = resolve_business_datetime()
        apply_update_audit(row, current_user)
        await row.save()
        return row

    @staticmethod
    async def delete(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> None:
        row = await EquipmentAcceptanceService.get(tenant_id, row_id)
        if row.status not in ("草稿", "已驳回"):
            raise ValidationError("仅草稿或已驳回状态可删除")
        row.deleted_at = resolve_business_datetime()
        apply_update_audit(row, current_user)
        await row.save()
