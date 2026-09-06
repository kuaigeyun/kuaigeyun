"""固定资产生命周期阶段（R-14）。"""

from __future__ import annotations

from typing import Dict, List

# 采买申请侧阶段（审批通过后推进）
STAGE_DRAFT = "draft"
STAGE_PENDING = "pending"
STAGE_APPROVED = "approved"
STAGE_PROCURING = "procuring"
STAGE_PAID = "paid"
STAGE_INBOUND = "inbound"
STAGE_ISSUED = "issued"
STAGE_CARDED = "carded"
STAGE_FINANCE_AUDITED = "finance_audited"
STAGE_WRITTEN_OFF = "written_off"
STAGE_SCRAPPED = "scrapped"

PURCHASE_STAGE_ORDER: List[str] = [
    STAGE_DRAFT,
    STAGE_PENDING,
    STAGE_APPROVED,
    STAGE_PROCURING,
    STAGE_PAID,
    STAGE_INBOUND,
    STAGE_ISSUED,
    STAGE_CARDED,
    STAGE_FINANCE_AUDITED,
    STAGE_WRITTEN_OFF,
]

PURCHASE_STAGE_LABELS: Dict[str, str] = {
    STAGE_DRAFT: "草稿",
    STAGE_PENDING: "审批中",
    STAGE_APPROVED: "已批准",
    STAGE_PROCURING: "采买中",
    STAGE_PAID: "已付款",
    STAGE_INBOUND: "已入库",
    STAGE_ISSUED: "已领料",
    STAGE_CARDED: "已建卡",
    STAGE_FINANCE_AUDITED: "财务已审核",
    STAGE_WRITTEN_OFF: "财务已销账",
    STAGE_SCRAPPED: "已报废",
}

# 资产台账状态（与历史 in_stock/in_use/scrapped 并存）
ASSET_STATUS_IN_STOCK = "in_stock"
ASSET_STATUS_IN_USE = "in_use"
ASSET_STATUS_FINANCE_PENDING = "finance_pending"
ASSET_STATUS_WRITTEN_OFF = "written_off"
ASSET_STATUS_SCRAPPED = "scrapped"
