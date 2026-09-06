"""
设备故障维修 Schema 模块

定义设备故障和维修记录相关的 Pydantic Schema，用于 API 请求和响应验证。

Author: Luigi Lu
Date: 2025-01-15
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict, field_validator


class EquipmentFaultBase(BaseModel):
    """设备故障记录基础 Schema。"""

    fault_no: Optional[str] = Field(None, max_length=100, description="故障记录编号（可选，创建时自动生成）")
    equipment_uuid: str = Field(..., description="设备UUID")
    fault_date: Optional[datetime] = Field(None, description="故障发生时刻（缺省为报障时刻）")
    response_minutes: Optional[int] = Field(None, ge=1, le=24 * 60, description="规定到场时限（分钟）")
    fault_type: str = Field(..., max_length=50, description="故障类型")
    fault_description: str = Field(..., description="故障描述")
    fault_level: str = Field(..., max_length=50, description="故障级别")
    reporter_id: Optional[int] = Field(None, description="报告人ID")
    reporter_name: Optional[str] = Field(None, max_length=100, description="报告人姓名")
    status: str = Field(default="待处理", max_length=50, description="故障状态")
    repair_required: bool = Field(default=True, description="是否需要维修")
    remark: Optional[str] = Field(None, description="备注")
    attachments: Optional[List[dict]] = Field(None, description="附件列表")
    source_type: Optional[str] = Field(None, max_length=50, description="来源类型")
    source_uuid: Optional[str] = Field(None, max_length=36, description="来源单据 UUID")

    @field_validator("fault_type")
    @classmethod
    def validate_fault_type(cls, v: str) -> str:
        allowed_types = ["机械故障", "电气故障", "软件故障", "其他"]
        if v not in allowed_types:
            raise ValueError(f"故障类型必须是 {allowed_types} 之一")
        return v

    @field_validator("fault_level")
    @classmethod
    def validate_fault_level(cls, v: str) -> str:
        allowed_levels = ["轻微", "一般", "严重", "紧急"]
        if v not in allowed_levels:
            raise ValueError(f"故障级别必须是 {allowed_levels} 之一")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed_statuses = ["待处理", "处理中", "已修复", "已关闭"]
        if v not in allowed_statuses:
            raise ValueError(f"故障状态必须是 {allowed_statuses} 之一")
        return v


class EquipmentFaultCreate(EquipmentFaultBase):
    pass


class EquipmentFaultUpdate(BaseModel):
    fault_date: Optional[datetime] = Field(None, description="故障发生日期")
    fault_type: Optional[str] = Field(None, max_length=50, description="故障类型")
    fault_description: Optional[str] = Field(None, description="故障描述")
    fault_level: Optional[str] = Field(None, max_length=50, description="故障级别")
    reporter_id: Optional[int] = Field(None, description="报告人ID")
    reporter_name: Optional[str] = Field(None, max_length=100, description="报告人姓名")
    status: Optional[str] = Field(None, max_length=50, description="故障状态")
    repair_required: Optional[bool] = Field(None, description="是否需要维修")
    response_minutes: Optional[int] = Field(None, ge=1, le=24 * 60, description="规定到场时限（分钟）")
    remark: Optional[str] = Field(None, description="备注")
    attachments: Optional[List[dict]] = Field(None, description="附件列表")
    source_type: Optional[str] = Field(None, max_length=50, description="来源类型")
    source_uuid: Optional[str] = Field(None, max_length=36, description="来源单据 UUID")


class EquipmentFaultResponse(EquipmentFaultBase):
    model_config = ConfigDict(from_attributes=True)

    uuid: str = Field(..., description="设备故障记录UUID")
    id: int = Field(..., description="设备故障记录ID")
    tenant_id: int = Field(..., description="组织ID")
    equipment_id: int = Field(..., description="设备ID")
    equipment_code: Optional[str] = Field(None, description="设备编码")
    equipment_name: str = Field(..., description="设备名称")
    reported_at: Optional[datetime] = Field(None, description="报障时间")
    response_due_at: Optional[datetime] = Field(None, description="要求到场截止时刻")
    response_overdue: bool = Field(default=False, description="是否已超过规定到场时限且未到场")
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    lifecycle: Optional[Dict[str, Any]] = Field(None, description="通用生命周期")
    deleted_at: Optional[datetime] = Field(None, description="删除时间")


class EquipmentFaultArriveRequest(BaseModel):
    equipment_uuid: str = Field(..., description="扫码得到的设备 UUID，须与故障设备一致")
    repair_type: Optional[str] = Field(default="现场维修", max_length=50)
    repairer_name: Optional[str] = Field(None, max_length=100)


class EquipmentRepairCompleteRequest(BaseModel):
    fault_cause: str = Field(..., min_length=1, description="故障原因")
    repair_content: str = Field(..., min_length=1, description="维修内容")
    repair_result: Optional[str] = Field(default="成功", max_length=50)
    remark: Optional[str] = Field(None, description="备注")
    attachments: Optional[List[dict]] = Field(None, description="附件列表")

    @field_validator("repair_result")
    @classmethod
    def validate_repair_result(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed_results = ["成功", "失败", "部分成功"]
            if v not in allowed_results:
                raise ValueError(f"维修结果必须是 {allowed_results} 之一")
        return v


class EquipmentRepairBase(BaseModel):
    repair_no: Optional[str] = Field(None, max_length=100)
    equipment_fault_uuid: Optional[str] = Field(None)
    equipment_uuid: str = Field(...)
    repair_date: datetime = Field(...)
    repair_type: str = Field(...)
    repair_description: str = Field(...)
    fault_cause: Optional[str] = Field(None)
    repair_content: Optional[str] = Field(None)
    repair_cost: Optional[Decimal] = Field(None)
    repair_parts: Optional[Dict[str, Any]] = Field(None)
    repairer_id: Optional[int] = Field(None)
    repairer_name: Optional[str] = Field(None, max_length=100)
    repair_duration: Optional[Decimal] = Field(None)
    status: str = Field(default="进行中", max_length=50)
    repair_result: Optional[str] = Field(None, max_length=50)
    remark: Optional[str] = Field(None)
    attachments: Optional[List[dict]] = Field(None)

    @field_validator("repair_type")
    @classmethod
    def validate_repair_type(cls, v: str) -> str:
        allowed_types = ["现场维修", "返厂维修", "委外维修"]
        if v not in allowed_types:
            raise ValueError(f"维修类型必须是 {allowed_types} 之一")
        return v

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed_statuses = ["进行中", "已完成", "已取消"]
        if v not in allowed_statuses:
            raise ValueError(f"维修状态必须是 {allowed_statuses} 之一")
        return v

    @field_validator("repair_result")
    @classmethod
    def validate_repair_result(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            allowed_results = ["成功", "失败", "部分成功"]
            if v not in allowed_results:
                raise ValueError(f"维修结果必须是 {allowed_results} 之一")
        return v


class EquipmentRepairCreate(EquipmentRepairBase):
    pass


class EquipmentRepairUpdate(BaseModel):
    repair_date: Optional[datetime] = Field(None)
    repair_type: Optional[str] = Field(None, max_length=50)
    repair_description: Optional[str] = Field(None)
    fault_cause: Optional[str] = Field(None)
    repair_content: Optional[str] = Field(None)
    repair_cost: Optional[Decimal] = Field(None)
    repair_parts: Optional[Dict[str, Any]] = Field(None)
    repairer_id: Optional[int] = Field(None)
    repairer_name: Optional[str] = Field(None, max_length=100)
    repair_duration: Optional[Decimal] = Field(None)
    status: Optional[str] = Field(None, max_length=50)
    repair_result: Optional[str] = Field(None, max_length=50)
    remark: Optional[str] = Field(None)
    attachments: Optional[List[dict]] = Field(None)


class EquipmentRepairResponse(EquipmentRepairBase):
    model_config = ConfigDict(from_attributes=True)

    uuid: str
    id: int
    tenant_id: int
    equipment_fault_id: Optional[int] = None
    equipment_id: int
    equipment_name: str
    arrival_at: Optional[datetime] = None
    arrival_by_id: Optional[int] = None
    arrival_by_name: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    deleted_at: Optional[datetime] = None


class EquipmentFaultListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[EquipmentFaultResponse]
    total: int
    skip: int
    limit: int


class EquipmentRepairListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: list[EquipmentRepairResponse]
    total: int
    skip: int
    limit: int
