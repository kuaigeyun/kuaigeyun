"""R-13：生产日报模板与日报单据。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_production_daily_templates" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "template_code" VARCHAR(50) NOT NULL,
            "template_name" VARCHAR(200) NOT NULL,
            "description" TEXT,
            "field_schema" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "sort_order" INT NOT NULL DEFAULT 0,
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "is_system" BOOL NOT NULL DEFAULT FALSE,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_prod_daily_tpl_code" UNIQUE ("tenant_id", "template_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_prod_daily_tpl_active"
            ON "apps_kuaizhizao_production_daily_templates" ("tenant_id", "is_active", "sort_order");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_production_daily_reports" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "code" VARCHAR(50) NOT NULL,
            "template_id" INT NOT NULL,
            "template_code" VARCHAR(50) NOT NULL,
            "template_name" VARCHAR(200) NOT NULL,
            "report_date" DATE NOT NULL,
            "team_name" VARCHAR(100),
            "shift_name" VARCHAR(50),
            "workshop_name" VARCHAR(100),
            "plant_name" VARCHAR(100),
            "field_values" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "submitted_at" TIMESTAMPTZ,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_prod_daily_report_code" UNIQUE ("tenant_id", "code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_prod_daily_report_date"
            ON "apps_kuaizhizao_production_daily_reports" ("tenant_id", "report_date");
        CREATE INDEX IF NOT EXISTS "idx_kz_prod_daily_report_tpl"
            ON "apps_kuaizhizao_production_daily_reports" ("tenant_id", "template_code", "report_date");
        CREATE INDEX IF NOT EXISTS "idx_kz_prod_daily_report_team"
            ON "apps_kuaizhizao_production_daily_reports" ("tenant_id", "team_name");
        CREATE INDEX IF NOT EXISTS "idx_kz_prod_daily_report_status"
            ON "apps_kuaizhizao_production_daily_reports" ("tenant_id", "status");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_production_daily_reports";
        DROP TABLE IF EXISTS "apps_kuaizhizao_production_daily_templates";
    """
