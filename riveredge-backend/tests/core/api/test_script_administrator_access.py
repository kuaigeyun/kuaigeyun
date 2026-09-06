from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi import FastAPI

from core.api.scripts import scripts as api


@pytest.mark.asyncio
@pytest.mark.parametrize("method,path,body", [
    ("POST", "/scripts", {"name": "fixture", "code": "fixture", "type": "python", "content": "fixture"}),
    ("GET", "/scripts", None),
    ("GET", "/scripts/fixture", None),
    ("PUT", "/scripts/fixture", {"content": "fixture"}),
    ("DELETE", "/scripts/fixture", None),
    ("POST", "/scripts/fixture/execute", {}),
])
@pytest.mark.parametrize("identity", ["ordinary", "tenant_admin", "invalid_platform_flag"])
async def test_tenant_accounts_cannot_access_host_scripts(monkeypatch, method, path, body, identity):
    app = FastAPI()
    app.include_router(api.router)
    user = SimpleNamespace(id=51, tenant_id=1, is_active=True,
        is_infra_admin=identity == "invalid_platform_flag", is_tenant_admin=identity == "tenant_admin")
    app.dependency_overrides[api.soil_get_current_user] = lambda: user
    app.dependency_overrides[api.get_current_tenant] = lambda: 1
    calls = []
    async def reached(*args, **kwargs):
        calls.append(True)
        # 旧代码若抵达服务，即记录越权；无需运行数据库或脚本。
        raise api.ValidationError("fixture reached service")
    for name in ["create_script", "list_scripts", "get_script_by_uuid", "update_script", "delete_script", "execute_script"]:
        monkeypatch.setattr(api.ScriptService, name, reached)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app, raise_app_exceptions=False), base_url="http://fixture") as client:
        response = await client.request(method, path, json=body)
    assert response.status_code == 403 and not calls, (response.status_code, calls)


@pytest.mark.asyncio
async def test_platform_administrator_can_execute_in_explicit_tenant(monkeypatch):
    app = FastAPI()
    app.include_router(api.router)
    user = SimpleNamespace(id=51, tenant_id=None, is_active=True, is_infra_admin=True, is_tenant_admin=False)
    app.dependency_overrides[api.soil_get_current_user] = lambda: user
    app.dependency_overrides[api.get_current_tenant] = lambda: 1
    run = AsyncMock(return_value={"success": True, "output": "fixture"})
    monkeypatch.setattr(api.ScriptService, "execute_script", run)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://fixture") as client:
        response = await client.post("/scripts/fixture/execute", json={})
    assert response.status_code == 200
    assert run.call_args.kwargs["tenant_id"] == 1


@pytest.mark.asyncio
async def test_anonymous_request_is_rejected():
    app = FastAPI()
    app.include_router(api.router)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://fixture") as client:
        response = await client.post("/scripts/fixture/execute", json={})
    assert response.status_code == 401
