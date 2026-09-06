"""R-14：证照提醒渠道/接收人；固定资产生命周期阶段与事件。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaioa_licenses"
            ADD COLUMN IF NOT EXISTS "notify_user_ids" JSONB NOT NULL DEFAULT '[]'::jsonb;
        ALTER TABLE "apps_kuaioa_licenses"
            ADD COLUMN IF NOT EXISTS "notify_channels" JSONB NOT NULL DEFAULT '["internal"]'::jsonb;
        ALTER TABLE "apps_kuaioa_licenses"
            ADD COLUMN IF NOT EXISTS "notify_enabled" BOOL NOT NULL DEFAULT TRUE;

        ALTER TABLE "apps_kuaioa_asset_purchases"
            ADD COLUMN IF NOT EXISTS "lifecycle_stage" VARCHAR(40) NOT NULL DEFAULT 'draft';
        ALTER TABLE "apps_kuaioa_asset_purchases"
            ADD COLUMN IF NOT EXISTS "payment_amount" DECIMAL(20,4);
        ALTER TABLE "apps_kuaioa_asset_purchases"
            ADD COLUMN IF NOT EXISTS "payment_at" TIMESTAMPTZ;
        ALTER TABLE "apps_kuaioa_asset_purchases"
            ADD COLUMN IF NOT EXISTS "attachment_uuids" JSONB NOT NULL DEFAULT '[]'::jsonb;

        ALTER TABLE "apps_kuaioa_assets"
            ADD COLUMN IF NOT EXISTS "finance_audited_at" TIMESTAMPTZ;
        ALTER TABLE "apps_kuaioa_assets"
            ADD COLUMN IF NOT EXISTS "written_off_at" TIMESTAMPTZ;
        ALTER TABLE "apps_kuaioa_assets"
            ADD COLUMN IF NOT EXISTS "attachment_uuids" JSONB NOT NULL DEFAULT '[]'::jsonb;

        CREATE TABLE IF NOT EXISTS "apps_kuaioa_asset_lifecycle_events" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "purchase_id" INT,
            "asset_id" INT,
            "stage" VARCHAR(40) NOT NULL,
            "remark" TEXT,
            "file_uuid" VARCHAR(36),
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "occurred_at" TIMESTAMPTZ NOT NULL,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_oa_asset_life_purchase"
            ON "apps_kuaioa_asset_lifecycle_events" ("tenant_id", "purchase_id", "occurred_at");
        CREATE INDEX IF NOT EXISTS "idx_oa_asset_life_asset"
            ON "apps_kuaioa_asset_lifecycle_events" ("tenant_id", "asset_id", "occurred_at");
        CREATE INDEX IF NOT EXISTS "idx_oa_asset_life_stage"
            ON "apps_kuaioa_asset_lifecycle_events" ("tenant_id", "stage");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaioa_asset_lifecycle_events";
        ALTER TABLE "apps_kuaioa_assets" DROP COLUMN IF EXISTS "attachment_uuids";
        ALTER TABLE "apps_kuaioa_assets" DROP COLUMN IF EXISTS "written_off_at";
        ALTER TABLE "apps_kuaioa_assets" DROP COLUMN IF EXISTS "finance_audited_at";
        ALTER TABLE "apps_kuaioa_asset_purchases" DROP COLUMN IF EXISTS "attachment_uuids";
        ALTER TABLE "apps_kuaioa_asset_purchases" DROP COLUMN IF EXISTS "payment_at";
        ALTER TABLE "apps_kuaioa_asset_purchases" DROP COLUMN IF EXISTS "payment_amount";
        ALTER TABLE "apps_kuaioa_asset_purchases" DROP COLUMN IF EXISTS "lifecycle_stage";
        ALTER TABLE "apps_kuaioa_licenses" DROP COLUMN IF EXISTS "notify_enabled";
        ALTER TABLE "apps_kuaioa_licenses" DROP COLUMN IF EXISTS "notify_channels";
        ALTER TABLE "apps_kuaioa_licenses" DROP COLUMN IF EXISTS "notify_user_ids";
    """
