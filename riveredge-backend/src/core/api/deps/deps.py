"""
API 依赖模块

提供 API 路由所需的依赖注入函数，包括认证、权限检查、获取当前用户等。
复用 soil 模块的依赖函数，确保一致性。
"""

from typing import Optional
from fastapi import Depends, HTTPException, status, Header
from starlette.requests import Request

# 复用 soil 模块的依赖函数
from infra.api.deps.deps import (
    get_current_user as soil_get_current_user,
    oauth2_scheme,
)
from infra.models.user import User
from infra.domain.tenant_context import set_current_tenant_id


async def get_current_user(
    request: Request,
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    获取当前登录用户

    复用 soil 模块的 get_current_user 函数；透传 request 以便 soil 层将身份
    缓存到 request.state 供 OperationLogMiddleware 等复用。

    Args:
        request: 当前请求对象（FastAPI 自动注入）
        token: JWT Token（从请求头 Authorization: Bearer <token> 中提取）

    Returns:
        User: 当前用户对象

    Raises:
        HTTPException: 当认证失败时抛出
    """
    return await soil_get_current_user(request=request, token=token)


async def get_current_tenant(
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
    current_user: User = Depends(get_current_user),
) -> int:
    """Resolve a tenant only after validating the active user/session.

    Ordinary users are bound to their authenticated organization. Platform
    superadmins must explicitly select a tenant; ambient context is not identity.
    """
    is_infra_superadmin = bool(getattr(current_user, "_is_infra_superadmin", False))
    tenant_id = None
    if x_tenant_id is not None:
        try:
            tenant_id = int(x_tenant_id)
            if tenant_id <= 0:
                raise ValueError
        except (TypeError, ValueError):
            raise HTTPException(status_code=400, detail="无效的组织ID")

    if is_infra_superadmin:
        if tenant_id is None:
            raise HTTPException(
                status_code=400,
                detail="平台超级管理员访问租户资源时，必须通过 X-Tenant-ID 指定租户ID",
            )
    else:
        try:
            authenticated_tenant_id = int(current_user.tenant_id)
            if authenticated_tenant_id <= 0:
                raise ValueError
        except (TypeError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="会话组织信息无效，请重新登录",
                headers={"WWW-Authenticate": "Bearer"},
            )
        if tenant_id is not None and tenant_id != authenticated_tenant_id:
            raise HTTPException(status_code=403, detail="租户上下文不匹配，禁止跨租户访问")
        tenant_id = authenticated_tenant_id

    set_current_tenant_id(tenant_id)
    return tenant_id


async def get_current_user_id(user: User = Depends(get_current_user)) -> Optional[int]:
    """
    获取当前用户ID
    
    Args:
        user: 当前用户对象（依赖注入）
    
    Returns:
        Optional[int]: 当前用户ID
    """
    return user.id if user else None
