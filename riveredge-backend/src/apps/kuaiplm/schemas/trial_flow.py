"""试流 Schema（R-08）"""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class TrialFlowMaterialLineIn(BaseModel):
    material_id: Optional[int] = None
    material_code: str = Field(..., min_length=1, max_length=80)
    material_name: str = Field(..., min_length=1, max_length=200)
    qty: Optional[Decimal] = None
    unit: Optional[str] = Field(None, max_length=20)
    remarks: Optional[str] = Field(None, max_length=500)


class TrialFlowMaterialLineOut(TrialFlowMaterialLineIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    line_no: int


class TrialFlowStepOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    step_key: str
    step_name: str
    dept_code: str
    sort_order: int
    status: str
    result: Optional[str] = None
    result_notes: Optional[str] = None
    filled_by: Optional[int] = None
    filled_by_name: Optional[str] = None
    filled_at: Optional[datetime] = None


class TrialFlowCreate(BaseModel):
    project_id: int
    business_type: str = Field(..., description="component/structure/complete")
    title: str = Field(..., min_length=1, max_length=200)
    trial_code: Optional[str] = Field(None, max_length=50)
    remarks: Optional[str] = None
    materials: List[TrialFlowMaterialLineIn] = Field(default_factory=list)


class TrialFlowUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    remarks: Optional[str] = None
    materials: Optional[List[TrialFlowMaterialLineIn]] = None


class TrialFlowStepFill(BaseModel):
    result: str = Field(..., description="pass/fail/na")
    result_notes: Optional[str] = None


class TrialFlowConclude(BaseModel):
    conclusion: str = Field(..., description="pass/fail/conditional")
    conclusion_summary: Optional[str] = None


class TrialFlowResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: UUID
    id: int
    trial_code: str
    project_id: int
    project_code: str
    project_name: str
    business_type: str
    title: str
    status: str
    current_step_key: Optional[str] = None
    conclusion: Optional[str] = None
    conclusion_summary: Optional[str] = None
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    concluded_at: Optional[datetime] = None
    closed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    materials: List[TrialFlowMaterialLineOut] = Field(default_factory=list)
    steps: List[TrialFlowStepOut] = Field(default_factory=list)


class TrialFlowListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    uuid: UUID
    id: int
    trial_code: str
    project_id: int
    project_code: str
    project_name: str
    business_type: str
    title: str
    status: str
    current_step_key: Optional[str] = None
    conclusion: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None


class TrialFlowListResponse(BaseModel):
    items: List[TrialFlowListItem]
    total: int
