"""
组织可用性校验（状态 + 到期时间）。

到期后须同步 status=expired 并拒绝租户侧业务访问；平台超管 impersonation 亦同。
"""

from __future__ import annotations

from fastapi import HTTPException, status

from infra.models.tenant import Tenant, TenantStatus

TENANT_EXPIRED_DETAIL = "组织已过期，请联系管理员续期"
TENANT_SUSPENDED_DETAIL = "组织已暂停，无法继续使用"
TENANT_INACTIVE_DETAIL = "组织未激活，无法继续使用"
TENANT_NOT_OPERATIONAL_DETAIL = "所属组织不可用，请重新登录"


def tenant_access_denied_detail(tenant: Tenant) -> str | None:
    """返回不可用时面向用户的说明；可用则 None。"""
    if tenant.status == TenantStatus.EXPIRED:
        return TENANT_EXPIRED_DETAIL
    if tenant.status == TenantStatus.SUSPENDED:
        return TENANT_SUSPENDED_DETAIL
    if tenant.status == TenantStatus.INACTIVE:
        return TENANT_INACTIVE_DETAIL
    if tenant.status != TenantStatus.ACTIVE:
        return TENANT_NOT_OPERATIONAL_DETAIL
    return None


async def sync_tenant_expiry_status(tenant: Tenant) -> Tenant:
    """expires_at 已过且仍为 active 时，落库 expired。"""
    if tenant.status == TenantStatus.ACTIVE and tenant.expires_at is not None:
        if await tenant.is_expired():
            tenant.status = TenantStatus.EXPIRED
            await tenant.save(update_fields=["status", "updated_at"])
    return tenant


async def filter_operational_tenant_ids(tenant_ids: set[int]) -> set[int]:
    """批量筛选仍可用的组织 ID（含到期同步）。"""
    if not tenant_ids:
        return set()
    tenants = await Tenant.filter(id__in=tenant_ids).all()
    operational: set[int] = set()
    for tenant in tenants:
        await sync_tenant_expiry_status(tenant)
        if tenant_access_denied_detail(tenant) is None:
            operational.add(tenant.id)
    return operational


async def require_operational_tenant_by_id(tenant_id: int) -> Tenant:
    """加载组织并校验可用；不可用时 403。"""
    tenant = await Tenant.get_or_none(id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="组织不存在",
        )
    await sync_tenant_expiry_status(tenant)
    detail = tenant_access_denied_detail(tenant)
    if detail:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)
    return tenant


async def require_operational_tenant_for_session(tenant_id: int) -> Tenant:
    """会话续期/鉴权：组织不可用时按 401 处理，促使前端重新登录。"""
    tenant = await Tenant.get_or_none(id=tenant_id)
    if not tenant:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="会话组织已失效，请重新登录",
            headers={"WWW-Authenticate": "Bearer"},
        )
    await sync_tenant_expiry_status(tenant)
    detail = tenant_access_denied_detail(tenant)
    if detail:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )
    return tenant
