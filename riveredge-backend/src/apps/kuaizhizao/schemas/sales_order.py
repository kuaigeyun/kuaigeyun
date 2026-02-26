"""
销售订单管理模块数据验证schema

提供销售订单相关的数据验证和序列化。

Author: Luigi Lu
Date: 2026-01-19
"""

from __future__ import annotations

from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal
from pydantic import Field, field_validator, model_validator
from core.schemas.base import BaseSchema
from apps.kuaizhizao.constants import DemandStatus, ReviewStatus


# === 销售订单明细 ===

class SalesOrderItemBase(BaseSchema):
    """销售订单明细基础schema"""
    material_id: int | None = Field(None, description="物料ID")
    material_code: str = Field(..., max_length=100, description="物料编码")
    material_name: str = Field(..., max_length=200, description="物料名称")
    material_spec: str | None = Field(None, max_length=200, description="物料规格")
    material_unit: str | None = Field(None, max_length=20, description="物料单位")
    required_quantity: Decimal = Field(..., gt=0, description="需求数量")
    delivery_date: date = Field(..., description="交货日期")
    unit_price: Decimal | None = Field(None, ge=0, description="单价（不含税）")
    tax_rate: Decimal | None = Field(None, ge=0, le=100, description="税率（%）")
    item_amount: Decimal | None = Field(None, ge=0, description="价税合计")
    notes: str | None = Field(None, description="备注")


class SalesOrderItemCreate(SalesOrderItemBase):
    """创建销售订单明细schema"""
    pass


class SalesOrderItemUpdate(BaseSchema):
    """更新销售订单明细schema"""
    material_id: int | None = None
    material_code: str | None = Field(None, max_length=100)
    material_name: str | None = Field(None, max_length=200)
    material_spec: str | None = Field(None, max_length=200)
    material_unit: str | None = Field(None, max_length=20)
    required_quantity: Decimal | None = Field(None, gt=0)
    delivery_date: date | None = None
    unit_price: Decimal | None = Field(None, ge=0)
    tax_rate: Decimal | None = Field(None, ge=0, le=100)
    item_amount: Decimal | None = Field(None, ge=0)
    notes: str | None = None


class SalesOrderItemResponse(SalesOrderItemBase):
    """销售订单明细响应schema"""
    id: int
    uuid: str
    tenant_id: int
    sales_order_id: int
    delivered_quantity: Decimal | None = Field(None, description="已交货数量")
    remaining_quantity: Decimal | None = Field(None, description="剩余数量")
    delivery_status: str | None = Field(None, max_length=20, description="交货状态")
    work_order_id: int | None = Field(None, description="工单ID")
    work_order_code: str | None = Field(None, max_length=50, description="工单编码")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# === 销售订单 ===

class SalesOrderBase(BaseSchema):
    """销售订单基础schema"""
    order_code: str | None = Field(None, max_length=50, description="订单编码（自动生成，无需填写）")
    order_name: str | None = Field(None, max_length=200, description="订单名称（选填，不填时以订单编码作为展示名）")
    order_date: date = Field(..., description="订单日期")
    delivery_date: date = Field(..., description="交货日期")
    
    # 客户信息（必填）
    customer_id: int = Field(..., description="客户ID")
    customer_name: str = Field(..., max_length=200, description="客户名称")
    customer_contact: str | None = Field(None, max_length=100, description="客户联系人")
    customer_phone: str | None = Field(None, max_length=20, description="客户电话")
    
    # 金额信息
    total_quantity: Decimal = Field(Decimal("0"), ge=0, description="总数量")
    total_amount: Decimal = Field(Decimal("0"), ge=0, description="总金额")
    price_type: str | None = Field("tax_exclusive", max_length=20, description="价格类型：含税(tax_inclusive)/不含税(tax_exclusive)")
    discount_amount: Decimal = Field(Decimal("0"), ge=0, description="整单优惠金额")
    
    # 状态
    status: DemandStatus = Field(DemandStatus.DRAFT, description="订单状态")
    
    # 时间节点记录（用于耗时统计）
    submit_time: datetime | None = Field(None, description="提交时间")
    
    # 审核信息
    reviewer_id: int | None = Field(None, description="审核人ID")
    reviewer_name: str | None = Field(None, max_length=100, description="审核人姓名")
    review_time: datetime | None = Field(None, description="审核时间")
    review_status: ReviewStatus = Field(ReviewStatus.PENDING, description="审核状态")
    review_remarks: str | None = Field(None, description="审核备注")
    
    # 销售信息
    salesman_id: int | None = Field(None, description="销售员ID")
    salesman_name: str | None = Field(None, max_length=100, description="销售员姓名")
    
    # 物流信息
    shipping_address: str | None = Field(None, description="收货地址")
    shipping_method: str | None = Field(None, max_length=50, description="发货方式")
    payment_terms: str | None = Field(None, max_length=100, description="付款条件")
    
    notes: str | None = Field(None, description="备注")
    attachments: list[dict] | None = Field(None, description="附件列表")


class SalesOrderCreate(SalesOrderBase):
    """创建销售订单schema"""
    items: list[SalesOrderItemCreate] = Field(default_factory=list, description="订单明细")
    
    @model_validator(mode='after')
    def validate_items(self):
        """验证订单明细"""
        if not self.items or len(self.items) == 0:
            raise ValueError("销售订单必须至少包含一条明细")
        return self


class SalesOrderUpdate(BaseSchema):
    """更新销售订单schema。status/review_status 由工作流控制，不允许客户端直接修改。"""
    order_name: str | None = Field(None, max_length=200)
    order_date: date | None = None
    delivery_date: date | None = None
    customer_id: int | None = None
    customer_name: str | None = Field(None, max_length=200)
    customer_contact: str | None = Field(None, max_length=100)
    customer_phone: str | None = Field(None, max_length=20)
    total_quantity: Decimal | None = Field(None, ge=0)
    total_amount: Decimal | None = Field(None, ge=0)
    price_type: str | None = Field(None, max_length=20)
    discount_amount: Decimal | None = Field(None, ge=0)
    salesman_id: int | None = None
    salesman_name: str | None = Field(None, max_length=100)
    shipping_address: str | None = None
    shipping_method: str | None = Field(None, max_length=50)
    payment_terms: str | None = Field(None, max_length=100)
    notes: str | None = None
    attachments: list[dict] | None = None
    items: list[SalesOrderItemCreate] | None = None


class SalesOrderResponse(SalesOrderBase):
    """销售订单响应schema"""
    id: int
    uuid: str
    tenant_id: int
    pushed_to_computation: bool = Field(False, description="是否已下推到需求计算")
    computation_id: int | None = Field(None, description="需求计算ID")
    computation_code: str | None = Field(None, max_length=50, description="需求计算编码")
    is_active: bool = Field(True, description="是否启用")
    created_by: int | None = None
    updated_by: int | None = None
    created_at: datetime
    updated_at: datetime
    items: list[SalesOrderItemResponse] | None = Field(None, description="订单明细")
    duration_info: dict | None = Field(None, description="耗时统计信息")
    delivery_progress: float | None = Field(None, description="交货进度 0-100")
    invoice_progress: float | None = Field(None, description="开票进度 0-100")
    demand_synced: bool | None = Field(None, description="本次操作是否已同步至关联需求")
    lifecycle: dict | None = Field(None, description="生命周期（后端计算，供前端 UniLifecycleStepper 展示）")

    class Config:
        from_attributes = True


class SalesOrderListResponse(BaseSchema):
    """销售订单列表响应schema"""
    data: list[SalesOrderResponse]
    total: int
    success: bool = True


class SalesOrderRemindCreate(BaseSchema):
    """销售订单提醒创建schema"""
    recipient_user_uuid: str = Field(..., description="提醒对象（用户UUID）")
    action_type: str = Field(..., description="提醒操作：review/delivery/invoice/follow_up/other")
    remarks: str | None = Field(None, max_length=500, description="备注")
