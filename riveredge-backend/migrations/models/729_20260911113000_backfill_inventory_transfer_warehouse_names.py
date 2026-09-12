"""
调拨单表头仓库名称回填。

根因：前端未稳定写入 from/to_warehouse_name 快照，列表依赖表头名称展示。
"""

from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
UPDATE "apps_kuaizhizao_inventory_transfers" AS t
SET "from_warehouse_name" = w."name"
FROM "apps_master_data_warehouses" AS w
WHERE t."deleted_at" IS NULL
  AND (t."from_warehouse_name" IS NULL OR TRIM(t."from_warehouse_name") = '')
  AND t."from_warehouse_id" = w."id"
  AND t."tenant_id" = w."tenant_id"
  AND w."deleted_at" IS NULL;

UPDATE "apps_kuaizhizao_inventory_transfers" AS t
SET "to_warehouse_name" = w."name"
FROM "apps_master_data_warehouses" AS w
WHERE t."deleted_at" IS NULL
  AND (t."to_warehouse_name" IS NULL OR TRIM(t."to_warehouse_name") = '')
  AND t."to_warehouse_id" = w."id"
  AND t."tenant_id" = w."tenant_id"
  AND w."deleted_at" IS NULL;
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: inventory transfer warehouse name backfill is irreversible"
