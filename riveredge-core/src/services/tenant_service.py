"""
租户服务模块

提供租户的 CRUD 操作和业务逻辑处理
"""

from typing import Optional, Dict, Any, List
from datetime import datetime

from tortoise.exceptions import DoesNotExist, IntegrityError

from models.tenant import Tenant, TenantStatus, TenantPlan
from models.tenant_config import TenantConfig
from schemas.tenant import TenantCreate, TenantUpdate
from core.query_filter import get_tenant_queryset


class TenantService:
    """
    租户服务类
    
    提供租户的 CRUD 操作和业务逻辑处理。
    注意：租户管理通常需要超级管理员权限，可以跨租户访问。
    """
    
    async def create_tenant(self, data: TenantCreate) -> Tenant:
        """
        创建租户
        
        创建新租户并保存到数据库。如果域名已存在，则抛出异常。
        
        Args:
            data: 租户创建数据
            
        Returns:
            Tenant: 创建的租户对象
            
        Raises:
            IntegrityError: 当域名已存在时抛出
            
        Example:
            >>> service = TenantService()
            >>> tenant = await service.create_tenant(
            ...     TenantCreate(
            ...         name="测试租户",
            ...         domain="test",
            ...         status=TenantStatus.ACTIVE
            ...     )
            ... )
        """
        try:
            # 创建租户（租户表本身不包含 tenant_id，所以设置为 None）
            tenant = await Tenant.create(
                tenant_id=None,  # 租户表本身不需要 tenant_id
                name=data.name,
                domain=data.domain,
                status=data.status,
                plan=data.plan,
                settings=data.settings,
                max_users=data.max_users,
                max_storage=data.max_storage,
                expires_at=data.expires_at,
            )
            return tenant
        except IntegrityError as e:
            if "domain" in str(e).lower():
                raise ValueError(f"域名 {data.domain} 已存在")
            raise
    
    async def get_tenant_by_id(
        self,
        tenant_id: int,
        skip_tenant_filter: bool = True  # 租户查询需要跨租户访问
    ) -> Optional[Tenant]:
        """
        根据 ID 获取租户
        
        Args:
            tenant_id: 租户 ID
            skip_tenant_filter: 是否跳过租户过滤（租户查询需要跨租户访问，默认为 True）
            
        Returns:
            Optional[Tenant]: 租户对象，如果不存在则返回 None
        """
        queryset = get_tenant_queryset(
            Tenant,
            skip_tenant_filter=skip_tenant_filter
        )
        return await queryset.get_or_none(id=tenant_id)
    
    async def get_tenant_by_domain(
        self,
        domain: str,
        skip_tenant_filter: bool = True
    ) -> Optional[Tenant]:
        """
        根据域名获取租户
        
        Args:
            domain: 租户域名
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            Optional[Tenant]: 租户对象，如果不存在则返回 None
        """
        queryset = get_tenant_queryset(
            Tenant,
            skip_tenant_filter=skip_tenant_filter
        )
        return await queryset.get_or_none(domain=domain)
    
    async def list_tenants(
        self,
        page: int = 1,
        page_size: int = 10,
        status: Optional[TenantStatus] = None,
        plan: Optional[TenantPlan] = None,
        skip_tenant_filter: bool = True  # 租户列表需要跨租户访问
    ) -> Dict[str, Any]:
        """
        获取租户列表
        
        支持分页、状态筛选、套餐筛选。
        
        Args:
            page: 页码（默认 1）
            page_size: 每页数量（默认 10）
            status: 租户状态筛选（可选）
            plan: 租户套餐筛选（可选）
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            dict: 包含 items、total、page、page_size 的字典
        """
        queryset = get_tenant_queryset(
            Tenant,
            skip_tenant_filter=skip_tenant_filter
        )
        
        # 添加筛选条件
        filters = {}
        if status is not None:
            filters["status"] = status
        if plan is not None:
            filters["plan"] = plan
        
        query = queryset.filter(**filters) if filters else queryset.all()
        
        # 计算总数
        total = await query.count()
        
        # 分页查询
        items = await query.offset((page - 1) * page_size).limit(page_size).all()
        
        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
        }
    
    async def update_tenant(
        self,
        tenant_id: int,
        data: TenantUpdate,
        skip_tenant_filter: bool = True
    ) -> Optional[Tenant]:
        """
        更新租户信息
        
        Args:
            tenant_id: 租户 ID
            data: 租户更新数据
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            Optional[Tenant]: 更新后的租户对象，如果不存在则返回 None
        """
        tenant = await self.get_tenant_by_id(tenant_id, skip_tenant_filter=skip_tenant_filter)
        if not tenant:
            return None
        
        # 更新字段（只更新提供的字段）
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(tenant, field, value)
        
        await tenant.save()
        return tenant
    
    async def delete_tenant(
        self,
        tenant_id: int,
        skip_tenant_filter: bool = True
    ) -> bool:
        """
        删除租户（软删除）
        
        将租户状态设置为 SUSPENDED，而不是真正删除数据。
        
        Args:
            tenant_id: 租户 ID
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            bool: 如果删除成功则返回 True，否则返回 False
        """
        tenant = await self.get_tenant_by_id(tenant_id, skip_tenant_filter=skip_tenant_filter)
        if not tenant:
            return False
        
        # 软删除：将状态设置为 SUSPENDED
        tenant.status = TenantStatus.SUSPENDED
        await tenant.save()
        return True
    
    async def activate_tenant(
        self,
        tenant_id: int,
        skip_tenant_filter: bool = True
    ) -> Optional[Tenant]:
        """
        激活租户
        
        Args:
            tenant_id: 租户 ID
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            Optional[Tenant]: 更新后的租户对象，如果不存在则返回 None
        """
        tenant = await self.get_tenant_by_id(tenant_id, skip_tenant_filter=skip_tenant_filter)
        if not tenant:
            return None
        
        tenant.status = TenantStatus.ACTIVE
        await tenant.save()
        return tenant
    
    async def deactivate_tenant(
        self,
        tenant_id: int,
        skip_tenant_filter: bool = True
    ) -> Optional[Tenant]:
        """
        停用租户
        
        Args:
            tenant_id: 租户 ID
            skip_tenant_filter: 是否跳过租户过滤（默认为 True）
            
        Returns:
            Optional[Tenant]: 更新后的租户对象，如果不存在则返回 None
        """
        tenant = await self.get_tenant_by_id(tenant_id, skip_tenant_filter=skip_tenant_filter)
        if not tenant:
            return None
        
        tenant.status = TenantStatus.INACTIVE
        await tenant.save()
        return tenant
    
    async def get_tenant_config(
        self,
        tenant_id: int,
        config_key: str
    ) -> Optional[TenantConfig]:
        """
        获取租户配置
        
        Args:
            tenant_id: 租户 ID
            config_key: 配置键
            
        Returns:
            Optional[TenantConfig]: 配置对象，如果不存在则返回 None
        """
        queryset = get_tenant_queryset(
            TenantConfig,
            tenant_id=tenant_id
        )
        return await queryset.get_or_none(config_key=config_key)
    
    async def set_tenant_config(
        self,
        tenant_id: int,
        config_key: str,
        config_value: Dict[str, Any],
        description: Optional[str] = None
    ) -> TenantConfig:
        """
        设置租户配置
        
        如果配置已存在则更新，否则创建新配置。
        
        Args:
            tenant_id: 租户 ID
            config_key: 配置键
            config_value: 配置值
            description: 配置描述（可选）
            
        Returns:
            TenantConfig: 配置对象
        """
        config = await self.get_tenant_config(tenant_id, config_key)
        
        if config:
            # 更新现有配置
            config.config_value = config_value
            if description is not None:
                config.description = description
            await config.save()
        else:
            # 创建新配置
            config = await TenantConfig.create(
                tenant_id=tenant_id,
                config_key=config_key,
                config_value=config_value,
                description=description,
            )
        
        return config
    
    async def initialize_tenant_data(
        self,
        tenant_id: int
    ) -> None:
        """
        初始化租户数据
        
        在创建新租户后调用，初始化租户的默认数据（如默认角色、权限等）。
        此方法为占位方法，后续完善。
        
        Args:
            tenant_id: 租户 ID
        """
        # TODO: 实现租户数据初始化逻辑
        # 1. 创建默认角色
        # 2. 创建默认权限
        # 3. 创建默认配置
        pass

