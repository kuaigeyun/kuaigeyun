"""R-10 WP-10.1：工装台账补入库/数量/保管/产品型号与借还快照。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "quantity" INT NOT NULL DEFAULT 1;
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "custodian_name" VARCHAR(100);
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "inbound_date" DATE;
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "product_model" VARCHAR(120);
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "current_borrower_name" VARCHAR(100);
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "current_borrow_at" TIMESTAMPTZ;
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "last_return_at" TIMESTAMPTZ;
        ALTER TABLE "apps_kuaizhizao_tools"
            ADD COLUMN IF NOT EXISTS "last_return_by_name" VARCHAR(100);
        CREATE INDEX IF NOT EXISTS "idx_kz_tools_product_model"
            ON "apps_kuaizhizao_tools" ("tenant_id", "product_model");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_tools_product_model";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "last_return_by_name";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "last_return_at";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "current_borrow_at";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "current_borrower_name";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "product_model";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "inbound_date";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "custodian_name";
        ALTER TABLE "apps_kuaizhizao_tools" DROP COLUMN IF EXISTS "quantity";
    """
