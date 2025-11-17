"""
FastAPI 应用入口

创建 FastAPI 应用实例，配置路由、中间件等
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from app.config import settings
from core.cache import cache
from core.database import register_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    应用生命周期管理

    在应用启动和关闭时执行相应的初始化或清理操作

    Args:
        app: FastAPI 应用实例
    """
    # 启动时执行
    logger.info("应用启动中...")

    # 连接 Redis
    await cache.connect()
    logger.info("Redis 连接成功")

    # 数据库连接由 register_tortoise 自动管理

    yield

    # 关闭时执行
    logger.info("应用关闭中...")

    # 断开 Redis 连接
    await cache.disconnect()
    logger.info("Redis 连接已关闭")


# 创建 FastAPI 应用实例
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="RiverEdge SaaS 多租户框架 - 后端核心系统",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# 配置 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)

# 注册数据库
register_db(app)

# 注册路由（后续添加）
# from api.v1 import router as v1_router
# app.include_router(v1_router, prefix="/api/v1")


@app.get("/")
async def root():
    """
    根路径

    Returns:
        dict: 欢迎信息
    """
    return {
        "message": "欢迎使用 RiverEdge SaaS 多租户框架",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    """
    健康检查接口

    Returns:
        dict: 健康状态
    """
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
