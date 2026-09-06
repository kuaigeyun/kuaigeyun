"""供应商评价（R-03）常量。

与主数据 `rating_grade`/`rating_score`（交期+IQC 运营评级）分离：
本模块是质量体系年/季评价单据，不覆盖运营评级。
"""

from __future__ import annotations

PERIOD_ANNUAL = "annual"
PERIOD_QUARTERLY = "quarterly"
SUPPLIER_EVAL_PERIOD_TYPES = frozenset({PERIOD_ANNUAL, PERIOD_QUARTERLY})
SUPPLIER_EVAL_PERIOD_DEFAULT = PERIOD_ANNUAL

AUDIT_ONSITE = "onsite"
AUDIT_DOCUMENT = "document"
SUPPLIER_EVAL_AUDIT_MODES = frozenset({AUDIT_ONSITE, AUDIT_DOCUMENT})
SUPPLIER_EVAL_AUDIT_DEFAULT = AUDIT_DOCUMENT

RECT_NONE = "none"
RECT_OPEN = "open"
RECT_CLOSED = "closed"
SUPPLIER_EVAL_RECT_STATUSES = frozenset({RECT_NONE, RECT_OPEN, RECT_CLOSED})

STATUS_DRAFT = "draft"
STATUS_PENDING = "pending"
STATUS_APPROVED = "approved"
STATUS_REJECTED = "rejected"
STATUS_REVOKED = "revoked"
SUPPLIER_EVAL_STATUSES = frozenset(
    {
        STATUS_DRAFT,
        STATUS_PENDING,
        STATUS_APPROVED,
        STATUS_REJECTED,
        STATUS_REVOKED,
    }
)

# 环保资料类型（清单项，非主数据资质证书）
ENV_DOC_TYPES = frozenset(
    {
        "rohs",
        "reach",
        "conflict_minerals",
        "msds",
        "other",
    }
)
ENV_DOC_TYPE_DEFAULT = "other"

PLAN_STATUS_DRAFT = "draft"
PLAN_STATUS_RELEASED = "released"
PLAN_STATUS_CLOSED = "closed"
SUPPLIER_EVAL_PLAN_STATUSES = frozenset(
    {
        PLAN_STATUS_DRAFT,
        PLAN_STATUS_RELEASED,
        PLAN_STATUS_CLOSED,
    }
)
