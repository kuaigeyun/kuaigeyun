"""
租户 Schema 模块

定义租户相关的 Pydantic Schema，用于 API 请求和响应的数据验证
"""

from datetime import datetime
from typing import Optional, Dict, Any

from pydantic import BaseModel, Field, ConfigDict

from models.tenant import TenantStatus, TenantPlan


class TenantBase(BaseModel):
    """
    租户基础 Schema
    
    包含租户的通用字段定义
    
    Attributes:
        name: 租户名称
        domain: 租户域名
        status: 租户状态
        plan: 租户套餐
        settings: 租户配置
        max_users: 最大用户数限制
        max_storage: 最大存储空间限制（MB）
        expires_at: 过期时间（可选）
    """
    
    name: str = Field(..., min_length=1, max_length=100, description="租户名称")
    domain: str = Field(..., min_length=1, max_length=100, description="租户域名（用于子域名访问）")
    status: TenantStatus = Field(default=TenantStatus.INACTIVE, description="租户状态")
    plan: TenantPlan = Field(default=TenantPlan.BASIC, description="租户套餐")
    settings: Dict[str, Any] = Field(default_factory=dict, description="租户配置（JSONB 存储）")
    max_users: int = Field(default=10, ge=1, description="最大用户数限制")
    max_storage: int = Field(default=1024, ge=0, description="最大存储空间限制（MB）")
    expires_at: Optional[datetime] = Field(default=None, description="过期时间（可选）")


class TenantCreate(TenantBase):
    """
    租户创建 Schema
    
    用于创建新租户时的数据验证
    
    Attributes:
        name: 租户名称（必填）
        domain: 租户域名（必填，全局唯一）
        status: 租户状态（可选，默认 inactive）
        plan: 租户套餐（可选，默认 basic）
        settings: 租户配置（可选，默认空字典）
        max_users: 最大用户数限制（可选，默认 10）
        max_storage: 最大存储空间限制（可选，默认 1024 MB）
        expires_at: 过期时间（可选）
    """
    pass


class TenantUpdate(BaseModel):
    """
    租户更新 Schema
    
    用于更新租户信息时的数据验证。
    所有字段都是可选的，只更新提供的字段。
    
    Attributes:
        name: 租户名称（可选）
        domain: 租户域名（可选）
        status: 租户状态（可选）
        plan: 租户套餐（可选）
        settings: 租户配置（可选）
        max_users: 最大用户数限制（可选）
        max_storage: 最大存储空间限制（可选）
        expires_at: 过期时间（可选）
    """
    
    name: Optional[str] = Field(None, min_length=1, max_length=100, description="租户名称")
    domain: Optional[str] = Field(None, min_length=1, max_length=100, description="租户域名")
    status: Optional[TenantStatus] = Field(None, description="租户状态")
    plan: Optional[TenantPlan] = Field(None, description="租户套餐")
    settings: Optional[Dict[str, Any]] = Field(None, description="租户配置")
    max_users: Optional[int] = Field(None, ge=1, description="最大用户数限制")
    max_storage: Optional[int] = Field(None, ge=0, description="最大存储空间限制（MB）")
    expires_at: Optional[datetime] = Field(None, description="过期时间")


class TenantResponse(TenantBase):
    """
    租户响应 Schema
    
    用于 API 响应时的数据序列化
    
    Attributes:
        id: 租户 ID
        name: 租户名称
        domain: 租户域名
        status: 租户状态
        plan: 租户套餐
        settings: 租户配置
        max_users: 最大用户数限制
        max_storage: 最大存储空间限制（MB）
        expires_at: 过期时间（可选）
        created_at: 创建时间
        updated_at: 更新时间
    """
    
    id: int = Field(..., description="租户 ID")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")
    
    model_config = ConfigDict(from_attributes=True)


class TenantListResponse(BaseModel):
    """
    租户列表响应 Schema
    
    用于分页列表响应
    
    Attributes:
        items: 租户列表
        total: 总数量
        page: 当前页码
        page_size: 每页数量
    """
    
    items: list[TenantResponse] = Field(..., description="租户列表")
    total: int = Field(..., description="总数量")
    page: int = Field(..., description="当前页码")
    page_size: int = Field(..., description="每页数量")

