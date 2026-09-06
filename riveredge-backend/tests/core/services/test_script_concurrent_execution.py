import asyncio
import os
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock
from urllib.parse import urlparse

import pytest
import pytest_asyncio
from tortoise import Tortoise

from core.models.script import Script
from core.schemas.script import ScriptExecuteRequest, ScriptUpdate
from core.services.scheduling import script_service as service


@pytest_asyncio.fixture
async def database():
    url = os.environ.get("SCRIPT_TEST_DATABASE_URL")
    if not url:
        pytest.skip("需要显式配置一次性 PostgreSQL 测试库")
    if urlparse(url).path != "/codex_stock_test":
        pytest.fail("拒绝在非 codex 测试库执行并发测试")
    await Tortoise.init(db_url=url, modules={"models": ["core.models.script"]})
    await Tortoise.generate_schemas(safe=True)
    await Script.all().delete()
    yield
    await Script.all().delete()
    await Tortoise.close_connections()


@pytest.mark.asyncio
async def test_eight_database_claims_only_start_one_script(database, monkeypatch):
    script = await Script.create(tenant_id=1, name="fixture", code="fixture", type="python", content="fixture")
    monkeypatch.setattr(service.settings, "ENABLE_SCRIPT_EXECUTION", True)
    original_get = service.ScriptService.get_script_by_uuid
    read_barrier = asyncio.Event()
    read_count = 0

    async def read(*args):
        nonlocal read_count
        snapshot = await original_get(*args)
        read_count += 1
        if read_count == 8:
            read_barrier.set()
        await read_barrier.wait()
        return snapshot

    monkeypatch.setattr(service.ScriptService, "get_script_by_uuid", read)
    # 所有真实条件 UPDATE 完成后再启动执行，确定性验证同一次竞争。
    from tortoise.queryset import UpdateQuery
    original_await = UpdateQuery.__await__
    claim_barrier = asyncio.Event()
    claim_count = 0

    def await_update(query):
        async def wait_for_claims():
            nonlocal claim_count
            result = await _await_original(query)
            claim_count += 1
            if claim_count == 8:
                claim_barrier.set()
            await asyncio.wait_for(claim_barrier.wait(), 2)
            return result
        return wait_for_claims().__await__()

    class _await_original:
        def __init__(self, query):
            self.query = query
        def __await__(self):
            return original_await(self.query)

    monkeypatch.setattr(UpdateQuery, "__await__", await_update)
    run = MagicMock(return_value=SimpleNamespace(stdout="fixture", stderr="", returncode=0))
    monkeypatch.setattr(service.subprocess, "run", run)
    results = await asyncio.wait_for(asyncio.gather(*[
        service.ScriptService.execute_script(1, str(script.uuid), ScriptExecuteRequest()) for _ in range(8)
    ], return_exceptions=True), 5)
    assert run.call_count == 1, results
    assert sum(isinstance(result, service.ValidationError) for result in results) == 7
    await script.refresh_from_db()
    assert not script.is_running
    assert script.last_run_status == "success"


def fixture(monkeypatch):
    script = SimpleNamespace(uuid="fixture", is_active=True, is_running=False, type="python",
        content="fixture", config={}, save=AsyncMock())
    monkeypatch.setattr(service.settings, "ENABLE_SCRIPT_EXECUTION", True)
    monkeypatch.setattr(service.ScriptService, "get_script_by_uuid", AsyncMock(return_value=script))
    query = MagicMock()
    query.update = AsyncMock(return_value=1)
    monkeypatch.setattr(Script, "filter", MagicMock(return_value=query))
    return script, query


@pytest.mark.asyncio
async def test_lost_claim_never_starts_or_clears_other_execution(monkeypatch):
    script, query = fixture(monkeypatch)
    query.update.return_value = 0
    run = MagicMock()
    monkeypatch.setattr(service.subprocess, "run", run)
    with pytest.raises(service.ValidationError):
        await service.ScriptService.execute_script(1, "fixture", ScriptExecuteRequest())
    run.assert_not_called()
    script.save.assert_not_awaited()


@pytest.mark.asyncio
async def test_process_failure_releases_running_flag_without_overwriting_content(monkeypatch):
    script, query = fixture(monkeypatch)
    monkeypatch.setattr(service.subprocess, "run", MagicMock(side_effect=RuntimeError("fixture error")))
    result = await service.ScriptService.execute_script(1, "fixture", ScriptExecuteRequest())
    assert not result["success"] and not script.is_running
    fields = script.save.call_args.kwargs["update_fields"]
    assert "is_running" in fields and "content" not in fields and "deleted_at" not in fields
    assert Script.filter.call_args.kwargs["is_running"] is False
    assert Script.filter.call_args.kwargs["is_active"] is True
    assert Script.filter.call_args.kwargs["tenant_id"] == 1


@pytest.mark.asyncio
@pytest.mark.parametrize("operation", ["update", "delete"])
async def test_edit_and_delete_do_not_overwrite_running_state(monkeypatch, operation):
    script, _ = fixture(monkeypatch)
    if operation == "update":
        await service.ScriptService.update_script(1, "fixture", ScriptUpdate(name="edited"))
        assert "name" in script.save.call_args.kwargs["update_fields"]
    else:
        await service.ScriptService.delete_script(1, "fixture")
        assert "deleted_at" in script.save.call_args.kwargs["update_fields"]
    assert "is_running" not in script.save.call_args.kwargs["update_fields"]


@pytest.mark.asyncio
async def test_unsupported_async_mode_does_not_claim_execution(monkeypatch):
    _, query = fixture(monkeypatch)
    with pytest.raises(service.ValidationError):
        await service.ScriptService.execute_script(1, "fixture", ScriptExecuteRequest(async_execution=True))
    query.update.assert_not_awaited()
