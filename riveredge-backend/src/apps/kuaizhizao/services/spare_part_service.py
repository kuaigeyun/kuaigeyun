"""
备品备件业务服务模块

处理备件出入库、库存预警以及与维修保养流程的联动。

Author: Antigravity (RiverEdge Agent)
Date: 2026-03-26
"""

from typing import List, Optional, Dict, Any
from datetime import datetime

from tortoise.expressions import Q

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.kuaizhizao.models.spare_part import SparePart, SparePartInventory, SparePartStockRecord
from apps.kuaizhizao.schemas.equipment_extra import SparePartCreate, SparePartUpdate
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User
from core.utils.timezone_utils import resolve_business_datetime

DEFAULT_SPARE_PART_WAREHOUSE_LOCATION = "默认库位"


def normalize_spare_part_warehouse_location(location: Optional[str]) -> str:
    text = str(location or "").strip()
    return text or DEFAULT_SPARE_PART_WAREHOUSE_LOCATION


def normalize_stock_adjust_delta(quantity: int, operation_type: str) -> int:
    """入库为正、出库为负；兼容前端 in/out 与中文入出库。"""
    qty = abs(int(quantity))
    op = str(operation_type or "").strip().lower()
    if op in ("out", "出库", "issue", "deduct"):
        return -qty
    if op in ("in", "入库", "receive"):
        return qty
    return int(quantity)


class SparePartService:
    """
    备品备件服务类
    """

    async def list_spare_parts(
        self,
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        is_active: Optional[bool] = None,
        keyword: Optional[str] = None,
        order_by: Optional[str] = None,
        created_start_date: Optional[str] = None,
        created_end_date: Optional[str] = None,
        updated_start_date: Optional[str] = None,
        updated_end_date: Optional[str] = None,
    ) -> tuple[List[SparePart], int]:
        from apps.kuaizhizao.services.equipment_list_core import (
            SPARE_PART_MASTER_SORTABLE_FIELDS,
            apply_equipment_created_date_range,
            apply_equipment_keyword_filter,
            apply_equipment_updated_date_range,
            pick_search_keyword,
            resolve_equipment_list_order_by,
        )

        qs = SparePart.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if is_active is not None:
            qs = qs.filter(is_active=is_active)
        qs = apply_equipment_keyword_filter(
            qs,
            pick_search_keyword(keyword, search),
            ["part_no", "part_name", "category", "brand"],
        )
        qs = apply_equipment_created_date_range(
            qs,
            start_date=created_start_date,
            end_date=created_end_date,
        )
        qs = apply_equipment_updated_date_range(
            qs,
            start_date=updated_start_date,
            end_date=updated_end_date,
        )
        total = await qs.count()
        order_clause = resolve_equipment_list_order_by(
            order_by,
            SPARE_PART_MASTER_SORTABLE_FIELDS,
            "-created_at",
        )
        rows = await qs.order_by(order_clause).offset(skip).limit(limit)
        return rows, total

    async def get_spare_part(self, tenant_id: int, spare_part_id: int) -> SparePart:
        part = await SparePart.filter(
            tenant_id=tenant_id,
            id=spare_part_id,
            deleted_at__isnull=True,
        ).first()
        if not part:
            raise NotFoundError(f"备件不存在: {spare_part_id}")
        return part

    async def create_spare_part(
        self,
        tenant_id: int,
        data: SparePartCreate,
        current_user: Optional[User] = None,
    ) -> SparePart:
        existing = await SparePart.filter(
            tenant_id=tenant_id,
            part_no=data.part_no,
            deleted_at__isnull=True,
        ).first()
        if existing:
            raise ValidationError(f"备件编号已存在: {data.part_no}")
        payload = data.model_dump()
        apply_create_audit(payload, current_user)
        return await SparePart.create(tenant_id=tenant_id, **payload)

    async def update_spare_part(
        self,
        tenant_id: int,
        spare_part_id: int,
        data: SparePartUpdate,
        current_user: Optional[User] = None,
    ) -> SparePart:
        part = await self.get_spare_part(tenant_id, spare_part_id)
        update_data = data.model_dump(exclude_unset=True)
        if "part_no" in update_data and update_data["part_no"] != part.part_no:
            dup = await SparePart.filter(
                tenant_id=tenant_id,
                part_no=update_data["part_no"],
                deleted_at__isnull=True,
            ).first()
            if dup:
                raise ValidationError(f"备件编号已存在: {update_data['part_no']}")
        for k, v in update_data.items():
            setattr(part, k, v)
        apply_update_audit(part, current_user)
        await part.save()
        return part

    async def delete_spare_part(self, tenant_id: int, spare_part_id: int) -> None:
        part = await self.get_spare_part(tenant_id, spare_part_id)
        part.deleted_at = resolve_business_datetime()
        part.is_active = False
        await part.save()

    async def _get_or_create_active_inventory(
        self,
        tenant_id: int,
        spare_part: SparePart,
        warehouse_location: str,
    ) -> SparePartInventory:
        location = normalize_spare_part_warehouse_location(warehouse_location)
        inventory = await SparePartInventory.filter(
            tenant_id=tenant_id,
            spare_part_id=spare_part.id,
            warehouse_location=location,
            deleted_at__isnull=True,
        ).first()
        if inventory:
            return inventory
        return await SparePartInventory.create(
            tenant_id=tenant_id,
            spare_part_id=spare_part.id,
            spare_part_uuid=spare_part.uuid,
            warehouse_location=location,
            stock_quantity=0,
        )

    async def _list_active_inventory_rows(
        self, tenant_id: int, spare_part_id: int
    ) -> List[SparePartInventory]:
        return await SparePartInventory.filter(
            tenant_id=tenant_id,
            spare_part_id=spare_part_id,
            deleted_at__isnull=True,
        ).order_by("-stock_quantity", "id").all()

    def _format_inventory_shortage_message(
        self,
        spare_part: SparePart,
        *,
        preferred_location: str,
        required_qty: int,
        location_qty: int,
        rows: List[SparePartInventory],
    ) -> str:
        part_label = f"{spare_part.part_no} {spare_part.part_name}".strip()
        stocked = [
            f"「{normalize_spare_part_warehouse_location(row.warehouse_location)}」{int(row.stock_quantity or 0)}"
            for row in rows
            if int(row.stock_quantity or 0) > 0
        ]
        total_qty = sum(int(row.stock_quantity or 0) for row in rows)
        detail = "、".join(stocked[:5]) if stocked else "无可用库位"
        if len(stocked) > 5:
            detail = f"{detail} 等"
        return (
            f"备件「{part_label}」在库位「{preferred_location}」库存不足："
            f"当前 {location_qty}，本次需出库 {required_qty}。"
            f"全库位合计 {total_qty}（{detail}）。请核对库位或在备品备件中入库。"
        )

    async def _deduct_stock_across_locations(
        self,
        tenant_id: int,
        spare_part: SparePart,
        quantity: int,
        preferred_location: Optional[str],
        *,
        operation_type: str,
        rel_type: Optional[str] = None,
        rel_id: Optional[int] = None,
        operator_id: Optional[int] = None,
        operator_name: Optional[str] = None,
        remark: Optional[str] = None,
    ) -> None:
        need_qty = abs(int(quantity))
        if need_qty <= 0:
            return

        preferred = normalize_spare_part_warehouse_location(preferred_location)
        rows = await self._list_active_inventory_rows(tenant_id, int(spare_part.id))
        location_qty = next(
            (int(row.stock_quantity or 0) for row in rows if normalize_spare_part_warehouse_location(row.warehouse_location) == preferred),
            0,
        )
        total_qty = sum(int(row.stock_quantity or 0) for row in rows)
        if total_qty < need_qty:
            raise ValidationError(
                self._format_inventory_shortage_message(
                    spare_part,
                    preferred_location=preferred,
                    required_qty=need_qty,
                    location_qty=location_qty,
                    rows=rows,
                )
            )

        remaining = need_qty
        preferred_rows = [
            row for row in rows if normalize_spare_part_warehouse_location(row.warehouse_location) == preferred
        ]
        other_rows = [
            row for row in rows if normalize_spare_part_warehouse_location(row.warehouse_location) != preferred
        ]
        ordered_rows = preferred_rows + other_rows

        for row in ordered_rows:
            if remaining <= 0:
                break
            available = int(row.stock_quantity or 0)
            if available <= 0:
                continue
            take = min(available, remaining)
            await self.adjust_stock(
                tenant_id=tenant_id,
                spare_part_id=int(spare_part.id),
                quantity=-take,
                operation_type=operation_type,
                warehouse_location=normalize_spare_part_warehouse_location(row.warehouse_location),
                rel_type=rel_type,
                rel_id=rel_id,
                operator_id=operator_id,
                operator_name=operator_name,
                remark=remark,
            )
            remaining -= take

        if remaining > 0:
            raise ValidationError(
                self._format_inventory_shortage_message(
                    spare_part,
                    preferred_location=preferred,
                    required_qty=need_qty,
                    location_qty=location_qty,
                    rows=rows,
                )
            )

    async def adjust_stock(
        self,
        tenant_id: int,
        spare_part_id: int,
        quantity: int,
        operation_type: str,
        warehouse_location: Optional[str] = None,
        rel_type: Optional[str] = None,
        rel_id: Optional[int] = None,
        operator_id: Optional[int] = None,
        operator_name: Optional[str] = None,
        remark: Optional[str] = None
    ) -> SparePartInventory:
        """
        调整备件库存并记录流水
        """
        spare_part = await SparePart.filter(
            id=spare_part_id,
            tenant_id=tenant_id,
            deleted_at__isnull=True,
        ).first()
        if not spare_part:
            raise NotFoundError(f"备件不存在: {spare_part_id}")
        warehouse_location = normalize_spare_part_warehouse_location(warehouse_location)
        delta = normalize_stock_adjust_delta(quantity, operation_type)

        inventory = await self._get_or_create_active_inventory(
            tenant_id, spare_part, warehouse_location
        )

        old_quantity = int(inventory.stock_quantity or 0)
        new_quantity = old_quantity + delta
        if new_quantity < 0:
            rows = await self._list_active_inventory_rows(tenant_id, spare_part_id)
            raise ValidationError(
                self._format_inventory_shortage_message(
                    spare_part,
                    preferred_location=warehouse_location,
                    required_qty=abs(delta),
                    location_qty=old_quantity,
                    rows=rows,
                )
            )

        inventory.stock_quantity = new_quantity
        await inventory.save()

        # 记录流水
        await SparePartStockRecord.create(
            tenant_id=tenant_id,
            record_no=f"STK-{resolve_business_datetime().strftime('%Y%m%d%H%M%S')}",
            spare_part_id=spare_part_id,
            spare_part_uuid=spare_part.uuid,
            operation_type=operation_type,
            quantity=delta,
            after_quantity=new_quantity,
            rel_type=rel_type,
            rel_id=rel_id,
            operator_id=operator_id,
            operator_name=operator_name,
            remark=remark
        )

        return inventory

    async def apply_parts_usage(
        self,
        tenant_id: int,
        parts_data: Any,
        *,
        rel_type: str,
        rel_id: int,
        operator_id: Optional[int] = None,
        operator_name: Optional[str] = None,
    ) -> None:
        """从维修/保养 JSON 备件列表出库。"""
        if not parts_data:
            return
        items = parts_data if isinstance(parts_data, list) else parts_data.get("items") if isinstance(parts_data, dict) else []
        if not isinstance(items, list):
            return
        for item in items:
            if not isinstance(item, dict):
                continue
            part_id = item.get("spare_part_id") or item.get("part_id")
            qty = item.get("quantity") or item.get("qty")
            location = item.get("warehouse_location") or item.get("location")
            if not part_id or not qty:
                continue
            spare_part = await SparePart.filter(
                tenant_id=tenant_id,
                id=int(part_id),
                deleted_at__isnull=True,
            ).first()
            if not spare_part:
                raise NotFoundError(f"备件不存在: {part_id}")
            await self._deduct_stock_across_locations(
                tenant_id=tenant_id,
                spare_part=spare_part,
                quantity=abs(int(qty)),
                preferred_location=location,
                operation_type="出库",
                rel_type=rel_type,
                rel_id=rel_id,
                operator_id=operator_id,
                operator_name=operator_name,
                remark=item.get("remark"),
            )

    async def get_safety_stock_alerts(self, tenant_id: int) -> List[Dict[str, Any]]:
        """
        获取库存低于安全库存的备件列表
        """
        all_parts = await SparePart.filter(tenant_id=tenant_id, is_active=True, deleted_at__isnull=True).all()
        alerts = []
        for part in all_parts:
            total_stock = await SparePartInventory.filter(
                tenant_id=tenant_id,
                spare_part_id=part.id,
                deleted_at__isnull=True,
            ).all()
            total_qty = sum([inv.stock_quantity for inv in total_stock])
            if total_qty < part.safety_stock:
                alerts.append({
                    "part_no": part.part_no,
                    "part_name": part.part_name,
                    "current_stock": total_qty,
                    "safety_stock": part.safety_stock
                })
        return alerts
