"""返工单业务态 capabilities（唯一真源）。"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Optional

from infra.exceptions.exceptions import BusinessLogicError

from apps.kuaizhizao.services.document_action_policy.types import (
    ActionCapability,
    CAPABILITY_REASON_MESSAGES,
    ReworkOrderCapabilities,
)
from apps.kuaizhizao.utils.rework_order_constants import (
    ROUTING_MODE_DYNAMIC,
    TERMINAL_REWORK_ORDER_STATUSES,
)

_TERMINAL = TERMINAL_REWORK_ORDER_STATUSES | frozenset({"cancelled"})

_CAPABILITY_CONTEXT_KEYS = frozenset({
    "has_reports",
    "current_op_completed",
    "has_completed_operation",
    "awaiting_route_decision",
    "verification_passed",
})


def capability_kwargs_from_context(ctx: dict[str, Any]) -> dict[str, Any]:
    """从 compute_capability_context 结果提取 derive_rework_order_capabilities 可接受参数。"""
    return {key: ctx[key] for key in _CAPABILITY_CONTEXT_KEYS if key in ctx}


def _cap(allowed: bool, reason: Optional[str] = None) -> ActionCapability:
    return ActionCapability(allowed=allowed, reason=reason if not allowed else None)


def _norm(value: Any) -> str:
    return str(value or "").strip()


def _dec(value: Any) -> Decimal:
    try:
        return Decimal(str(value or 0))
    except Exception:
        return Decimal("0")


def derive_rework_order_capabilities(
    record: Any,
    *,
    has_reports: bool = False,
    current_op_completed: bool = False,
    has_completed_operation: bool = False,
    awaiting_route_decision: bool = False,
    verification_passed: bool = False,
) -> ReworkOrderCapabilities:
    status = _norm(getattr(record, "status", None))
    routing_mode = _norm(getattr(record, "routing_mode", ROUTING_MODE_DYNAMIC))
    business_type = _norm(getattr(record, "business_type", None)) or "simple_exec"
    verification_required = bool(getattr(record, "verification_required", False))
    is_terminal = status in _TERMINAL

    update_allowed = status == "draft"
    update_cap = _cap(update_allowed, "rework_order.update.not_draft" if not update_allowed else None)

    delete_allowed = status in ("draft", "cancelled") or (status == "released" and not has_reports)
    delete_cap = _cap(
        delete_allowed,
        "rework_order.delete.not_allowed" if not delete_allowed else None,
    )

    # 简化执行：草稿可下达；会签型/库存验证：审核通过后可下达
    if business_type in ("multi_signoff", "inventory_verify"):
        release_allowed = status == "approved"
        release_reason = (
            None
            if release_allowed
            else (
                "rework_order.release.awaiting_approval"
                if status in ("draft", "pending")
                else "rework_order.release.not_draft"
            )
        )
    else:
        release_allowed = status == "draft"
        release_reason = "rework_order.release.not_draft" if not release_allowed else None
    release_cap = _cap(release_allowed, release_reason)

    execute_allowed = status in ("released", "in_progress") and not awaiting_route_decision
    execute_cap = _cap(
        execute_allowed,
        "rework_order.execute.awaiting_decision"
        if awaiting_route_decision
        else "rework_order.execute.not_allowed"
        if not execute_allowed
        else None,
    )

    advance_allowed = (
        routing_mode == ROUTING_MODE_DYNAMIC
        and status == "in_progress"
        and awaiting_route_decision
    )
    advance_cap = _cap(
        advance_allowed,
        "rework_order.advance.not_dynamic" if routing_mode != ROUTING_MODE_DYNAMIC else "rework_order.advance.not_allowed"
        if not advance_allowed
        else None,
    )

    request_complete_allowed = (
        status == "in_progress"
        and has_completed_operation
        and (awaiting_route_decision or current_op_completed or routing_mode != ROUTING_MODE_DYNAMIC)
    )
    request_complete_cap = _cap(
        request_complete_allowed,
        "rework_order.request_complete.not_allowed" if not request_complete_allowed else None,
    )

    quality_release_allowed = status == "pending_verification" and verification_passed
    quality_release_cap = _cap(
        quality_release_allowed,
        "rework_order.quality_release.verification_pending"
        if status == "pending_verification" and not verification_passed
        else "rework_order.quality_release.not_allowed"
        if not quality_release_allowed
        else None,
    )

    base_close_ready = status == "quality_released" or (
        status == "pending_verification" and not verification_required
    )
    finance_signed = bool(getattr(record, "finance_signed_at", None))
    if business_type in ("multi_signoff", "inventory_verify"):
        finance_sign_allowed = base_close_ready and not finance_signed
        finance_sign_cap = _cap(
            finance_sign_allowed,
            "rework_order.finance_sign.already_signed"
            if base_close_ready and finance_signed
            else "rework_order.finance_sign.not_allowed"
            if not finance_sign_allowed
            else None,
        )
        close_allowed = base_close_ready and finance_signed
        close_cap = _cap(
            close_allowed,
            "rework_order.close.awaiting_finance"
            if base_close_ready and not finance_signed
            else "rework_order.close.not_allowed"
            if not close_allowed
            else None,
        )
    else:
        finance_sign_cap = _cap(False, "rework_order.finance_sign.not_allowed")
        close_allowed = base_close_ready
        close_cap = _cap(
            close_allowed,
            "rework_order.close.not_allowed" if not close_allowed else None,
        )

    pqc_checked = bool(getattr(record, "pqc_checked_at", None))
    if business_type == "inventory_verify":
        pqc_status_ok = status not in ("draft", "cancelled")
        pqc_check_allowed = pqc_status_ok and not pqc_checked
        if not pqc_status_ok:
            pqc_reason = "rework_order.pqc_check.not_allowed"
        elif pqc_checked:
            pqc_reason = "rework_order.pqc_check.already_checked"
        else:
            pqc_reason = None
        pqc_check_cap = _cap(pqc_check_allowed, pqc_reason)
        oqc_notify_allowed = pqc_status_ok and pqc_checked
        oqc_notify_cap = _cap(
            oqc_notify_allowed,
            "rework_order.oqc_notify.pqc_required"
            if pqc_status_ok and not pqc_checked
            else "rework_order.oqc_notify.not_allowed"
            if not oqc_notify_allowed
            else None,
        )
    else:
        pqc_check_cap = _cap(False, "rework_order.pqc_check.not_inventory_verify")
        oqc_notify_cap = _cap(False, "rework_order.oqc_notify.not_inventory_verify")

    cancel_allowed = False
    cancel_reason = "rework_order.cancel.not_allowed"
    if status == "draft":
        cancel_allowed = True
        cancel_reason = None
    elif status == "released" and not has_reports:
        cancel_allowed = True
        cancel_reason = None
    elif status == "cancelled":
        cancel_reason = "rework_order.cancel.already_cancelled"
    elif is_terminal:
        cancel_reason = "rework_order.cancel.terminal"

    hold_allowed = status in ("released", "in_progress")
    hold_cap = _cap(hold_allowed, "rework_order.hold.not_allowed" if not hold_allowed else None)

    resume_allowed = status == "on_hold"
    resume_cap = _cap(resume_allowed, "rework_order.resume.not_on_hold" if not resume_allowed else None)

    return ReworkOrderCapabilities(
        update=update_cap,
        delete=delete_cap,
        release=release_cap,
        execute=execute_cap,
        advance_next=advance_cap,
        request_complete=request_complete_cap,
        quality_release=quality_release_cap,
        finance_sign=finance_sign_cap,
        pqc_check=pqc_check_cap,
        oqc_notify=oqc_notify_cap,
        close=close_cap,
        cancel=_cap(cancel_allowed, cancel_reason),
        hold=hold_cap,
        resume=resume_cap,
        print=_cap(not is_terminal or status == "closed"),
    )


def assert_rework_order_capability(record: Any, action: str, caps: Optional[ReworkOrderCapabilities] = None) -> None:
    resolved = caps or derive_rework_order_capabilities(record)
    cap_map = {
        "update": resolved.update,
        "delete": resolved.delete,
        "release": resolved.release,
        "execute": resolved.execute,
        "advance_next": resolved.advance_next,
        "request_complete": resolved.request_complete,
        "quality_release": resolved.quality_release,
        "finance_sign": resolved.finance_sign,
        "pqc_check": resolved.pqc_check,
        "oqc_notify": resolved.oqc_notify,
        "close": resolved.close,
        "cancel": resolved.cancel,
        "hold": resolved.hold,
        "resume": resolved.resume,
        "print": resolved.print,
    }
    cap = cap_map.get(action)
    if cap is None:
        raise ValueError(f"Unknown rework order capability action: {action}")
    if not cap.allowed:
        msg = CAPABILITY_REASON_MESSAGES.get(cap.reason or "", cap.reason or "操作不允许")
        raise BusinessLogicError(msg)
