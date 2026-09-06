"""库存过账的事务去重，以及单据确认/撤回的串行边界。"""
import hashlib
import inspect
from contextlib import asynccontextmanager
from contextvars import ContextVar
from functools import wraps
from uuid import uuid4

from tortoise.transactions import in_transaction
from tortoise import connections
from tortoise.backends.base.client import BaseTransactionWrapper

_posting_scope: ContextVar[str | None] = ContextVar("stock_posting_scope", default=None)


@asynccontextmanager
async def _stock_transaction():
    conn = connections.get("default")
    if isinstance(conn, BaseTransactionWrapper):
        # Tortoise 0.21 的嵌套事务锁不可重入；复用单据事务，避免三层嵌套死锁。
        try:
            yield conn
        except BaseException:
            if not conn._finalized:
                await conn.rollback()
            raise
    else:
        async with in_transaction() as conn:
            yield conn


def atomic_stock_change(func):
    @wraps(func)
    async def wrapped(*args, **kwargs):
        async with _stock_transaction():
            return await func(*args, **kwargs)
    return wrapped


async def _lock(conn, key: str) -> None:
    lock_id = int.from_bytes(hashlib.sha256(key.encode()).digest()[:8], "big", signed=True)
    await conn.execute_query("SELECT pg_advisory_xact_lock($1)", [lock_id])


def idempotent_stock_change(func):
    """先锁定幂等操作，再查流水；余额和全部拆批流水与此检查同事务提交。"""
    signature = inspect.signature(func)

    @wraps(func)
    async def wrapped(*args, **kwargs):
        bound = signature.bind(*args, **kwargs)
        key = bound.arguments.get("idempotency_key")
        if not key:
            return await func(*args, **kwargs)
        tenant_id = bound.arguments["tenant_id"]
        scope = _posting_scope.get()
        if scope:
            # 确认→撤回→再次确认是新过账，不能沿用历史单据明细键。
            key = f"{key}@{scope}"
            bound.arguments["idempotency_key"] = key
        from apps.kuaizhizao.models.material_stock_movement import MaterialStockMovement

        async with _stock_transaction() as conn:
            await _lock(conn, f"stock-posting:{tenant_id}:{key}")
            # FIFO 首条使用原键；全部走负库存时首条为 #neg0。
            if await MaterialStockMovement.filter(
                tenant_id=tenant_id, idempotency_key__in=[key, f"{key}#neg0"],
            ).using_db(conn).exists():
                return True
            return await func(*bound.args, **bound.kwargs)

    return wrapped


def serialize_stock_document(document_type: str, id_parameter: str):
    """同一单据的确认和撤回互斥；锁内重新读取并校验状态。"""
    def decorate(func):
        signature = inspect.signature(func)

        @wraps(func)
        async def wrapped(*args, **kwargs):
            values = signature.bind(*args, **kwargs).arguments
            async with _stock_transaction() as conn:
                await _lock(conn, f"stock-document:{document_type}:{values['tenant_id']}:{values[id_parameter]}")
                token = _posting_scope.set(uuid4().hex)
                try:
                    return await func(*args, **kwargs)
                finally:
                    _posting_scope.reset(token)
        return wrapped
    return decorate
