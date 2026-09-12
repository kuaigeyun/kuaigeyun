"""组织到期与可用性校验。"""

from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import HTTPException

from infra.domain.tenant.tenant_access import (
    TENANT_EXPIRED_DETAIL,
    filter_operational_tenant_ids,
    require_operational_tenant_by_id,
    sync_tenant_expiry_status,
    tenant_access_denied_detail,
)
from infra.models.tenant import TenantStatus


def test_tenant_access_denied_detail_expired():
    tenant = MagicMock()
    tenant.status = TenantStatus.EXPIRED
    assert tenant_access_denied_detail(tenant) == TENANT_EXPIRED_DETAIL


def test_tenant_access_denied_detail_active():
    tenant = MagicMock()
    tenant.status = TenantStatus.ACTIVE
    assert tenant_access_denied_detail(tenant) is None


@pytest.mark.asyncio
async def test_sync_tenant_expiry_status_marks_expired():
    tenant = MagicMock()
    tenant.status = TenantStatus.ACTIVE
    tenant.expires_at = datetime.now(timezone.utc) - timedelta(hours=1)
    tenant.is_expired = AsyncMock(return_value=True)
    tenant.save = AsyncMock()

    await sync_tenant_expiry_status(tenant)

    assert tenant.status == TenantStatus.EXPIRED
    tenant.save.assert_awaited_once()


@pytest.mark.asyncio
async def test_require_operational_tenant_by_id_raises_when_expired():
    tenant = MagicMock()
    tenant.status = TenantStatus.ACTIVE
    tenant.expires_at = datetime.now(timezone.utc) - timedelta(minutes=1)
    tenant.is_expired = AsyncMock(return_value=True)
    tenant.save = AsyncMock()

    with patch(
        "infra.domain.tenant.tenant_access.Tenant.get_or_none",
        new=AsyncMock(return_value=tenant),
    ):
        with pytest.raises(HTTPException) as exc:
            await require_operational_tenant_by_id(1)
    assert exc.value.status_code == 403
    assert exc.value.detail == TENANT_EXPIRED_DETAIL


@pytest.mark.asyncio
async def test_filter_operational_tenant_ids_excludes_expired():
    active = MagicMock()
    active.id = 1
    active.status = TenantStatus.ACTIVE
    active.expires_at = None
    active.is_expired = AsyncMock(return_value=False)
    active.save = AsyncMock()

    expired = MagicMock()
    expired.id = 2
    expired.status = TenantStatus.ACTIVE
    expired.expires_at = datetime.now(timezone.utc) - timedelta(days=1)
    expired.is_expired = AsyncMock(return_value=True)
    expired.save = AsyncMock(side_effect=lambda **_: setattr(expired, "status", TenantStatus.EXPIRED))

    with patch(
        "infra.domain.tenant.tenant_access.Tenant.filter",
    ) as mock_filter:
        mock_filter.return_value.all = AsyncMock(return_value=[active, expired])
        result = await filter_operational_tenant_ids({1, 2})

    assert result == {1}
