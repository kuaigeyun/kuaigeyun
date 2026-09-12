"""
设备管理服务模块

提供设备的 CRUD 操作。

Author: Luigi Lu
Date: 2026-01-05
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from tortoise.exceptions import IntegrityError

from apps.kuaizhizao.models.equipment import Equipment, EquipmentCalibration
from apps.kuaizhizao.models.equipment_status_monitor import EquipmentStatusHistory
from apps.kuaizhizao.models.equipment_fault import EquipmentFault, EquipmentRepair
from apps.kuaizhizao.models.maintenance_plan import MaintenanceExecution
from apps.kuaizhizao.models.equipment_point_inspection import EquipmentPointInspectionRecord
from apps.kuaizhizao.schemas.equipment import (
    EquipmentCreate,
    EquipmentUpdate,
    EquipmentCalibrationCreate,
    EquipmentCalibrationCreateWithEquipment,
)
from apps.common.audit_actor import apply_create_audit
from core.services.business.code_generation_service import CodeGenerationService
from infra.exceptions.exceptions import NotFoundError, ValidationError
from infra.models.user import User
from core.utils.timezone_utils import resolve_business_datetime


class EquipmentService:
    """
    设备管理服务类
    
    提供设备的 CRUD 操作。
    """
    
    @staticmethod
    async def create_equipment(
        tenant_id: int,
        data: EquipmentCreate,
        created_by: Optional[int] = None
    ) -> Equipment:
        """创建设备"""
        try:
            code = (data.code or "").strip() or None
            if code:
                exists = await Equipment.filter(
                    tenant_id=tenant_id,
                    code=code,
                    deleted_at__isnull=True,
                ).exists()
                if exists:
                    raise ValidationError(
                        f"设备编码 {code} 已存在，请关闭弹窗后重新新建以获取最新编号"
                    )
            else:
                code = await CodeGenerationService.generate_code(
                    tenant_id=tenant_id,
                    rule_code="EQUIPMENT_CODE",
                    context=None,
                )
            data.code = code

            bind = (data.qr_bind_code or "").strip() or None
            if bind:
                await EquipmentService._assert_qr_bind_unique(tenant_id, bind)
            equipment = Equipment(
                tenant_id=tenant_id,
                **{**data.model_dump(exclude_none=True), "qr_bind_code": bind},
            )
            actor = None
            if created_by is not None:
                actor = await User.filter(id=created_by, tenant_id=tenant_id).first()
            apply_create_audit(equipment, actor)
            await equipment.save()
            return equipment
        except IntegrityError:
            raise ValidationError(f"设备编码 {data.code} 已存在")

    @staticmethod
    async def _assert_qr_bind_unique(
        tenant_id: int,
        qr_bind_code: str,
        *,
        exclude_uuid: Optional[str] = None,
    ) -> None:
        qs = Equipment.filter(
            tenant_id=tenant_id,
            qr_bind_code=qr_bind_code,
            deleted_at__isnull=True,
        )
        if exclude_uuid:
            qs = qs.exclude(uuid=exclude_uuid)
        existing = await qs.first()
        if existing:
            raise ValidationError(f"二维码绑定内容已被设备 {existing.code} 使用")

    @staticmethod
    async def resolve_by_scan(tenant_id: int, raw: str) -> Equipment:
        """扫码解析：系统 EQ JSON / 设备编码 / 手工绑定码。"""
        import json

        q = (raw or "").strip()
        if not q:
            raise ValidationError("扫码内容不能为空")

        if q.startswith("{") and q.endswith("}"):
            try:
                payload = json.loads(q)
            except json.JSONDecodeError:
                payload = None
            if isinstance(payload, dict) and payload.get("type") is not None and isinstance(
                payload.get("data"), dict
            ):
                qr_type = str(payload.get("type") or "").strip().upper()
                if qr_type != "EQ":
                    labels = {
                        "MAT": "物料码",
                        "WO": "工单码",
                        "OP": "工序码",
                        "EQ": "设备码",
                        "MD": "模具码",
                        "EMP": "人员码",
                        "STATION": "工位码",
                        "BOX": "装箱码",
                        "TRACE": "追溯码",
                        "DOC": "单据码",
                    }
                    label = labels.get(qr_type, f"{qr_type} 码")
                    raise ValidationError(f"扫到的是{label}，不是设备码")
                data = payload.get("data") if isinstance(payload.get("data"), dict) else {}
                uuid = str(data.get("equipment_uuid") or "").strip()
                if uuid:
                    return await EquipmentService.get_equipment_by_uuid(tenant_id, uuid)
                code = str(data.get("equipment_code") or "").strip()
                if not code:
                    raise ValidationError("设备码缺少设备编码")
                by_code = await EquipmentService.get_equipment_by_code(tenant_id, code)
                if by_code:
                    return by_code
                raise NotFoundError("未找到设备")

        by_code = await EquipmentService.get_equipment_by_code(tenant_id, q)
        if by_code:
            return by_code

        by_bind = await Equipment.filter(
            tenant_id=tenant_id,
            qr_bind_code=q,
            deleted_at__isnull=True,
        ).first()
        if by_bind:
            return by_bind

        raise NotFoundError("未找到设备")
    
    @staticmethod
    async def get_equipment_by_uuid(
        tenant_id: int,
        uuid: str
    ) -> Equipment:
        """根据UUID获取设备"""
        equipment = await Equipment.filter(
            tenant_id=tenant_id,
            uuid=uuid,
            deleted_at__isnull=True
        ).first()
        
        if not equipment:
            raise NotFoundError("设备不存在")
        
        return equipment
    
    @staticmethod
    async def get_equipment_by_code(
        tenant_id: int,
        code: str
    ) -> Optional[Equipment]:
        """根据编码获取设备"""
        return await Equipment.filter(
            tenant_id=tenant_id,
            code=code,
            deleted_at__isnull=True
        ).first()
    
    @staticmethod
    async def list_equipment(
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        type: Optional[str] = None,
        category: Optional[str] = None,
        equipment_nature: Optional[str] = None,
        exclude_equipment_nature: Optional[str] = None,
        status: Optional[str] = None,
        is_active: Optional[bool] = None,
        workshop_id: Optional[int] = None,
        production_line_id: Optional[int] = None,
        workstation_id: Optional[int] = None,
        search: Optional[str] = None,
        keyword: Optional[str] = None,
        order_by: Optional[str] = None,
        created_start_date: Optional[str] = None,
        created_end_date: Optional[str] = None,
        updated_start_date: Optional[str] = None,
        updated_end_date: Optional[str] = None,
    ) -> tuple[List[Equipment], int]:
        """获取设备列表"""
        from apps.kuaizhizao.services.equipment_list_core import (
            EQUIPMENT_LEDGER_SORTABLE_FIELDS,
            apply_equipment_created_date_range,
            apply_equipment_keyword_filter,
            apply_equipment_updated_date_range,
            pick_search_keyword,
            resolve_equipment_list_order_by,
        )

        query = Equipment.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True
        )
        if type:
            query = query.filter(type=type)
        if category:
            query = query.filter(category=category)
        if equipment_nature:
            query = query.filter(equipment_nature=equipment_nature)
        if exclude_equipment_nature:
            query = query.exclude(equipment_nature=exclude_equipment_nature)
        if status:
            query = query.filter(status=status)
        if is_active is not None:
            query = query.filter(is_active=is_active)
        if workshop_id is not None:
            query = query.filter(workshop_id=workshop_id)
        if production_line_id is not None:
            query = query.filter(production_line_id=production_line_id)
        if workstation_id:
            query = query.filter(workstation_id=workstation_id)
        query = apply_equipment_keyword_filter(
            query,
            pick_search_keyword(keyword, search),
            [
                "code",
                "name",
                "serial_number",
                "responsible_person_name",
                "spot_check_person_name",
                "supplier",
                "qr_bind_code",
            ],
        )
        query = apply_equipment_created_date_range(
            query,
            start_date=created_start_date,
            end_date=created_end_date,
        )
        query = apply_equipment_updated_date_range(
            query,
            start_date=updated_start_date,
            end_date=updated_end_date,
        )
        total = await query.count()
        order_clause = resolve_equipment_list_order_by(
            order_by,
            EQUIPMENT_LEDGER_SORTABLE_FIELDS,
            "-created_at",
        )
        equipment_list = await query.offset(skip).limit(limit).order_by(order_clause)
        return equipment_list, total
    
    @staticmethod
    async def update_equipment(
        tenant_id: int,
        uuid: str,
        data: EquipmentUpdate
    ) -> Equipment:
        """更新设备"""
        equipment = await EquipmentService.get_equipment_by_uuid(tenant_id, uuid)
        update_data = data.model_dump(exclude_unset=True, exclude_none=True)
        # 允许清空设备负责人（exclude_none 会丢掉 null）
        if "responsible_person_id" in data.model_fields_set:
            update_data["responsible_person_id"] = data.responsible_person_id
        if "responsible_person_name" in data.model_fields_set:
            update_data["responsible_person_name"] = data.responsible_person_name
        if "spot_check_person_id" in data.model_fields_set:
            update_data["spot_check_person_id"] = data.spot_check_person_id
        if "spot_check_person_name" in data.model_fields_set:
            update_data["spot_check_person_name"] = data.spot_check_person_name
        if "last_calibration_date" in data.model_fields_set:
            update_data["last_calibration_date"] = data.last_calibration_date
        if "next_calibration_date" in data.model_fields_set:
            update_data["next_calibration_date"] = data.next_calibration_date
        if "calibration_period" in data.model_fields_set:
            update_data["calibration_period"] = data.calibration_period
        if "needs_calibration" in data.model_fields_set:
            update_data["needs_calibration"] = data.needs_calibration
        # 允许清空设备照片
        if "photo_file_uuid" in data.model_fields_set:
            update_data["photo_file_uuid"] = data.photo_file_uuid
        if "qr_bind_code" in data.model_fields_set:
            bind = (data.qr_bind_code or "").strip() or None
            update_data["qr_bind_code"] = bind
            if bind:
                await EquipmentService._assert_qr_bind_unique(
                    tenant_id, bind, exclude_uuid=str(equipment.uuid)
                )
        if 'code' in update_data and update_data['code'] != equipment.code:
            existing = await EquipmentService.get_equipment_by_code(
                tenant_id, update_data['code']
            )
            if existing and existing.uuid != equipment.uuid:
                raise ValidationError(f"设备编码 {update_data['code']} 已存在")
        for key, value in update_data.items():
            setattr(equipment, key, value)
        if (
            "last_calibration_date" in data.model_fields_set
            or "calibration_period" in data.model_fields_set
        ) and equipment.last_calibration_date and equipment.calibration_period:
            from datetime import timedelta

            if "next_calibration_date" not in data.model_fields_set:
                equipment.next_calibration_date = (
                    equipment.last_calibration_date
                    + timedelta(days=equipment.calibration_period)
                )
        await equipment.save()
        return equipment
    
    @staticmethod
    async def delete_equipment(
        tenant_id: int,
        uuid: str
    ) -> None:
        """删除设备"""
        equipment = await EquipmentService.get_equipment_by_uuid(tenant_id, uuid)
        equipment.deleted_at = resolve_business_datetime()
        await equipment.save()

    @staticmethod
    async def _apply_calibration_to_equipment(
        equipment: Equipment,
        calibration_date,
        expiry_date,
    ) -> None:
        """更新设备上次/下次校验日期"""
        from datetime import timedelta

        equipment.last_calibration_date = calibration_date
        if expiry_date:
            equipment.next_calibration_date = expiry_date
        elif equipment.calibration_period:
            equipment.next_calibration_date = calibration_date + timedelta(days=equipment.calibration_period)
        await equipment.save()

    @staticmethod
    async def create_equipment_calibration(
        tenant_id: int,
        equipment_uuid: str,
        data: EquipmentCalibrationCreate,
        current_user: Optional[User] = None,
    ) -> EquipmentCalibration:
        """创建设备校验记录"""
        from apps.kuaizhizao.constants.calibration_plan_types import (
            CALIBRATION_PLAN_EXTERNAL,
            CALIBRATION_PLAN_TYPES,
            CALIBRATION_PLAN_TYPE_DEFAULT,
        )

        equipment = await EquipmentService.get_equipment_by_uuid(tenant_id, equipment_uuid)
        plan_type = (getattr(data, "plan_type", None) or CALIBRATION_PLAN_TYPE_DEFAULT).strip().lower()
        if plan_type not in CALIBRATION_PLAN_TYPES:
            raise ValidationError(f"非法校准计划类型: {plan_type}")
        if plan_type == CALIBRATION_PLAN_EXTERNAL and not data.expiry_date:
            raise ValidationError("外校记录须填写计量到期日")

        calib = EquipmentCalibration(
            tenant_id=tenant_id,
            equipment_id=equipment.id,
            equipment_uuid=equipment.uuid,
            plan_type=plan_type,
            calibration_date=data.calibration_date,
            result=data.result,
            certificate_no=data.certificate_no,
            expiry_date=data.expiry_date,
            attachment_uuid=data.attachment_uuid,
            attachments=data.attachments,
            remark=data.remark,
        )
        apply_create_audit(calib, current_user)
        await calib.save()
        await EquipmentService._apply_calibration_to_equipment(
            equipment, data.calibration_date, data.expiry_date
        )
        from apps.kuaizhizao.services.equipment_calibration_reminder_service import (
            EquipmentCalibrationReminderService,
        )

        await EquipmentCalibrationReminderService.sync_after_calibration_saved(
            tenant_id, equipment, calib
        )
        return calib

    @staticmethod
    async def _resolve_equipment_ids_by_nature(
        tenant_id: int,
        *,
        equipment_nature: Optional[str] = None,
        exclude_equipment_nature: Optional[str] = None,
    ) -> Optional[set[int]]:
        if not equipment_nature and not exclude_equipment_nature:
            return None
        qs = Equipment.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if equipment_nature:
            qs = qs.filter(equipment_nature=equipment_nature)
        if exclude_equipment_nature:
            qs = qs.exclude(equipment_nature=exclude_equipment_nature)
        ids = await qs.values_list("id", flat=True)
        return set(ids)

    @staticmethod
    async def list_all_calibrations(
        tenant_id: int,
        equipment_uuid: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
        keyword: Optional[str] = None,
        search: Optional[str] = None,
        order_by: Optional[str] = None,
        calibration_start_date: Optional[str] = None,
        calibration_end_date: Optional[str] = None,
        created_start_date: Optional[str] = None,
        created_end_date: Optional[str] = None,
        updated_start_date: Optional[str] = None,
        updated_end_date: Optional[str] = None,
        equipment_nature: Optional[str] = None,
        exclude_equipment_nature: Optional[str] = None,
    ) -> tuple[List[EquipmentCalibration], int]:
        """获取全量设备校验记录列表（支持按设备筛选）"""
        from apps.kuaizhizao.services.equipment_list_core import (
            EQUIPMENT_CALIBRATION_SORTABLE_FIELDS,
            apply_asset_workflow_list_filters,
        )

        query = EquipmentCalibration.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
        )
        nature_ids = await EquipmentService._resolve_equipment_ids_by_nature(
            tenant_id,
            equipment_nature=equipment_nature,
            exclude_equipment_nature=exclude_equipment_nature,
        )
        if nature_ids is not None:
            if not nature_ids:
                return [], 0
            query = query.filter(equipment_id__in=list(nature_ids))
        if equipment_uuid:
            equipment = await EquipmentService.get_equipment_by_uuid(tenant_id, equipment_uuid)
            query = query.filter(equipment_id=equipment.id)
        query, order_clause = apply_asset_workflow_list_filters(
            query,
            keyword=keyword,
            search=search,
            order_by=order_by,
            allowed_fields=EQUIPMENT_CALIBRATION_SORTABLE_FIELDS,
            keyword_fields=["certificate_no", "result"],
            date_field="calibration_date",
            date_start=calibration_start_date,
            date_end=calibration_end_date,
            created_start_date=created_start_date,
            created_end_date=created_end_date,
            updated_start_date=updated_start_date,
            updated_end_date=updated_end_date,
        )
        total = await query.count()
        items = await query.offset(skip).limit(limit).order_by(order_clause)
        return list(items), total

    @staticmethod
    async def list_calibration_alerts(
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        due_type: Optional[str] = None,
        equipment_nature: Optional[str] = None,
        exclude_equipment_nature: Optional[str] = None,
    ) -> tuple[List[dict], int]:
        """设备检定到期提醒（租户可配置提前天数内到期或已逾期）"""
        from apps.kuaizhizao.services.equipment_calibration_settings_service import (
            get_calibration_reminder_advance_days,
        )
        from core.utils.timezone_utils import resolve_business_datetime, to_site_date

        advance_days = await get_calibration_reminder_advance_days(tenant_id)
        today = to_site_date(resolve_business_datetime())
        eq_query = Equipment.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            is_active=True,
            needs_calibration=True,
        )
        if equipment_nature:
            eq_query = eq_query.filter(equipment_nature=equipment_nature)
        if exclude_equipment_nature:
            eq_query = eq_query.exclude(equipment_nature=exclude_equipment_nature)
        equipments = await eq_query
        results: List[dict] = []
        for eq in equipments:
            if not eq.next_calibration_date:
                continue
            delta = (eq.next_calibration_date - today).days
            if delta > advance_days:
                continue
            rtype = "overdue" if delta < 0 else "due_soon"
            if due_type and rtype != due_type:
                continue
            results.append({
                "equipment_uuid": eq.uuid,
                "equipment_code": eq.code,
                "equipment_name": eq.name,
                "reminder_type": "calibration",
                "due_type": rtype,
                "due_date": eq.next_calibration_date,
                "days_until_due": delta,
                "calibration_period": eq.calibration_period,
                "last_calibration_date": eq.last_calibration_date,
            })
        results.sort(key=lambda x: (0 if x["due_type"] == "overdue" else 1, x["days_until_due"]))
        total = len(results)
        return results[skip : skip + limit], total

    @staticmethod
    async def report_measuring_instrument_calibration_alerts(
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        due_type: Optional[str] = None,
    ) -> tuple[List[dict], int]:
        from apps.kuaizhizao.constants.measuring_instrument import MEASURING_INSTRUMENT_NATURE

        return await EquipmentService.list_calibration_alerts(
            tenant_id,
            skip=skip,
            limit=limit,
            due_type=due_type,
            equipment_nature=MEASURING_INSTRUMENT_NATURE,
        )

    @staticmethod
    async def report_measuring_instrument_calibration_detail(
        tenant_id: int,
        skip: int = 0,
        limit: int = 100,
        calibration_start_date: Optional[str] = None,
        calibration_end_date: Optional[str] = None,
    ) -> tuple[List[dict], int]:
        from apps.kuaizhizao.constants.measuring_instrument import MEASURING_INSTRUMENT_NATURE

        items, total = await EquipmentService.list_all_calibrations(
            tenant_id=tenant_id,
            skip=skip,
            limit=limit,
            equipment_nature=MEASURING_INSTRUMENT_NATURE,
            calibration_start_date=calibration_start_date,
            calibration_end_date=calibration_end_date,
            order_by="-calibration_date",
        )
        if not items:
            return [], total
        equipment_ids = {c.equipment_id for c in items}
        equipments = {
            e.id: e for e in await Equipment.filter(id__in=list(equipment_ids))
        }
        rows: List[dict] = []
        for calib in items:
            eq = equipments.get(calib.equipment_id)
            if not eq:
                continue
            attachments = calib.attachments if isinstance(calib.attachments, list) else []
            rows.append({
                "equipment_uuid": eq.uuid,
                "equipment_code": eq.code,
                "equipment_name": eq.name,
                "calibration_uuid": calib.uuid,
                "calibration_date": calib.calibration_date,
                "result": calib.result,
                "certificate_no": calib.certificate_no,
                "expiry_date": calib.expiry_date,
                "attachment_count": len(attachments),
                "remark": calib.remark,
                "created_by_name": calib.created_by_name,
            })
        return rows, total

    @staticmethod
    async def get_equipment_lifecycle_log(
        tenant_id: int,
        equipment_uuid: str,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """
        获取设备全生命周期履历
        聚合各模块记录：状态变更、故障、维修、保养、点检、校准。
        """
        equipment = await EquipmentService.get_equipment_by_uuid(tenant_id, equipment_uuid)
        equipment_id = equipment.id
        logs = []
        
        # 1. 状态变更记录
        items = await EquipmentStatusHistory.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "status_change", "time": item.status_changed_at, "title": f"状态变更: {item.from_status} -> {item.to_status}", "content": item.reason or "", "operator": item.changed_by_name})
            
        # 2. 故障记录
        items = await EquipmentFault.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "fault", "time": item.fault_date, "title": f"故障上报: {item.fault_type}", "content": item.fault_description, "operator": item.reporter_name, "status": item.status})
            
        # 3. 维修记录
        items = await EquipmentRepair.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "repair", "time": item.repair_date, "title": f"设备维修: {item.repair_type}", "content": item.repair_description, "operator": item.repairer_name, "result": item.repair_result})
            
        # 4. 保养记录
        items = await MaintenanceExecution.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "maintenance", "time": item.execution_date, "title": f"设备保养: {item.execution_no}", "content": item.execution_content, "operator": item.executor_name, "result": item.execution_result})
            
        # 5. 点检记录
        items = await EquipmentPointInspectionRecord.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "inspection", "time": item.inspection_date, "title": "日常点检", "content": f"结果: {'异常' if item.has_abnormality else '正常'} - {item.abnormality_description or ''}", "operator": item.inspector_name})
            
        # 6. 校准记录
        items = await EquipmentCalibration.filter(tenant_id=tenant_id, equipment_id=equipment_id).limit(limit).all()
        for item in items:
            logs.append({"type": "calibration", "time": item.calibration_date, "title": "设备校准/计量", "content": f"结果: {item.result}, 证书号: {item.certificate_no or '无'}", "operator": ""})

        logs.sort(key=lambda x: x["time"] if x["time"] else datetime.min, reverse=True)
        return logs[:limit]
