"""
超级管理员认证服务模块

提供超级管理员认证相关的业务逻辑，包括登录、Token 刷新等功能
"""

from typing import Optional, Dict, Any

from fastapi import HTTPException, status
from loguru import logger

from models.superadmin import SuperAdmin
from schemas.superadmin import SuperAdminLoginRequest
from services.superadmin_service import SuperAdminService
from core.superadmin_security import create_token_for_superadmin


class SuperAdminAuthService:
    """
    超级管理员认证服务类
    
    提供超级管理员认证相关的业务逻辑处理。
    注意：超级管理员认证独立于租户系统，Token 不包含 tenant_id。
    """
    
    async def login(
        self,
        data: SuperAdminLoginRequest
    ) -> Dict[str, Any]:
        """
        超级管理员登录
        
        验证超级管理员凭据并返回 JWT Token（不包含 tenant_id）。
        
        Args:
            data: 登录请求数据
            
        Returns:
            Dict[str, Any]: 包含 token、token_type、expires_in、user 的字典
            
        Raises:
            HTTPException: 当用户名或密码错误时抛出
            
        Example:
            >>> service = SuperAdminAuthService()
            >>> result = await service.login(
            ...     SuperAdminLoginRequest(
            ...         username="superadmin",
            ...         password="password123"
            ...     )
            ... )
            >>> "token" in result
            True
        """
        # 验证超级管理员凭据
        service = SuperAdminService()
        admin = await service.verify_superadmin_credentials(
            data.username,
            data.password
        )
        
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="用户名或密码错误",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # 生成 Token（不包含 tenant_id）⭐ 关键
        token_info = create_token_for_superadmin(admin)
        
        logger.info(f"超级管理员登录成功: {admin.username} (ID: {admin.id})")
        
        from schemas.superadmin import SuperAdminResponse
        
        return {
            **token_info,
            "user": SuperAdminResponse.model_validate(admin).model_dump()
        }
    
    async def get_current_superadmin_from_token(
        self,
        token: str
    ) -> Optional[SuperAdmin]:
        """
        从 Token 获取当前超级管理员
        
        验证 Token 并返回对应的超级管理员对象。
        
        Args:
            token: JWT Token 字符串
            
        Returns:
            Optional[SuperAdmin]: 超级管理员对象，如果验证失败则返回 None
        """
        from core.superadmin_security import get_superadmin_token_payload
        
        payload = get_superadmin_token_payload(token)
        if not payload:
            return None
        
        admin_id = int(payload.get("sub"))
        admin = await SuperAdmin.get_or_none(id=admin_id)
        
        if not admin or not admin.is_active:
            return None
        
        return admin

