"""
验证 SuperAdmin 表结构脚本

检查 core_superadmins 表是否正确创建
"""

import asyncio
import asyncpg
from loguru import logger

from app.config import settings


async def verify():
    """
    验证 SuperAdmin 表结构
    """
    logger.info(f"连接到数据库: {settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}")
    
    # 连接数据库
    conn = await asyncpg.connect(
        host=settings.DB_HOST,
        port=settings.DB_PORT,
        user=settings.DB_USER,
        password=settings.DB_PASSWORD,
        database=settings.DB_NAME
    )
    
    try:
        # 检查表是否存在
        table_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'core_superadmins'
            );
        """)
        
        if not table_exists:
            logger.error("❌ 表 core_superadmins 不存在")
            return
        
        logger.info("✅ 表 core_superadmins 存在")
        
        # 获取表结构
        columns = await conn.fetch("""
            SELECT 
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public' 
            AND table_name = 'core_superadmins'
            ORDER BY ordinal_position;
        """)
        
        logger.info("\n表结构:")
        for col in columns:
            nullable = "NULL" if col['is_nullable'] == 'YES' else "NOT NULL"
            default = f" DEFAULT {col['column_default']}" if col['column_default'] else ""
            logger.info(f"  - {col['column_name']}: {col['data_type']} {nullable}{default}")
        
        # 获取索引
        indexes = await conn.fetch("""
            SELECT 
                indexname,
                indexdef
            FROM pg_indexes
            WHERE schemaname = 'public' 
            AND tablename = 'core_superadmins';
        """)
        
        logger.info("\n索引:")
        for idx in indexes:
            logger.info(f"  - {idx['indexname']}: {idx['indexdef']}")
        
        # 检查是否包含 tenant_id（应该不包含）
        has_tenant_id = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.columns
                WHERE table_schema = 'public' 
                AND table_name = 'core_superadmins'
                AND column_name = 'tenant_id'
            );
        """)
        
        if has_tenant_id:
            logger.warning("⚠️  警告：表包含 tenant_id 字段（超级管理员应该独立于租户系统）")
        else:
            logger.info("✅ 确认：表不包含 tenant_id 字段（符合超级管理员独立于租户系统的设计）")
        
    except Exception as e:
        logger.error(f"❌ 验证失败: {e}")
        raise
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(verify())

