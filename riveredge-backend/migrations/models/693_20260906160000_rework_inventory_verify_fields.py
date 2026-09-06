"""R-07：返工单库存验证扩展字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            ADD COLUMN IF NOT EXISTS "verify_month" VARCHAR(7),
            ADD COLUMN IF NOT EXISTS "show_to_customer" BOOL NOT NULL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "pqc_summary" TEXT,
            ADD COLUMN IF NOT EXISTS "pqc_summary_file_uuid" VARCHAR(36),
            ADD COLUMN IF NOT EXISTS "pqc_checked_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "pqc_checked_by" INT,
            ADD COLUMN IF NOT EXISTS "pqc_checked_by_name" VARCHAR(100);

        CREATE INDEX IF NOT EXISTS "idx_kz_rework_verify_month"
            ON "apps_kuaizhizao_rework_orders" ("tenant_id", "verify_month");
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_show_customer"
            ON "apps_kuaizhizao_rework_orders" ("tenant_id", "show_to_customer");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_rework_show_customer";
        DROP INDEX IF EXISTS "idx_kz_rework_verify_month";
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            DROP COLUMN IF EXISTS "verify_month",
            DROP COLUMN IF EXISTS "show_to_customer",
            DROP COLUMN IF EXISTS "pqc_summary",
            DROP COLUMN IF EXISTS "pqc_summary_file_uuid",
            DROP COLUMN IF EXISTS "pqc_checked_at",
            DROP COLUMN IF EXISTS "pqc_checked_by",
            DROP COLUMN IF EXISTS "pqc_checked_by_name";
    """
