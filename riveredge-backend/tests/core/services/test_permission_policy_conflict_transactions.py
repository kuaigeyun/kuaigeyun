"""使用专用 PostgreSQL 测试库验证真实唯一约束冲突恢复。"""
import os
import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
import pytest_asyncio
from tortoise import Tortoise
from tortoise.transactions import in_transaction

from core.models.data_permission_policy import DataPermissionPolicy
from core.models.field_permission_policy import FieldPermissionPolicy
from core.schemas.permission_policy import FieldPermissionPolicyUpsert, DataPermissionPolicyUpsert
from core.services.authorization.permission_policy_service import PermissionPolicyService as Service


@pytest_asyncio.fixture
async def database():
    url = os.environ.get("POLICY_TEST_DATABASE_URL")
    if not url:
        pytest.skip("requires disposable PostgreSQL")
    if not url.rsplit("/", 1)[-1].startswith("codex_stock_test"):
        pytest.fail("use dedicated codex_stock_test database")
    await Tortoise.init(db_url=url, modules={"models": ["core.models.data_permission_policy", "core.models.field_permission_policy"]})
    await Tortoise.generate_schemas()
    await DataPermissionPolicy.all().delete()
    await FieldPermissionPolicy.all().delete()
    try:
        yield
    finally:
        await Tortoise.close_connections()


@pytest.mark.asyncio
async def test_field_policy_conflict_reuses_row_without_aborting_transaction(database):
    row = await FieldPermissionPolicy.create(tenant_id=1, role_uuid="fixture", resource="sales:order", field_name="amount", mask_level="masked", deleted_at=datetime.now(timezone.utc))
    item = FieldPermissionPolicyUpsert(resource="sales:order", field_name="amount", mask_level="hidden")
    existing = {}
    async with in_transaction() as conn:
        await Service._upsert_field_policy_row(tenant_id=1, role_uuid="fixture", item=item, existing_by_key=existing, key=(item.resource,item.field_name))
        await conn.execute_query("SELECT 1")
    await row.refresh_from_db()
    assert row.deleted_at is None and row.mask_level == "hidden"
    assert existing[(item.resource,item.field_name)].id == row.id
    assert await FieldPermissionPolicy.all().count() == 1


@pytest.mark.asyncio
async def test_data_policy_stale_snapshot_recovers_unique_conflict(database, monkeypatch):
    row = await DataPermissionPolicy.create(tenant_id=1, role_uuid="fixture", resource="sales:order", scope_type="scope_all", deleted_at=datetime.now(timezone.utc))
    monkeypatch.setattr(Service, "_collect_allowed_function_resources", AsyncMock(return_value={"sales:order"}))
    monkeypatch.setattr(Service, "_collect_role_granted_function_resources", AsyncMock(return_value={"sales:order"}))
    monkeypatch.setattr(Service, "list_data_policies", AsyncMock(return_value=[]))
    original = DataPermissionPolicy.filter
    first = True
    def stale_once(*args, **kwargs):
        nonlocal first
        if first:
            first = False
            return SimpleNamespace(order_by=AsyncMock(return_value=[]))
        return original(*args, **kwargs)
    monkeypatch.setattr(DataPermissionPolicy, "filter", stale_once)
    await Service.save_data_policies(1, "fixture", [DataPermissionPolicyUpsert(resource="sales:order", scope_type="scope_self")])
    await row.refresh_from_db()
    assert row.deleted_at is None and row.scope_type == "scope_self"
    assert await DataPermissionPolicy.all().count() == 1


@pytest.mark.asyncio
async def test_concurrent_field_policy_creation_leaves_one_row(database):
    item = FieldPermissionPolicyUpsert(resource="sales:order", field_name="amount", mask_level="hidden")
    async def save():
        async with in_transaction():
            await Service._upsert_field_policy_row(tenant_id=1, role_uuid="fixture", item=item, existing_by_key={}, key=(item.resource,item.field_name))
    await asyncio.gather(*(save() for _ in range(8)))
    assert await FieldPermissionPolicy.all().count() == 1
    assert (await FieldPermissionPolicy.first()).mask_level == "hidden"
