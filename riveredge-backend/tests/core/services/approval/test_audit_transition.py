"""audit_transition 单元测试。"""

from __future__ import annotations

from core.services.approval.audit_transition import (
    resolve_revoke_landing_phase,
    resolve_revoke_to_draft_landing_phase,
    resolve_sales_order_revoke_landing_phase,
    resolve_sales_order_revoke_state,
)


def test_revoke_landing_always_draft():
    assert resolve_revoke_landing_phase(manual_audit_enabled=True) == "draft"
    assert resolve_revoke_landing_phase(manual_audit_enabled=False) == "draft"


def test_revoke_to_draft_landing_always_draft():
    assert resolve_revoke_to_draft_landing_phase(manual_audit_enabled=True) == "draft"
    assert resolve_revoke_to_draft_landing_phase(manual_audit_enabled=False) == "draft"


def test_sales_order_revoke_landing_alias_always_draft():
    assert resolve_sales_order_revoke_landing_phase(manual_audit_enabled=True) == "draft"
    assert resolve_sales_order_revoke_landing_phase(manual_audit_enabled=False) == "draft"


def test_sales_order_revoke_state_pending():
    state = resolve_sales_order_revoke_state(landing="pending")
    assert state == {"status": "PENDING_REVIEW", "review_status": "PENDING"}


def test_sales_order_revoke_state_draft():
    state = resolve_sales_order_revoke_state(landing="draft")
    assert state == {"status": "DRAFT", "review_status": "PENDING"}
