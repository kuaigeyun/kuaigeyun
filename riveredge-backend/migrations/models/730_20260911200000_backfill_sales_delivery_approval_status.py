"""
销售出库 / 生产领料审核状态回填。

根因：审批流完成回调再次调用 approve_* 时，仍校验「进行中流程」导致写回失败，
单据长期停留在待审核；另有无审核下推时 status=待出库 但 review_status 仍为待审核。
"""

from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
UPDATE "apps_kuaizhizao_sales_deliveries" AS sd
SET
    "status" = '待出库',
    "review_status" = '已通过',
    "updated_at" = NOW()
FROM "core_approval_instances" AS ai
WHERE sd."deleted_at" IS NULL
  AND sd."status" = '待审核'
  AND sd."review_status" IN ('待审核', '')
  AND ai."deleted_at" IS NULL
  AND ai."status" = 'approved'
  AND ai."data"->>'entity_type' = 'sales_delivery'
  AND (ai."data"->>'entity_id')::bigint = sd."id"
  AND sd."tenant_id" = ai."tenant_id";

UPDATE "apps_kuaizhizao_sales_deliveries"
SET
    "review_status" = '已通过',
    "updated_at" = NOW()
WHERE "deleted_at" IS NULL
  AND "status" = '待出库'
  AND "review_status" IN ('待审核', '');

UPDATE "apps_kuaizhizao_production_pickings" AS pp
SET
    "status" = '待领料',
    "review_status" = '已通过',
    "updated_at" = NOW()
FROM "core_approval_instances" AS ai
WHERE pp."deleted_at" IS NULL
  AND pp."status" = '待审核'
  AND pp."review_status" IN ('待审核', '')
  AND ai."deleted_at" IS NULL
  AND ai."status" = 'approved'
  AND ai."data"->>'entity_type' = 'production_picking'
  AND (ai."data"->>'entity_id')::bigint = pp."id"
  AND pp."tenant_id" = ai."tenant_id";

UPDATE "apps_kuaizhizao_production_pickings"
SET
    "review_status" = '已通过',
    "updated_at" = NOW()
WHERE "deleted_at" IS NULL
  AND "status" = '待领料'
  AND "review_status" IN ('待审核', '');
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: sales delivery / production picking approval backfill is irreversible"
