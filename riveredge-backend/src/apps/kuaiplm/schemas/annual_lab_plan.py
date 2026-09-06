"""年度实验计划 Schema（R-07）。"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class AnnualLabPlanMonthBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    year_month: str = Field(..., max_length=7)
    month_no: int = Field(..., ge=1, le=12)
    title: Optional[str] = Field(None, max_length=200)
    month_status: str = "pending"
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    due_at: Optional[datetime] = None
    material_desc: Optional[str] = None
    issue_status: str = "none"
    lab_request_id: Optional[int] = None
    lab_request_code: Optional[str] = Field(None, max_length=50)
    report_file_uuid: Optional[str] = Field(None, max_length=36)
    report_url: Optional[str] = Field(None, max_length=500)
    defect_desc: Optional[str] = None
    treatment_result: Optional[str] = None
    remarks: Optional[str] = None


class AnnualLabPlanMonthInput(BaseModel):
    year_month: Optional[str] = Field(None, max_length=7)
    month_no: Optional[int] = Field(None, ge=1, le=12)
    title: Optional[str] = Field(None, max_length=200)
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    due_at: Optional[datetime] = None
    material_desc: Optional[str] = None
    remarks: Optional[str] = None


class AnnualLabPlanMonthUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    month_status: Optional[str] = Field(None, max_length=30)
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    due_at: Optional[datetime] = None
    material_desc: Optional[str] = None
    lab_request_id: Optional[int] = None
    lab_request_code: Optional[str] = Field(None, max_length=50)
    report_file_uuid: Optional[str] = Field(None, max_length=36)
    report_url: Optional[str] = Field(None, max_length=500)
    defect_desc: Optional[str] = None
    treatment_result: Optional[str] = None
    remarks: Optional[str] = None


class AnnualLabPlanMonthResponse(AnnualLabPlanMonthBase):
    id: int
    uuid: str
    plan_id: int
    issue_submitted_at: Optional[datetime] = None
    issue_approved_at: Optional[datetime] = None
    issue_reject_reason: Optional[str] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class AnnualLabPlanCreate(BaseModel):
    plan_code: Optional[str] = Field(None, max_length=50)
    plan_year: int = Field(..., ge=2000, le=2100)
    title: str = Field(..., max_length=200)
    plan_file_uuid: Optional[str] = Field(None, max_length=36)
    plan_file_name: Optional[str] = Field(None, max_length=255)
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    remarks: Optional[str] = None
    months: Optional[List[AnnualLabPlanMonthInput]] = None


class AnnualLabPlanUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    plan_file_uuid: Optional[str] = Field(None, max_length=36)
    plan_file_name: Optional[str] = Field(None, max_length=255)
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = Field(None, max_length=100)
    remarks: Optional[str] = None
    months: Optional[List[AnnualLabPlanMonthInput]] = None


class AnnualLabPlanRejectRequest(BaseModel):
    reason: str = Field(..., min_length=1)


class AnnualLabPlanIssueRejectRequest(BaseModel):
    reason: str = Field(..., min_length=1)


class AnnualLabPlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    plan_code: str
    plan_year: int
    title: str
    status: str
    plan_file_uuid: Optional[str] = None
    plan_file_name: Optional[str] = None
    owner_user_id: Optional[int] = None
    owner_user_name: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    approved_by: Optional[int] = None
    approved_by_name: Optional[str] = None
    rejected_at: Optional[datetime] = None
    reject_reason: Optional[str] = None
    closed_at: Optional[datetime] = None
    remarks: Optional[str] = None
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    months: List[AnnualLabPlanMonthResponse] = Field(default_factory=list)
    completed_months: int = 0
    total_months: int = 0


class AnnualLabPlanListResponse(BaseModel):
    data: List[AnnualLabPlanResponse] = Field(default_factory=list)
    total: int = 0
    success: bool = True
