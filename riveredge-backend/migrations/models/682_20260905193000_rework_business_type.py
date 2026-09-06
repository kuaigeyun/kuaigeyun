"""R-11：返工单增加 business_type（多部门会签 / 简化执行）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            ADD COLUMN IF NOT EXISTS "business_type" VARCHAR(30) NOT NULL DEFAULT 'simple_exec';
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_business_type"
            ON "apps_kuaizhizao_rework_orders" ("tenant_id", "business_type");
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."business_type"
            IS '返工业务类型：multi_signoff/simple_exec';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_rework_business_type";
        ALTER TABLE "apps_kuaizhizao_rework_orders" DROP COLUMN IF EXISTS "business_type";
    """
