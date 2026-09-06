"""设备工装验收 Schema。"""

from datetime import date, datetime
from typing import Any, List, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


TARGET_TYPES = ("equipment", "tool")
ACCEPTANCE_RESULTS = ("合格", "不合格", "延期异常")
ACCEPTANCE_STATUSES = ("草稿", "已提交", "已批准", "已驳回")


class EquipmentAcceptanceBase(BaseModel):
    target_type: str = Field(..., description="equipment 或 tool")
    target_id: int = Field(..., description="设备或工装主键")
    category: Optional[str] = Field(None, max_length=100, description="验收分类")
    due_date: date = Field(..., description="要求完成验收时限")
    accepted_at: Optional[date] = Field(None, description="实际验收日期")
    result: Optional[str] = Field(None, description="验收结果")
    exception_problem: Optional[str] = Field(None, description="异常问题")
    solution: Optional[str] = Field(None, description="解决方案")
    handled_at: Optional[datetime] = Field(None, description="异常处理时间")
    attachments: Optional[List[dict]] = Field(None, description="验收单附件")
    remark: Optional[str] = Field(None, description="备注")

    @field_validator("target_type")
    @classmethod
    def validate_target_type(cls, v: str) -> str:
        raw = (v or "").strip().lower()
        if raw not in TARGET_TYPES:
            raise ValueError("target_type 仅支持 equipment 或 tool")
        return raw

    @field_validator("result")
    @classmethod
    def validate_result(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        if v not in ACCEPTANCE_RESULTS:
            raise ValueError("验收结果仅支持 合格/不合格/延期异常")
        return v


class EquipmentAcceptanceCreate(EquipmentAcceptanceBase):
    pass


class EquipmentAcceptanceUpdate(BaseModel):
    category: Optional[str] = Field(None, max_length=100)
    due_date: Optional[date] = None
    accepted_at: Optional[date] = None
    result: Optional[str] = None
    exception_problem: Optional[str] = None
    solution: Optional[str] = None
    handled_at: Optional[datetime] = None
    attachments: Optional[List[dict]] = None
    remark: Optional[str] = None

    @field_validator("result")
    @classmethod
    def validate_result(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        if v not in ACCEPTANCE_RESULTS:
            raise ValueError("验收结果仅支持 合格/不合格/延期异常")
        return v


class EquipmentAcceptanceResponse(EquipmentAcceptanceBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    tenant_id: int
    acceptance_no: str
    target_uuid: str
    target_code: Optional[str] = None
    target_name: Optional[str] = None
    applicant_id: Optional[int] = None
    applicant_name: Optional[str] = None
    status: str
    approver_id: Optional[int] = None
    approver_name: Optional[str] = None
    approved_at: Optional[datetime] = None
    reject_reason: Optional[str] = None
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    deleted_at: Optional[datetime] = None


class EquipmentAcceptanceListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    items: List[EquipmentAcceptanceResponse]
    total: int
    skip: int
    limit: int


class EquipmentAcceptanceRejectRequest(BaseModel):
    reject_reason: str = Field(..., min_length=1, description="驳回原因")
