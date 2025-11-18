"""
数据库连接和配置模块

配置 Tortoise ORM 数据库连接
"""

from tortoise import Tortoise
from tortoise.contrib.fastapi import register_tortoise

from app.config import settings


# Tortoise ORM 配置
# 注意：Tortoise ORM 使用 asyncpg 作为 PostgreSQL 驱动
# 连接字符串中可以包含连接池参数
TORTOISE_ORM = {
    "connections": {
        "default": {
            "engine": "tortoise.backends.asyncpg",
            "credentials": {
                "host": settings.DB_HOST,
                "port": settings.DB_PORT,
                "user": settings.DB_USER,
                "password": settings.DB_PASSWORD,
                "database": settings.DB_NAME,
                "minsize": 1,  # 最小连接数
                "maxsize": 10,  # 最大连接数
                "command_timeout": 30,  # 命令超时时间（秒）
            },
        },
    },
    "apps": {
        "models": {
            "models": [
                "models.base",
                "models.tenant",
                "models.tenant_config",
                "models.user",
                "models.role",
                "models.permission",
                "models.superadmin",
                "aerich.models",
            ],
            "default_connection": "default",
        },
    },
}


async def init_db() -> None:
    """
    初始化数据库连接

    在应用启动时调用，建立数据库连接
    """
    await Tortoise.init(config=TORTOISE_ORM)
    await Tortoise.generate_schemas()


async def close_db() -> None:
    """
    关闭数据库连接

    在应用关闭时调用，关闭数据库连接
    """
    await Tortoise.close_connections()


def register_db(app) -> None:
    """
    注册 Tortoise ORM 到 FastAPI 应用

    Args:
        app: FastAPI 应用实例
    """
    register_tortoise(
        app,
        config=TORTOISE_ORM,
        generate_schemas=False,  # 使用 Aerich 管理迁移，不自动生成
        add_exception_handlers=False,  # 禁用 Tortoise 的异常处理器，使用全局异常处理器
    )
