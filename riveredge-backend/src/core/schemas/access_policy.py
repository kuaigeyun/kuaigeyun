from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, Field


class AccessPolicyBase(BaseModel):
    name: str = Field(..., max_length=120)
    effect: str = Field(default="allow")
    priority: int = Field(default=100)
    target_resource: str
    target_action: str
    condition_expr: dict[str, Any] | None = None
    enabled: bool = True
    bindings: list[dict[str, Any]] = Field(default_factory=list, description="绑定主体，格式: {subject_type, subject_id}")


class AccessPolicyCreate(AccessPolicyBase):
    pass


class AccessPolicyUpdate(BaseModel):
    name: str | None = None
    effect: str | None = None
    priority: int | None = None
    target_resource: str | None = None
    target_action: str | None = None
    condition_expr: dict[str, Any] | None = None
    enabled: bool | None = None
    bindings: list[dict[str, Any]] | None = None


class AccessPolicyResponse(AccessPolicyBase):
    uuid: str
    tenant_id: int
    created_at: datetime
    updated_at: datetime
