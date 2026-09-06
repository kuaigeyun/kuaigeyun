"""设备/ESD 看板参观展示覆盖服务。

仅改展示层；业务点检/故障/台账真源不变；每次修订写审计。
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from tortoise.expressions import Q
from tortoise.transactions import in_transaction

from apps.kuaizhizao.models.equipment_board_visit import (
    EquipmentBoardVisitAudit,
    EquipmentBoardVisitOverride,
)
from apps.common.audit_actor import apply_create_audit
from core.utils.timezone_utils import resolve_business_datetime, to_api_isoformat
from infra.exceptions.exceptions import ValidationError
from infra.models.user import User

VISIT_METRIC_KEYS = frozenset(
    {
        "total_count",
        "faulty_count",
        "open_fault_count",
        "failure_rate",
        "spot_check_due",
        "spot_check_done",
        "spot_check_pending",
        "spot_check_rate",
        "spot_check_review_pending",
        "alert_count",
    }
)

_BOARD_DOMAINS = frozenset({"equipment", "esd"})


def _normalize_domain(raw: Optional[str]) -> str:
    domain = (raw or "equipment").strip().lower() or "equipment"
    if domain not in _BOARD_DOMAINS:
        raise ValidationError("看板域必须是 equipment 或 esd")
    return domain


def _normalize_metric_key(raw: str) -> str:
    key = (raw or "").strip()
    if key not in VISIT_METRIC_KEYS:
        raise ValidationError(f"不支持的参观展示指标: {raw}")
    return key


def _plant_filter(plant_id: Optional[int]) -> Q:
    if plant_id is None:
        return Q(plant_id__isnull=True)
    return Q(plant_id=plant_id)


async def list_visit_overrides(
    tenant_id: int,
    *,
    board_domain: str = "equipment",
    plant_id: Optional[int] = None,
) -> List[Dict[str, Any]]:
    domain = _normalize_domain(board_domain)
    rows = await EquipmentBoardVisitOverride.filter(
        tenant_id=tenant_id,
        board_domain=domain,
        is_active=True,
        deleted_at__isnull=True,
    ).filter(_plant_filter(plant_id)).order_by("metric_key").all()
    return [
        {
            "id": r.id,
            "uuid": r.uuid,
            "board_domain": r.board_domain,
            "plant_id": r.plant_id,
            "metric_key": r.metric_key,
            "metric_value": r.metric_value,
            "reason": r.reason,
            "updated_at": to_api_isoformat(r.updated_at),
            "updated_by_name": r.updated_by_name,
        }
        for r in rows
    ]


async def apply_visit_overrides_to_metrics(
    metrics: Dict[str, Any],
    overrides: List[Dict[str, Any]],
) -> Dict[str, Any]:
    out = dict(metrics or {})
    for item in overrides:
        key = item.get("metric_key")
        if key in out:
            out[key] = item.get("metric_value")
    return out


async def upsert_visit_overrides(
    tenant_id: int,
    *,
    board_domain: str,
    plant_id: Optional[int],
    items: List[Dict[str, Any]],
    reason: Optional[str],
    current_user: Optional[User],
) -> List[Dict[str, Any]]:
    domain = _normalize_domain(board_domain)
    reason_text = (reason or "").strip() or None
    if not items:
        raise ValidationError("请至少提交一项参观展示修订")

    async with in_transaction():
        for raw in items:
            key = _normalize_metric_key(str(raw.get("metric_key") or ""))
            if raw.get("metric_value") is None:
                raise ValidationError(f"指标 {key} 缺少展示值")
            try:
                value = float(raw.get("metric_value"))
            except (TypeError, ValueError) as exc:
                raise ValidationError(f"指标 {key} 展示值非法") from exc

            existing = await EquipmentBoardVisitOverride.filter(
                tenant_id=tenant_id,
                board_domain=domain,
                metric_key=key,
                deleted_at__isnull=True,
                is_active=True,
            ).filter(_plant_filter(plant_id)).first()
            before = existing.metric_value if existing else None
            if existing:
                existing.metric_value = value
                existing.reason = reason_text
                if current_user:
                    existing.updated_by = current_user.id
                    existing.updated_by_name = (
                        current_user.full_name or current_user.username
                    )
                existing.updated_at = resolve_business_datetime()
                await existing.save()
            else:
                payload: Dict[str, Any] = {
                    "tenant_id": tenant_id,
                    "board_domain": domain,
                    "plant_id": plant_id,
                    "metric_key": key,
                    "metric_value": value,
                    "reason": reason_text,
                    "is_active": True,
                }
                apply_create_audit(payload, current_user)
                await EquipmentBoardVisitOverride.create(**payload)

            await _write_audit(
                tenant_id,
                board_domain=domain,
                plant_id=plant_id,
                action="set",
                metric_key=key,
                before_value=before,
                after_value=value,
                reason=reason_text,
                current_user=current_user,
            )

    return await list_visit_overrides(tenant_id, board_domain=domain, plant_id=plant_id)


async def clear_visit_overrides(
    tenant_id: int,
    *,
    board_domain: str,
    plant_id: Optional[int],
    metric_keys: Optional[List[str]] = None,
    reason: Optional[str] = None,
    current_user: Optional[User] = None,
) -> int:
    domain = _normalize_domain(board_domain)
    reason_text = (reason or "").strip() or None
    qs = EquipmentBoardVisitOverride.filter(
        tenant_id=tenant_id,
        board_domain=domain,
        deleted_at__isnull=True,
        is_active=True,
    ).filter(_plant_filter(plant_id))
    if metric_keys:
        keys = [_normalize_metric_key(k) for k in metric_keys]
        qs = qs.filter(metric_key__in=keys)

    rows = await qs.all()
    now = resolve_business_datetime()
    async with in_transaction():
        for row in rows:
            before = row.metric_value
            row.is_active = False
            row.deleted_at = now
            if current_user:
                row.updated_by = current_user.id
                row.updated_by_name = current_user.full_name or current_user.username
            row.updated_at = now
            await row.save()
            await _write_audit(
                tenant_id,
                board_domain=domain,
                plant_id=plant_id,
                action="clear" if metric_keys else "clear_all",
                metric_key=row.metric_key,
                before_value=before,
                after_value=None,
                reason=reason_text,
                current_user=current_user,
            )
    return len(rows)


async def list_visit_audits(
    tenant_id: int,
    *,
    board_domain: str = "equipment",
    plant_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 50,
) -> tuple[List[Dict[str, Any]], int]:
    domain = _normalize_domain(board_domain)
    qs = EquipmentBoardVisitAudit.filter(
        tenant_id=tenant_id,
        board_domain=domain,
        deleted_at__isnull=True,
    ).filter(_plant_filter(plant_id))
    total = await qs.count()
    rows = await qs.order_by("-created_at", "-id").offset(skip).limit(limit).all()
    return [
        {
            "id": r.id,
            "uuid": r.uuid,
            "board_domain": r.board_domain,
            "plant_id": r.plant_id,
            "action": r.action,
            "metric_key": r.metric_key,
            "before_value": r.before_value,
            "after_value": r.after_value,
            "reason": r.reason,
            "operator_id": r.operator_id,
            "operator_name": r.operator_name,
            "created_at": to_api_isoformat(r.created_at),
        }
        for r in rows
    ], total


async def _write_audit(
    tenant_id: int,
    *,
    board_domain: str,
    plant_id: Optional[int],
    action: str,
    metric_key: Optional[str],
    before_value: Optional[float],
    after_value: Optional[float],
    reason: Optional[str],
    current_user: Optional[User],
) -> None:
    payload: Dict[str, Any] = {
        "tenant_id": tenant_id,
        "board_domain": board_domain,
        "plant_id": plant_id,
        "action": action,
        "metric_key": metric_key,
        "before_value": before_value,
        "after_value": after_value,
        "reason": reason,
        "operator_id": current_user.id if current_user else None,
        "operator_name": (
            (current_user.full_name or current_user.username) if current_user else None
        ),
    }
    apply_create_audit(payload, current_user)
    await EquipmentBoardVisitAudit.create(**payload)
