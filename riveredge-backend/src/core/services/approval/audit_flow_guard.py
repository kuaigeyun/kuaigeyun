"""单据提交启审批 / 审核前校验 pending 实例（与销售订单试点同一契约）。"""

from __future__ import annotations

from typing import Any, Optional

from infra.exceptions.exceptions import BusinessLogicError


async def start_document_approval_or_raise(
    *,
    tenant_id: int,
    user_id: int,
    node_key: str,
    entity_type: str,
    entity_id: int,
    entity_uuid: str,
    title: str,
    content: str,
    doc_label: str,
    send_notification: bool = True,
) -> Any:
    """审核已开时必须创建审批实例；失败即暴露，禁止空壳待审。"""
    from core.services.approval.approval_instance_service import ApprovalInstanceService

    instance = await ApprovalInstanceService.start_approval_for_node(
        tenant_id=tenant_id,
        user_id=user_id,
        node_key=node_key,
        entity_type=entity_type,
        entity_id=entity_id,
        entity_uuid=str(entity_uuid),
        title=title,
        content=content,
        send_notification=send_notification,
    )
    if not instance:
        raise BusinessLogicError(
            f"{doc_label}审核已开启但未找到可用的审批流程，"
            f"请在配置中心检查 {node_key} 审批流程是否已激活"
        )
    return instance


async def assert_pending_approval_instance(
    *,
    tenant_id: int,
    entity_type: str,
    entity_id: int,
    audit_required: bool,
    doc_label: str,
    verb: str = "审核",
) -> None:
    """审核已开时须存在 pending 审批实例，禁止撤销后空壳直审。"""
    if not audit_required:
        return
    from core.services.approval.approval_instance_service import ApprovalInstanceService

    approval_status = await ApprovalInstanceService.get_approval_status(
        tenant_id=tenant_id,
        entity_type=entity_type,
        entity_id=entity_id,
    )
    has_pending_flow = bool(
        approval_status.get("has_instance")
        and approval_status.get("status") == "pending"
    )
    if not has_pending_flow:
        raise BusinessLogicError(
            f"{doc_label}审核已开启但无进行中的审批流程，请先提交审批后再{verb}"
        )
