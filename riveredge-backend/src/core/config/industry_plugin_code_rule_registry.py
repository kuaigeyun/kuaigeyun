"""行业插件编码规则登记。

仅登记「标准产品号段无法覆盖、须由行业插件启用」的规则码。
须在编码规则服务启用，禁止业务自造流水。命名与文案不得出现客户公司名。
"""

from __future__ import annotations

from typing import Dict, Tuple

# rule_code → (中文名, 用途说明)
INDUSTRY_PLUGIN_CODE_RULE_REGISTRY: Dict[str, Tuple[str, str]] = {
    "INDUSTRY_REWORK_FR": ("FR 流程单号", "返工/流程类单据 FR 前缀（行业插件）"),
    "INDUSTRY_COMPLAINT_RC": ("RC 投诉整改单号", "投诉/整改类单据 RC 前缀（行业插件）"),
    "INDUSTRY_PACKING_BOX": ("装箱箱号", "装箱绑定箱号（行业插件）"),
    "INDUSTRY_LABEL_JOB": ("标签打印任务号", "标签打印任务幂等业务号（行业插件）"),
}


def required_industry_plugin_code_rule_codes() -> Tuple[str, ...]:
    return tuple(INDUSTRY_PLUGIN_CODE_RULE_REGISTRY.keys())
