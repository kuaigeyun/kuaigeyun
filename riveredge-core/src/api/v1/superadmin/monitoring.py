"""
超级管理员运营监控 API 模块

提供租户运营监控和系统监控相关的 API 接口
"""

from typing import Optional
from fastapi import APIRouter, Query, Depends

from services.monitoring_service import MonitoringService
from api.deps import get_current_superadmin
from models.superadmin import SuperAdmin

# 创建路由
router = APIRouter(prefix="/superadmin/monitoring", tags=["SuperAdmin Monitoring"])


@router.get("/tenants/statistics")
async def get_tenant_statistics(
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取租户数量统计
    
    统计所有租户的数量，按状态和套餐分组。
    
    Args:
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 租户统计信息
    """
    service = MonitoringService()
    return await service.get_tenant_statistics()


@router.get("/tenants/activity")
async def get_tenant_activity(
    tenant_id: Optional[int] = Query(None, description="租户 ID（可选）"),
    days: int = Query(30, ge=1, le=365, description="统计天数（默认 30 天）"),
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取租户活跃度监控数据
    
    统计租户的日活、月活、访问量等数据。
    
    Args:
        tenant_id: 租户 ID（可选，如果提供则只统计该租户）
        days: 统计天数（默认 30 天）
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 租户活跃度数据
    """
    service = MonitoringService()
    return await service.get_tenant_activity(tenant_id=tenant_id, days=days)


@router.get("/tenants/resource-usage")
async def get_tenant_resource_usage(
    tenant_id: Optional[int] = Query(None, description="租户 ID（可选）"),
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取租户资源使用监控数据
    
    统计租户的存储空间、API 调用次数、数据量等。
    
    Args:
        tenant_id: 租户 ID（可选，如果提供则只统计该租户）
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 租户资源使用数据
    """
    service = MonitoringService()
    return await service.get_tenant_resource_usage(tenant_id=tenant_id)


@router.get("/tenants/data-statistics")
async def get_tenant_data_statistics(
    tenant_id: Optional[int] = Query(None, description="租户 ID（可选）"),
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取租户数据统计
    
    统计租户的用户数、订单数、业务数据量等。
    
    Args:
        tenant_id: 租户 ID（可选，如果提供则只统计该租户）
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 租户数据统计
    """
    service = MonitoringService()
    return await service.get_tenant_data_statistics(tenant_id=tenant_id)


@router.get("/system/status")
async def get_system_status(
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取系统整体运行状态
    
    返回系统的基本运行状态信息。
    
    Args:
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 系统运行状态
    """
    service = MonitoringService()
    return await service.get_system_status()


@router.get("/system/resources")
async def get_system_resources(
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取系统资源使用情况
    
    返回系统的 CPU、内存、磁盘等资源使用情况。
    
    Args:
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 系统资源使用情况
    """
    service = MonitoringService()
    return await service.get_system_resources()


@router.get("/system/performance")
async def get_system_performance(
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取系统性能指标
    
    返回系统的性能指标，如 API 响应时间、请求量等。
    
    Args:
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        Dict[str, Any]: 系统性能指标
    """
    service = MonitoringService()
    return await service.get_system_performance()


@router.get("/system/alerts")
async def get_system_alerts(
    current_admin: SuperAdmin = Depends(get_current_superadmin)
):
    """
    获取系统异常告警
    
    返回系统的异常告警列表。
    
    Args:
        current_admin: 当前超级管理员（依赖注入）
        
    Returns:
        List[Dict[str, Any]]: 异常告警列表
    """
    service = MonitoringService()
    return await service.get_system_alerts()

