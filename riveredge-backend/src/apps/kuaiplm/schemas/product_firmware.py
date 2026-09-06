"""产品固件 Schema（R-15 #28）"""

from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProductFirmwareCreate(BaseModel):
    project_id: int = Field(..., description="研发项目ID")
    version: str = Field(..., min_length=1, max_length=50)
    title: str = Field(..., min_length=1, max_length=200)
    release_date: Optional[date] = None
    firmware_code: Optional[str] = Field(None, max_length=50)
    file_uuid: Optional[str] = Field(None, max_length=36)
    file_name: Optional[str] = Field(None, max_length=200)
    checksum: Optional[str] = Field(None, max_length=128)
    change_summary: Optional[str] = None
    remarks: Optional[str] = None


class ProductFirmwareUpdate(BaseModel):
    version: Optional[str] = Field(None, min_length=1, max_length=50)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    release_date: Optional[date] = None
    file_uuid: Optional[str] = Field(None, max_length=36)
    file_name: Optional[str] = Field(None, max_length=200)
    checksum: Optional[str] = Field(None, max_length=128)
    change_summary: Optional[str] = None
    remarks: Optional[str] = None


class ProductFirmwareResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: UUID
    firmware_code: str
    project_id: int
    project_code: str
    project_name: str
    version: str
    title: str
    release_date: Optional[date] = None
    status: str
    file_uuid: Optional[str] = None
    file_name: Optional[str] = None
    checksum: Optional[str] = None
    change_summary: Optional[str] = None
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    released_at: Optional[datetime] = None
    obsolete_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None


class ProductFirmwareListResponse(BaseModel):
    items: List[ProductFirmwareResponse]
    total: int
