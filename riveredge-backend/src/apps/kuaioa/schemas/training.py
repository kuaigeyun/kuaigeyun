"""培训 schemas。"""

from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class TrainingPlanCreate(BaseModel):
    plan_name: str = Field(..., max_length=200)
    plan_type: str = Field(default="quality", max_length=50)
    plan_year: Optional[int] = None
    department_name: Optional[str] = None
    planned_start_date: Optional[str] = None
    planned_end_date: Optional[str] = None
    due_date: Optional[str] = None
    source_application_id: Optional[int] = None
    description: Optional[str] = None
    reminder_days: int = 7


class TrainingPlanUpdate(BaseModel):
    plan_name: Optional[str] = Field(None, max_length=200)
    plan_type: Optional[str] = Field(None, max_length=50)
    plan_year: Optional[int] = None
    department_name: Optional[str] = None
    planned_start_date: Optional[str] = None
    planned_end_date: Optional[str] = None
    due_date: Optional[str] = None
    source_application_id: Optional[int] = None
    status: Optional[str] = None
    description: Optional[str] = None
    reminder_days: Optional[int] = None


class TrainingRecordCreate(BaseModel):
    plan_id: Optional[int] = None
    training_name: str = Field(..., max_length=200)
    record_kind: str = Field(default="production", max_length=30)
    trainee_id: Optional[int] = None
    trainee_name: Optional[str] = None
    trainer_name: Optional[str] = None
    training_date: Optional[str] = None
    due_date: Optional[str] = None
    theory_score: Optional[Decimal] = None
    practice_score: Optional[Decimal] = None
    is_passed: bool = False
    content_summary: Optional[str] = None
    attachment_file_uuid: Optional[str] = None
    template_id: Optional[int] = None
    notes: Optional[str] = None


class TrainingRecordUpdate(BaseModel):
    training_name: Optional[str] = Field(None, max_length=200)
    record_kind: Optional[str] = Field(None, max_length=30)
    trainee_id: Optional[int] = None
    trainee_name: Optional[str] = None
    trainer_name: Optional[str] = None
    training_date: Optional[str] = None
    due_date: Optional[str] = None
    theory_score: Optional[Decimal] = None
    practice_score: Optional[Decimal] = None
    is_passed: Optional[bool] = None
    status: Optional[str] = None
    content_summary: Optional[str] = None
    attachment_file_uuid: Optional[str] = None
    template_id: Optional[int] = None
    notes: Optional[str] = None


class WorkLicenseCreate(BaseModel):
    license_name: str = Field(..., max_length=200)
    license_type: str = Field(default="work", max_length=50)
    holder_id: Optional[int] = None
    holder_name: Optional[str] = None
    department_name: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    reminder_days: int = 30
    notes: Optional[str] = None


class WorkLicenseUpdate(BaseModel):
    license_name: Optional[str] = Field(None, max_length=200)
    license_type: Optional[str] = Field(None, max_length=50)
    holder_id: Optional[int] = None
    holder_name: Optional[str] = None
    department_name: Optional[str] = None
    issue_date: Optional[str] = None
    expiry_date: Optional[str] = None
    status: Optional[str] = None
    reminder_days: Optional[int] = None
    notes: Optional[str] = None


class DeptTrainingApplicationCreate(BaseModel):
    title: str = Field(..., max_length=200)
    plan_year: int
    department_name: Optional[str] = None
    training_content: Optional[str] = None
    notes: Optional[str] = None


class DeptTrainingApplicationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    plan_year: Optional[int] = None
    department_name: Optional[str] = None
    training_content: Optional[str] = None
    notes: Optional[str] = None


class SpecialWorkQualificationCreate(BaseModel):
    title: str = Field(..., max_length=200)
    qualification_year: int
    holder_id: Optional[int] = None
    holder_name: Optional[str] = None
    job_type: Optional[str] = None
    confirmation_content: Optional[str] = None
    department_name: Optional[str] = None
    notes: Optional[str] = None


class SpecialWorkQualificationUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    qualification_year: Optional[int] = None
    holder_id: Optional[int] = None
    holder_name: Optional[str] = None
    job_type: Optional[str] = None
    confirmation_content: Optional[str] = None
    department_name: Optional[str] = None
    notes: Optional[str] = None


class TrainingTemplateCreate(BaseModel):
    template_name: str = Field(..., max_length=200)
    template_kind: str = Field(..., max_length=30)
    content_body: Optional[str] = None
    is_active: bool = True
    notes: Optional[str] = None


class TrainingTemplateUpdate(BaseModel):
    template_name: Optional[str] = Field(None, max_length=200)
    template_kind: Optional[str] = Field(None, max_length=30)
    content_body: Optional[str] = None
    is_active: Optional[bool] = None
    notes: Optional[str] = None
