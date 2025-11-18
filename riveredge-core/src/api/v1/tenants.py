"""
租户管理 API 模块

提供租户管理的 RESTful API 接口
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends

from schemas.tenant import (
    TenantCreate,
    TenantUpdate,
    TenantResponse,
    TenantListResponse,
)
from services.tenant_service import TenantService
from models.tenant import TenantStatus, TenantPlan

# 创建路由
router = APIRouter(prefix="/tenants", tags=["Tenants"])


@router.post("", response_model=TenantResponse, status_code=201)
async def create_tenant(data: TenantCreate):
    """
    创建租户
    
    创建新租户。注意：此接口通常需要超级管理员权限。
    
    Args:
        data: 租户创建数据
        
    Returns:
        TenantResponse: 创建的租户
        
    Raises:
        HTTPException: 当域名已存在时返回 400 错误
    """
    service = TenantService()
    try:
        tenant = await service.create_tenant(data)
        return tenant
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=TenantListResponse)
async def list_tenants(
    page: int = Query(1, ge=1, description="页码"),
    page_size: int = Query(10, ge=1, le=100, description="每页数量"),
    status: Optional[TenantStatus] = Query(None, description="租户状态筛选"),
    plan: Optional[TenantPlan] = Query(None, description="租户套餐筛选"),
):
    """
    获取租户列表
    
    支持分页、状态筛选、套餐筛选。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        page: 页码（默认 1）
        page_size: 每页数量（默认 10，最大 100）
        status: 租户状态筛选（可选）
        plan: 租户套餐筛选（可选）
        
    Returns:
        TenantListResponse: 租户列表响应
    """
    service = TenantService()
    result = await service.list_tenants(
        page=page,
        page_size=page_size,
        status=status,
        plan=plan,
    )
    return result


@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(tenant_id: int):
    """
    获取租户详情
    
    根据租户 ID 获取租户详细信息。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        tenant_id: 租户 ID
        
    Returns:
        TenantResponse: 租户详情
        
    Raises:
        HTTPException: 当租户不存在时返回 404 错误
    """
    service = TenantService()
    tenant = await service.get_tenant_by_id(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
    return tenant


@router.put("/{tenant_id}", response_model=TenantResponse)
async def update_tenant(tenant_id: int, data: TenantUpdate):
    """
    更新租户信息
    
    更新租户的详细信息。只更新提供的字段。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        tenant_id: 租户 ID
        data: 租户更新数据
        
    Returns:
        TenantResponse: 更新后的租户
        
    Raises:
        HTTPException: 当租户不存在时返回 404 错误
    """
    service = TenantService()
    tenant = await service.update_tenant(tenant_id, data)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
    return tenant


@router.delete("/{tenant_id}", status_code=204)
async def delete_tenant(tenant_id: int):
    """
    删除租户（软删除）
    
    将租户状态设置为 SUSPENDED，而不是真正删除数据。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        tenant_id: 租户 ID
        
    Raises:
        HTTPException: 当租户不存在时返回 404 错误
    """
    service = TenantService()
    success = await service.delete_tenant(tenant_id)
    if not success:
        raise HTTPException(status_code=404, detail="租户不存在")


@router.post("/{tenant_id}/activate", response_model=TenantResponse)
async def activate_tenant(tenant_id: int):
    """
    激活租户
    
    将租户状态设置为 ACTIVE。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        tenant_id: 租户 ID
        
    Returns:
        TenantResponse: 更新后的租户
        
    Raises:
        HTTPException: 当租户不存在时返回 404 错误
    """
    service = TenantService()
    tenant = await service.activate_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
    return tenant


@router.post("/{tenant_id}/deactivate", response_model=TenantResponse)
async def deactivate_tenant(tenant_id: int):
    """
    停用租户
    
    将租户状态设置为 INACTIVE。
    注意：此接口通常需要超级管理员权限。
    
    Args:
        tenant_id: 租户 ID
        
    Returns:
        TenantResponse: 更新后的租户
        
    Raises:
        HTTPException: 当租户不存在时返回 404 错误
    """
    service = TenantService()
    tenant = await service.deactivate_tenant(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="租户不存在")
    return tenant

