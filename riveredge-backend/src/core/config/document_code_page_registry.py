"""
编码规则 page_code → 单据实体 / 追溯类型映射（编号可编辑性唯一真源之一）。
"""

from __future__ import annotations

import importlib
from dataclasses import dataclass
from typing import Any, Callable, Dict, Optional, Tuple, Type

from tortoise import Model

from core.config.code_rule_entity_models import ENTITY_MODEL_BY_RULE_CODE
from core.config.code_rule_pages import CODE_RULE_PAGES, get_page_config_by_code

# page_code → document_relation DOCUMENT_TYPES 键（无映射则仅草稿门禁，不做下游追溯）
PAGE_CODE_TO_DOCUMENT_TYPE: Dict[str, str] = {
    "kuaizhizao-sales-order": "sales_order",
    "kuaizhizao-sales-delivery": "sales_delivery",
    "kuaizhizao-delivery-notice": "delivery_notice",
    "kuaizhizao-shipment-notice": "shipment_notice",
    "kuaizhizao-receipt-notice": "receipt_notice",
    "kuaizhizao-sales-return": "sales_return",
    "kuaizhizao-quotation": "quotation",
    "kuaizhizao-demand-plan": "demand",
    "kuaizhizao-demand-computation": "demand_computation",
    "kuaizhizao-production-work-order": "work_order",
    "kuaizhizao-production-rework-order": "work_order",
    "kuaizhizao-production-outsource-order": "outsource_order",
    "kuaizhizao-production-outsource-work-order": "outsource_work_order",
    "kuaizhizao-purchase-order": "purchase_order",
    "kuaizhizao-purchase-requisition": "purchase_requisition",
    "kuaizhizao-purchase-receipt": "purchase_receipt",
    "kuaizhizao-purchase-return": "purchase_return",
    "kuaizhizao-warehouse-inbound": "production_picking",
    "kuaizhizao-warehouse-production-return": "production_return",
    "kuaizhizao-warehouse-other-inbound": "other_inbound",
    "kuaizhizao-warehouse-other-outbound": "other_outbound",
    "kuaizhizao-warehouse-material-borrow": "material_borrow",
    "kuaizhizao-warehouse-material-return": "material_return",
    "kuaizhizao-warehouse-finished-goods-inbound": "finished_goods_receipt",
    "kuaizhizao-warehouse-semi-finished-inbound": "semi_finished_goods_receipt",
    "kuaizhizao-warehouse-stocktaking": "stocktaking",
    "kuaizhizao-warehouse-inventory-transfer": "inventory_transfer",
    "kuaizhizao-quality-incoming-inspection": "incoming_inspection",
    "kuaizhizao-quality-process-inspection": "process_inspection",
    "kuaizhizao-quality-finished-goods-inspection": "finished_goods_inspection",
    "kuaizhizao-quality-oqc-inspection": "finished_goods_inspection",
    "kuaizhizao-freight-order": "freight_order",
    "kuaizhizao-delivery-project": "delivery_project",
    "kuaizhizao-equipment-management-equipment": "equipment",
    "kuaizhizao-equipment-management-mold": "mold",
    "kuaizhizao-equipment-management-tool": "tool",
}


@dataclass(frozen=True)
class DocumentCodePageEntry:
    page_code: str
    code_field: str
    model_class: Type[Model]
    document_type: Optional[str]
    rule_code: Optional[str]


_model_cache: Dict[str, Type[Model]] = {}


def _load_model_class(module_path: str, class_name: str) -> Type[Model]:
    key = f"{module_path}.{class_name}"
    if key in _model_cache:
        return _model_cache[key]
    module = importlib.import_module(module_path)
    model_cls = getattr(module, class_name)
    _model_cache[key] = model_cls
    return model_cls


def resolve_document_code_page_entry(page_code: str) -> Optional[DocumentCodePageEntry]:
    """按 page_code 解析 ORM 实体与编号字段；无 rule_code 绑定的页面返回 None。"""
    page = get_page_config_by_code(page_code)
    if not page:
        return None
    code_field = (page.get("code_field") or "").strip()
    if not code_field:
        return None
    rule_code = (page.get("rule_code") or "").strip() or None
    model_class: Optional[Type[Model]] = None
    if rule_code and rule_code in ENTITY_MODEL_BY_RULE_CODE:
        module_path, class_name = ENTITY_MODEL_BY_RULE_CODE[rule_code]
        model_class = _load_model_class(module_path, class_name)
    if model_class is None:
        return None
    return DocumentCodePageEntry(
        page_code=page_code,
        code_field=code_field,
        model_class=model_class,
        document_type=PAGE_CODE_TO_DOCUMENT_TYPE.get(page_code),
        rule_code=rule_code,
    )


def list_auto_generate_page_codes() -> Tuple[str, ...]:
    return tuple(
        str(p.get("page_code"))
        for p in CODE_RULE_PAGES
        if p.get("auto_generate") and p.get("page_code")
    )
