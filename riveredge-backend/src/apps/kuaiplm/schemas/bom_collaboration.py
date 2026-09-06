"""BOM 协同 Schema（R-15 #65）"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class BomCollabLineIn(BaseModel):
    material_id: Optional[int] = None
    material_code: str = Field(..., min_length=1, max_length=80)
    material_name: str = Field(..., min_length=1, max_length=200)
    qty: Optional[Decimal] = None
    unit: Optional[str] = Field(None, max_length=20)
    remarks: Optional[str] = Field(None, max_length=500)


class BomCollabLineOut(BomCollabLineIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    section: str
    line_no: int


class BomCollabCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=1, max_length=200)
    collab_code: Optional[str] = Field(None, max_length=50)
    remarks: Optional[str] = None
    electronics_lines: List[BomCollabLineIn] = Field(default_factory=list)
    structure_lines: List[BomCollabLineIn] = Field(default_factory=list)


class BomCollabUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    remarks: Optional[str] = None


class BomCollabSectionUpdate(BaseModel):
    lines: List[BomCollabLineIn] = Field(default_factory=list)


class BomCollabEnter(BaseModel):
    master_bom_id: Optional[int] = None
    master_bom_code: Optional[str] = Field(None, max_length=80)


class BomCollabResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    collab_code: str
    project_id: int
    project_code: str
    project_name: str
    title: str
    status: str
    electronics_status: str
    structure_status: str
    remarks: Optional[str] = None
    master_bom_id: Optional[int] = None
    master_bom_code: Optional[str] = None
    entered_by: Optional[int] = None
    entered_by_name: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    entered_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    electronics_lines: List[BomCollabLineOut] = Field(default_factory=list)
    structure_lines: List[BomCollabLineOut] = Field(default_factory=list)


class BomCollabListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    collab_code: str
    project_id: int
    project_code: str
    project_name: str
    title: str
    status: str
    electronics_status: str
    structure_status: str
    electronics_line_count: int = 0
    structure_line_count: int = 0
    created_at: datetime
    updated_at: datetime
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class BomCollabListResponse(BaseModel):
    items: List[BomCollabListItem]
    total: int


class BomCollabFormProfileSection(BaseModel):
    key: str
    label: str
    sort: int = 0
    active: bool = True


class BomCollabFormProfile(BaseModel):
    sections: List[BomCollabFormProfileSection] = Field(default_factory=list)
