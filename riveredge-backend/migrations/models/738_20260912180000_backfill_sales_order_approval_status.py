"""
销售订单审核状态回填。

根因：审批流完成回调再次调用 approve_sales_order 时未传 is_auto_approve，
仍校验「进行中流程」导致写回失败，单据长期停留在待审核。
"""

from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
UPDATE "apps_kuaizhizao_sales_orders" AS so
SET
    "status" = 'AUDITED',
    "review_status" = 'APPROVED',
    "updated_at" = NOW()
FROM "core_approval_instances" AS ai
WHERE so."deleted_at" IS NULL
  AND so."status" IN ('PENDING_REVIEW', 'PENDING', '待审核', '已提交')
  AND so."review_status" IN ('PENDING', '待审核', '')
  AND ai."deleted_at" IS NULL
  AND ai."status" = 'approved'
  AND ai."data"->>'entity_type' = 'sales_order'
  AND (ai."data"->>'entity_id')::bigint = so."id"
  AND so."tenant_id" = ai."tenant_id";

UPDATE "apps_kuaizhizao_sales_orders" AS so
SET
    "status" = 'REJECTED',
    "review_status" = 'REJECTED',
    "updated_at" = NOW()
FROM "core_approval_instances" AS ai
WHERE so."deleted_at" IS NULL
  AND so."status" IN ('PENDING_REVIEW', 'PENDING', '待审核', '已提交')
  AND so."review_status" IN ('PENDING', '待审核', '')
  AND ai."deleted_at" IS NULL
  AND ai."status" = 'rejected'
  AND ai."data"->>'entity_type' = 'sales_order'
  AND (ai."data"->>'entity_id')::bigint = so."id"
  AND so."tenant_id" = ai."tenant_id";
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: sales order approval backfill is irreversible"
