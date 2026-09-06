"""通用会签 / 自定义审批业务类型（WP-04B）。

通过 form template / request 的 business_type 绑定字段 schema 与审批声明；
不为每类表单复制 CRUD。让步放行继续走既有 collaboration.concession，不在此重复登记。
"""

from __future__ import annotations

from typing import FrozenSet

# code → 中文名称（产品通用，禁止客户公司名）
GENERAL_SIGNOFF_BUSINESS_TYPES: dict[str, str] = {
    "five_m_change": "5M 变更报告",
    "material_request": "物料申请",
    "sample_inspection": "样品检验",
    "tech_work_contact": "技术工作联系",
    "confirmation": "确认书",
    "review_sheet": "评审单",
    "material_issue": "领料单",
}

GENERAL_SIGNOFF_BUSINESS_TYPE_CODES: FrozenSet[str] = frozenset(
    GENERAL_SIGNOFF_BUSINESS_TYPES.keys()
)


def is_valid_general_signoff_business_type(code: str | None) -> bool:
    raw = (code or "").strip()
    if not raw:
        return True  # 空 = 普通自定义申请
    return raw in GENERAL_SIGNOFF_BUSINESS_TYPE_CODES


def list_general_signoff_business_types() -> list[dict[str, str]]:
    return [
        {"code": code, "name": name}
        for code, name in GENERAL_SIGNOFF_BUSINESS_TYPES.items()
    ]
