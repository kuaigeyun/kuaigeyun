"""
全站单据编号可编辑性查询与改号（草稿 / 无下游可改）。
"""

from __future__ import annotations

from typing import Any, Callable, Dict, Optional, Tuple

from loguru import logger
from tortoise import Model

from apps.kuaizhizao.constants import is_draft_status
from apps.kuaizhizao.models.document_relation import DocumentRelation
from core.config.code_rule_pages import get_page_config_by_code
from core.config.document_code_page_registry import (
    DocumentCodePageEntry,
    resolve_document_code_page_entry,
)
from core.services.business.code_rule_service import CodeRuleService
from core.services.document_code_editability import (
    REASON_HAS_DOWNSTREAM,
    REASON_MANUAL_EDIT_DISABLED,
    resolve_document_code_editable,
)
from infra.exceptions.exceptions import BusinessLogicError, NotFoundError, ValidationError

DownstreamChecker = Callable[[int, int], Any]


async def _trace_has_downstream(tenant_id: int, document_type: str, document_id: int) -> bool:
    from apps.kuaizhizao.services.document_relation_new_service import DocumentRelationNewService

    svc = DocumentRelationNewService()
    trace = await svc.trace_document_chain(
        tenant_id=tenant_id,
        document_type=document_type,
        document_id=document_id,
        direction="downstream",
        max_depth=10,
    )
    collected = svc._flatten_downstream_nodes(trace.downstream_chain)
    return bool(collected)


async def _sales_order_has_downstream(tenant_id: int, document_id: int) -> bool:
    from apps.kuaizhizao.services.sales_order_code_sync import sales_order_has_downstream_documents

    return await sales_order_has_downstream_documents(tenant_id, document_id)


DOWNSTREAM_CHECKERS: Dict[str, DownstreamChecker] = {
    "sales_order": _sales_order_has_downstream,
}


async def load_document_entity(
    tenant_id: int,
    entry: DocumentCodePageEntry,
    document_id: int,
) -> Model:
    filters: Dict[str, Any] = {"tenant_id": tenant_id, "id": document_id}
    fields_map = getattr(getattr(entry.model_class, "_meta", None), "fields_map", {}) or {}
    if "deleted_at" in fields_map:
        filters["deleted_at__isnull"] = True
    entity = await entry.model_class.get_or_none(**filters)
    if entity is None:
        raise NotFoundError(f"单据不存在（page_code={entry.page_code}, id={document_id}）")
    return entity


def _entity_is_draft(entity: Model) -> bool:
    fields_map = getattr(getattr(entity.__class__, "_meta", None), "fields_map", {}) or {}
    if "status" not in fields_map:
        return False
    return is_draft_status(str(getattr(entity, "status", "") or ""))


async def _resolve_allow_manual_edit(tenant_id: int, page_code: str) -> bool:
    page = get_page_config_by_code(page_code)
    if not page:
        return True
    if page.get("allow_manual_edit") is False:
        return False
    rule_code = (page.get("rule_code") or "").strip()
    if not rule_code:
        return page.get("allow_manual_edit", True) is not False
    try:
        rule, _ = await CodeRuleService.resolve_rule_by_code(tenant_id, rule_code)
        if rule is not None and rule.allow_manual_edit is False:
            return False
    except Exception:
        pass
    return True


async def document_has_downstream(
    tenant_id: int,
    document_type: Optional[str],
    document_id: int,
) -> bool:
    if not document_type:
        return False
    checker = DOWNSTREAM_CHECKERS.get(document_type)
    if checker is not None:
        return bool(await checker(tenant_id, document_id))
    return await _trace_has_downstream(tenant_id, document_type, document_id)


async def resolve_document_code_editability_for_page(
    tenant_id: int,
    page_code: str,
    document_id: int,
) -> Tuple[bool, Optional[str], str]:
    """
    返回 (可编辑, 锁定原因码, code_field)。
    """
    entry = resolve_document_code_page_entry(page_code)
    if entry is None:
        raise NotFoundError(f"未找到编码规则页面配置：{page_code}")

    entity = await load_document_entity(tenant_id, entry, document_id)
    allow_manual = await _resolve_allow_manual_edit(tenant_id, page_code)
    has_downstream = False
    if entry.document_type:
        has_downstream = await document_has_downstream(
            tenant_id,
            entry.document_type,
            document_id,
        )
    editable, reason = resolve_document_code_editable(
        is_draft=_entity_is_draft(entity),
        has_downstream=has_downstream,
        allow_manual_edit=allow_manual,
    )
    return editable, reason, entry.code_field


async def assert_document_code_change_allowed(
    tenant_id: int,
    page_code: str,
    entity: Model,
    new_code: str,
    *,
    entry: Optional[DocumentCodePageEntry] = None,
) -> None:
    entry = entry or resolve_document_code_page_entry(page_code)
    if entry is None:
        raise NotFoundError(f"未找到编码规则页面配置：{page_code}")

    new_code = (new_code or "").strip()
    if not new_code:
        raise ValidationError("编号不能为空")

    old_code = str(getattr(entity, entry.code_field, "") or "").strip()
    if new_code == old_code:
        return

    allow_manual = await _resolve_allow_manual_edit(tenant_id, page_code)
    has_downstream = False
    if entry.document_type:
        has_downstream = await document_has_downstream(
            tenant_id,
            entry.document_type,
            int(entity.id),
        )
    editable, reason = resolve_document_code_editable(
        is_draft=_entity_is_draft(entity),
        has_downstream=has_downstream,
        allow_manual_edit=allow_manual,
    )
    if not editable:
        if reason == REASON_MANUAL_EDIT_DISABLED:
            raise BusinessLogicError("当前编号规则不允许手工修改编号")
        if reason == REASON_HAS_DOWNSTREAM:
            raise BusinessLogicError("已有下游单据，不可修改编号")
        raise BusinessLogicError("当前状态不可修改编号")

    filters: Dict[str, Any] = {
        "tenant_id": tenant_id,
        entry.code_field: new_code,
    }
    fields_map = getattr(getattr(entry.model_class, "_meta", None), "fields_map", {}) or {}
    if "deleted_at" in fields_map:
        filters["deleted_at__isnull"] = True
    other = await entry.model_class.get_or_none(**filters)
    if other is not None and int(other.id) != int(entity.id):
        raise ValidationError("编号已存在")


async def sync_document_code_snapshots(
    tenant_id: int,
    page_code: str,
    document_id: int,
    new_code: str,
    *,
    old_code: Optional[str] = None,
    document_type: Optional[str] = None,
) -> None:
    """改号后同步单据关系与类型专属快照。"""
    new_code = (new_code or "").strip()
    if not new_code:
        return

    entry = resolve_document_code_page_entry(page_code)
    doc_type = document_type or (entry.document_type if entry else None)

    if doc_type == "sales_order":
        from apps.kuaizhizao.services.sales_order_code_sync import sync_sales_order_code_snapshots

        await sync_sales_order_code_snapshots(
            tenant_id,
            document_id,
            new_code,
            old_code=old_code,
        )
        return

    if doc_type:
        await DocumentRelation.filter(
            tenant_id=tenant_id,
            source_type=doc_type,
            source_id=document_id,
        ).update(source_code=new_code, source_name=new_code)
        await DocumentRelation.filter(
            tenant_id=tenant_id,
            target_type=doc_type,
            target_id=document_id,
        ).update(target_code=new_code, target_name=new_code)

    logger.info(
        "单据 {}#{} 编号已同步为 {}（page_code={}）",
        doc_type or page_code,
        document_id,
        new_code,
        page_code,
    )


async def apply_document_code_change(
    tenant_id: int,
    page_code: str,
    entity: Model,
    new_code: str,
) -> str:
    """
    校验并写入新编号，返回实际新编号（未变更则返回原编号）。
    """
    entry = resolve_document_code_page_entry(page_code)
    if entry is None:
        raise NotFoundError(f"未找到编码规则页面配置：{page_code}")

    new_code = (new_code or "").strip()
    old_code = str(getattr(entity, entry.code_field, "") or "").strip()
    if new_code == old_code:
        return old_code

    await assert_document_code_change_allowed(tenant_id, page_code, entity, new_code, entry=entry)
    setattr(entity, entry.code_field, new_code)
    await entity.save(update_fields=[entry.code_field])
    await sync_document_code_snapshots(
        tenant_id,
        page_code,
        int(entity.id),
        new_code,
        old_code=old_code or None,
    )
    return new_code


async def pop_and_apply_code_change_from_update_dict(
    tenant_id: int,
    page_code: str,
    entity: Model,
    update_dict: dict,
    code_field: str,
) -> None:
    """从更新 payload 中取出编号字段并按全站规则改号（已写入 entity）。"""
    if code_field not in update_dict:
        return
    new_code = update_dict.pop(code_field, None)
    if new_code is None:
        return
    await apply_document_code_change(tenant_id, page_code, entity, str(new_code))
