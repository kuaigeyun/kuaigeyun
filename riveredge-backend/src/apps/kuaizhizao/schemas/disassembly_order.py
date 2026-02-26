"""
拆卸单数据验证Schema模块

Author: Luigi Lu
Date: 2026-02-26
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal


class DisassemblyOrderBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: int = Field(..., description="仓库ID")
    warehouse_name: str = Field(..., description="仓库名称")
    disassembly_date: datetime = Field(..., description="拆卸日期")
    product_material_id: int = Field(..., description="成品物料ID")
    product_material_code: str = Field(..., description="成品物料编码")
    product_material_name: str = Field(..., description="成品物料名称")
    total_quantity: Decimal = Field(0, description="拆卸数量（成品数量）")
    remarks: str | None = Field(None, description="备注")


class DisassemblyOrderCreate(DisassemblyOrderBase):
    pass


class DisassemblyOrderUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    warehouse_id: int | None = None
    warehouse_name: str | None = None
    disassembly_date: datetime | None = None
    product_material_id: int | None = None
    product_material_code: str | None = None
    product_material_name: str | None = None
    total_quantity: Decimal | None = None
    remarks: str | None = None


class DisassemblyOrderResponse(DisassemblyOrderBase):
    id: int = Field(..., description="拆卸单ID")
    uuid: str = Field(..., description="业务ID")
    code: str = Field(..., description="拆卸单号")
    status: str = Field(..., description="状态")
    total_items: int = Field(..., description="组件产出数")
    executed_by: int | None = Field(None, description="执行人ID")
    executed_by_name: str | None = Field(None, description="执行人姓名")
    executed_at: datetime | None = Field(None, description="执行时间")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    created_by: int | None = Field(None, description="创建人ID")
    created_by_name: str | None = Field(None, description="创建人姓名")


class DisassemblyOrderListResponse(BaseModel):
    items: list[DisassemblyOrderResponse] = Field(default_factory=list)
    total: int = Field(..., description="总数")


class DisassemblyOrderItemBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    disassembly_order_id: int = Field(..., description="拆卸单ID")
    material_id: int = Field(..., description="组件物料ID")
    material_code: str = Field(..., description="组件物料编码")
    material_name: str = Field(..., description="组件物料名称")
    quantity: Decimal = Field(..., description="产出数量")
    unit_price: Decimal = Field(default=0, description="单价")
    remarks: str | None = Field(None, description="备注")


class DisassemblyOrderItemCreate(DisassemblyOrderItemBase):
    pass


class DisassemblyOrderItemCreateInput(BaseModel):
    """API 创建明细时的请求体，disassembly_order_id 由路径提供"""
    model_config = ConfigDict(from_attributes=True)

    material_id: int = Field(..., description="组件物料ID")
    material_code: str = Field(..., description="组件物料编码")
    material_name: str = Field(..., description="组件物料名称")
    quantity: Decimal = Field(..., description="产出数量")
    unit_price: Decimal = Field(default=0, description="单价")
    remarks: str | None = Field(None, description="备注")


class DisassemblyOrderItemUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    quantity: Decimal | None = None
    unit_price: Decimal | None = None
    remarks: str | None = None


class DisassemblyOrderItemResponse(DisassemblyOrderItemBase):
    id: int = Field(..., description="明细ID")
    uuid: str = Field(..., description="业务ID")
    amount: Decimal = Field(..., description="金额")
    status: str = Field(..., description="状态")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")


class DisassemblyOrderWithItemsResponse(DisassemblyOrderResponse):
    items: list[DisassemblyOrderItemResponse] = Field(default_factory=list, description="拆卸明细列表")
