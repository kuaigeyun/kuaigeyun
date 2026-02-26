"""
工装 Schema 模块

定义工装及其生命周期记录相关的 Pydantic Schema。

Author: Antigravity
Date: 2026-02-02
"""

from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator


# --- 工装基础 ---

class ToolBase(BaseModel):
    code: str | None = Field(None, max_length=50, description="工装编码")
    name: str = Field(..., max_length=200, description="工装名称")
    type: str | None = Field(None, max_length=50, description="类型")
    spec: str | None = Field(None, max_length=200, description="规格型号")
    
    manufacturer: str | None = Field(None, max_length=200, description="制造商")
    supplier: str | None = Field(None, max_length=200, description="供应商")
    purchase_date: date | None = Field(None, description="采购日期")
    warranty_expiry: date | None = Field(None, description="保修到期日")
    
    status: str = Field(default="正常", description="状态（正常、领用中、维修中、校验中、停用、报废）")
    is_active: bool = Field(default=True)
    
    maintenance_period: int | None = Field(None, description="保养周期（天）")
    needs_calibration: bool = Field(default=False)
    calibration_period: int | None = Field(None, description="校验周期（天）")
    
    description: str | None = Field(None)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        allowed = ["正常", "领用中", "维修中", "校验中", "停用", "报废"]
        if v not in allowed:
            raise ValueError(f"状态必须是 {allowed} 之一")
        return v


class ToolCreate(ToolBase):
    pass


class ToolUpdate(BaseModel):
    code: str | None = None
    name: str | None = None
    type: str | None = None
    spec: str | None = None
    status: str | None = None
    is_active: bool | None = None
    maintenance_period: int | None = None
    needs_calibration: bool | None = None
    calibration_period: int | None = None
    description: str | None = None


class ToolResponse(ToolBase):
    model_config = ConfigDict(from_attributes=True)
    
    uuid: str
    id: int
    tenant_id: int
    last_maintenance_date: date | None = None
    next_maintenance_date: date | None = None
    last_calibration_date: date | None = None
    next_calibration_date: date | None = None
    total_usage_count: int
    created_at: datetime
    updated_at: datetime


# --- 领用记录 ---

class ToolUsageBase(BaseModel):
    tool_uuid: str
    usage_no: str | None = Field(None, description="领用单号")
    operator_id: int | None = None
    operator_name: str | None = None
    department_name: str | None = None
    source_type: str | None = None
    source_no: str | None = None
    checkout_date: datetime = Field(default_factory=datetime.now)
    checkin_date: datetime | None = None
    status: str = Field(default="使用中")
    remark: str | None = None


class ToolUsageCreate(ToolUsageBase):
    pass


class ToolUsageResponse(ToolUsageBase):
    model_config = ConfigDict(from_attributes=True)
    uuid: str
    id: int
    tenant_id: int
    created_at: datetime


# --- 维保记录 ---

class ToolMaintenanceBase(BaseModel):
    tool_uuid: str
    maintenance_type: str = Field(..., description="日常保养、定期保养、故障维修")
    maintenance_date: date
    executor: str | None = None
    content: str | None = None
    result: str = Field(default="完成")
    cost: float = Field(default=0.0)
    remark: str | None = None


class ToolMaintenanceCreate(ToolMaintenanceBase):
    pass


class ToolMaintenanceResponse(ToolMaintenanceBase):
    model_config = ConfigDict(from_attributes=True)
    uuid: str
    id: int
    created_at: datetime


# --- 校验记录 ---

class ToolCalibrationBase(BaseModel):
    tool_uuid: str
    calibration_date: date
    calibration_org: str | None = None
    certificate_no: str | None = None
    result: str = Field(..., description="合格、不合格、准用")
    expiry_date: date | None = None
    attachment_uuid: str | None = None
    remark: str | None = None


class ToolCalibrationCreate(ToolCalibrationBase):
    pass


class ToolCalibrationResponse(ToolCalibrationBase):
    model_config = ConfigDict(from_attributes=True)
    uuid: str
    id: int
    created_at: datetime


# --- 列表包装 ---

class ToolListResponse(BaseModel):
    items: list[ToolResponse]
    total: int


class ToolUsageListResponse(BaseModel):
    items: list[ToolUsageResponse]
    total: int
    skip: int = 0
    limit: int = 100


class ToolMaintenanceListResponse(BaseModel):
    items: list[ToolMaintenanceResponse]
    total: int
    skip: int = 0
    limit: int = 100


class ToolCalibrationListResponse(BaseModel):
    items: list[ToolCalibrationResponse]
    total: int
    skip: int = 0
    limit: int = 100
