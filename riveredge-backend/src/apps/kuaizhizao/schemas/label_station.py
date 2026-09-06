"""标签工位 schemas（R-16）。"""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class LabelModelConfigCreate(BaseModel):
    model_code: Optional[str] = Field(None, max_length=80)
    model_name: str = Field(..., max_length=200)
    template_uuid: str = Field(..., max_length=36)
    template_version: Optional[int] = None
    qty_per_box: int = Field(1, ge=1)
    print_copies: int = Field(1, ge=1)
    device_uuid: Optional[str] = None
    validation_hooks: Optional[List[str]] = None
    policy_config: Optional[Dict[str, Any]] = None
    is_active: bool = True
    remarks: Optional[str] = None


class LabelModelConfigUpdate(BaseModel):
    model_name: Optional[str] = Field(None, max_length=200)
    template_uuid: Optional[str] = Field(None, max_length=36)
    template_version: Optional[int] = None
    qty_per_box: Optional[int] = Field(None, ge=1)
    print_copies: Optional[int] = Field(None, ge=1)
    device_uuid: Optional[str] = None
    validation_hooks: Optional[List[str]] = None
    policy_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    remarks: Optional[str] = None


class LabelStationCreate(BaseModel):
    station_code: Optional[str] = Field(None, max_length=50)
    station_name: str = Field(..., max_length=200)
    model_config_id: Optional[int] = None
    default_mode: str = "work"
    device_uuid: Optional[str] = None
    unlock_requires_password: bool = False
    is_active: bool = True
    remarks: Optional[str] = None


class LabelStationUpdate(BaseModel):
    station_name: Optional[str] = Field(None, max_length=200)
    model_config_id: Optional[int] = None
    default_mode: Optional[str] = None
    device_uuid: Optional[str] = None
    unlock_requires_password: Optional[bool] = None
    is_active: Optional[bool] = None
    remarks: Optional[str] = None


class LabelSessionOpen(BaseModel):
    station_id: int
    mode: Optional[str] = "work"
    model_config_id: Optional[int] = None


class LabelScanRequest(BaseModel):
    session_id: int
    barcode: str = Field(..., min_length=1, max_length=200)
    manual: bool = False


class LabelUnlockRequest(BaseModel):
    session_id: int
    reason: Optional[str] = None
    confirm_password: Optional[str] = None


class LabelLockRequest(BaseModel):
    session_id: int
    reason: str = Field(..., min_length=1, max_length=200)


class LabelUnbindRequest(BaseModel):
    box_id: int
    barcode: Optional[str] = None
    reason: Optional[str] = None


class LabelReprintRequest(BaseModel):
    box_id: int


class LabelCleanupRequest(BaseModel):
    before_at: str = Field(..., description="站点墙钟或可解析业务时刻")


class LabelStationSnapshot(BaseModel):
    session: Dict[str, Any]
    station: Dict[str, Any]
    model: Optional[Dict[str, Any]] = None
    current_box: Optional[Dict[str, Any]] = None
    items: List[Dict[str, Any]] = []
