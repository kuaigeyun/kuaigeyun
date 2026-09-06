"""R-05 质量投诉总批次月录入 Schema。"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class QualityComplaintBatchMonthUpsert(BaseModel):
    year_month: str = Field(..., min_length=7, max_length=7, description="YYYY-MM")
    total_batch_count: int = Field(..., ge=0)
    remarks: Optional[str] = Field(None, max_length=500)


class QualityComplaintBatchMonthResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    year_month: str
    total_batch_count: int
    remarks: Optional[str] = None
    created_by_name: Optional[str] = None
    updated_by_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class QualityComplaintBatchMonthListResponse(BaseModel):
    data: List[QualityComplaintBatchMonthResponse] = Field(default_factory=list)
    total: int = 0
    success: bool = True
