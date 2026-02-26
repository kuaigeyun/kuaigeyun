"""
报价单管理模块数据验证schema

提供报价单相关的数据验证和序列化。

Author: RiverEdge Team
Date: 2026-02-19
"""

from __future__ import annotations

from datetime import datetime, date
from typing import Optional, List
from decimal import Decimal
from pydantic import Field, model_validator
from core.schemas.base import BaseSchema


# === 报价单明细 ===

class QuotationItemBase(BaseSchema):
    """报价单明细基础schema"""
    material_id: int = Field(..., description="物料ID")
    material_code: str = Field(..., max_length=100, description="物料编码")
    material_name: str = Field(..., max_length=200, description="物料名称")
    material_spec: str | None = Field(None, max_length=200, description="物料规格")
    material_unit: str = Field(..., max_length=20, description="物料单位")
    quote_quantity: Decimal = Field(..., gt=0, description="报价数量")
    unit_price: Decimal = Field(..., ge=0, description="单价")
    total_amount: Decimal | None = Field(None, ge=0, description="金额")
    delivery_date: date | None = Field(None, description="预计交货日期")
    notes: str | None = Field(None, description="备注")


class QuotationItemCreate(QuotationItemBase):
    """创建报价单明细schema"""
    pass


class QuotationItemUpdate(BaseSchema):
    """更新报价单明细schema"""
    material_id: int | None = None
    material_code: str | None = Field(None, max_length=100)
    material_name: str | None = Field(None, max_length=200)
    material_spec: str | None = Field(None, max_length=200)
    material_unit: str | None = Field(None, max_length=20)
    quote_quantity: Decimal | None = Field(None, gt=0)
    unit_price: Decimal | None = Field(None, ge=0)
    total_amount: Decimal | None = Field(None, ge=0)
    delivery_date: date | None = None
    notes: str | None = None


class QuotationItemResponse(QuotationItemBase):
    """报价单明细响应schema"""
    id: int
    uuid: str
    tenant_id: int
    quotation_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# === 报价单 ===

class QuotationBase(BaseSchema):
    """报价单基础schema"""
    quotation_code: str | None = Field(None, max_length=50, description="报价单编码（自动生成，无需填写）")
    quotation_date: date = Field(..., description="报价日期")
    valid_until: date | None = Field(None, description="有效期至")
    delivery_date: date | None = Field(None, description="预计交货日期")

    # 客户信息（必填）
    customer_id: int = Field(..., description="客户ID")
    customer_name: str = Field(..., max_length=200, description="客户名称")
    customer_contact: str | None = Field(None, max_length=100, description="客户联系人")
    customer_phone: str | None = Field(None, max_length=20, description="客户电话")

    # 金额信息
    total_quantity: Decimal = Field(Decimal("0"), ge=0, description="总数量")
    total_amount: Decimal = Field(Decimal("0"), ge=0, description="总金额")

    # 状态：草稿/已发送/已接受/已拒绝/已转订单
    status: str = Field("草稿", max_length=20, description="报价状态")

    # 审核信息
    reviewer_id: int | None = Field(None, description="审核人ID")
    reviewer_name: str | None = Field(None, max_length=100, description="审核人姓名")
    review_time: datetime | None = Field(None, description="审核时间")
    review_status: str | None = Field("待审核", max_length=20, description="审核状态")
    review_remarks: str | None = Field(None, description="审核备注")

    # 销售信息
    salesman_id: int | None = Field(None, description="销售员ID")
    salesman_name: str | None = Field(None, max_length=100, description="销售员姓名")

    # 物流信息
    shipping_address: str | None = Field(None, description="收货地址")
    shipping_method: str | None = Field(None, max_length=50, description="发货方式")
    payment_terms: str | None = Field(None, max_length=100, description="付款条件")

    notes: str | None = Field(None, description="备注")


class QuotationCreate(QuotationBase):
    """创建报价单schema"""
    items: list[QuotationItemCreate] = Field(default_factory=list, description="报价明细")

    @model_validator(mode='after')
    def validate_items(self):
        """验证报价明细"""
        if not self.items or len(self.items) == 0:
            raise ValueError("报价单必须至少包含一条明细")
        return self


class QuotationUpdate(BaseSchema):
    """更新报价单schema"""
    quotation_date: date | None = None
    valid_until: date | None = None
    delivery_date: date | None = None
    customer_id: int | None = None
    customer_name: str | None = Field(None, max_length=200)
    customer_contact: str | None = Field(None, max_length=100)
    customer_phone: str | None = Field(None, max_length=20)
    total_quantity: Decimal | None = Field(None, ge=0)
    total_amount: Decimal | None = Field(None, ge=0)
    status: str | None = Field(None, max_length=20)
    salesman_id: int | None = None
    salesman_name: str | None = Field(None, max_length=100)
    shipping_address: str | None = None
    shipping_method: str | None = Field(None, max_length=50)
    payment_terms: str | None = Field(None, max_length=100)
    notes: str | None = None
    items: list[QuotationItemCreate] | None = None


class QuotationResponse(QuotationBase):
    """报价单响应schema"""
    id: int
    uuid: str
    tenant_id: int
    sales_order_id: int | None = Field(None, description="关联销售订单ID")
    sales_order_code: str | None = Field(None, max_length=50, description="关联销售订单编码")
    is_active: bool = Field(True, description="是否有效")
    created_by: int | None = None
    updated_by: int | None = None
    created_at: datetime
    updated_at: datetime
    items: list[QuotationItemResponse] | None = Field(None, description="报价明细")

    class Config:
        from_attributes = True


class QuotationListResponse(BaseSchema):
    """报价单列表响应schema"""
    data: list[QuotationResponse]
    total: int
    success: bool = True
