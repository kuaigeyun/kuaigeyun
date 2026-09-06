"""物料评审 Schema（R-15 #37）"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MaterialReviewLineIn(BaseModel):
    material_id: Optional[int] = None
    material_code: str = Field(..., min_length=1, max_length=80)
    material_name: str = Field(..., min_length=1, max_length=200)
    usage_status: str = Field(..., description="preferred/limited/forbidden")
    remarks: Optional[str] = Field(None, max_length=500)


class MaterialReviewLineOut(MaterialReviewLineIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    line_no: int


class MaterialReviewCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=1, max_length=200)
    review_code: Optional[str] = Field(None, max_length=50)
    remarks: Optional[str] = None
    lines: List[MaterialReviewLineIn] = Field(default_factory=list)


class MaterialReviewUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    remarks: Optional[str] = None
    lines: Optional[List[MaterialReviewLineIn]] = None


class MaterialReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    review_code: str
    project_id: int
    project_code: str
    project_name: str
    title: str
    status: str
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    lines: List[MaterialReviewLineOut] = Field(default_factory=list)


class MaterialReviewListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    review_code: str
    project_id: int
    project_code: str
    project_name: str
    title: str
    status: str
    line_count: int = 0
    created_at: datetime
    updated_at: datetime
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class MaterialReviewListResponse(BaseModel):
    items: List[MaterialReviewListItem]
    total: int
