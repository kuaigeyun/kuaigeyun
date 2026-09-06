"""ESD 行业包种子：预置点检项 + domain=esd 方案，复用通用点检采集。"""

from __future__ import annotations

import copy
from typing import Any, Dict, List, Optional

from loguru import logger
from tortoise.transactions import in_transaction

from apps.kuaielectronics.profiles import (
    ELECTRONICS_ESD_SEED,
    ESD_CONFIG_KEY,
    ESD_SCHEME_CODE,
)
from apps.kuaizhizao.models.equipment_ops import (
    EquipmentInspectionItem,
    EquipmentInspectionScheme,
)
from apps.kuaizhizao.schemas.equipment_ops import (
    InspectionItemCreate,
    InspectionSchemeCreate,
    InspectionSchemeLineCreate,
    InspectionSchemeUpdate,
)
from apps.kuaizhizao.services.equipment_ops_service import (
    EquipmentInspectionItemService,
    EquipmentInspectionSchemeService,
)
from infra.services.tenant_service import TenantService


def _active_projects(profile: Dict[str, Any]) -> List[Dict[str, Any]]:
    items = profile.get("project_types") or []
    out: List[Dict[str, Any]] = []
    for raw in items:
        if not isinstance(raw, dict):
            continue
        if not raw.get("active", True):
            continue
        code = str(raw.get("code") or "").strip()
        if not code:
            continue
        out.append(raw)
    out.sort(key=lambda x: (int(x.get("sort") or 0), str(x.get("code") or "")))
    return out


async def get_esd_profile(tenant_id: int) -> Dict[str, Any]:
    row = await TenantService().get_tenant_config(tenant_id, ESD_CONFIG_KEY)
    if row and isinstance(row.config_value, dict) and row.config_value.get("enabled"):
        profile = row.config_value.get("profile")
        if isinstance(profile, dict):
            return copy.deepcopy(profile)
    return copy.deepcopy(ELECTRONICS_ESD_SEED)


async def write_esd_profile(tenant_id: int, profile: Dict[str, Any]) -> Dict[str, Any]:
    payload = {
        "enabled": True,
        "extension_id": "electronics.esd",
        "module_app_code": "kuaielectronics",
        "profile": copy.deepcopy(profile),
    }
    await TenantService().set_tenant_config(
        tenant_id,
        ESD_CONFIG_KEY,
        payload,
        description="行业扩展：ESD 项目清单与看板布局",
    )
    return profile


async def clear_esd_profile(tenant_id: int) -> None:
    from infra.models.tenant_config import TenantConfig

    row = await TenantConfig.filter(tenant_id=tenant_id, config_key=ESD_CONFIG_KEY).first()
    if row:
        await row.delete()


async def ensure_esd_catalog(tenant_id: int, *, profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """启用电子包或保存清单时：同步点检项与 ESD 方案。"""
    profile = copy.deepcopy(profile or await get_esd_profile(tenant_id))
    await write_esd_profile(tenant_id, profile)

    item_svc = EquipmentInspectionItemService()
    scheme_svc = EquipmentInspectionSchemeService()
    projects = profile.get("project_types") or []
    item_id_by_code: Dict[str, int] = {}

    async with in_transaction():
        for raw in projects:
            if not isinstance(raw, dict):
                continue
            code = str(raw.get("code") or "").strip()
            if not code:
                continue
            label = str(raw.get("label") or code).strip()
            active = bool(raw.get("active", True))
            value_type = str(raw.get("value_type") or "boolean").strip() or "boolean"
            method = str(raw.get("method") or "").strip() or None
            judgment = str(raw.get("judgment_standard") or "").strip() or None
            requirement = str(raw.get("requirement") or "").strip() or f"检查{label}是否合格"

            existing = await EquipmentInspectionItem.filter(
                tenant_id=tenant_id,
                code=code,
                deleted_at__isnull=True,
            ).first()
            if existing:
                existing.name = label
                existing.requirement = requirement
                existing.method = method
                existing.judgment_standard = judgment
                existing.value_type = value_type
                existing.is_active = active
                await existing.save()
                item_id_by_code[code] = existing.id
            else:
                created = await item_svc.create(
                    tenant_id,
                    InspectionItemCreate(
                        code=code,
                        name=label,
                        requirement=requirement,
                        method=method,
                        judgment_standard=judgment,
                        value_type=value_type,
                        is_active=active,
                    ),
                )
                item_id_by_code[code] = created.id

        scheme_code = str(profile.get("scheme_code") or ESD_SCHEME_CODE).strip()
        scheme_name = str(profile.get("scheme_name") or "ESD 日常点检").strip()
        lines = [
            InspectionSchemeLineCreate(
                item_id=item_id_by_code[str(p["code"])],
                sort_order=int(p.get("sort") or 0),
                is_critical=bool(p.get("is_critical", False)),
                photo_required=bool(p.get("photo_required", False)),
            )
            for p in _active_projects(profile)
            if str(p.get("code")) in item_id_by_code
        ]

        scheme = await EquipmentInspectionScheme.filter(
            tenant_id=tenant_id,
            code=scheme_code,
            deleted_at__isnull=True,
        ).first()
        if scheme:
            await scheme_svc.update(
                tenant_id,
                scheme.id,
                InspectionSchemeUpdate(
                    name=scheme_name,
                    domain="esd",
                    cycle_type=str(profile.get("cycle_type") or "每天"),
                    capture_mode=str(profile.get("capture_mode") or "A"),
                    overdue_hours=int(profile.get("overdue_hours") or 8),
                    review_overdue_hours=int(profile.get("review_overdue_hours") or 4),
                    is_active=True,
                    lines=lines,
                ),
            )
            scheme_id = scheme.id
        else:
            created_scheme = await scheme_svc.create(
                tenant_id,
                InspectionSchemeCreate(
                    code=scheme_code,
                    name=scheme_name,
                    description="电子制造行业包预置 ESD 点检方案（采集走通用点检单）",
                    domain="esd",
                    cycle_type=str(profile.get("cycle_type") or "每天"),
                    capture_mode=str(profile.get("capture_mode") or "A"),
                    overdue_hours=int(profile.get("overdue_hours") or 8),
                    review_overdue_hours=int(profile.get("review_overdue_hours") or 4),
                    is_active=True,
                    lines=lines,
                ),
            )
            scheme_id = created_scheme.id

    logger.info(
        "esd_catalog_ensured tenant={} scheme_id={} projects={}",
        tenant_id,
        scheme_id,
        len(projects),
    )
    return {
        "profile": profile,
        "scheme_id": scheme_id,
        "scheme_code": scheme_code,
        "project_count": len(projects),
        "active_count": len(lines),
    }


async def deactivate_esd_scheme(tenant_id: int) -> None:
    """停用行业包：停用 ESD 方案，不删除历史点检单。"""
    profile = await get_esd_profile(tenant_id)
    scheme_code = str(profile.get("scheme_code") or ESD_SCHEME_CODE).strip()
    scheme = await EquipmentInspectionScheme.filter(
        tenant_id=tenant_id,
        code=scheme_code,
        deleted_at__isnull=True,
    ).first()
    if scheme:
        scheme.is_active = False
        await scheme.save()
    await clear_esd_profile(tenant_id)


async def get_esd_catalog_summary(tenant_id: int) -> Dict[str, Any]:
    profile = await get_esd_profile(tenant_id)
    scheme_code = str(profile.get("scheme_code") or ESD_SCHEME_CODE).strip()
    scheme = await EquipmentInspectionScheme.filter(
        tenant_id=tenant_id,
        code=scheme_code,
        deleted_at__isnull=True,
    ).first()
    return {
        "profile": profile,
        "scheme": (
            {
                "id": scheme.id,
                "uuid": scheme.uuid,
                "code": scheme.code,
                "name": scheme.name,
                "domain": scheme.domain,
                "is_active": scheme.is_active,
                "capture_mode": scheme.capture_mode,
                "cycle_type": scheme.cycle_type,
            }
            if scheme
            else None
        ),
        "project_types": profile.get("project_types") or [],
        "active_count": len(_active_projects(profile)),
    }
