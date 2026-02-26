from __future__ import annotations
from typing import Optional, Any
from datetime import datetime
from pydantic import Field
from core.schemas.base import BaseSchema
from apps.kuaireport.constants import ReportStatus

class DashboardBase(BaseSchema):
    code: str = Field(..., max_length=50, description="看板编码")
    name: str = Field(..., max_length=100, description="看板名称")
    
    layout_config: Any | None = Field(None, description="布局配置")
    widgets_config: Any | None = Field(None, description="组件配置")
    theme_config: Any | None = Field(None, description="主题配置")
    
    status: ReportStatus = Field(ReportStatus.DRAFT, description="状态")
    description: str | None = Field(None, description="描述")
    thumbnail: str | None = Field(None, max_length=500, description="缩略图URL")

class DashboardCreate(DashboardBase):
    pass

class DashboardUpdate(BaseSchema):
    name: str | None = Field(None, max_length=100)
    layout_config: Any | None = None
    widgets_config: Any | None = None
    theme_config: Any | None = None
    status: ReportStatus | None = None
    description: str | None = None
    thumbnail: str | None = None

class DashboardResponse(DashboardBase):
    id: int
    uuid: str
    tenant_id: int
    created_by: int | None = None
    updated_by: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class DashboardListResponse(BaseSchema):
    data: list[DashboardResponse]
    total: int
    success: bool = True
