"""R-03 深化：评价模板/条款、评价明细、整改关闭字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_eval_templates" (
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
            "version" VARCHAR(40) NOT NULL DEFAULT 'v1',
            "grade_version" VARCHAR(40) NOT NULL DEFAULT 'v1',
            "grade_bands" JSONB,
            "period_type" VARCHAR(20),
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_supplier_eval_tpl_code"
            ON "apps_kuaizhizao_supplier_eval_templates" ("tenant_id", "code");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_tpl_active"
            ON "apps_kuaizhizao_supplier_eval_templates" ("tenant_id", "is_active");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_eval_template_clauses" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "template_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "clause_code" VARCHAR(50) NOT NULL,
            "clause_name" VARCHAR(200) NOT NULL,
            "weight" DECIMAL(10,4) NOT NULL DEFAULT 1,
            "max_score" DECIMAL(10,2) NOT NULL DEFAULT 100,
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_tpl_clause"
            ON "apps_kuaizhizao_supplier_eval_template_clauses" ("tenant_id", "template_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_evaluation_lines" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "evaluation_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "clause_code" VARCHAR(50) NOT NULL,
            "clause_name" VARCHAR(200) NOT NULL,
            "weight" DECIMAL(10,4) NOT NULL DEFAULT 1,
            "max_score" DECIMAL(10,2) NOT NULL DEFAULT 100,
            "score" DECIMAL(10,2),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_line"
            ON "apps_kuaizhizao_supplier_evaluation_lines" ("tenant_id", "evaluation_id");

        ALTER TABLE "apps_kuaizhizao_supplier_evaluations"
            ADD COLUMN IF NOT EXISTS "template_id" INT,
            ADD COLUMN IF NOT EXISTS "template_code" VARCHAR(50),
            ADD COLUMN IF NOT EXISTS "template_name" VARCHAR(200),
            ADD COLUMN IF NOT EXISTS "rectification_result" TEXT,
            ADD COLUMN IF NOT EXISTS "rectification_closed_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "rectification_closed_by" INT,
            ADD COLUMN IF NOT EXISTS "rectification_closed_by_name" VARCHAR(100);
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_supplier_evaluations"
            DROP COLUMN IF EXISTS "template_id",
            DROP COLUMN IF EXISTS "template_code",
            DROP COLUMN IF EXISTS "template_name",
            DROP COLUMN IF EXISTS "rectification_result",
            DROP COLUMN IF EXISTS "rectification_closed_at",
            DROP COLUMN IF EXISTS "rectification_closed_by",
            DROP COLUMN IF EXISTS "rectification_closed_by_name";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_evaluation_lines";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_eval_template_clauses";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_eval_templates";
    """
