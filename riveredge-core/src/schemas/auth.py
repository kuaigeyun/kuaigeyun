"""
认证 Schema 模块

定义认证相关的 Pydantic Schema，用于登录、注册等认证操作
"""

from typing import Optional, List

from pydantic import BaseModel, Field, EmailStr


class LoginRequest(BaseModel):
    """
    登录请求 Schema
    
    用于用户登录的请求数据。
    
    Attributes:
        username: 用户名（符合中国用户使用习惯，仅支持用户名登录）
        password: 密码
        tenant_id: 租户 ID（可选，如果提供则直接设置租户上下文）
    """
    
    username: str = Field(..., min_length=1, max_length=255, description="用户名（符合中国用户使用习惯）")
    password: str = Field(..., min_length=1, max_length=100, description="密码")
    tenant_id: Optional[int] = Field(None, description="租户 ID（可选，如果提供则直接设置租户上下文）")


class TenantInfo(BaseModel):
    """
    租户信息 Schema
    
    用于返回租户的基本信息。
    
    Attributes:
        id: 租户 ID
        name: 租户名称
        domain: 租户域名
        status: 租户状态
    """
    
    id: int = Field(..., description="租户 ID")
    name: str = Field(..., description="租户名称")
    domain: str = Field(..., description="租户域名")
    status: str = Field(..., description="租户状态")


class LoginResponse(BaseModel):
    """
    登录响应 Schema
    
    用于返回登录成功的响应数据。
    
    Attributes:
        access_token: JWT 访问令牌
        token_type: 令牌类型（通常为 "bearer"）
        expires_in: 令牌过期时间（秒）
        user: 用户信息（可选）
        tenants: 用户可访问的租户列表（可选）
        default_tenant_id: 默认租户 ID（可选，超级用户使用）
        requires_tenant_selection: 是否需要选择租户（当用户有多个租户时）
    """
    
    access_token: str = Field(..., description="JWT 访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")
    expires_in: int = Field(..., description="令牌过期时间（秒）")
    user: Optional[dict] = Field(None, description="用户信息（可选）")
    tenants: Optional[List[TenantInfo]] = Field(None, description="用户可访问的租户列表（可选）")
    default_tenant_id: Optional[int] = Field(None, description="默认租户 ID（可选，超级用户使用）")
    requires_tenant_selection: bool = Field(default=False, description="是否需要选择租户（当用户有多个租户时）")


class UserRegisterRequest(BaseModel):
    """
    用户注册请求 Schema
    
    用于在已有租户中注册新用户的请求数据。
    
    Attributes:
        username: 用户名（必填，3-50 字符）
        email: 用户邮箱（可选，符合中国用户使用习惯）
        password: 密码（必填，最少 8 字符）
        full_name: 用户全名（可选）
        tenant_id: 租户 ID（必填，用于多租户隔离）
    """
    
    username: str = Field(..., min_length=3, max_length=50, description="用户名（3-50 字符）")
    email: Optional[EmailStr] = Field(None, description="用户邮箱（可选，符合中国用户使用习惯）")
    password: str = Field(..., min_length=8, max_length=100, description="密码（最少 8 字符）")
    full_name: Optional[str] = Field(None, max_length=100, description="用户全名（可选）")
    tenant_id: int = Field(..., description="租户 ID（用于多租户隔离）")


class RegisterRequest(BaseModel):
    """
    租户注册请求 Schema
    
    用于租户注册的请求数据（包含租户信息和管理员信息）。
    
    Attributes:
        tenant_name: 租户名称（必填）
        tenant_domain: 租户域名（必填，全局唯一）
        username: 管理员用户名（必填，3-50 字符）
        email: 管理员邮箱（可选，符合中国用户使用习惯）
        password: 管理员密码（必填，最少 8 字符）
        full_name: 管理员全名（可选）
    """
    
    tenant_name: str = Field(..., min_length=1, max_length=100, description="租户名称")
    tenant_domain: str = Field(..., min_length=1, max_length=100, description="租户域名（全局唯一，用于子域名访问）")
    username: str = Field(..., min_length=3, max_length=50, description="管理员用户名（3-50 字符）")
    email: Optional[EmailStr] = Field(None, description="管理员邮箱（可选，符合中国用户使用习惯）")
    password: str = Field(..., min_length=8, max_length=100, description="管理员密码（最少 8 字符）")
    full_name: Optional[str] = Field(None, max_length=100, description="管理员全名（可选）")


class RegisterResponse(BaseModel):
    """
    注册响应 Schema
    
    用于返回注册成功的响应数据。
    
    Attributes:
        id: 用户 ID
        username: 用户名
        email: 用户邮箱
        message: 注册成功消息
    """
    
    id: int = Field(..., description="用户 ID")
    username: str = Field(..., description="用户名")
    email: Optional[str] = Field(None, description="用户邮箱（可选）")
    message: str = Field(default="注册成功", description="注册成功消息")


class TokenRefreshRequest(BaseModel):
    """
    Token 刷新请求 Schema
    
    用于刷新 JWT Token 的请求数据。
    
    Attributes:
        refresh_token: 刷新令牌（可选，如果未提供则使用当前访问令牌）
    """
    
    refresh_token: Optional[str] = Field(None, description="刷新令牌（可选）")


class TokenRefreshResponse(BaseModel):
    """
    Token 刷新响应 Schema
    
    用于返回刷新后的 Token 信息。
    
    Attributes:
        access_token: 新的 JWT 访问令牌
        token_type: 令牌类型（通常为 "bearer"）
        expires_in: 令牌过期时间（秒）
    """
    
    access_token: str = Field(..., description="新的 JWT 访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")
    expires_in: int = Field(..., description="令牌过期时间（秒）")


class CurrentUserResponse(BaseModel):
    """
    当前用户信息响应 Schema
    
    用于返回当前登录用户的信息。
    
    Attributes:
        id: 用户 ID
        username: 用户名
        email: 用户邮箱
        full_name: 用户全名
        tenant_id: 租户 ID
        is_active: 是否激活
        is_superuser: 是否为超级用户
        is_tenant_admin: 是否为租户管理员
    """
    
    id: int = Field(..., description="用户 ID")
    username: str = Field(..., description="用户名")
    email: Optional[str] = Field(None, description="用户邮箱（可选）")
    full_name: Optional[str] = Field(None, description="用户全名")
    tenant_id: int = Field(..., description="租户 ID")
    is_active: bool = Field(..., description="是否激活")
    is_superuser: bool = Field(..., description="是否为超级用户")
    is_tenant_admin: bool = Field(..., description="是否为租户管理员")

