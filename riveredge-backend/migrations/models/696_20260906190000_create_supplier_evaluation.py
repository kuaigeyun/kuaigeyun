"""INF-05 / R-03：供应商评价与环保资料表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_evaluations" (
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
            "period_type" VARCHAR(20) NOT NULL DEFAULT 'annual',
            "period_year" INT NOT NULL,
            "period_quarter" INT,
            "supplier_id" INT NOT NULL,
            "supplier_code" VARCHAR(80),
            "supplier_name" VARCHAR(200),
            "audit_mode" VARCHAR(20) NOT NULL DEFAULT 'document',
            "score" DECIMAL(8,2),
            "grade" VARCHAR(8),
            "formula_version" VARCHAR(40),
            "grade_version" VARCHAR(40),
            "needs_rectification" BOOL NOT NULL DEFAULT FALSE,
            "rectification_plan" TEXT,
            "rectification_due" DATE,
            "rectification_status" VARCHAR(20) NOT NULL DEFAULT 'none',
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "attachments" JSONB,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "revoked_at" TIMESTAMPTZ,
            "revoked_by" INT,
            "revoked_by_name" VARCHAR(100),
            "revoke_reason" TEXT,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_supplier_eval_code"
            ON "apps_kuaizhizao_supplier_evaluations" ("tenant_id", "code");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_status"
            ON "apps_kuaizhizao_supplier_evaluations" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_supplier"
            ON "apps_kuaizhizao_supplier_evaluations" ("tenant_id", "supplier_id");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_eval_period"
            ON "apps_kuaizhizao_supplier_evaluations" ("tenant_id", "period_year", "period_type");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_supplier_eval_env_docs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "supplier_id" INT NOT NULL,
            "supplier_code" VARCHAR(80),
            "supplier_name" VARCHAR(200),
            "doc_type" VARCHAR(40) NOT NULL DEFAULT 'other',
            "title" VARCHAR(200) NOT NULL,
            "issued_at" DATE,
            "expires_at" DATE,
            "attachments" JSONB,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_env_supplier"
            ON "apps_kuaizhizao_supplier_eval_env_docs" ("tenant_id", "supplier_id");
        CREATE INDEX IF NOT EXISTS "idx_kz_supplier_env_expires"
            ON "apps_kuaizhizao_supplier_eval_env_docs" ("tenant_id", "expires_at");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_eval_env_docs";
        DROP TABLE IF EXISTS "apps_kuaizhizao_supplier_evaluations";
    """
