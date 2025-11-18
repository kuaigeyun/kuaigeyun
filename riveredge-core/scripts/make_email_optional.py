"""
将用户邮箱字段改为可选

根据中国用户使用习惯，将邮箱字段改为可选（null=True），并去掉唯一性约束。
"""

import asyncio
import sys
from pathlib import Path

# 添加 src 目录到 Python 路径
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from loguru import logger
from core.database import init_db, close_db
from tortoise import connections


async def make_email_optional() -> None:
    """
    将用户邮箱字段改为可选
    """
    try:
        # 初始化数据库连接
        logger.info("正在初始化数据库连接...")
        await init_db()
        logger.info("数据库连接初始化成功")
        
        # 获取数据库连接
        db = connections.get('default')
        
        # 执行 SQL 语句
        logger.info("正在删除 email 字段的唯一性约束...")
        await db.execute_query('ALTER TABLE "core_users" DROP CONSTRAINT IF EXISTS "core_users_email_key"')
        logger.success("唯一性约束删除成功")
        
        logger.info("正在将 email 字段改为允许 NULL...")
        await db.execute_query('ALTER TABLE "core_users" ALTER COLUMN "email" DROP NOT NULL')
        logger.success("email 字段已改为允许 NULL")
        
        logger.info("正在删除 email 字段的索引...")
        await db.execute_query('DROP INDEX IF EXISTS "idx_core_users_email_438fe9"')
        logger.success("索引删除成功")
        
        logger.info("正在更新注释说明...")
        await db.execute_query("COMMENT ON COLUMN \"core_users\".\"email\" IS '用户邮箱（可选，符合中国用户使用习惯）'")
        logger.success("注释更新成功")
        
        logger.success("✅ 用户邮箱字段已成功改为可选！")
        
    except Exception as e:
        logger.error(f"修改邮箱字段时出错: {e}")
        import traceback
        logger.error(traceback.format_exc())
        raise
    finally:
        # 关闭数据库连接
        logger.info("正在关闭数据库连接...")
        await close_db()
        logger.info("数据库连接已关闭")


if __name__ == "__main__":
    """
    脚本入口
    
    运行此脚本以将用户邮箱字段改为可选。
    
    使用方法:
        python scripts/make_email_optional.py
    """
    logger.info("=" * 60)
    logger.info("RiverEdge SaaS 多租户框架 - 邮箱字段改为可选脚本")
    logger.info("=" * 60)
    
    try:
        asyncio.run(make_email_optional())
        logger.success("\n邮箱字段修改完成！")
    except KeyboardInterrupt:
        logger.warning("用户中断操作")
        sys.exit(1)
    except Exception as e:
        logger.error(f"修改失败: {e}")
        sys.exit(1)

