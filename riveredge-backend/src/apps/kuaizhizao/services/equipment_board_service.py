"""设备总览 / 厂区维度看板汇总（R-10 WP-10.10）。

厂区来自主数据 Plant；设备经 workshop_id → Workshop.plant_id 归属。
不写死「老厂/新厂」等客户文案。
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional, Sequence, Set

from apps.kuaizhizao.models.equipment import Equipment
from apps.kuaizhizao.models.equipment_fault import EquipmentFault, EquipmentRepair
from apps.kuaizhizao.models.equipment_ops import (
    EquipmentInspectionScheme,
    EquipmentSchemeBinding,
    EquipmentSpotCheck,
)
from apps.master_data.models.factory import Plant, Workshop
from core.utils.timezone_utils import (
    resolve_business_datetime,
    to_api_isoformat,
    to_site_date,
)

_FAULT_OPEN = ("待处理", "处理中")
_SPOT_DONE = ("待审核", "已审核")
_EQUIP_EXCLUDED = ("报废", "停用", "scrapped", "disabled")
_ALERT_LIMIT = 30


async def list_equipment_board_plants(tenant_id: int) -> List[Dict[str, Any]]:
    plants = await Plant.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        is_active=True,
    ).order_by("code", "id").all()
    return [
        {"id": p.id, "uuid": p.uuid, "code": p.code, "name": p.name}
        for p in plants
    ]


async def _workshop_ids_for_plant(tenant_id: int, plant_id: int) -> List[int]:
    return list(
        await Workshop.filter(
            tenant_id=tenant_id,
            plant_id=plant_id,
            deleted_at__isnull=True,
        ).values_list("id", flat=True)
    )


async def _equipment_scope_ids(
    tenant_id: int,
    *,
    plant_id: Optional[int],
) -> List[int]:
    qs = Equipment.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        is_active=True,
    ).exclude(status__in=list(_EQUIP_EXCLUDED))
    if plant_id is not None:
        workshop_ids = await _workshop_ids_for_plant(tenant_id, plant_id)
        if not workshop_ids:
            return []
        qs = qs.filter(workshop_id__in=workshop_ids)
    return list(await qs.values_list("id", flat=True))


def _site_today() -> date:
    return to_site_date(resolve_business_datetime())


async def get_equipment_board(
    tenant_id: int,
    *,
    plant_id: Optional[int] = None,
    alert_limit: int = _ALERT_LIMIT,
    scheme_domain: str = "equipment",
) -> Dict[str, Any]:
    now = resolve_business_datetime()
    today = _site_today()
    domain = (scheme_domain or "equipment").strip().lower() or "equipment"

    plant_meta: Optional[Dict[str, Any]] = None
    if plant_id is not None:
        plant = await Plant.filter(
            tenant_id=tenant_id,
            id=plant_id,
            deleted_at__isnull=True,
        ).first()
        if not plant:
            return {
                "plant": None,
                "domain": domain,
                "metrics": _empty_metrics(),
                "status_breakdown": [],
                "alerts": [],
                "as_of": to_api_isoformat(now),
                "spot_check_date": today.isoformat(),
            }
        plant_meta = {
            "id": plant.id,
            "uuid": plant.uuid,
            "code": plant.code,
            "name": plant.name,
        }

    equipment_ids = await _equipment_scope_ids(tenant_id, plant_id=plant_id)

    if not equipment_ids:
        return {
            "plant": plant_meta,
            "domain": domain,
            "metrics": _empty_metrics(),
            "status_breakdown": [],
            "alerts": [],
            "as_of": to_api_isoformat(now),
            "spot_check_date": today.isoformat(),
        }

    domain_scheme_ids = list(
        await EquipmentInspectionScheme.filter(
            tenant_id=tenant_id,
            domain=domain,
            deleted_at__isnull=True,
            is_active=True,
        ).values_list("id", flat=True)
    )

    equipments = await Equipment.filter(
        tenant_id=tenant_id,
        id__in=equipment_ids,
        deleted_at__isnull=True,
    ).all()

    status_counts: Dict[str, int] = {}
    for eq in equipments:
        key = str(eq.status or "正常").strip() or "正常"
        status_counts[key] = status_counts.get(key, 0) + 1
    total_count = len(equipments)
    faulty_count = sum(
        c for s, c in status_counts.items() if s in ("故障", "维修中", "maintenance", "fault")
    )
    failure_rate = round(faulty_count / total_count * 100, 2) if total_count else 0.0

    # 应点检：范围内绑定了指定业务域点检方案的设备
    if domain_scheme_ids:
        binding_eq_ids = set(
            await EquipmentSchemeBinding.filter(
                tenant_id=tenant_id,
                scheme_type="spot_check",
                equipment_id__in=equipment_ids,
                scheme_id__in=domain_scheme_ids,
                deleted_at__isnull=True,
            ).values_list("equipment_id", flat=True)
        )
    else:
        binding_eq_ids = set()
    due_count = len(binding_eq_ids)

    today_checks_qs = EquipmentSpotCheck.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        equipment_id__in=equipment_ids,
        check_date=today,
        status__in=list(_SPOT_DONE),
    )
    if domain_scheme_ids:
        today_checks_qs = today_checks_qs.filter(scheme_id__in=domain_scheme_ids)
    else:
        today_checks_qs = today_checks_qs.filter(id=-1)
    today_checks = await today_checks_qs.all()
    done_eq_ids = {c.equipment_id for c in today_checks if c.equipment_id in binding_eq_ids}
    done_count = len(done_eq_ids)
    pending_count = max(0, due_count - done_count)
    spot_check_rate = round(done_count / due_count * 100, 2) if due_count else 0.0

    review_qs = EquipmentSpotCheck.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        equipment_id__in=equipment_ids,
        status="待审核",
    )
    if domain_scheme_ids:
        review_qs = review_qs.filter(scheme_id__in=domain_scheme_ids)
    else:
        review_qs = review_qs.filter(id=-1)
    review_pending = await review_qs.count()

    open_faults = await EquipmentFault.filter(
        tenant_id=tenant_id,
        deleted_at__isnull=True,
        equipment_id__in=equipment_ids,
        status__in=list(_FAULT_OPEN),
    ).count()

    alerts = await _build_alerts(
        tenant_id,
        equipment_ids=equipment_ids,
        binding_eq_ids=binding_eq_ids,
        done_eq_ids=done_eq_ids,
        domain_scheme_ids=set(domain_scheme_ids),
        today=today,
        now=now,
        limit=alert_limit,
        domain=domain,
    )

    return {
        "plant": plant_meta,
        "domain": domain,
        "metrics": {
            "total_count": total_count,
            "faulty_count": faulty_count,
            "open_fault_count": int(open_faults),
            "failure_rate": failure_rate,
            "spot_check_due": due_count,
            "spot_check_done": done_count,
            "spot_check_pending": pending_count,
            "spot_check_rate": spot_check_rate,
            "spot_check_review_pending": int(review_pending),
            "alert_count": len(alerts),
        },
        "status_breakdown": [
            {"status": k, "count": v}
            for k, v in sorted(status_counts.items(), key=lambda x: (-x[1], x[0]))
        ],
        "alerts": alerts,
        "as_of": to_api_isoformat(now),
        "spot_check_date": today.isoformat(),
    }


async def get_equipment_board_with_visit(
    tenant_id: int,
    *,
    plant_id: Optional[int] = None,
    alert_limit: int = _ALERT_LIMIT,
    scheme_domain: str = "equipment",
    visit_mode: bool = False,
) -> Dict[str, Any]:
    """看板汇总；visit_mode 时叠加参观展示覆盖（不改真源）。"""
    board = await get_equipment_board(
        tenant_id,
        plant_id=plant_id,
        alert_limit=alert_limit,
        scheme_domain=scheme_domain,
    )
    source_metrics = dict(board.get("metrics") or {})
    board["source_metrics"] = source_metrics
    board["visit_mode"] = bool(visit_mode)
    board["visit_overrides"] = []
    if not visit_mode:
        return board

    from apps.kuaizhizao.services.equipment_board_visit_service import (
        apply_visit_overrides_to_metrics,
        list_visit_overrides,
    )

    overrides = await list_visit_overrides(
        tenant_id,
        board_domain=scheme_domain,
        plant_id=plant_id,
    )
    board["visit_overrides"] = overrides
    if overrides:
        board["metrics"] = await apply_visit_overrides_to_metrics(source_metrics, overrides)
        # 参观模式：告警条数可被覆盖展示，但不伪造明细；有覆盖 alert_count 时截断或清空列表仅影响展示
        overridden_alert = next(
            (o for o in overrides if o.get("metric_key") == "alert_count"),
            None,
        )
        if overridden_alert is not None:
            try:
                n = int(float(overridden_alert.get("metric_value") or 0))
            except (TypeError, ValueError):
                n = 0
            board["alerts"] = (board.get("alerts") or [])[: max(0, n)]
    return board


def _empty_metrics() -> Dict[str, Any]:
    return {
        "total_count": 0,
        "faulty_count": 0,
        "open_fault_count": 0,
        "failure_rate": 0.0,
        "spot_check_due": 0,
        "spot_check_done": 0,
        "spot_check_pending": 0,
        "spot_check_rate": 0.0,
        "spot_check_review_pending": 0,
        "alert_count": 0,
    }


async def _build_alerts(
    tenant_id: int,
    *,
    equipment_ids: Sequence[int],
    binding_eq_ids: Set[int],
    done_eq_ids: Set[int],
    domain_scheme_ids: Set[int],
    today: date,
    now: datetime,
    limit: int,
    domain: str = "equipment",
) -> List[Dict[str, Any]]:
    alerts: List[Dict[str, Any]] = []
    spot_link = (
        "/apps/kuaielectronics/esd/inspection"
        if domain == "esd"
        else "/apps/kuaizhizao/equipment-management/spot-checks"
    )
    label_prefix = "ESD" if domain == "esd" else "点检"

    def _scheme_filter(qs):
        if domain_scheme_ids:
            return qs.filter(scheme_id__in=list(domain_scheme_ids))
        return qs.filter(id=-1)

    abnormal_checks = await _scheme_filter(
        EquipmentSpotCheck.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            equipment_id__in=list(equipment_ids),
            check_date=today,
            has_abnormality=True,
        )
    ).order_by("-id").limit(limit).all()
    for row in abnormal_checks:
        alerts.append(
            {
                "kind": "spot_abnormal",
                "title": f"{label_prefix}异常 {row.document_no}",
                "detail": f"{row.equipment_code or ''} {row.equipment_name or ''} {row.abnormality_description or ''}".strip(),
                "document_no": row.document_no,
                "equipment_code": row.equipment_code,
                "equipment_name": row.equipment_name,
                "occurred_at": to_api_isoformat(row.created_at),
                "link_path": spot_link,
                "link_uuid": row.uuid,
            }
        )

    if domain == "equipment":
        faults = await EquipmentFault.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            equipment_id__in=list(equipment_ids),
            status__in=list(_FAULT_OPEN),
        ).order_by("-reported_at", "-id").limit(limit).all()
        for fault in faults:
            alerts.append(
                {
                    "kind": "fault_open",
                    "title": f"故障处理中 {fault.fault_no}",
                    "detail": f"{fault.equipment_code or ''} {fault.equipment_name or ''} {fault.fault_description or ''}".strip(),
                    "document_no": fault.fault_no,
                    "equipment_code": fault.equipment_code,
                    "equipment_name": fault.equipment_name,
                    "occurred_at": to_api_isoformat(fault.reported_at or fault.fault_date),
                    "link_path": f"/apps/kuaizhizao/equipment-management/equipment-faults?uuid={fault.uuid}",
                    "link_uuid": fault.uuid,
                }
            )

    pending_review = await _scheme_filter(
        EquipmentSpotCheck.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            equipment_id__in=list(equipment_ids),
            status="待审核",
        )
    ).order_by("-id").limit(limit).all()
    for row in pending_review:
        alerts.append(
            {
                "kind": "spot_review_pending",
                "title": f"{label_prefix}待审核 {row.document_no}",
                "detail": f"{row.equipment_code or ''} {row.equipment_name or ''}".strip(),
                "document_no": row.document_no,
                "equipment_code": row.equipment_code,
                "equipment_name": row.equipment_name,
                "occurred_at": to_api_isoformat(row.created_at),
                "link_path": spot_link,
                "link_uuid": row.uuid,
            }
        )

    pending_ids = list(binding_eq_ids - done_eq_ids)[:limit]
    if pending_ids:
        pending_eqs = await Equipment.filter(
            tenant_id=tenant_id,
            id__in=pending_ids,
            deleted_at__isnull=True,
        ).all()
        for eq in pending_eqs:
            alerts.append(
                {
                    "kind": "spot_incomplete",
                    "title": f"今日未{label_prefix} {eq.code}",
                    "detail": eq.name or "",
                    "document_no": None,
                    "equipment_code": eq.code,
                    "equipment_name": eq.name,
                    "occurred_at": to_api_isoformat(now),
                    "link_path": spot_link,
                    "link_uuid": None,
                }
            )

    if domain == "equipment":
        overdue_faults = await EquipmentFault.filter(
            tenant_id=tenant_id,
            deleted_at__isnull=True,
            equipment_id__in=list(equipment_ids),
            status__in=list(_FAULT_OPEN),
            response_due_at__isnull=False,
            response_due_at__lt=now,
        ).order_by("response_due_at").limit(limit).all()
        if overdue_faults:
            fault_ids = [f.id for f in overdue_faults]
            arrived_fault_ids = set(
                await EquipmentRepair.filter(
                    tenant_id=tenant_id,
                    equipment_fault_id__in=fault_ids,
                    deleted_at__isnull=True,
                    arrival_at__isnull=False,
                ).values_list("equipment_fault_id", flat=True)
            )
            for fault in overdue_faults:
                if fault.id in arrived_fault_ids:
                    continue
                alerts.append(
                    {
                        "kind": "repair_arrival_overdue",
                        "title": f"到场超时 {fault.fault_no}",
                        "detail": f"{fault.equipment_code or ''} {fault.equipment_name or ''} 截止 {to_api_isoformat(fault.response_due_at)}".strip(),
                        "document_no": fault.fault_no,
                        "equipment_code": fault.equipment_code,
                        "equipment_name": fault.equipment_name,
                        "occurred_at": to_api_isoformat(fault.response_due_at),
                        "link_path": f"/apps/kuaizhizao/equipment-management/equipment-faults?uuid={fault.uuid}",
                        "link_uuid": fault.uuid,
                    }
                )

    def _sort_key(item: Dict[str, Any]) -> str:
        return str(item.get("occurred_at") or "")

    alerts.sort(key=_sort_key, reverse=True)
    return alerts[:limit]
