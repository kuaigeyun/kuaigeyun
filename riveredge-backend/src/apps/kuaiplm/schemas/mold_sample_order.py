"""开模合同 / 打样订单 Schema（R-15 #71）"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

DOC_KINDS = ("mold_contract", "sample_order")


class MoldSampleOrderCreate(BaseModel):
    project_id: int
    doc_kind: str = Field(..., min_length=1, max_length=32)
    title: str = Field(..., min_length=1, max_length=200)
    order_code: Optional[str] = Field(None, max_length=50)
    contract_no: Optional[str] = Field(None, max_length=80)
    party_name: Optional[str] = Field(None, max_length=200)
    file_uuid: Optional[str] = Field(None, max_length=36)
    file_name: Optional[str] = Field(None, max_length=200)
    remarks: Optional[str] = None


class MoldSampleOrderUpdate(BaseModel):
    doc_kind: Optional[str] = Field(None, min_length=1, max_length=32)
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    contract_no: Optional[str] = Field(None, max_length=80)
    party_name: Optional[str] = Field(None, max_length=200)
    file_uuid: Optional[str] = Field(None, max_length=36)
    file_name: Optional[str] = Field(None, max_length=200)
    remarks: Optional[str] = None


class MoldSampleOrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: UUID
    order_code: str
    project_id: int
    project_code: str
    project_name: str
    doc_kind: str
    title: str
    contract_no: Optional[str] = None
    party_name: Optional[str] = None
    file_uuid: Optional[str] = None
    file_name: Optional[str] = None
    status: str
    remarks: Optional[str] = None
    submitted_at: Optional[datetime] = None
    approved_at: Optional[datetime] = None
    sealed_at: Optional[datetime] = None
    sealed_by: Optional[int] = None
    sealed_by_name: Optional[str] = None
    archived_at: Optional[datetime] = None
    archived_by: Optional[int] = None
    archived_by_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    created_by: Optional[int] = None
    created_by_name: Optional[str] = None
    updated_by: Optional[int] = None
    updated_by_name: Optional[str] = None


class MoldSampleOrderListResponse(BaseModel):
    items: List[MoldSampleOrderResponse]
    total: int
