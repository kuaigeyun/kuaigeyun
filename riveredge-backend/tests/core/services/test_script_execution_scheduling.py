import asyncio
import subprocess
import threading
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock

import pytest
from core.services.scheduling import script_service as module


def setup(monkeypatch, kind="python"):
    script = SimpleNamespace(is_active=True, is_running=False, type=kind,
        content="fixture", config={}, save=AsyncMock())
    monkeypatch.setattr(module.settings, "ENABLE_SCRIPT_EXECUTION", True)
    monkeypatch.setattr(module.ScriptService, "get_script_by_uuid", AsyncMock(return_value=script))
    return script, SimpleNamespace(async_execution=False, parameters={})


@pytest.mark.asyncio
@pytest.mark.parametrize("kind", ["python", "shell"])
async def test_script_wait_does_not_block_event_loop(monkeypatch, kind):
    script, request = setup(monkeypatch, kind)
    timer = threading.Event()
    observed = []
    def run(*a, **kw):
        observed.append(timer.wait(timeout=0.3))
        return SimpleNamespace(stdout="fixture output", stderr="", returncode=0)
    monkeypatch.setattr(module.subprocess, "run", run)
    asyncio.get_running_loop().call_later(0.01, timer.set)
    result = await module.ScriptService.execute_script(1, "fixture", request)
    assert observed == [True], "the event loop timer could not run while waiting for the script"
    assert result["success"] and result["output"] == "fixture output"
    assert not script.is_running


@pytest.mark.asyncio
async def test_timeout_still_resets_running_status(monkeypatch):
    script, request = setup(monkeypatch)
    monkeypatch.setattr(module.subprocess, "run", MagicMock(side_effect=subprocess.TimeoutExpired("fixture", 300)))
    result = await module.ScriptService.execute_script(1, "fixture", request)
    assert not result["success"]
    assert "超时" in result["error"]
    assert not script.is_running


@pytest.mark.asyncio
async def test_disabled_scripts_never_start_process(monkeypatch):
    _, request = setup(monkeypatch)
    monkeypatch.setattr(module.settings, "ENABLE_SCRIPT_EXECUTION", False)
    run = MagicMock()
    monkeypatch.setattr(module.subprocess, "run", run)
    with pytest.raises(module.ValidationError):
        await module.ScriptService.execute_script(1, "fixture", request)
    run.assert_not_called()


@pytest.mark.asyncio
async def test_cancellation_keeps_running_flag_until_process_finishes(monkeypatch):
    script, request = setup(monkeypatch)
    started, release = threading.Event(), threading.Event()
    def run(*a, **kw):
        started.set()
        release.wait(timeout=1)
        return SimpleNamespace(stdout="", stderr="", returncode=0)
    monkeypatch.setattr(module.subprocess, "run", run)
    task = asyncio.create_task(module.ScriptService.execute_script(1, "fixture", request))
    await asyncio.to_thread(started.wait, 1)
    task.cancel()
    await asyncio.sleep(0.01)
    try:
        assert script.is_running
    finally:
        release.set()
    with pytest.raises(asyncio.CancelledError):
        await task
    assert not script.is_running
