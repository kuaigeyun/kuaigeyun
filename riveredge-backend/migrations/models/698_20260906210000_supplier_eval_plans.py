"""R-03：评价计划 + 评价单 plan 溯源字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_eval_plans" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "code" VARCHAR(50) NOT NULL,
            "name" VARCHAR(200) NOT NULL,
            "period_type" VARCHAR(20) NOT NULL DEFAULT 'annual',
            "period_year" INT NOT NULL,
            "period_quarter" INT,
            "template_id" INT NOT NULL,
            "template_code" VARCHAR(50),
            "template_name" VARCHAR(200),
            "audit_mode" VARCHAR(20) NOT NULL DEFAULT 'document',
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_supplier_eval_plan_code"
            ON "apps_kuaizhizao_supplier_eval_plans" ("tenant_id", "code");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_plan_period"
            ON "apps_kuaizhizao_supplier_eval_plans" ("tenant_id", "period_year", "period_type");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_eval_plan_lines" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "plan_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "supplier_id" INT NOT NULL,
            "supplier_code" VARCHAR(80),
            "supplier_name" VARCHAR(200),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_plan_line"
            ON "apps_kuaizhizao_supplier_eval_plan_lines" ("tenant_id", "plan_id");

        ALTER TABLE "apps_kuaizhizao_supplier_evaluations"
            ADD COLUMN IF NOT EXISTS "plan_id" INT,
            ADD COLUMN IF NOT EXISTS "plan_code" VARCHAR(50);
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_plan_ref"
            ON "apps_kuaizhizao_supplier_evaluations" ("tenant_id", "plan_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_supplier_eval_plan_ref";
        ALTER TABLE "apps_kuaizhizao_supplier_evaluations"
            DROP COLUMN IF EXISTS "plan_id",
            DROP COLUMN IF EXISTS "plan_code";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_eval_plan_lines";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_eval_plans";
    """
