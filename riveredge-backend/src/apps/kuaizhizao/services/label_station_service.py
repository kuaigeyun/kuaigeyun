"""标签工位引擎服务（R-16 通用）：会话、扫码绑定、锁定、解绑、补打、清理。"""

from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

from tortoise.exceptions import IntegrityError
from tortoise.transactions import in_transaction

from apps.common.audit_actor import apply_create_audit, apply_update_audit
from apps.kuaizhizao.models.label_station import (
    LabelBoxItem,
    LabelCleanupRun,
    LabelLockEvent,
    LabelModelConfig,
    LabelOuterBox,
    LabelScanEvent,
    LabelStation,
    LabelStationSession,
    LabelUnbindRecord,
)
from apps.kuaizhizao.schemas.label_station import (
    LabelCleanupRequest,
    LabelLockRequest,
    LabelModelConfigCreate,
    LabelModelConfigUpdate,
    LabelReprintRequest,
    LabelScanRequest,
    LabelSessionOpen,
    LabelStationCreate,
    LabelStationUpdate,
    LabelUnbindRequest,
    LabelUnlockRequest,
)
from apps.kuaizhizao.services.label_station_validators import (
    LabelScanContext,
    run_label_scan_validators,
)
from core.services.business.code_generation_service import CodeGenerationService
from core.services.print.print_bridge_service import PrintBridgeService
from core.utils.timezone_utils import coerce_business_datetime_to_utc, resolve_business_datetime
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError
from infra.models.user import User

ALLOWED_MODES = frozenset({"work", "reprint", "admin"})
SESSION_ACTIVE = "active"
SESSION_LOCKED = "locked"
SESSION_CLOSED = "closed"
BOX_OPEN = "open"
BOX_FULL = "full"
ITEM_BOUND = "bound"
ITEM_UNBOUND = "unbound"


def _user_name(user: User) -> str:
    return getattr(user, "full_name", None) or getattr(user, "name", None) or user.username


def _model_to_dict(row: Any) -> Dict[str, Any]:
    data = {}
    for key in row._meta.db_fields:
        data[key] = getattr(row, key)
    data["id"] = row.id
    data["uuid"] = str(row.uuid)
    return data


class LabelStationService:
    # ----- 型号配置 -----
    async def list_models(self, tenant_id: int, *, active_only: bool = False) -> List[Dict[str, Any]]:
        q = LabelModelConfig.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if active_only:
            q = q.filter(is_active=True)
        rows = await q.order_by("model_code")
        return [_model_to_dict(r) for r in rows]

    async def create_model(
        self, tenant_id: int, data: LabelModelConfigCreate, user: User
    ) -> Dict[str, Any]:
        code = (data.model_code or "").strip()
        if not code:
            code = await CodeGenerationService.generate_code(
                tenant_id, "LABEL_MODEL_CONFIG_CODE"
            )
        payload = {
            "tenant_id": tenant_id,
            "model_code": code,
            "model_name": data.model_name.strip(),
            "template_uuid": data.template_uuid.strip(),
            "template_version": data.template_version,
            "qty_per_box": data.qty_per_box,
            "print_copies": data.print_copies,
            "device_uuid": data.device_uuid,
            "validation_hooks": list(data.validation_hooks or ["builtin.reject_empty"]),
            "policy_config": dict(data.policy_config or {}),
            "is_active": data.is_active,
            "remarks": data.remarks,
        }
        apply_create_audit(payload, user)
        try:
            row = await LabelModelConfig.create(**payload)
        except IntegrityError as exc:
            raise BusinessLogicError("型号编码已存在") from exc
        return _model_to_dict(row)

    async def update_model(
        self, tenant_id: int, model_id: int, data: LabelModelConfigUpdate, user: User
    ) -> Dict[str, Any]:
        row = await LabelModelConfig.get_or_none(
            id=model_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("型号配置不存在")
        payload = data.model_dump(exclude_unset=True)
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return _model_to_dict(row)

    # ----- 工位 -----
    async def list_stations(self, tenant_id: int, *, active_only: bool = False) -> List[Dict[str, Any]]:
        q = LabelStation.filter(tenant_id=tenant_id, deleted_at__isnull=True)
        if active_only:
            q = q.filter(is_active=True)
        rows = await q.order_by("station_code")
        return [_model_to_dict(r) for r in rows]

    async def create_station(
        self, tenant_id: int, data: LabelStationCreate, user: User
    ) -> Dict[str, Any]:
        code = (data.station_code or "").strip()
        if not code:
            code = await CodeGenerationService.generate_code(
                tenant_id, "LABEL_STATION_CODE"
            )
        mode = (data.default_mode or "work").strip()
        if mode not in ALLOWED_MODES:
            raise ValidationError("不支持的作业模式")
        payload = {
            "tenant_id": tenant_id,
            "station_code": code,
            "station_name": data.station_name.strip(),
            "model_config_id": data.model_config_id,
            "default_mode": mode,
            "device_uuid": data.device_uuid,
            "unlock_requires_password": data.unlock_requires_password,
            "is_active": data.is_active,
            "remarks": data.remarks,
        }
        apply_create_audit(payload, user)
        try:
            row = await LabelStation.create(**payload)
        except IntegrityError as exc:
            raise BusinessLogicError("工位编码已存在") from exc
        return _model_to_dict(row)

    async def update_station(
        self, tenant_id: int, station_id: int, data: LabelStationUpdate, user: User
    ) -> Dict[str, Any]:
        row = await LabelStation.get_or_none(
            id=station_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not row:
            raise NotFoundError("工位不存在")
        payload = data.model_dump(exclude_unset=True)
        if "default_mode" in payload and payload["default_mode"] not in ALLOWED_MODES:
            raise ValidationError("不支持的作业模式")
        for key, value in payload.items():
            setattr(row, key, value)
        apply_update_audit(row, user)
        await row.save()
        return _model_to_dict(row)

    # ----- 会话 -----
    async def open_session(
        self, tenant_id: int, data: LabelSessionOpen, user: User
    ) -> Dict[str, Any]:
        station = await LabelStation.get_or_none(
            id=data.station_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not station or not station.is_active:
            raise NotFoundError("工位不存在或未启用")
        mode = (data.mode or station.default_mode or "work").strip()
        if mode not in ALLOWED_MODES:
            raise ValidationError("不支持的作业模式")
        active = await LabelStationSession.filter(
            tenant_id=tenant_id,
            station_id=station.id,
            status__in=[SESSION_ACTIVE, SESSION_LOCKED],
            deleted_at__isnull=True,
        ).first()
        if active:
            raise BusinessLogicError("该工位已有进行中的会话，请先关闭或继续现有会话")

        model_id = data.model_config_id or station.model_config_id
        model = None
        if model_id:
            model = await LabelModelConfig.get_or_none(
                id=model_id, tenant_id=tenant_id, deleted_at__isnull=True, is_active=True
            )
            if not model:
                raise NotFoundError("型号配置不存在或未启用")

        now = resolve_business_datetime()
        payload = {
            "tenant_id": tenant_id,
            "station_id": station.id,
            "station_code": station.station_code,
            "mode": mode,
            "status": SESSION_ACTIVE,
            "model_config_id": model.id if model else None,
            "model_code": model.model_code if model else None,
            "operator_id": user.id,
            "operator_name": _user_name(user),
            "opened_at": now,
        }
        apply_create_audit(payload, user)
        session = await LabelStationSession.create(**payload)
        return await self.get_snapshot(tenant_id, session.id)

    async def get_snapshot(self, tenant_id: int, session_id: int) -> Dict[str, Any]:
        session = await LabelStationSession.get_or_none(
            id=session_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not session:
            raise NotFoundError("会话不存在")
        station = await LabelStation.get_or_none(
            id=session.station_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not station:
            raise NotFoundError("工位不存在")
        model = None
        if session.model_config_id:
            model = await LabelModelConfig.get_or_none(
                id=session.model_config_id, tenant_id=tenant_id, deleted_at__isnull=True
            )
        box = None
        items: List[Dict[str, Any]] = []
        if session.current_box_id:
            box = await LabelOuterBox.get_or_none(
                id=session.current_box_id, tenant_id=tenant_id, deleted_at__isnull=True
            )
            if box:
                item_rows = await LabelBoxItem.filter(
                    tenant_id=tenant_id, box_id=box.id, status=ITEM_BOUND, deleted_at__isnull=True
                ).order_by("scanned_at")
                items = [_model_to_dict(i) for i in item_rows]
        return {
            "session": _model_to_dict(session),
            "station": _model_to_dict(station),
            "model": _model_to_dict(model) if model else None,
            "current_box": _model_to_dict(box) if box else None,
            "items": items,
        }

    async def close_session(self, tenant_id: int, session_id: int, user: User) -> Dict[str, Any]:
        session = await LabelStationSession.get_or_none(
            id=session_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not session:
            raise NotFoundError("会话不存在")
        if session.status == SESSION_CLOSED:
            return await self.get_snapshot(tenant_id, session_id)
        session.status = SESSION_CLOSED
        session.closed_at = resolve_business_datetime()
        apply_update_audit(session, user)
        await session.save()
        return await self.get_snapshot(tenant_id, session_id)

    # ----- 扫码绑定 -----
    async def scan_barcode(
        self, tenant_id: int, data: LabelScanRequest, user: User
    ) -> Dict[str, Any]:
        barcode = data.barcode.strip()
        if not barcode:
            raise ValidationError("条码不能为空")

        async with in_transaction():
            session = (
                await LabelStationSession.filter(
                    id=data.session_id, tenant_id=tenant_id, deleted_at__isnull=True
                )
                .select_for_update()
                .first()
            )
            if not session:
                raise NotFoundError("会话不存在")
            if session.status == SESSION_LOCKED:
                raise BusinessLogicError("工位已锁定，无法继续扫码")
            if session.status != SESSION_ACTIVE:
                raise BusinessLogicError("会话已关闭")
            if session.mode != "work":
                raise BusinessLogicError("当前模式不可扫码作业，请切换到作业模式")
            if not session.model_config_id or not session.model_code:
                raise BusinessLogicError("会话未选择型号")

            model = await LabelModelConfig.get_or_none(
                id=session.model_config_id, tenant_id=tenant_id, deleted_at__isnull=True
            )
            if not model or not model.is_active:
                raise BusinessLogicError("型号配置不可用")

            try:
                await run_label_scan_validators(
                    LabelScanContext(
                        tenant_id=tenant_id,
                        barcode=barcode,
                        model_code=session.model_code,
                        session_id=session.id,
                        station_id=session.station_id,
                        box_id=session.current_box_id,
                        hooks=list(model.validation_hooks or []),
                    )
                )
            except BusinessLogicError as exc:
                await self._log_scan(
                    tenant_id,
                    session,
                    barcode,
                    result="reject",
                    message=str(exc),
                    user=user,
                )
                await self._lock_session(session, reason=str(exc), user=user)
                raise

            dup = await LabelBoxItem.filter(
                tenant_id=tenant_id,
                barcode=barcode,
                status=ITEM_BOUND,
                deleted_at__isnull=True,
            ).first()
            if dup:
                msg = "条码已绑定，禁止重复扫码"
                await self._log_scan(
                    tenant_id, session, barcode, result="lock", message=msg, user=user
                )
                await self._lock_session(session, reason=msg, user=user)
                raise BusinessLogicError(msg)

            box = None
            if session.current_box_id:
                box = (
                    await LabelOuterBox.filter(
                        id=session.current_box_id, tenant_id=tenant_id, deleted_at__isnull=True
                    )
                    .select_for_update()
                    .first()
                )
            if not box or box.status != BOX_OPEN:
                box = await self._open_box(tenant_id, session, model, user)
                session.current_box_id = box.id
                apply_update_audit(session, user)
                await session.save()

            if box.model_code != session.model_code:
                msg = "混料：条码型号与当前箱型号不一致"
                await self._log_scan(
                    tenant_id, session, barcode, result="lock", message=msg, user=user, box_id=box.id
                )
                await self._lock_session(session, reason=msg, user=user)
                raise BusinessLogicError(msg)

            now = resolve_business_datetime()
            try:
                item = await LabelBoxItem.create(
                    tenant_id=tenant_id,
                    box_id=box.id,
                    barcode=barcode,
                    model_code=session.model_code,
                    status=ITEM_BOUND,
                    scanned_at=now,
                    created_by=user.id,
                    updated_by=user.id,
                    created_by_name=_user_name(user),
                    updated_by_name=_user_name(user),
                )
            except IntegrityError as exc:
                msg = "条码已绑定，禁止重复扫码"
                await self._log_scan(
                    tenant_id, session, barcode, result="lock", message=msg, user=user, box_id=box.id
                )
                await self._lock_session(session, reason=msg, user=user)
                raise BusinessLogicError(msg) from exc

            box.qty_current = int(box.qty_current or 0) + 1
            apply_update_audit(box, user)
            await box.save()
            await self._log_scan(
                tenant_id,
                session,
                barcode,
                result="ok",
                message="绑定成功",
                user=user,
                box_id=box.id,
            )

            print_job = None
            if box.qty_current >= box.qty_target:
                print_job = await self._close_box_and_print(tenant_id, session, box, model, user)
                session.current_box_id = None
                apply_update_audit(session, user)
                await session.save()

            snapshot = await self.get_snapshot(tenant_id, session.id)
            snapshot["last_item"] = _model_to_dict(item)
            if print_job:
                snapshot["print_job"] = {
                    "id": print_job.id,
                    "uuid": str(print_job.uuid),
                    "status": print_job.status,
                    "idempotency_key": print_job.idempotency_key,
                }
            return snapshot

    async def _open_box(
        self,
        tenant_id: int,
        session: LabelStationSession,
        model: LabelModelConfig,
        user: User,
    ) -> LabelOuterBox:
        max_attempts = 5
        policy = dict(model.policy_config or {})
        unique_days = policy.get("box_no_unique_days")
        box_no = ""
        for _ in range(max_attempts):
            box_no = await CodeGenerationService.generate_code(
                tenant_id, "LABEL_STATION_BOX_CODE"
            )
            if unique_days:
                days = int(unique_days)
                if days < 1:
                    raise BusinessLogicError("箱号周期唯一天数配置无效")
                since = resolve_business_datetime() - timedelta(days=days)
                clash = await LabelOuterBox.filter(
                    tenant_id=tenant_id,
                    box_no=box_no,
                    created_at__gte=since,
                ).first()
                if clash:
                    continue
            break
        else:
            raise BusinessLogicError("箱号在周期内冲突，请检查编码规则或稍后重试")

        payload = {
            "tenant_id": tenant_id,
            "box_no": box_no,
            "session_id": session.id,
            "station_id": session.station_id,
            "model_config_id": model.id,
            "model_code": model.model_code,
            "qty_target": max(1, int(model.qty_per_box or 1)),
            "qty_current": 0,
            "status": BOX_OPEN,
        }
        apply_create_audit(payload, user)
        return await LabelOuterBox.create(**payload)

    async def _close_box_and_print(
        self,
        tenant_id: int,
        session: LabelStationSession,
        box: LabelOuterBox,
        model: LabelModelConfig,
        user: User,
    ):
        now = resolve_business_datetime()
        job_code = await CodeGenerationService.generate_code(
            tenant_id, "LABEL_STATION_JOB_CODE"
        )
        station = await LabelStation.get_or_none(
            id=session.station_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        device_uuid = (station.device_uuid if station else None) or model.device_uuid
        items = await LabelBoxItem.filter(
            tenant_id=tenant_id, box_id=box.id, status=ITEM_BOUND, deleted_at__isnull=True
        ).order_by("scanned_at")
        payload_snapshot = {
            "box_no": box.box_no,
            "model_code": box.model_code,
            "qty": box.qty_current,
            "qty_target": box.qty_target,
            "barcodes": [i.barcode for i in items],
            "station_code": session.station_code,
            "job_code": job_code,
        }
        job = await PrintBridgeService.submit_job(
            tenant_id,
            idempotency_key=f"label-box:{box.uuid}:v1",
            template_uuid=model.template_uuid,
            payload_snapshot=payload_snapshot,
            copies=max(1, int(model.print_copies or 1)),
            device_uuid=device_uuid,
            template_version=model.template_version,
            entity_type="label_outer_box",
            entity_id=box.id,
            entity_uuid=str(box.uuid),
            requested_by=user.id,
            requested_by_name=_user_name(user),
        )
        box.status = BOX_FULL
        box.closed_at = now
        box.print_job_id = job.id
        box.print_job_code = job_code
        apply_update_audit(box, user)
        await box.save()
        return job

    async def _log_scan(
        self,
        tenant_id: int,
        session: LabelStationSession,
        barcode: str,
        *,
        result: str,
        message: str,
        user: User,
        box_id: Optional[int] = None,
    ) -> None:
        await LabelScanEvent.create(
            tenant_id=tenant_id,
            session_id=session.id,
            station_id=session.station_id,
            box_id=box_id or session.current_box_id,
            barcode=barcode,
            result=result,
            message=message[:500],
            occurred_at=resolve_business_datetime(),
            created_by=user.id,
            updated_by=user.id,
            created_by_name=_user_name(user),
            updated_by_name=_user_name(user),
        )

    async def _lock_session(
        self, session: LabelStationSession, *, reason: str, user: User
    ) -> None:
        session.status = SESSION_LOCKED
        session.locked_reason = reason[:200]
        session.locked_at = resolve_business_datetime()
        apply_update_audit(session, user)
        await session.save()
        await LabelLockEvent.create(
            tenant_id=session.tenant_id,
            session_id=session.id,
            station_id=session.station_id,
            action="lock",
            reason=reason[:200],
            operator_id=user.id,
            operator_name=_user_name(user),
            occurred_at=resolve_business_datetime(),
            created_by=user.id,
            updated_by=user.id,
            created_by_name=_user_name(user),
            updated_by_name=_user_name(user),
        )

    async def lock_session(
        self, tenant_id: int, data: LabelLockRequest, user: User
    ) -> Dict[str, Any]:
        session = await LabelStationSession.get_or_none(
            id=data.session_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not session:
            raise NotFoundError("会话不存在")
        if session.status == SESSION_CLOSED:
            raise BusinessLogicError("会话已关闭")
        await self._lock_session(session, reason=data.reason, user=user)
        return await self.get_snapshot(tenant_id, session.id)

    async def unlock_session(
        self, tenant_id: int, data: LabelUnlockRequest, user: User
    ) -> Dict[str, Any]:
        session = await LabelStationSession.get_or_none(
            id=data.session_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not session:
            raise NotFoundError("会话不存在")
        if session.status != SESSION_LOCKED:
            raise BusinessLogicError("会话未锁定")
        station = await LabelStation.get_or_none(
            id=session.station_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if station and station.unlock_requires_password:
            pwd = (data.confirm_password or "").strip()
            if not pwd:
                raise ValidationError("解锁须二次校验密码")
            if not user.verify_password(pwd):
                raise BusinessLogicError("密码校验失败")

        session.status = SESSION_ACTIVE
        session.locked_reason = None
        session.locked_at = None
        apply_update_audit(session, user)
        await session.save()
        await LabelLockEvent.create(
            tenant_id=tenant_id,
            session_id=session.id,
            station_id=session.station_id,
            action="unlock",
            reason=(data.reason or "管理员解锁")[:200],
            operator_id=user.id,
            operator_name=_user_name(user),
            occurred_at=resolve_business_datetime(),
            created_by=user.id,
            updated_by=user.id,
            created_by_name=_user_name(user),
            updated_by_name=_user_name(user),
        )
        return await self.get_snapshot(tenant_id, session.id)

    async def unbind(
        self, tenant_id: int, data: LabelUnbindRequest, user: User
    ) -> Dict[str, Any]:
        box = await LabelOuterBox.get_or_none(
            id=data.box_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not box:
            raise NotFoundError("外箱不存在")
        if data.barcode:
            item = await LabelBoxItem.get_or_none(
                tenant_id=tenant_id,
                box_id=box.id,
                barcode=data.barcode.strip(),
                status=ITEM_BOUND,
                deleted_at__isnull=True,
            )
            if not item:
                raise NotFoundError("箱内无此已绑定条码")
            item.status = ITEM_UNBOUND
            item.unbound_at = resolve_business_datetime()
            apply_update_audit(item, user)
            await item.save()
            box.qty_current = max(0, int(box.qty_current or 0) - 1)
            if box.status == BOX_FULL:
                box.status = BOX_OPEN
                box.closed_at = None
            apply_update_audit(box, user)
            await box.save()
            await LabelUnbindRecord.create(
                tenant_id=tenant_id,
                box_id=box.id,
                box_no=box.box_no,
                item_id=item.id,
                barcode=item.barcode,
                reason=data.reason,
                operator_id=user.id,
                operator_name=_user_name(user),
                occurred_at=resolve_business_datetime(),
                created_by=user.id,
                updated_by=user.id,
                created_by_name=_user_name(user),
                updated_by_name=_user_name(user),
            )
            return {"box": _model_to_dict(box), "item": _model_to_dict(item)}

        items = await LabelBoxItem.filter(
            tenant_id=tenant_id, box_id=box.id, status=ITEM_BOUND, deleted_at__isnull=True
        )
        now = resolve_business_datetime()
        for item in items:
            item.status = ITEM_UNBOUND
            item.unbound_at = now
            apply_update_audit(item, user)
            await item.save()
            await LabelUnbindRecord.create(
                tenant_id=tenant_id,
                box_id=box.id,
                box_no=box.box_no,
                item_id=item.id,
                barcode=item.barcode,
                reason=data.reason or "整箱解绑",
                operator_id=user.id,
                operator_name=_user_name(user),
                occurred_at=now,
                created_by=user.id,
                updated_by=user.id,
                created_by_name=_user_name(user),
                updated_by_name=_user_name(user),
            )
        box.qty_current = 0
        box.status = "unbound"
        apply_update_audit(box, user)
        await box.save()
        return {"box": _model_to_dict(box), "unbound_count": len(items)}

    async def reprint(
        self, tenant_id: int, data: LabelReprintRequest, user: User
    ) -> Dict[str, Any]:
        box = await LabelOuterBox.get_or_none(
            id=data.box_id, tenant_id=tenant_id, deleted_at__isnull=True
        )
        if not box:
            raise NotFoundError("外箱不存在")
        if not box.print_job_id:
            raise BusinessLogicError("该箱尚无打印任务，无法补打")
        job = await PrintBridgeService.create_reprint(
            tenant_id,
            box.print_job_id,
            idempotency_key=f"label-box-reprint:{box.uuid}:{resolve_business_datetime().timestamp()}",
            requested_by=user.id,
            requested_by_name=_user_name(user),
        )
        return {
            "box": _model_to_dict(box),
            "print_job": {
                "id": job.id,
                "uuid": str(job.uuid),
                "status": job.status,
                "is_reprint": job.is_reprint,
                "source_job_id": job.source_job_id,
            },
        }

    async def cleanup_history(
        self, tenant_id: int, data: LabelCleanupRequest, user: User
    ) -> Dict[str, Any]:
        try:
            parsed = datetime.fromisoformat(str(data.before_at).strip().replace("Z", "+00:00"))
        except ValueError as exc:
            raise ValidationError("清理截止时刻无效") from exc
        before = coerce_business_datetime_to_utc(parsed)
        if before is None:
            raise ValidationError("清理截止时刻无效")
        now = resolve_business_datetime()
        summary: Dict[str, int] = {}

        async def _soft_delete(model, key: str) -> None:
            rows = await model.filter(
                tenant_id=tenant_id, deleted_at__isnull=True, created_at__lt=before
            )
            count = 0
            for row in rows:
                row.deleted_at = now
                await row.save(update_fields=["deleted_at", "updated_at"])
                count += 1
            summary[key] = count

        await _soft_delete(LabelScanEvent, "scan_events")
        await _soft_delete(LabelLockEvent, "lock_events")
        await _soft_delete(LabelUnbindRecord, "unbind_records")
        # 仅清理已关箱且无进行中会话引用的外箱/明细
        boxes = await LabelOuterBox.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            status__in=[BOX_FULL, "unbound"],
            created_at__lt=before,
        )
        box_count = 0
        item_count = 0
        for box in boxes:
            in_use = await LabelStationSession.filter(
                tenant_id=tenant_id,
                current_box_id=box.id,
                status__in=[SESSION_ACTIVE, SESSION_LOCKED],
                deleted_at__isnull=True,
            ).exists()
            if in_use:
                continue
            items = await LabelBoxItem.filter(
                tenant_id=tenant_id, box_id=box.id, deleted_at__isnull=True
            )
            for item in items:
                item.deleted_at = now
                await item.save(update_fields=["deleted_at", "updated_at"])
                item_count += 1
            box.deleted_at = now
            await box.save(update_fields=["deleted_at", "updated_at"])
            box_count += 1
        summary["outer_boxes"] = box_count
        summary["box_items"] = item_count

        run = await LabelCleanupRun.create(
            tenant_id=tenant_id,
            before_at=before,
            summary=summary,
            operator_id=user.id,
            operator_name=_user_name(user),
            occurred_at=now,
            created_by=user.id,
            updated_by=user.id,
            created_by_name=_user_name(user),
            updated_by_name=_user_name(user),
        )
        return {"id": run.id, "summary": summary, "before_at": before.isoformat()}
