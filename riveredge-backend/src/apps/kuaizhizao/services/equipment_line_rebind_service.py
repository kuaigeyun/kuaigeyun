"""设备换线绑定服务（R-10 WP-10.7）。"""

from __future__ import annotations

from datetime import timedelta
from typing import List, Optional, Tuple

from tortoise.transactions import in_transaction

from apps.common.audit_actor import (
    apply_create_audit,
    apply_update_audit,
    operator_name_from_user,
)
from apps.kuaizhizao.models.equipment import Equipment
from apps.kuaizhizao.models.equipment_line_rebind import (
    EquipmentLineRebind,
    EquipmentLineRebindItem,
)
from apps.kuaizhizao.schemas.equipment_line_rebind import EquipmentLineRebindCreate
from apps.kuaizhizao.services.equipment_service import EquipmentService
from apps.master_data.models.factory import ProductionLine
from core.services.business.code_generation_service import CodeGenerationService
from core.utils.timezone_utils import resolve_business_datetime
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User

RULE_CODE = "EQUIPMENT_LINE_REBIND_CODE"


class EquipmentLineRebindService:
    @staticmethod
    async def _get_header(tenant_id: int, row_id: int) -> EquipmentLineRebind:
        row = await EquipmentLineRebind.filter(
            tenant_id=tenant_id, id=row_id, deleted_at__isnull=True
        ).first()
        if not row:
            raise NotFoundError(f"换线绑定单不存在: {row_id}")
        return row

    @staticmethod
    async def _load_items(
        tenant_id: int, rebind_id: int
    ) -> List[EquipmentLineRebindItem]:
        return (
            await EquipmentLineRebindItem.filter(
                tenant_id=tenant_id,
                rebind_id=rebind_id,
                deleted_at__isnull=True,
            )
            .order_by("id")
            .all()
        )

    @staticmethod
    async def _resolve_line(tenant_id: int, production_line_id: int) -> ProductionLine:
        line = await ProductionLine.filter(
            tenant_id=tenant_id,
            id=production_line_id,
            deleted_at__isnull=True,
        ).first()
        if not line:
            raise NotFoundError(f"产线不存在: {production_line_id}")
        if getattr(line, "is_active", True) is False:
            raise ValidationError(f"产线已停用: {line.code or production_line_id}")
        return line

    @staticmethod
    async def _assert_equipment_ok(equipment: Equipment) -> None:
        if equipment.status == "报废":
            raise ValidationError(f"报废设备不可换线: {equipment.code}")
        if not equipment.is_active:
            raise ValidationError(f"停用设备不可换线: {equipment.code}")

    @staticmethod
    async def _add_equipment_item(
        tenant_id: int,
        header: EquipmentLineRebind,
        equipment: Equipment,
        *,
        current_user: Optional[User],
    ) -> EquipmentLineRebindItem:
        await EquipmentLineRebindService._assert_equipment_ok(equipment)
        exists = await EquipmentLineRebindItem.filter(
            tenant_id=tenant_id,
            rebind_id=header.id,
            equipment_id=equipment.id,
            deleted_at__isnull=True,
        ).first()
        if exists:
            raise ValidationError(f"设备已在本单中: {equipment.code}")
        payload = dict(
            tenant_id=tenant_id,
            rebind_id=header.id,
            equipment_id=equipment.id,
            equipment_uuid=str(equipment.uuid),
            equipment_code=equipment.code,
            equipment_name=equipment.name,
            from_production_line_id=equipment.production_line_id,
            from_production_line_code=equipment.production_line_code,
            from_production_line_name=equipment.production_line_name,
            scanned_at=resolve_business_datetime(),
        )
        apply_create_audit(payload, current_user)
        return await EquipmentLineRebindItem.create(**payload)

    @staticmethod
    async def create(
        tenant_id: int,
        data: EquipmentLineRebindCreate,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentLineRebind:
        line = await EquipmentLineRebindService._resolve_line(
            tenant_id, data.production_line_id
        )
        document_no = await CodeGenerationService.generate_code(
            tenant_id=tenant_id,
            rule_code=RULE_CODE,
            context=None,
        )
        async with in_transaction():
            payload = dict(
                tenant_id=tenant_id,
                document_no=document_no,
                production_line_id=line.id,
                production_line_code=line.code,
                production_line_name=line.name,
                force_spot_overdue_hours=int(data.force_spot_overdue_hours or 4),
                status="进行中",
                remark=data.remark,
            )
            apply_create_audit(payload, current_user)
            header = await EquipmentLineRebind.create(**payload)
            for eq_id in data.equipment_ids or []:
                equipment = await Equipment.filter(
                    tenant_id=tenant_id, id=eq_id, deleted_at__isnull=True
                ).first()
                if not equipment:
                    raise NotFoundError(f"设备不存在: {eq_id}")
                await EquipmentLineRebindService._add_equipment_item(
                    tenant_id, header, equipment, current_user=current_user
                )
            return header

    @staticmethod
    async def scan(
        tenant_id: int,
        row_id: int,
        *,
        scan_code: str,
        current_user: Optional[User] = None,
    ) -> EquipmentLineRebindItem:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        if header.status != "进行中":
            raise ValidationError("仅进行中的换线单可扫码纳入设备")
        equipment = await EquipmentService.resolve_by_scan(tenant_id, scan_code)
        return await EquipmentLineRebindService._add_equipment_item(
            tenant_id, header, equipment, current_user=current_user
        )

    @staticmethod
    async def add_equipment(
        tenant_id: int,
        row_id: int,
        *,
        equipment_id: int,
        current_user: Optional[User] = None,
    ) -> EquipmentLineRebindItem:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        if header.status != "进行中":
            raise ValidationError("仅进行中的换线单可添加设备")
        equipment = await Equipment.filter(
            tenant_id=tenant_id, id=equipment_id, deleted_at__isnull=True
        ).first()
        if not equipment:
            raise NotFoundError(f"设备不存在: {equipment_id}")
        return await EquipmentLineRebindService._add_equipment_item(
            tenant_id, header, equipment, current_user=current_user
        )

    @staticmethod
    async def remove_item(
        tenant_id: int,
        row_id: int,
        item_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> None:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        if header.status != "进行中":
            raise ValidationError("仅进行中的换线单可移除设备")
        item = await EquipmentLineRebindItem.filter(
            tenant_id=tenant_id,
            id=item_id,
            rebind_id=row_id,
            deleted_at__isnull=True,
        ).first()
        if not item:
            raise NotFoundError(f"换线明细不存在: {item_id}")
        item.deleted_at = resolve_business_datetime()
        apply_update_audit(item, current_user)
        await item.save()

    @staticmethod
    async def complete(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentLineRebind:
        from apps.kuaizhizao.services.line_rebind_reminder_service import (
            LineRebindReminderService,
        )

        async with in_transaction():
            header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
            if header.status != "进行中":
                raise ValidationError("仅进行中的换线单可完成")
            items = await EquipmentLineRebindService._load_items(tenant_id, row_id)
            if not items:
                raise ValidationError("请至少扫码纳入一台设备后再完成换线")

            now = resolve_business_datetime()
            due_at = now + timedelta(hours=int(header.force_spot_overdue_hours or 4))
            for item in items:
                equipment = await Equipment.filter(
                    tenant_id=tenant_id,
                    id=item.equipment_id,
                    deleted_at__isnull=True,
                ).first()
                if not equipment:
                    raise NotFoundError(f"设备不存在: {item.equipment_id}")
                await EquipmentLineRebindService._assert_equipment_ok(equipment)
                equipment.production_line_id = header.production_line_id
                equipment.production_line_code = header.production_line_code
                equipment.production_line_name = header.production_line_name
                equipment.force_spot_check_required = True
                equipment.force_spot_check_due_at = due_at
                equipment.line_rebind_at = now
                equipment.line_rebind_id = header.id
                apply_update_audit(equipment, current_user)
                await equipment.save()
                await LineRebindReminderService.on_line_rebind_completed(
                    tenant_id, header, equipment, due_at=due_at
                )

            header.status = "已完成"
            header.completed_at = now
            header.completed_by = getattr(current_user, "id", None) if current_user else None
            header.completed_by_name = operator_name_from_user(current_user) or None
            apply_update_audit(header, current_user)
            await header.save()
            return header

    @staticmethod
    async def cancel(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> EquipmentLineRebind:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        if header.status != "进行中":
            raise ValidationError("仅进行中的换线单可取消")
        header.status = "已取消"
        apply_update_audit(header, current_user)
        await header.save()
        return header

    @staticmethod
    async def get_with_items(
        tenant_id: int, row_id: int
    ) -> Tuple[EquipmentLineRebind, List[EquipmentLineRebindItem]]:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        items = await EquipmentLineRebindService._load_items(tenant_id, row_id)
        return header, items

    @staticmethod
    async def list(
        tenant_id: int,
        *,
        skip: int,
        limit: int,
        status: Optional[str] = None,
        keyword: Optional[str] = None,
        production_line_id: Optional[int] = None,
    ) -> Tuple[List[EquipmentLineRebind], int]:
        qs = EquipmentLineRebind.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if status:
            qs = qs.filter(status=status)
        if production_line_id is not None:
            qs = qs.filter(production_line_id=production_line_id)
        if keyword:
            kw = keyword.strip()
            if kw:
                qs = qs.filter(document_no__icontains=kw)
        total = await qs.count()
        rows = await qs.order_by("-created_at").offset(skip).limit(limit)
        return rows, total

    @staticmethod
    async def delete(
        tenant_id: int,
        row_id: int,
        *,
        current_user: Optional[User] = None,
    ) -> None:
        header = await EquipmentLineRebindService._get_header(tenant_id, row_id)
        if header.status not in ("进行中", "已取消"):
            raise ValidationError("仅进行中或已取消的换线单可删除")
        now = resolve_business_datetime()
        header.deleted_at = now
        apply_update_audit(header, current_user)
        await header.save()
        await EquipmentLineRebindItem.filter(
            tenant_id=tenant_id, rebind_id=row_id, deleted_at__isnull=True
        ).update(deleted_at=now)

    @staticmethod
    async def clear_force_spot_for_equipment(
        tenant_id: int,
        equipment: Equipment,
        *,
        current_user: Optional[User] = None,
    ) -> None:
        """点检提交后解除换线强制初检闸门。"""
        if not getattr(equipment, "force_spot_check_required", False):
            return
        from apps.kuaizhizao.services.line_rebind_reminder_service import (
            LineRebindReminderService,
        )

        equipment.force_spot_check_required = False
        equipment.force_spot_check_due_at = None
        apply_update_audit(equipment, current_user)
        await equipment.save()

        rebind_id = getattr(equipment, "line_rebind_id", None)
        if rebind_id:
            item = await EquipmentLineRebindItem.filter(
                tenant_id=tenant_id,
                rebind_id=rebind_id,
                equipment_id=equipment.id,
                deleted_at__isnull=True,
            ).first()
            if item and not item.force_spot_cleared_at:
                item.force_spot_cleared_at = resolve_business_datetime()
                await item.save()

        await LineRebindReminderService.stop_force_spot_reminders(
            tenant_id, equipment.id, reason="换线强制初检已完成"
        )
