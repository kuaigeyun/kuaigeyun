"""证照/协议事项类型预置（R-14）。通用合规事项，非客户品牌。"""

from __future__ import annotations

from typing import Dict, List, Tuple

# code → 中文标签（写入配置/字典种子；前端 i18n 镜像）
LICENSE_TYPE_PRESETS: List[Tuple[str, str]] = [
    ("vehicle_group_insurance", "汽车及团体保险"),
    ("vehicle_annual_inspection", "汽车年检"),
    ("system_external_audit", "体系外审"),
    ("urban_drainage_permit", "城镇污水排入排水管网许可证"),
    ("year_end_rebate", "年终返利"),
    ("hygiene_permit", "卫生许可证"),
    ("waste_clearance_agreement", "垃圾清运和生活垃圾协议"),
    ("pollution_discharge_receipt", "固定污染源排污登记回执"),
    ("trademark_registration", "商标注册证"),
    ("foreign_investment_approval", "外商投资企业批准证书"),
    ("metrology", "计量"),
    ("canteen_agreement", "小卖部协议"),
    ("business_license_annual", "营业执照年审"),
    ("sewage_treatment", "污水处理"),
    ("greening", "绿化"),
]

LICENSE_TYPE_LABELS: Dict[str, str] = {code: label for code, label in LICENSE_TYPE_PRESETS}

ALLOWED_NOTIFY_CHANNELS = frozenset({"internal", "email", "sms"})
