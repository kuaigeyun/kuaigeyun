"""生产日报 schemas。"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductionDailyFieldDef(BaseModel):
    key: str = Field(..., min_length=1, max_length=64)
    label: str = Field(..., min_length=1, max_length=100)
    type: str = Field(default="text", description="text/number/textarea/select")
    required: bool = False
    options: Optional[List[str]] = None


class ProductionDailyTemplateCreate(BaseModel):
    template_code: Optional[str] = Field(None, max_length=50)
    template_name: str = Field(..., max_length=200)
    description: Optional[str] = None
    field_schema: List[ProductionDailyFieldDef] = Field(default_factory=list)
    sort_order: int = 0
    is_active: bool = True


class ProductionDailyTemplateUpdate(BaseModel):
    template_name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    field_schema: Optional[List[ProductionDailyFieldDef]] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None


class ProductionDailyTemplateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    template_code: str
    template_name: str
    description: Optional[str] = None
    field_schema: List[Any] = Field(default_factory=list)
    sort_order: int = 0
    is_active: bool = True
    is_system: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class ProductionDailyTemplateListResponse(BaseModel):
    items: List[ProductionDailyTemplateResponse]
    total: int


class ProductionDailyReportCreate(BaseModel):
    template_id: int
    report_date: date
    team_name: Optional[str] = None
    shift_name: Optional[str] = None
    workshop_name: Optional[str] = None
    plant_name: Optional[str] = None
    field_values: dict[str, Any] = Field(default_factory=dict)
    remarks: Optional[str] = None
    submit: bool = False


class ProductionDailyReportUpdate(BaseModel):
    report_date: Optional[date] = None
    team_name: Optional[str] = None
    shift_name: Optional[str] = None
    workshop_name: Optional[str] = None
    plant_name: Optional[str] = None
    field_values: Optional[dict[str, Any]] = None
    remarks: Optional[str] = None


class ProductionDailyReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    code: str
    template_id: int
    template_code: str
    template_name: str
    report_date: date
    team_name: Optional[str] = None
    shift_name: Optional[str] = None
    workshop_name: Optional[str] = None
    plant_name: Optional[str] = None
    field_values: dict[str, Any] = Field(default_factory=dict)
    status: str
    submitted_at: Optional[datetime] = None
    remarks: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class ProductionDailyReportListResponse(BaseModel):
    items: List[ProductionDailyReportResponse]
    total: int
