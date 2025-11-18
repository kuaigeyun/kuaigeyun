"""
FastAPI 应用入口

创建 FastAPI 应用实例，配置路由、中间件等
"""

from contextlib import asynccontextmanager
import traceback

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from loguru import logger

from app.config import settings
from app.middleware import TenantContextMiddleware
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

# 全局异常处理器（必须在注册路由之前注册）
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    全局异常处理器
    
    捕获所有未处理的异常，记录日志并返回友好的错误信息
    """
    # 记录详细的错误信息
    logger.error(f"未处理的异常: {exc}")
    logger.error(f"请求路径: {request.url.path}")
    logger.error(f"请求方法: {request.method}")
    logger.error(f"错误堆栈: {traceback.format_exc()}")
    
    # 返回错误响应
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
            "path": request.url.path,
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    请求验证异常处理器
    
    处理 Pydantic 验证错误
    """
    logger.error(f"请求验证失败: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )

# 配置租户上下文中间件（必须在 CORS 之后，路由之前）
app.add_middleware(TenantContextMiddleware)

# 注册数据库
register_db(app)

# 注册路由
from api.v1.tenants import router as tenants_router
from api.v1.auth import router as auth_router
from api.v1.register import router as register_router
from api.v1.users import router as users_router
from api.v1.roles import router as roles_router
from api.v1.permissions import router as permissions_router
from api.v1.superadmin.auth import router as superadmin_auth_router
from api.v1.superadmin.tenants import router as superadmin_tenants_router
from api.v1.superadmin.monitoring import router as superadmin_monitoring_router
app.include_router(tenants_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(register_router, prefix="/api/v1")
app.include_router(users_router, prefix="/api/v1")
app.include_router(roles_router, prefix="/api/v1")
app.include_router(permissions_router, prefix="/api/v1")
app.include_router(superadmin_auth_router, prefix="/api/v1")
app.include_router(superadmin_tenants_router, prefix="/api/v1")
app.include_router(superadmin_monitoring_router, prefix="/api/v1")


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
