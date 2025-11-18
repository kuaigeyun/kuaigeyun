"""
租户服务测试脚本

直接测试租户服务的业务逻辑，不依赖 HTTP 服务
"""

import sys
import asyncio
from pathlib import Path

# 添加 src 目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from tortoise import Tortoise
from loguru import logger

from models.tenant import Tenant, TenantStatus, TenantPlan
from services.tenant_service import TenantService
from schemas.tenant import TenantCreate, TenantUpdate
from core.database import TORTOISE_ORM


async def test_tenant_service():
    """
    测试租户服务
    
    测试所有租户服务方法
    """
    # 初始化数据库
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()
    
    logger.info("=" * 60)
    logger.info("开始测试租户服务")
    logger.info("=" * 60)
    
    service = TenantService()
    tenant_id = None
    
    try:
        # 1. 测试创建租户
        logger.info("\n1. 测试创建租户")
        create_data = TenantCreate(
            name="测试租户",
            domain="test-tenant",
            status=TenantStatus.ACTIVE,
            plan=TenantPlan.BASIC,
            max_users=50,
            max_storage=2048,
        )
        tenant = await service.create_tenant(create_data)
        tenant_id = tenant.id
        logger.success(f"✅ 租户创建成功，ID: {tenant_id}")
        logger.info(f"   租户名称: {tenant.name}")
        logger.info(f"   租户域名: {tenant.domain}")
        logger.info(f"   租户状态: {tenant.status}")
        logger.info(f"   租户套餐: {tenant.plan}")
        
        # 2. 测试获取租户列表
        logger.info("\n2. 测试获取租户列表")
        result = await service.list_tenants(page=1, page_size=10)
        logger.success(f"✅ 获取租户列表成功")
        logger.info(f"   总数: {result['total']}")
        logger.info(f"   当前页: {result['page']}")
        logger.info(f"   每页数量: {result['page_size']}")
        logger.info(f"   租户数量: {len(result['items'])}")
        
        # 3. 测试获取租户详情
        logger.info(f"\n3. 测试获取租户详情 (ID: {tenant_id})")
        tenant = await service.get_tenant_by_id(tenant_id)
        if tenant:
            logger.success(f"✅ 获取租户详情成功")
            logger.info(f"   租户名称: {tenant.name}")
            logger.info(f"   租户域名: {tenant.domain}")
        else:
            logger.error("❌ 获取租户详情失败：租户不存在")
        
        # 4. 测试根据域名获取租户
        logger.info(f"\n4. 测试根据域名获取租户 (domain: test-tenant)")
        tenant = await service.get_tenant_by_domain("test-tenant")
        if tenant:
            logger.success(f"✅ 根据域名获取租户成功")
            logger.info(f"   租户 ID: {tenant.id}")
            logger.info(f"   租户名称: {tenant.name}")
        else:
            logger.error("❌ 根据域名获取租户失败：租户不存在")
        
        # 5. 测试更新租户
        logger.info(f"\n5. 测试更新租户 (ID: {tenant_id})")
        update_data = TenantUpdate(
            name="更新后的租户名称",
            max_users=100,
        )
        tenant = await service.update_tenant(tenant_id, update_data)
        if tenant:
            logger.success(f"✅ 更新租户成功")
            logger.info(f"   更新后名称: {tenant.name}")
            logger.info(f"   更新后最大用户数: {tenant.max_users}")
        else:
            logger.error("❌ 更新租户失败：租户不存在")
        
        # 6. 测试停用租户
        logger.info(f"\n6. 测试停用租户 (ID: {tenant_id})")
        success = await service.deactivate_tenant(tenant_id)
        if success:
            logger.success(f"✅ 停用租户成功")
            tenant = await service.get_tenant_by_id(tenant_id)
            logger.info(f"   租户状态: {tenant.status}")
        else:
            logger.error("❌ 停用租户失败")
        
        # 7. 测试激活租户
        logger.info(f"\n7. 测试激活租户 (ID: {tenant_id})")
        success = await service.activate_tenant(tenant_id)
        if success:
            logger.success(f"✅ 激活租户成功")
            tenant = await service.get_tenant_by_id(tenant_id)
            logger.info(f"   租户状态: {tenant.status}")
        else:
            logger.error("❌ 激活租户失败")
        
        # 8. 测试租户配置管理
        logger.info(f"\n8. 测试租户配置管理 (ID: {tenant_id})")
        config = await service.set_tenant_config(
            tenant_id=tenant_id,
            config_key="test_config",
            config_value={"key1": "value1", "key2": 123},
            description="测试配置"
        )
        logger.success(f"✅ 设置租户配置成功")
        logger.info(f"   配置键: {config.config_key}")
        logger.info(f"   配置值: {config.config_value}")
        
        # 获取配置
        config = await service.get_tenant_config(tenant_id, "test_config")
        if config:
            logger.success(f"✅ 获取租户配置成功")
            logger.info(f"   配置值: {config.config_value}")
        else:
            logger.error("❌ 获取租户配置失败")
        
        # 9. 测试租户列表筛选（按状态）
        logger.info("\n9. 测试租户列表筛选（按状态）")
        result = await service.list_tenants(
            page=1,
            page_size=10,
            status=TenantStatus.ACTIVE
        )
        logger.success(f"✅ 筛选租户列表成功")
        logger.info(f"   筛选后的总数: {result['total']}")
        
        # 10. 测试租户列表筛选（按套餐）
        logger.info("\n10. 测试租户列表筛选（按套餐）")
        result = await service.list_tenants(
            page=1,
            page_size=10,
            plan=TenantPlan.BASIC
        )
        logger.success(f"✅ 筛选租户列表成功")
        logger.info(f"   筛选后的总数: {result['total']}")
        
        # 11. 测试删除租户（软删除）
        logger.info(f"\n11. 测试删除租户 (ID: {tenant_id})")
        success = await service.delete_tenant(tenant_id)
        if success:
            logger.success(f"✅ 删除租户成功（软删除）")
            tenant = await service.get_tenant_by_id(tenant_id)
            logger.info(f"   删除后状态: {tenant.status}")
        else:
            logger.error("❌ 删除租户失败")
        
        logger.info("\n" + "=" * 60)
        logger.info("租户服务测试完成")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"❌ 测试过程中出错: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # 清理测试数据
        if tenant_id:
            try:
                tenant = await Tenant.get_or_none(id=tenant_id)
                if tenant:
                    await tenant.delete()
                    logger.info(f"清理测试数据：删除租户 {tenant_id}")
            except Exception as e:
                logger.warning(f"清理测试数据时出错: {e}")
        
        await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(test_tenant_service())

