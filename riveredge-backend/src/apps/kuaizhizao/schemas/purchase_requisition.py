"""
采购申请数据验证Schema

Author: RiverEdge Team
Date: 2025-02-01
"""

from datetime import date, datetime
from typing import List, Optional
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict


class PurchaseRequisitionItemBase(BaseModel):
    """采购申请行基础"""
    model_config = ConfigDict(from_attributes=True)

    material_id: int = Field(..., description="物料ID")
    material_code: str = Field(..., max_length=50, description="物料编码")
    material_name: str = Field(..., max_length=200, description="物料名称")
    material_spec: str | None = Field(None, max_length=200, description="物料规格")
    unit: str = Field("件", max_length=20, description="单位")
    quantity: Decimal = Field(..., gt=0, description="申请数量")
    suggested_unit_price: Decimal = Field(Decimal(0), ge=0, description="建议单价")
    required_date: date | None = Field(None, description="要求到货日期")
    supplier_id: int | None = Field(None, description="供应商ID")
    notes: str | None = Field(None, description="备注")


class PurchaseRequisitionItemCreate(PurchaseRequisitionItemBase):
    """采购申请行创建"""
    demand_computation_item_id: int | None = Field(None, description="需求计算明细ID")


class PurchaseRequisitionItemUpdate(BaseModel):
    """采购申请行更新"""
    quantity: Decimal | None = Field(None, gt=0)
    suggested_unit_price: Decimal | None = Field(None, ge=0)
    required_date: date | None = None
    supplier_id: int | None = None
    notes: str | None = None


class PurchaseRequisitionItemResponse(PurchaseRequisitionItemBase):
    """采购申请行响应"""
    id: int
    requisition_id: int
    tenant_id: int
    demand_computation_item_id: int | None = None
    purchase_order_id: int | None = None
    purchase_order_item_id: int | None = None
    supplier_id: int | None = None
    created_at: datetime
    updated_at: datetime


class PurchaseRequisitionBase(BaseModel):
    """采购申请头基础"""
    model_config = ConfigDict(from_attributes=True)

    requisition_code: str = Field(..., max_length=50, description="申请编码")
    requisition_name: str | None = Field(None, max_length=200, description="申请名称")
    status: str = Field("草稿", max_length=20, description="状态")
    applicant_id: int | None = None
    applicant_name: str | None = None
    requisition_date: date | None = None
    required_date: date | None = None
    source_type: str | None = None
    source_id: int | None = None
    source_code: str | None = None
    is_urgent: bool = Field(False, description="是否紧急采购")
    urgent_reason: str | None = None
    notes: str | None = None


class PurchaseRequisitionCreate(BaseModel):
    """采购申请创建"""
    requisition_code: str | None = None
    requisition_name: str | None = None
    required_date: date | None = None
    source_type: str | None = None
    source_id: int | None = None
    source_code: str | None = None
    notes: str | None = None
    items: list[PurchaseRequisitionItemCreate] = Field(..., description="申请明细")


class PurchaseRequisitionUpdate(BaseModel):
    """采购申请更新"""
    requisition_name: str | None = None
    required_date: date | None = None
    notes: str | None = None
    items: list[PurchaseRequisitionItemCreate] | None = None


class PurchaseRequisitionResponse(PurchaseRequisitionBase):
    """采购申请响应"""
    id: int
    tenant_id: int
    urgent_operator_id: int | None = None
    urgent_operated_at: datetime | None = None
    reviewer_id: int | None = None
    reviewer_name: str | None = None
    review_time: datetime | None = None
    review_status: str = "待审核"
    review_remarks: str | None = None
    created_at: datetime
    updated_at: datetime
    items: list[PurchaseRequisitionItemResponse] = Field(default_factory=list)


class PurchaseRequisitionListResponse(PurchaseRequisitionResponse):
    """采购申请列表响应"""
    items_count: int | None = None


class ConvertToPurchaseOrderRequest(BaseModel):
    """转采购单请求"""
    item_ids: list[int] = Field(..., description="要转单的采购申请行ID列表")
    supplier_id: int = Field(..., description="供应商ID")
    supplier_name: str = Field(..., description="供应商名称")


class UrgentPurchaseRequest(BaseModel):
    """紧急采购请求"""
    urgent_reason: str = Field(..., min_length=1, description="紧急原因（必填）")
