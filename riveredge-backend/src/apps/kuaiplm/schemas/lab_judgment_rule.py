"""实验判定规则 Schema（R-02）。"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class LabJudgmentRuleBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rule_name: str = Field(..., max_length=200)
    version: str = Field("1", max_length=40)
    compare_type: str = Field("range", max_length=20)
    standard_min: Optional[str] = Field(None, max_length=80)
    standard_max: Optional[str] = Field(None, max_length=80)
    standard_value: Optional[str] = Field(None, max_length=80)
    unit: Optional[str] = Field(None, max_length=40)
    item_name: Optional[str] = Field(None, max_length=200)
    is_active: bool = True
    remarks: Optional[str] = None


class LabJudgmentRuleCreate(LabJudgmentRuleBase):
    rule_code: Optional[str] = Field(None, max_length=50)


class LabJudgmentRuleUpdate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    rule_name: Optional[str] = Field(None, max_length=200)
    compare_type: Optional[str] = Field(None, max_length=20)
    standard_min: Optional[str] = Field(None, max_length=80)
    standard_max: Optional[str] = Field(None, max_length=80)
    standard_value: Optional[str] = Field(None, max_length=80)
    unit: Optional[str] = Field(None, max_length=40)
    item_name: Optional[str] = Field(None, max_length=200)
    is_active: Optional[bool] = None
    remarks: Optional[str] = None


class LabJudgmentRuleReviseRequest(BaseModel):
    """升版：复制当前规则为新版本（默认停用旧版）。"""

    version: Optional[str] = Field(None, max_length=40, description="新版本号；空则自增")
    deactivate_previous: bool = True
    rule_name: Optional[str] = Field(None, max_length=200)
    compare_type: Optional[str] = Field(None, max_length=20)
    standard_min: Optional[str] = Field(None, max_length=80)
    standard_max: Optional[str] = Field(None, max_length=80)
    standard_value: Optional[str] = Field(None, max_length=80)
    unit: Optional[str] = Field(None, max_length=40)
    item_name: Optional[str] = Field(None, max_length=200)
    remarks: Optional[str] = None


class LabJudgmentRuleResponse(LabJudgmentRuleBase):
    id: int
    uuid: str
    rule_code: str
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class LabJudgmentRuleListResponse(BaseModel):
    data: List[LabJudgmentRuleResponse] = Field(default_factory=list)
    total: int = 0
    success: bool = True


class LabJudgmentRuleOption(BaseModel):
    id: int
    rule_code: str
    rule_name: str
    version: str
    compare_type: str
    standard_min: Optional[str] = None
    standard_max: Optional[str] = None
    standard_value: Optional[str] = None
    unit: Optional[str] = None
    item_name: Optional[str] = None
    label: str
