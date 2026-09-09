"""审核动作落点（与 ``audit_phase.allowed_actions`` 配套）。

标准流转（主流 ERP / OA 实践）::

    人工审核 (manual)::

        draft --submit--> pending --approve--> approved
        approved --revoke--> draft --submit--> pending --approve--> approved
        pending --withdraw--> draft

    自动审核 (auto)::

        draft --submit--> approved
        approved --revoke--> draft --submit--> approved

全单据：人工/自动审 ``revoke`` 一律 ``draft``，须重新提交再启审批
（``resolve_revoke_to_draft_landing_phase`` / ``resolve_revoke_landing_phase``）。

``withdraw`` 仅人工审 pending 态提供，退回 draft。
"""

from __future__ import annotations

from typing import Literal, TypedDict

RevokeLandingPhase = Literal["draft", "pending"]


class SalesOrderRevokeState(TypedDict):
    """销售订单 revoke 后写入 DB 的 status / review_status（唯一真源）。"""

    status: str
    review_status: str


def resolve_revoke_to_draft_landing_phase(
    *,
    manual_audit_enabled: bool = True,
) -> RevokeLandingPhase:
    """撤销审核落点：一律 draft（人工/自动审相同）。

    ``manual_audit_enabled`` 保留入参仅为调用方签名对称，不参与分支。
    """
    _ = manual_audit_enabled
    return "draft"


def resolve_revoke_landing_phase(*, manual_audit_enabled: bool) -> RevokeLandingPhase:
    """撤销审核落点（与 ``resolve_revoke_to_draft_landing_phase`` 同义）。"""
    return resolve_revoke_to_draft_landing_phase(
        manual_audit_enabled=manual_audit_enabled
    )


def resolve_sales_order_revoke_landing_phase(
    *,
    manual_audit_enabled: bool = True,
) -> RevokeLandingPhase:
    """销售订单别名；请新调用改用 ``resolve_revoke_to_draft_landing_phase``。"""
    return resolve_revoke_to_draft_landing_phase(
        manual_audit_enabled=manual_audit_enabled
    )


def resolve_sales_order_revoke_state(*, landing: RevokeLandingPhase) -> SalesOrderRevokeState:
    """销售订单撤销审核后的主状态与 review_status（与 withdraw_sales_order 草稿态一致）。"""
    if landing == "pending":
        return {"status": "PENDING_REVIEW", "review_status": "PENDING"}
    return {"status": "DRAFT", "review_status": "PENDING"}
