"""设备换线绑定 schemas（R-10 WP-10.7）。"""

from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from apps.kuaizhizao.schemas.equipment_ops import AuditActorFields


class EquipmentLineRebindCreate(BaseModel):
    production_line_id: int = Field(..., description="目标产线ID")
    force_spot_overdue_hours: int = Field(default=4, ge=1, le=720)
    remark: Optional[str] = None
    equipment_ids: Optional[List[int]] = Field(
        None, description="创建时预置设备（可空，后续扫码追加）"
    )


class EquipmentLineRebindScanRequest(BaseModel):
    scan_code: str = Field(..., min_length=1, description="扫码原文或设备编码")


class EquipmentLineRebindAddRequest(BaseModel):
    equipment_id: int = Field(..., description="设备ID")


class EquipmentLineRebindItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rebind_id: int
    equipment_id: int
    equipment_uuid: str
    equipment_code: Optional[str] = None
    equipment_name: Optional[str] = None
    from_production_line_id: Optional[int] = None
    from_production_line_code: Optional[str] = None
    from_production_line_name: Optional[str] = None
    scanned_at: datetime
    force_spot_cleared_at: Optional[datetime] = None


class EquipmentLineRebindResponse(AuditActorFields):
    model_config = ConfigDict(from_attributes=True)

    id: int
    uuid: str
    tenant_id: int
    document_no: str
    production_line_id: int
    production_line_code: Optional[str] = None
    production_line_name: Optional[str] = None
    force_spot_overdue_hours: int
    status: str
    completed_at: Optional[datetime] = None
    completed_by: Optional[int] = None
    completed_by_name: Optional[str] = None
    remark: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    items: Optional[List[EquipmentLineRebindItemResponse]] = None
    item_count: Optional[int] = None


class EquipmentLineRebindListResponse(BaseModel):
    items: List[EquipmentLineRebindResponse]
    total: int
    skip: int
    limit: int
