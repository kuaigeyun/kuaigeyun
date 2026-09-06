"""R-10 WP-10.2：模具供应商半年回签字段与履历表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "signback_required" BOOL NOT NULL DEFAULT TRUE;
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "signback_period_months" INT NOT NULL DEFAULT 6;
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "last_signback_date" DATE;
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "next_signback_due" DATE;
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "last_signback_supplier" VARCHAR(200);
        ALTER TABLE "apps_kuaizhizao_molds"
            ADD COLUMN IF NOT EXISTS "last_signback_attachments" JSONB;
        CREATE INDEX IF NOT EXISTS "idx_kz_molds_signback_due"
            ON "apps_kuaizhizao_molds" ("tenant_id", "next_signback_due");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_mold_signbacks" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "mold_id" INT NOT NULL,
            "mold_uuid" VARCHAR(36) NOT NULL,
            "mold_code" VARCHAR(50),
            "mold_name" VARCHAR(200),
            "period_due" DATE,
            "signed_at" DATE NOT NULL,
            "supplier_name" VARCHAR(200),
            "attachments" JSONB,
            "remark" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_mold_signback_mold"
            ON "apps_kuaizhizao_mold_signbacks" ("tenant_id", "mold_id");
        CREATE INDEX IF NOT EXISTS "idx_kz_mold_signback_signed"
            ON "apps_kuaizhizao_mold_signbacks" ("tenant_id", "signed_at");

        UPDATE "apps_kuaizhizao_molds"
        SET "next_signback_due" = (
            COALESCE("last_signback_date", "installation_date", "purchase_date", CURRENT_DATE)
            + (("signback_period_months")::INT * INTERVAL '1 month')
        )
        WHERE "deleted_at" IS NULL
          AND "signback_required" IS TRUE
          AND "next_signback_due" IS NULL;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_mold_signbacks";
        DROP INDEX IF EXISTS "idx_kz_molds_signback_due";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "last_signback_attachments";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "last_signback_supplier";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "next_signback_due";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "last_signback_date";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "signback_period_months";
        ALTER TABLE "apps_kuaizhizao_molds" DROP COLUMN IF EXISTS "signback_required";
    """
