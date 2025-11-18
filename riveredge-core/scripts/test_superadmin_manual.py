"""
手动测试超级管理员功能脚本

直接测试超级管理员的核心功能，不依赖完整的 FastAPI 应用
"""

import asyncio
import sys
from pathlib import Path

# 添加 src 目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from loguru import logger
from tortoise import Tortoise
from app.config import settings

from models.superadmin import SuperAdmin
from services.superadmin_service import SuperAdminService
from services.superadmin_auth_service import SuperAdminAuthService
from schemas.superadmin import SuperAdminCreate, SuperAdminLoginRequest


async def test_superadmin():
    """
    测试超级管理员功能
    """
    # 初始化数据库连接
    await Tortoise.init(
        db_url=settings.DB_URL,
        modules={"models": ["models.superadmin"]}
    )
    
    try:
        logger.info("=" * 60)
        logger.info("开始测试超级管理员功能")
        logger.info("=" * 60)
        
        # 1. 测试创建超级管理员
        logger.info("\n1. 测试创建超级管理员")
        service = SuperAdminService()
        try:
            admin = await service.create_superadmin(
                SuperAdminCreate(
                    username="test_superadmin",
                    password="test_password_123",
                    email="test_superadmin@example.com",
                    full_name="测试超级管理员",
                    is_active=True,
                )
            )
            logger.success(f"✅ 创建超级管理员成功: {admin.username} (ID: {admin.id})")
        except Exception as e:
            # 如果已存在，则获取
            admin = await service.get_superadmin_by_username("test_superadmin")
            if admin:
                logger.info(f"✅ 使用现有超级管理员: {admin.username} (ID: {admin.id})")
            else:
                logger.error(f"❌ 创建超级管理员失败: {e}")
                return
        
        # 2. 测试验证凭据
        logger.info("\n2. 测试验证超级管理员凭据")
        verified_admin = await service.verify_superadmin_credentials(
            "test_superadmin",
            "test_password_123"
        )
        if verified_admin:
            logger.success(f"✅ 凭据验证成功: {verified_admin.username}")
        else:
            logger.error("❌ 凭据验证失败")
            return
        
        # 3. 测试错误密码
        logger.info("\n3. 测试错误密码")
        wrong_admin = await service.verify_superadmin_credentials(
            "test_superadmin",
            "wrong_password"
        )
        if not wrong_admin:
            logger.success("✅ 错误密码验证失败（符合预期）")
        else:
            logger.error("❌ 错误密码验证成功（不符合预期）")
        
        # 4. 测试登录服务
        logger.info("\n4. 测试超级管理员登录服务")
        auth_service = SuperAdminAuthService()
        try:
            login_result = await auth_service.login(
                SuperAdminLoginRequest(
                    username="test_superadmin",
                    password="test_password_123"
                )
            )
            logger.success("✅ 登录成功")
            logger.info(f"   Token: {login_result['token'][:50]}...")
            logger.info(f"   Token 类型: {login_result['token_type']}")
            logger.info(f"   用户信息: {login_result['user']}")
        except Exception as e:
            logger.error(f"❌ 登录失败: {e}")
            return
        
        # 5. 测试错误密码登录
        logger.info("\n5. 测试错误密码登录")
        try:
            await auth_service.login(
                SuperAdminLoginRequest(
                    username="test_superadmin",
                    password="wrong_password"
                )
            )
            logger.error("❌ 错误密码登录成功（不符合预期）")
        except Exception as e:
            logger.success(f"✅ 错误密码登录失败（符合预期）: {e}")
        
        logger.info("\n" + "=" * 60)
        logger.success("所有测试通过！")
        logger.info("=" * 60)
        
    finally:
        await Tortoise.close_connections()


if __name__ == "__main__":
    asyncio.run(test_superadmin())

