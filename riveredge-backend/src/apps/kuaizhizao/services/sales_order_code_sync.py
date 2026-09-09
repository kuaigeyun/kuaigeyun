"""
销售订单编号：下游检测与改号后快照同步。
"""

from __future__ import annotations

from typing import Any, Dict, List, Tuple

from loguru import logger

from apps.kuaizhizao.constants import DemandStatus, normalize_status
from apps.kuaizhizao.models.document_relation import DocumentRelation
from apps.kuaizhizao.models.sales_order import SalesOrder
from core.services.document_code_editability import (
    REASON_HAS_DOWNSTREAM,
    REASON_MANUAL_EDIT_DISABLED,
    resolve_document_code_editable,
)
from core.services.business.code_generation_service import CodeGenerationService
from infra.exceptions.exceptions import BusinessLogicError, ValidationError


def _is_sales_order_draft(order: SalesOrder) -> bool:
    return normalize_status(str(order.status or "")) == DemandStatus.DRAFT.value


async def sales_order_has_downstream_documents(tenant_id: int, sales_order_id: int) -> bool:
    from apps.kuaizhizao.services.document_relation_new_service import DocumentRelationNewService

    trace = await DocumentRelationNewService().trace_document_chain(
        tenant_id=tenant_id,
        document_type="sales_order",
        document_id=sales_order_id,
        direction="downstream",
        max_depth=10,
    )
    collected = DocumentRelationNewService()._flatten_downstream_nodes(trace.downstream_chain)
    if collected:
        return True

    fk_specs: List[Tuple[Any, str]] = [
        (_lazy_work_order_model, "sales_order_id"),
        (_lazy_sales_delivery_model, "sales_order_id"),
        (_lazy_shipment_notice_model, "sales_order_id"),
        (_lazy_sales_return_model, "sales_order_id"),
    ]
    for loader, field in fk_specs:
        model = loader()
        fields_map = getattr(getattr(model, "_meta", None), "fields_map", {}) or {}
        if field not in fields_map:
            continue
        filters: Dict[str, Any] = {
            "tenant_id": tenant_id,
            field: sales_order_id,
        }
        if "deleted_at" in fields_map:
            filters["deleted_at__isnull"] = True
        if await model.filter(**filters).exists():
            return True
    return False


def _lazy_work_order_model():
    from apps.kuaizhizao.models.work_order import WorkOrder

    return WorkOrder


def _lazy_sales_delivery_model():
    from apps.kuaizhizao.models.sales_delivery import SalesDelivery

    return SalesDelivery


def _lazy_shipment_notice_model():
    from apps.kuaizhizao.models.shipment_notice import ShipmentNotice

    return ShipmentNotice


def _lazy_sales_return_model():
    from apps.kuaizhizao.models.sales_return import SalesReturn

    return SalesReturn


async def resolve_sales_order_code_editable(
    tenant_id: int,
    order: SalesOrder,
    *,
    allow_manual_edit: bool = True,
) -> tuple[bool, str | None]:
    has_downstream = await sales_order_has_downstream_documents(tenant_id, int(order.id))
    return resolve_document_code_editable(
        is_draft=_is_sales_order_draft(order),
        has_downstream=has_downstream,
        allow_manual_edit=allow_manual_edit,
    )


async def assert_sales_order_code_change_allowed(
    tenant_id: int,
    order: SalesOrder,
    new_code: str,
    *,
    allow_manual_edit: bool = True,
) -> None:
    new_code = (new_code or "").strip()
    if not new_code:
        raise ValidationError("销售订单编号不能为空")
    old_code = (order.order_code or "").strip()
    if new_code == old_code:
        return

    editable, reason = await resolve_sales_order_code_editable(
        tenant_id,
        order,
        allow_manual_edit=allow_manual_edit,
    )
    if not editable:
        if reason == REASON_MANUAL_EDIT_DISABLED:
            raise BusinessLogicError("当前编号规则不允许手工修改订单编号")
        if reason == REASON_HAS_DOWNSTREAM:
            raise BusinessLogicError("销售订单已有下游单据，不可修改编号")
        raise BusinessLogicError("当前状态不可修改销售订单编号")

    exists = await CodeGenerationService._check_code_exists(
        tenant_id=tenant_id,
        code=new_code,
        entity_type="sales_order",
    )
    if exists and new_code != old_code:
        other = await SalesOrder.get_or_none(
            tenant_id=tenant_id,
            order_code=new_code,
            deleted_at__isnull=True,
        )
        if other and int(other.id) != int(order.id):
            raise ValidationError("销售订单编号已存在")


async def sync_sales_order_code_snapshots(
    tenant_id: int,
    sales_order_id: int,
    new_code: str,
    *,
    old_code: str | None = None,
) -> None:
    """改号后同步 sales_order_id 关联的快照编码与单据关系。"""
    new_code = (new_code or "").strip()
    if not new_code:
        return

    snapshot_specs: List[Tuple[Any, str, str]] = [
        (_lazy_work_order_model, "sales_order_id", "sales_order_code"),
        (_lazy_sales_delivery_model, "sales_order_id", "sales_order_code"),
        (_lazy_shipment_notice_model, "sales_order_id", "sales_order_code"),
        (_lazy_sales_return_model, "sales_order_id", "sales_order_code"),
        (_lazy_delivery_notice_model, "sales_order_id", "sales_order_code"),
        (_lazy_delivery_project_model, "sales_order_id", "sales_order_code"),
        (_lazy_oqc_inspection_model, "sales_order_id", "sales_order_code"),
        (_lazy_finished_goods_receipt_model, "sales_order_id", "sales_order_code"),
        (_lazy_finished_goods_inspection_model, "sales_order_id", "sales_order_code"),
        (_lazy_after_sales_ticket_model, "sales_order_id", "sales_order_code"),
        (_lazy_after_sales_service_model, "sales_order_id", "sales_order_code"),
        (_lazy_quotation_model, "sales_order_id", "sales_order_code"),
    ]

    for loader, id_field, code_field in snapshot_specs:
        model = loader()
        fields_map = getattr(getattr(model, "_meta", None), "fields_map", {}) or {}
        if id_field not in fields_map or code_field not in fields_map:
            continue
        filters: Dict[str, Any] = {"tenant_id": tenant_id, id_field: sales_order_id}
        if "deleted_at" in fields_map:
            filters["deleted_at__isnull"] = True
        await model.filter(**filters).update(**{code_field: new_code})

    from apps.kuaizhizao.models.demand import Demand

    demand_filters: Dict[str, Any] = {
        "tenant_id": tenant_id,
        "source_type": "sales_order",
        "source_id": sales_order_id,
        "deleted_at__isnull": True,
    }
    await Demand.filter(**demand_filters).update(source_code=new_code)
    if old_code:
        await Demand.filter(**demand_filters, demand_code=old_code).update(demand_code=new_code)

    await DocumentRelation.filter(
        tenant_id=tenant_id,
        source_type="sales_order",
        source_id=sales_order_id,
    ).update(source_code=new_code, source_name=new_code)

    logger.info(
        "销售订单 {} 编号已同步快照为 {}",
        sales_order_id,
        new_code,
    )


def _lazy_delivery_notice_model():
    from apps.kuaizhizao.models.delivery_notice import DeliveryNotice

    return DeliveryNotice


def _lazy_delivery_project_model():
    from apps.kuaizhizao.models.delivery_project import DeliveryProject

    return DeliveryProject


def _lazy_oqc_inspection_model():
    from apps.kuaizhizao.models.oqc_inspection import OqcInspection

    return OqcInspection


def _lazy_finished_goods_receipt_model():
    from apps.kuaizhizao.models.finished_goods_receipt import FinishedGoodsReceipt

    return FinishedGoodsReceipt


def _lazy_finished_goods_inspection_model():
    from apps.kuaizhizao.models.finished_goods_inspection import FinishedGoodsInspection

    return FinishedGoodsInspection


def _lazy_after_sales_ticket_model():
    from apps.kuaizhizao.models.after_sales_ticket import AfterSalesTicket

    return AfterSalesTicket


def _lazy_after_sales_service_model():
    from apps.kuaizhizao.models.after_sales_service import AfterSalesService

    return AfterSalesService


def _lazy_quotation_model():
    from apps.kuaizhizao.models.quotation import Quotation

    return Quotation
