"""质量异常 create_from_inspection 幂等：闭环后不得再造待处理。"""

from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from apps.kuaizhizao.services.exception_service import ExceptionService

_NOW = datetime(2026, 9, 9, 8, 0, 0, tzinfo=timezone.utc)


def _exception_ns(**overrides):
    base = dict(
        exception_type="inspection_failure",
        problem_description="desc",
        severity="major",
        uuid="u-1",
        tenant_id=1,
        work_order_id=None,
        work_order_code=None,
        material_id=1,
        material_code="M1",
        material_name="物料",
        batch_no=None,
        inspection_record_id=99,
        inspection_source_type="finished_goods_inspection",
        root_cause=None,
        corrective_action=None,
        preventive_action=None,
        responsible_person_id=None,
        responsible_person_name=None,
        planned_completion_date=None,
        actual_completion_date=None,
        verification_result=None,
        handled_by=None,
        handled_by_name=None,
        handled_at=None,
        remarks=None,
        created_at=_NOW,
        updated_at=_NOW,
        created_by=1,
        created_by_name="u",
        updated_by=1,
        updated_by_name="u",
        deleted_at=None,
    )
    base.update(overrides)
    return SimpleNamespace(**base)


class _FilterChain:
    def __init__(self, *, active=None, closed=None):
        self._active = active
        self._closed = closed
        self._mode = "base"

    def filter(self, **kwargs):
        status_in = kwargs.get("status__in")
        status = kwargs.get("status")
        nxt = _FilterChain(active=self._active, closed=self._closed)
        if status_in is not None:
            nxt._mode = "active"
        elif status == "closed":
            nxt._mode = "closed"
        return nxt

    def order_by(self, *_args, **_kwargs):
        return self

    async def first(self):
        if self._mode == "active":
            return self._active
        if self._mode == "closed":
            return self._closed
        return self._active or self._closed


@pytest.mark.asyncio
async def test_create_from_inspection_returns_closed_without_recreate(monkeypatch):
    closed = _exception_ns(
        id=40,
        status="closed",
        verification_result="done",
        handled_by=1,
        handled_by_name="u",
    )
    create_mock = AsyncMock()
    monkeypatch.setattr(
        "apps.kuaizhizao.models.quality_exception.QualityException.filter",
        lambda **_kwargs: _FilterChain(active=None, closed=closed),
    )
    monkeypatch.setattr(
        "apps.kuaizhizao.models.quality_exception.QualityException.create",
        create_mock,
    )

    result = await ExceptionService().create_from_inspection(
        tenant_id=1,
        source_type="finished_goods_inspection",
        source_id=99,
        created_by=1,
        problem_description="不应再建",
    )
    assert result.id == 40
    assert result.status == "closed"
    create_mock.assert_not_called()


@pytest.mark.asyncio
async def test_create_from_inspection_returns_active_without_recreate(monkeypatch):
    active = _exception_ns(
        id=10,
        status="pending",
        inspection_record_id=85,
        inspection_source_type="process_inspection",
    )
    create_mock = AsyncMock()
    monkeypatch.setattr(
        "apps.kuaizhizao.models.quality_exception.QualityException.filter",
        lambda **_kwargs: _FilterChain(active=active, closed=None),
    )
    monkeypatch.setattr(
        "apps.kuaizhizao.models.quality_exception.QualityException.create",
        create_mock,
    )

    result = await ExceptionService().create_from_inspection(
        tenant_id=1,
        source_type="process_inspection",
        source_id=85,
        created_by=1,
    )
    assert result.id == 10
    assert result.status == "pending"
    create_mock.assert_not_called()
