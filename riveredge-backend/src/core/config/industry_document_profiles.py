"""通用单据扩展 profile 默认值（未启用行业包时使用）。"""

from __future__ import annotations

from typing import Any, Dict

# 样品加工：仅中性种类与附件；标签不含 PCB
GENERIC_SAMPLE_PROCESS_PROFILE: Dict[str, Any] = {
    "request_kinds": [
        {"code": "general", "label": "通用加工", "sort": 10, "active": True},
    ],
    "attachment_types": [
        {"code": "other", "label": "其它", "sort": 10, "active": True},
    ],
    "field_labels": {
        "material_code": "物料编码",
        "material_version": "物料版本",
    },
    "validation_rules": [],
}

GENERIC_BOM_COLLAB_PROFILE: Dict[str, Any] = {
    # 分区 key 与库字段稳定契约（electronics/structure）；展示文案可被行业包覆盖
    "sections": [
        {"key": "electronics", "label": "分区一", "sort": 10, "active": True},
        {"key": "structure", "label": "分区二", "sort": 20, "active": True},
    ],
}

GENERIC_PROFILES_BY_KEY: Dict[str, Dict[str, Any]] = {
    "kuaiplm.sample_process": GENERIC_SAMPLE_PROCESS_PROFILE,
    "kuaiplm.bom_collab": GENERIC_BOM_COLLAB_PROFILE,
}
