"""
租户注册 API 模块

提供租户注册的 RESTful API 接口
"""

from fastapi import APIRouter, HTTPException, status
from loguru import logger

from schemas.tenant import TenantCreate
from schemas.auth import RegisterRequest, RegisterResponse
from schemas.user import UserCreate
from services.tenant_service import TenantService
from services.auth_service import AuthService
from services.user_service import UserService
from models.tenant import TenantStatus, TenantPlan
from models.user import User

# 创建路由
router = APIRouter(prefix="/register", tags=["Register"])


@router.post("", response_model=RegisterResponse, status_code=201)
async def register_tenant(data: RegisterRequest):
    """
    租户注册
    
    创建新租户并自动创建租户管理员用户。
    注册成功后，租户状态为 INACTIVE，需要超级管理员审核后才能激活。
    
    Args:
        data: 注册请求数据（包含租户信息和管理员信息）
        
    Returns:
        RegisterResponse: 注册响应（包含用户信息）
        
    Raises:
        HTTPException: 当域名已存在、用户名已存在或邮箱已存在时抛出
        
    Example:
        >>> response = await register_tenant(
        ...     RegisterRequest(
        ...         tenant_name="测试租户",
        ...         tenant_domain="test",
        ...         username="admin",
        ...         email="admin@test.com",  # 可选
        ...         password="password123",
        ...         full_name="管理员"
        ...     )
        ... )
    """
    tenant_service = TenantService()
    auth_service = AuthService()
    user_service = UserService()
    
    try:
        # 1. 检查租户域名是否已存在
        existing_tenant = await tenant_service.get_tenant_by_domain(
            data.tenant_domain,
            skip_tenant_filter=True
        )
        if existing_tenant:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"域名 {data.tenant_domain} 已被使用"
            )
        
        # 2. 创建租户（状态为 INACTIVE，需要审核）
        tenant_data = TenantCreate(
            name=data.tenant_name,
            domain=data.tenant_domain,
            status=TenantStatus.INACTIVE,  # 注册时默认为未激活状态，需要审核
            plan=TenantPlan.BASIC,  # 注册时默认为基础套餐
            settings={
                "description": f"租户 {data.tenant_name} 的配置",
                "registered_by": data.username,  # 记录注册者
            },
            max_users=10,  # 默认最大用户数
            max_storage=1024,  # 默认最大存储空间（1GB）
            expires_at=None,  # 默认永不过期
        )
        
        tenant = await tenant_service.create_tenant(tenant_data)
        logger.info(f"租户创建成功: {tenant.name} (ID: {tenant.id}, Domain: {tenant.domain})")
        
        # 3. 初始化租户数据（创建默认角色、权限等）
        await tenant_service.initialize_tenant_data(tenant.id)
        logger.info(f"租户数据初始化完成: {tenant.id}")
        
        # 4. 创建租户管理员用户
        user_data = UserCreate(
            username=data.username,
            email=data.email if data.email else None,  # 邮箱可选
            password=data.password,
            full_name=data.full_name,
            tenant_id=tenant.id,  # 关联到新创建的租户
            is_active=True,
            is_superuser=False,
            is_tenant_admin=True,  # 设置为租户管理员
        )
        
        user = await user_service.create_user(user_data, tenant_id=tenant.id)
        logger.info(f"租户管理员创建成功: {user.username} (ID: {user.id}, Tenant ID: {tenant.id})")
        
        # 5. 返回注册响应
        return RegisterResponse(
            id=user.id,
            username=user.username,
            email=user.email if user.email else None,
            message="注册成功，等待管理员审核"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"租户注册失败: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"注册失败: {str(e)}"
        )

