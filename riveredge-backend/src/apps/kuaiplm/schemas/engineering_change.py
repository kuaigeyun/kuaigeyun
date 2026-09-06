"""工程变更 Schema（R-04 / ECN）"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class EcnMaterialLineIn(BaseModel):
    material_id: Optional[int] = None
    material_code: str = Field(..., min_length=1, max_length=80)
    material_name: str = Field(..., min_length=1, max_length=200)
    before_desc: Optional[str] = Field(None, max_length=500)
    after_desc: Optional[str] = Field(None, max_length=500)
    stock_qty: Optional[Decimal] = None
    unit_price: Optional[Decimal] = None
    cost_amount: Optional[Decimal] = None
    disposition: Optional[str] = Field(None, max_length=20)
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    remarks: Optional[str] = Field(None, max_length=500)


class EcnMaterialLineOut(EcnMaterialLineIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    line_no: int


class EcnSignoffOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    dept_code: str
    dept_name: str
    sort_order: int
    status: str
    result: Optional[str] = None
    signer_id: Optional[int] = None
    signer_name: Optional[str] = None
    signed_at: Optional[datetime] = None
    notes: Optional[str] = None


class EngineeringChangeCreate(BaseModel):
    change_kind: str = Field(..., description="material/process/drawing/other")
    title: str = Field(..., min_length=1, max_length=200)
    project_id: Optional[int] = None
    ecn_code: Optional[str] = Field(None, max_length=50)
    change_reason: Optional[str] = None
    remarks: Optional[str] = None
    materials: List[EcnMaterialLineIn] = Field(default_factory=list)


class EngineeringChangeUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    change_reason: Optional[str] = None
    remarks: Optional[str] = None
    materials: Optional[List[EcnMaterialLineIn]] = None


class EngineeringChangeErpAudit(BaseModel):
    erp_ecn_no: str = Field(..., min_length=1, max_length=80)
    result: str = Field(..., description="pass/fail")
    notes: Optional[str] = None


class EngineeringChangeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: UUID
    id: int
    ecn_code: str
    project_id: Optional[int] = None
    project_code: Optional[str] = None
    project_name: Optional[str] = None
    change_kind: str
    title: str
    change_reason: Optional[str] = None
    status: str
    erp_ecn_no: Optional[str] = None
    erp_audit_status: Optional[str] = None
    erp_audit_notes: Optional[str] = None
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    materials: List[EcnMaterialLineOut] = Field(default_factory=list)
    signoffs: List[EcnSignoffOut] = Field(default_factory=list)


class EngineeringChangeListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: UUID
    id: int
    ecn_code: str
    project_id: Optional[int] = None
    project_code: Optional[str] = None
    project_name: Optional[str] = None
    change_kind: str
    title: str
    status: str
    erp_ecn_no: Optional[str] = None
    erp_audit_status: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class EngineeringChangeListResponse(BaseModel):
    items: List[EngineeringChangeListItem]
    total: int
