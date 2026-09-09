"""
生产领料明细挂工单：支持批量下推合并为一张领料单（明细按工单分段）。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_production_picking_items"
            ADD COLUMN IF NOT EXISTS "work_order_id" INT;
        ALTER TABLE "apps_kuaizhizao_production_picking_items"
            ADD COLUMN IF NOT EXISTS "work_order_code" VARCHAR(50);
        COMMENT ON COLUMN "apps_kuaizhizao_production_picking_items"."work_order_id"
            IS '来源工单ID（批量合并领料时按行区分）';
        COMMENT ON COLUMN "apps_kuaizhizao_production_picking_items"."work_order_code"
            IS '来源工单编号';

        UPDATE "apps_kuaizhizao_production_picking_items" AS i
        SET
            "work_order_id" = p."work_order_id",
            "work_order_code" = p."work_order_code"
        FROM "apps_kuaizhizao_production_pickings" AS p
        WHERE i."picking_id" = p."id"
          AND i."work_order_id" IS NULL
          AND p."work_order_id" IS NOT NULL;

        CREATE INDEX IF NOT EXISTS "idx_prod_pick_item_wo"
            ON "apps_kuaizhizao_production_picking_items" ("tenant_id", "work_order_id");

        ALTER TABLE "apps_kuaizhizao_production_pickings"
            ALTER COLUMN "work_order_code" TYPE VARCHAR(500);
        COMMENT ON COLUMN "apps_kuaizhizao_production_pickings"."work_order_code"
            IS '工单编号（多工单合并时为编号拼接或「首单等N单」）';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_prod_pick_item_wo";
        ALTER TABLE "apps_kuaizhizao_production_picking_items"
            DROP COLUMN IF EXISTS "work_order_id";
        ALTER TABLE "apps_kuaizhizao_production_picking_items"
            DROP COLUMN IF EXISTS "work_order_code";
        ALTER TABLE "apps_kuaizhizao_production_pickings"
            ALTER COLUMN "work_order_code" TYPE VARCHAR(50);
    """
