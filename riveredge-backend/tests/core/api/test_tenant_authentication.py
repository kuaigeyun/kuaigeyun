"""Tenant-only routes must authenticate before accepting an organization header."""
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from fastapi import Depends, FastAPI, HTTPException
from httpx import ASGITransport, AsyncClient

from core.api.deps import deps


@pytest.mark.asyncio
@pytest.mark.parametrize(
    "token,header,expected",
    [(None, "21", 401), ("invalid", "21", 401), ("inactive", "21", 403),
     ("user", "22", 403), ("user", "21", 200), ("user", None, 200),
     ("no-tenant", "21", 401), ("admin", None, 400), ("admin", "21", 200),
     ("admin", "0", 400), ("admin", "bad", 400)],
)
async def test_tenant_only_route_authenticates(monkeypatch, token, header, expected):
    async def authenticate(request, token):
        if token in (None, "invalid"):
            raise HTTPException(401, "invalid session")
        if token == "inactive":
            raise HTTPException(403, "inactive user")
        return SimpleNamespace(
            tenant_id=21 if token == "user" else None,
            _is_infra_superadmin=token == "admin",
        )

    auth = AsyncMock(side_effect=authenticate)
    monkeypatch.setattr(deps, "soil_get_current_user", auth)
    # A stale context must never select a tenant for a new authenticated request.
    monkeypatch.setattr(deps, "get_tenant_id_from_context", lambda: 99, raising=False)
    monkeypatch.setattr(deps, "set_current_tenant_id", lambda tenant: None)
    # Legacy decoder fixtures make the original insecure route runnable too.
    monkeypatch.setattr(deps, "get_token_payload", lambda t: {"tenant_id": 21} if t == "user" else None, raising=False)
    monkeypatch.setattr(deps, "get_infra_superadmin_token_payload", lambda t: {"sub": "1"} if t == "admin" else None, raising=False)
    app = FastAPI()

    @app.get("/tenant-resource")
    async def resource(tenant_id: int = Depends(deps.get_current_tenant)):
        return {"tenant_id": tenant_id}

    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if header is not None:
        headers["X-Tenant-ID"] = header
    async with AsyncClient(transport=ASGITransport(app), base_url="http://test") as client:
        response = await client.get("/tenant-resource", headers=headers)
    assert response.status_code == expected
    if expected == 200:
        assert response.json() == {"tenant_id": 21}
        auth.assert_awaited_once()
