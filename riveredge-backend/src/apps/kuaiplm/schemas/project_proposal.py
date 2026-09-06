"""项目建议书 Schema（R-15 #68）"""

from __future__ import annotations

from datetime import date, datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectProposalCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=1, max_length=200)
    proposal_code: Optional[str] = Field(None, max_length=50)
    summary: Optional[str] = None
    customer_name: Optional[str] = Field(None, max_length=200)
    expected_date: Optional[date] = None
    supplier_id: Optional[int] = None
    supplier_code: Optional[str] = Field(None, max_length=80)
    supplier_name: Optional[str] = Field(None, max_length=200)
    supplier_contact: Optional[str] = Field(None, max_length=200)
    supplier_remark: Optional[str] = None
    remarks: Optional[str] = None


class ProjectProposalUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    summary: Optional[str] = None
    customer_name: Optional[str] = Field(None, max_length=200)
    expected_date: Optional[date] = None
    remarks: Optional[str] = None


class ProjectProposalSupplierFill(BaseModel):
    supplier_id: Optional[int] = None
    supplier_code: Optional[str] = Field(None, max_length=80)
    supplier_name: str = Field(..., min_length=1, max_length=200)
    supplier_contact: Optional[str] = Field(None, max_length=200)
    supplier_remark: Optional[str] = None


class ProjectProposalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    proposal_code: str
    project_id: int
    project_code: str
    project_name: str
    title: str
    summary: Optional[str] = None
    customer_name: Optional[str] = None
    expected_date: Optional[date] = None
    supplier_id: Optional[int] = None
    supplier_code: Optional[str] = None
    supplier_name: Optional[str] = None
    supplier_contact: Optional[str] = None
    supplier_remark: Optional[str] = None
    status: str
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    issued_at: Optional[datetime] = None
    issued_by: Optional[int] = None
    issued_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None


class ProjectProposalListResponse(BaseModel):
    items: List[ProjectProposalResponse]
    total: int
