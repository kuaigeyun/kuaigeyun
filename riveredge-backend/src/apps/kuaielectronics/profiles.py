"""电子制造行业包：样品加工替代 profile 与 ESD 独立能力种子。"""

from __future__ import annotations

from typing import Any, Dict, List

ELECTRONICS_SAMPLE_PROCESS_SEED: Dict[str, Any] = {
    "request_kinds": [
        {"code": "general", "label": "通用加工", "sort": 10, "active": True},
        {"code": "stencil", "label": "钢网制作", "sort": 20, "active": True},
        {"code": "smt", "label": "SMT 贴片", "sort": 30, "active": True},
    ],
    "attachment_types": [
        {"code": "gerber", "label": "Gerber", "sort": 10, "active": True},
        {"code": "pick_place_bom", "label": "贴片 BOM", "sort": 20, "active": True},
        {"code": "coordinate", "label": "坐标", "sort": 30, "active": True},
        {"code": "silkscreen", "label": "丝印", "sort": 40, "active": True},
        {"code": "stencil", "label": "钢网资料", "sort": 50, "active": True},
        {"code": "other", "label": "其它", "sort": 90, "active": True},
    ],
    "field_labels": {
        "material_code": "PCB 料号",
        "material_version": "PCB 版本",
    },
    "validation_rules": [
        {
            "when_kind_in": ["stencil", "smt"],
            "require": ["material_code"],
            "message": "钢网/SMT 申请须填写 PCB 料号",
        }
    ],
}

ELECTRONICS_BOM_COLLAB_SEED: Dict[str, Any] = {
    "sections": [
        {"key": "electronics", "label": "电子分区", "sort": 10, "active": True},
        {"key": "structure", "label": "结构分区", "sort": 20, "active": True},
    ],
}

# ESD 预置方案编码（通用点检方案 domain=esd）
ESD_SCHEME_CODE = "ESD-STD-DAILY"
ESD_SCHEME_NAME = "ESD 日常点检"
ESD_CONFIG_KEY = "industry.ext.kuaielectronics.esd"

# 16 类 ESD 项目（行业包预置；租户可改 active/label/判定）
ELECTRONICS_ESD_PROJECT_TYPES: List[Dict[str, Any]] = [
    {"code": "ESD-01", "label": "防静电线", "sort": 10, "active": True, "value_type": "boolean"},
    {"code": "ESD-02", "label": "线体接地", "sort": 20, "active": True, "value_type": "boolean"},
    {"code": "ESD-03", "label": "设备接地", "sort": 30, "active": True, "value_type": "boolean"},
    {"code": "ESD-04", "label": "人员防静电手腕带", "sort": 40, "active": True, "value_type": "boolean"},
    {"code": "ESD-05", "label": "静电报警器", "sort": 50, "active": True, "value_type": "boolean"},
    {
        "code": "ESD-06",
        "label": "恒温烙铁接地电阻漏电流温度",
        "sort": 60,
        "active": True,
        "value_type": "boolean",
    },
    {"code": "ESD-07", "label": "离子风机", "sort": 70, "active": True, "value_type": "boolean"},
    {
        "code": "ESD-08",
        "label": "线别绝缘体孤立导体测试",
        "sort": 80,
        "active": True,
        "value_type": "boolean",
    },
    {"code": "ESD-09", "label": "PCB 料框", "sort": 90, "active": True, "value_type": "boolean"},
    {"code": "ESD-10", "label": "流水线皮带", "sort": 100, "active": True, "value_type": "boolean"},
    {"code": "ESD-11", "label": "防静电箱", "sort": 110, "active": True, "value_type": "boolean"},
    {"code": "ESD-12", "label": "防静电工作台", "sort": 120, "active": True, "value_type": "boolean"},
    {"code": "ESD-13", "label": "防静电气泡袋", "sort": 130, "active": True, "value_type": "boolean"},
    {"code": "ESD-14", "label": "防静电盒", "sort": 140, "active": True, "value_type": "boolean"},
    {"code": "ESD-15", "label": "防静电服", "sort": 150, "active": True, "value_type": "boolean"},
    {"code": "ESD-16", "label": "温湿度", "sort": 160, "active": True, "value_type": "boolean"},
]

ELECTRONICS_ESD_SEED: Dict[str, Any] = {
    "scheme_code": ESD_SCHEME_CODE,
    "scheme_name": ESD_SCHEME_NAME,
    "cycle_type": "每天",
    "capture_mode": "A",
    "overdue_hours": 8,
    "review_overdue_hours": 4,
    "project_types": ELECTRONICS_ESD_PROJECT_TYPES,
    # 看板按主数据厂区动态切换；设备归属由车间绑定，不写死厂区名
    "board_layout": {
        "plant_source": "master_data.plant",
        "show_overview": True,
    },
}

# OEM 标签签样包目录（抽象编码；书面签样模板 UUID 由租户绑定）
# 真源实现见 services/label_oem_seed_service.ELECTRONICS_LABEL_OEM_PACKS
ELECTRONICS_LABEL_OEM_PROFILE_KEY = "kuaielectronics.label_oem"
