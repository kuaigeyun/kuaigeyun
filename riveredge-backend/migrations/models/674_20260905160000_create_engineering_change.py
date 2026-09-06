"""R-04：工程变更单头、物料对照行、会签行。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_engineering_changes" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "ecn_code" VARCHAR(50) NOT NULL,
            "project_id" INT,
            "project_code" VARCHAR(50),
            "project_name" VARCHAR(200),
            "change_kind" VARCHAR(20) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "change_reason" TEXT,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "erp_ecn_no" VARCHAR(80),
            "erp_audit_status" VARCHAR(20),
            "erp_audit_notes" TEXT,
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "closed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_ecn_code"
            ON "apps_kuaiplm_engineering_changes" ("tenant_id", "ecn_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_project"
            ON "apps_kuaiplm_engineering_changes" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_kind"
            ON "apps_kuaiplm_engineering_changes" ("tenant_id", "change_kind");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_status"
            ON "apps_kuaiplm_engineering_changes" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_uuid"
            ON "apps_kuaiplm_engineering_changes" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_engineering_changes" IS '快研发 - 工程变更单';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_ecn_material_lines" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "ecn_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "before_desc" VARCHAR(500),
            "after_desc" VARCHAR(500),
            "stock_qty" DECIMAL(18,4),
            "unit_price" DECIMAL(18,6),
            "cost_amount" DECIMAL(18,4),
            "disposition" VARCHAR(20),
            "owner_user_id" INT,
            "owner_user_name" VARCHAR(100),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_mat"
            ON "apps_kuaiplm_ecn_material_lines" ("tenant_id", "ecn_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_mat_uuid"
            ON "apps_kuaiplm_ecn_material_lines" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_ecn_material_lines" IS '快研发 - 工程变更物料行';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_ecn_signoffs" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "ecn_id" INT NOT NULL,
            "dept_code" VARCHAR(50) NOT NULL,
            "dept_name" VARCHAR(100) NOT NULL,
            "sort_order" INT NOT NULL DEFAULT 0,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "result" VARCHAR(20),
            "signer_id" INT,
            "signer_name" VARCHAR(100),
            "signed_at" TIMESTAMPTZ,
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_ecn_signoff"
            ON "apps_kuaiplm_ecn_signoffs" ("tenant_id", "ecn_id", "dept_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_signoff"
            ON "apps_kuaiplm_ecn_signoffs" ("tenant_id", "ecn_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_ecn_signoff_uuid"
            ON "apps_kuaiplm_ecn_signoffs" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_ecn_signoffs" IS '快研发 - 工程变更会签行';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_ecn_signoffs";
        DROP TABLE IF EXISTS "apps_kuaiplm_ecn_material_lines";
        DROP TABLE IF EXISTS "apps_kuaiplm_engineering_changes";
    """
