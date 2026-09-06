"""电子标签 OEM 签样包种子与校验钩子（PACK-LABEL-OEM）。

元数据只用行业抽象编码，禁止客户公司名常量。
书面签样由租户导入打印模板 UUID 后绑定。
"""

from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

from apps.common.audit_actor import apply_create_audit
from apps.kuaizhizao.models.label_station import LabelModelConfig
from apps.kuaizhizao.services.label_station_validators import (
    LabelScanContext,
    register_label_scan_validator,
)
from infra.exceptions.exceptions import BusinessLogicError, ValidationError
from infra.models.user import User
from loguru import logger

# 占位模板 UUID：种子落地后须在配置中改成真实打印模板
OEM_TEMPLATE_PLACEHOLDER = "00000000-0000-4000-8000-label0oem0001"

_ALNUM = re.compile(r"^[A-Za-z0-9\-_.]+$")

# 抽象签样包（对应不同码制/箱规/周期策略；名称不含品牌）
ELECTRONICS_LABEL_OEM_PACKS: List[Dict[str, Any]] = [
    {
        "pack_code": "OEM-SN-LINEAR-200",
        "pack_name": "序列号一维码装箱包",
        "barcode_kind": "code128",
        "qty_per_box": 200,
        "print_copies": 1,
        "validation_hooks": ["builtin.reject_empty", "electronics.oem.require_alnum"],
        "policy_config": {},
        "remarks": "一维序列号装箱；须绑定书面签样对应的打印模板 UUID。",
    },
    {
        "pack_code": "OEM-QR-168-WEEK-BOX",
        "pack_name": "二维码装箱包（箱号七日内唯一）",
        "barcode_kind": "qr",
        "qty_per_box": 168,
        "print_copies": 1,
        "validation_hooks": ["builtin.reject_empty", "electronics.oem.require_alnum"],
        "policy_config": {"box_no_unique_days": 7},
        "remarks": "二维码装箱；箱号在 7 日内不得复用（周期唯一策略）。",
    },
    {
        "pack_code": "OEM-SN-LINEAR-200-DUPLEX",
        "pack_name": "序列号一维码双份装箱包",
        "barcode_kind": "code128",
        "qty_per_box": 200,
        "print_copies": 2,
        "validation_hooks": ["builtin.reject_empty", "electronics.oem.require_alnum"],
        "policy_config": {},
        "remarks": "正式标签双份打印；临时单份可在型号配置中改 print_copies。",
    },
    {
        "pack_code": "OEM-GENERIC-SAMPLE",
        "pack_name": "通用签样占位包",
        "barcode_kind": "mixed",
        "qty_per_box": 1,
        "print_copies": 1,
        "validation_hooks": ["builtin.reject_empty"],
        "policy_config": {},
        "remarks": "书面签样未齐套时的占位型号；箱规与码制以导入模板为准。",
    },
]


async def _oem_require_alnum(ctx: LabelScanContext) -> None:
    code = (ctx.barcode or "").strip()
    if not _ALNUM.match(code):
        raise BusinessLogicError("OEM 条码仅允许字母数字及 - _ .")


register_label_scan_validator("electronics.oem.require_alnum", _oem_require_alnum)


def list_oem_pack_catalog() -> List[Dict[str, Any]]:
    return [dict(p) for p in ELECTRONICS_LABEL_OEM_PACKS]


async def get_oem_pack_status(tenant_id: int) -> Dict[str, Any]:
    codes = [str(p["pack_code"]) for p in ELECTRONICS_LABEL_OEM_PACKS]
    rows = await LabelModelConfig.filter(
        tenant_id=tenant_id,
        model_code__in=codes,
        deleted_at__isnull=True,
    )
    by_code = {r.model_code: r for r in rows}
    items = []
    for pack in ELECTRONICS_LABEL_OEM_PACKS:
        code = str(pack["pack_code"])
        row = by_code.get(code)
        items.append(
            {
                **pack,
                "applied": row is not None,
                "model_id": row.id if row else None,
                "template_uuid": row.template_uuid if row else None,
                "template_bound": bool(
                    row
                    and row.template_uuid
                    and row.template_uuid != OEM_TEMPLATE_PLACEHOLDER
                ),
            }
        )
    return {"items": items, "total": len(items), "placeholder_template_uuid": OEM_TEMPLATE_PLACEHOLDER}


async def ensure_oem_label_packs(
    tenant_id: int,
    user: Optional[User] = None,
    *,
    pack_codes: Optional[List[str]] = None,
) -> Dict[str, Any]:
    wanted = {str(c).strip() for c in (pack_codes or []) if str(c).strip()}
    packs = [
        p
        for p in ELECTRONICS_LABEL_OEM_PACKS
        if not wanted or str(p["pack_code"]) in wanted
    ]
    if wanted:
        known = {str(p["pack_code"]) for p in ELECTRONICS_LABEL_OEM_PACKS}
        unknown = wanted - known
        if unknown:
            raise ValidationError(f"未知签样包编码: {', '.join(sorted(unknown))}")

    created = 0
    skipped = 0
    for pack in packs:
        code = str(pack["pack_code"])
        existing = await LabelModelConfig.get_or_none(
            tenant_id=tenant_id, model_code=code, deleted_at__isnull=True
        )
        if existing:
            skipped += 1
            continue
        payload: Dict[str, Any] = {
            "tenant_id": tenant_id,
            "model_code": code,
            "model_name": str(pack["pack_name"]),
            "template_uuid": OEM_TEMPLATE_PLACEHOLDER,
            "template_version": None,
            "qty_per_box": int(pack["qty_per_box"]),
            "print_copies": int(pack["print_copies"]),
            "device_uuid": None,
            "validation_hooks": list(pack["validation_hooks"]),
            "policy_config": dict(pack.get("policy_config") or {}),
            "is_active": True,
            "remarks": pack.get("remarks"),
        }
        if user is not None:
            apply_create_audit(payload, user)
        else:
            payload.setdefault("created_by_name", "system")
            payload.setdefault("updated_by_name", "system")
        await LabelModelConfig.create(**payload)
        created += 1

    logger.info(
        "label_oem_packs_ensured tenant={} created={} skipped={}",
        tenant_id,
        created,
        skipped,
    )
    status = await get_oem_pack_status(tenant_id)
    return {"created": created, "skipped": skipped, **status}
