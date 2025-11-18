"""
认证 API 模块

提供用户认证相关的 RESTful API 接口
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

from schemas.auth import (
    LoginRequest,
    LoginResponse,
    UserRegisterRequest,
    RegisterResponse,
    TokenRefreshRequest,
    TokenRefreshResponse,
    CurrentUserResponse,
)
from schemas.user import UserResponse
from services.auth_service import AuthService
from api.deps import get_current_user
from models.user import User

router = APIRouter(prefix="/auth", tags=["认证"])

# OAuth2 密码流（用于 Swagger UI 测试）
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserRegisterRequest
):
    """
    用户注册接口
    
    在已有租户中创建新用户并自动设置租户 ID。
    
    Args:
        data: 用户注册请求数据（包含 username, email（可选）, password, tenant_id）
        
    Returns:
        RegisterResponse: 注册成功的响应数据
        
    Raises:
        HTTPException: 当租户不存在或用户名已存在时抛出
        
    Example:
        ```json
        {
            "username": "testuser",
            "email": "test@example.com",  // 可选
            "password": "password123",
            "tenant_id": 1,
            "full_name": "测试用户"  // 可选
        }
        ```
    """
    service = AuthService()
    user = await service.register(data)
    
    return RegisterResponse(
        id=user.id,
        username=user.username,
        email=user.email if user.email else None,
        message="注册成功"
    )


@router.post("/login", response_model=LoginResponse)
async def login(
    data: LoginRequest
):
    """
    用户登录接口
    
    验证用户凭据并返回 JWT Token（包含 tenant_id）。
    登录成功后自动设置租户上下文。
    
    Args:
        data: 登录请求数据（username, password, tenant_id 可选）
        
    Returns:
        LoginResponse: 登录成功的响应数据（包含 access_token）
        
    Raises:
        HTTPException: 当用户名/密码错误或用户未激活时抛出
        
    Example:
        ```json
        {
            "username": "testuser",
            "password": "password123",
            "tenant_id": 1
        }
        ```
    """
    service = AuthService()
    result = await service.login(data)
    
    return LoginResponse(**result)


@router.post("/login/form", response_model=LoginResponse)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    用户登录接口（OAuth2 表单格式）
    
    用于 Swagger UI 的 OAuth2 认证测试。
    支持用户名或邮箱登录。
    
    Args:
        form_data: OAuth2 表单数据（username, password）
        
    Returns:
        LoginResponse: 登录成功的响应数据
    """
    service = AuthService()
    result = await service.login(
        LoginRequest(
            username=form_data.username,
            password=form_data.password,
            tenant_id=None  # 表单登录不指定租户，使用用户的默认租户
        )
    )
    
    return LoginResponse(**result)


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh_token(
    data: TokenRefreshRequest
):
    """
    Token 刷新接口
    
    验证当前 Token 并生成新的 Token。
    
    Args:
        data: Token 刷新请求数据（refresh_token 可选）
        
    Returns:
        TokenRefreshResponse: 新的 Token 信息
        
    Raises:
        HTTPException: 当 Token 无效时抛出
    """
    service = AuthService()
    
    # 如果提供了 refresh_token，使用它；否则从请求头获取
    token = data.refresh_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="请提供 refresh_token"
        )
    
    result = await service.refresh_token(token)
    
    return TokenRefreshResponse(**result)


@router.get("/me", response_model=CurrentUserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    获取当前用户信息接口
    
    返回当前登录用户的详细信息。
    自动从 Token 中解析用户信息和租户信息。
    
    Args:
        current_user: 当前用户（依赖注入，自动从 Token 解析）
        
    Returns:
        CurrentUserResponse: 当前用户信息
        
    Raises:
        HTTPException: 当 Token 无效或用户不存在时抛出
    """
    return CurrentUserResponse(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        full_name=current_user.full_name,
        tenant_id=current_user.tenant_id,
        is_active=current_user.is_active,
        is_superuser=current_user.is_superuser,
        is_tenant_admin=current_user.is_tenant_admin,
    )

