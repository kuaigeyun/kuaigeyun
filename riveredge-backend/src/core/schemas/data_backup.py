"""
数据备份 Schema 模块
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class DataBackupBase(BaseModel):
    name: str = Field(..., description="备份名称")
    backup_type: str = Field("full", description="备份类型 (full, incremental)")
    backup_scope: str = Field("all", description="备份范围 (all, tenant, table)")
    backup_tables: list[str] | None = Field(None, description="备份的表列表")


class DataBackupCreate(DataBackupBase):
    pass


class DataBackupResponse(DataBackupBase):
    uuid: str
    tenant_id: int | None
    file_path: str | None = None
    file_uuid: str | None = None
    file_size: int | None = None
    status: str
    inngest_run_id: str | None = None
    started_at: datetime | None = None
    completed_at: datetime | None = None
    error_message: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DataBackupListResponse(BaseModel):
    items: list[DataBackupResponse]
    total: int
    page: int
    page_size: int
