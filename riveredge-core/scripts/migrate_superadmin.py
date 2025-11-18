"""
手动执行 SuperAdmin 模型数据库迁移脚本

由于 aerich 迁移工具的限制，手动执行 SQL 迁移
"""

import asyncio
import asyncpg
from loguru import logger

from app.config import settings


async def migrate():
    """
    执行 SuperAdmin 模型数据库迁移
    """
    # 使用配置中的数据库连接信息
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
        # 执行迁移 SQL
        migration_sql = """
        CREATE TABLE IF NOT EXISTS "core_superadmins" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "username" VARCHAR(50) NOT NULL UNIQUE,
            "email" VARCHAR(255),
            "password_hash" VARCHAR(255) NOT NULL,
            "full_name" VARCHAR(100),
            "is_active" BOOL NOT NULL DEFAULT True,
            "last_login" TIMESTAMPTZ,
            "device_fingerprint" VARCHAR(255)
        );
        CREATE INDEX IF NOT EXISTS "idx_core_superadmins_username" ON "core_superadmins" ("username");
        COMMENT ON COLUMN "core_superadmins"."id" IS '主键 ID';
        COMMENT ON COLUMN "core_superadmins"."created_at" IS '创建时间';
        COMMENT ON COLUMN "core_superadmins"."updated_at" IS '更新时间';
        COMMENT ON COLUMN "core_superadmins"."username" IS '用户名（全局唯一）';
        COMMENT ON COLUMN "core_superadmins"."email" IS '用户邮箱（可选，符合中国用户使用习惯）';
        COMMENT ON COLUMN "core_superadmins"."password_hash" IS '密码哈希值（使用 bcrypt 加密）';
        COMMENT ON COLUMN "core_superadmins"."full_name" IS '用户全名（可选）';
        COMMENT ON COLUMN "core_superadmins"."is_active" IS '是否激活';
        COMMENT ON COLUMN "core_superadmins"."last_login" IS '最后登录时间（可选）';
        COMMENT ON COLUMN "core_superadmins"."device_fingerprint" IS '设备指纹（可选，用于设备绑定）';
        COMMENT ON TABLE "core_superadmins" IS '超级管理员模型（独立于租户系统，不包含 tenant_id）';
        """
        
        await conn.execute(migration_sql)
        logger.info("✅ SuperAdmin 模型迁移成功")
        
        # 检查表是否存在
        table_exists = await conn.fetchval("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'core_superadmins'
            );
        """)
        
        if table_exists:
            logger.info("✅ 表 core_superadmins 已创建")
        else:
            logger.error("❌ 表 core_superadmins 创建失败")
            
    except Exception as e:
        logger.error(f"❌ 迁移失败: {e}")
        raise
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(migrate())

