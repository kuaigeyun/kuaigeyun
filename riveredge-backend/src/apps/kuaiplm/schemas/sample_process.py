"""样品加工申请 Schema（R-15 #33）"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SampleProcessAttachment(BaseModel):
    attachment_type: str = Field(..., min_length=1, max_length=50)
    file_uuid: str = Field(..., min_length=1, max_length=36)
    file_name: Optional[str] = Field(None, max_length=200)


class SampleProcessCreate(BaseModel):
    project_id: int = Field(..., description="研发项目ID")
    request_kind: str = Field(default="general", max_length=30)
    title: str = Field(..., min_length=1, max_length=200)
    application_code: Optional[str] = Field(None, max_length=50)
    material_code: Optional[str] = Field(None, max_length=100)
    material_version: Optional[str] = Field(None, max_length=50)
    release_date: Optional[date] = None
    purpose: Optional[str] = None
    attachments: List[SampleProcessAttachment] = Field(default_factory=list)
    remarks: Optional[str] = None


class SampleProcessUpdate(BaseModel):
    request_kind: Optional[str] = Field(None, max_length=30)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    material_code: Optional[str] = Field(None, max_length=100)
    material_version: Optional[str] = Field(None, max_length=50)
    release_date: Optional[date] = None
    purpose: Optional[str] = None
    attachments: Optional[List[SampleProcessAttachment]] = None
    remarks: Optional[str] = None


class SampleProcessResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    application_code: str
    project_id: int
    project_code: str
    project_name: str
    request_kind: str
    title: str
    material_code: Optional[str] = None
    material_version: Optional[str] = None
    release_date: Optional[date] = None
    purpose: Optional[str] = None
    status: str
    attachments: List[Any] = Field(default_factory=list)
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


class SampleProcessListResponse(BaseModel):
    items: List[SampleProcessResponse]
    total: int


class SampleProcessFormProfile(BaseModel):
    """前端表单/列表消费的扩展 profile。"""

    request_kinds: List[Dict[str, Any]] = Field(default_factory=list)
    attachment_types: List[Dict[str, Any]] = Field(default_factory=list)
    field_labels: Dict[str, str] = Field(default_factory=dict)
    validation_rules: List[Dict[str, Any]] = Field(default_factory=list)
