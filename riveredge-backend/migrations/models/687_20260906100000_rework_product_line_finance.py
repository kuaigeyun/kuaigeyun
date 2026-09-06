"""R-11：返工单产品线 + 财务会签门控支撑字段已存在，仅补产品线。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            ADD COLUMN IF NOT EXISTS "product_line_code" VARCHAR(50);
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."product_line_code"
            IS '产品线代码（字典）';
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_product_line"
            ON "apps_kuaizhizao_rework_orders" ("tenant_id", "product_line_code");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_rework_product_line";
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            DROP COLUMN IF EXISTS "product_line_code";
    """
