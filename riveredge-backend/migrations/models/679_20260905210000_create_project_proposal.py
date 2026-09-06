"""R-15：项目建议书表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_project_proposals" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "proposal_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "summary" TEXT,
            "customer_name" VARCHAR(200),
            "expected_date" DATE,
            "supplier_id" INT,
            "supplier_code" VARCHAR(80),
            "supplier_name" VARCHAR(200),
            "supplier_contact" VARCHAR(200),
            "supplier_remark" TEXT,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "issued_at" TIMESTAMPTZ,
            "issued_by" INT,
            "issued_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_pp_code"
            ON "apps_kuaiplm_project_proposals" ("tenant_id", "proposal_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_pp_project"
            ON "apps_kuaiplm_project_proposals" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_pp_status"
            ON "apps_kuaiplm_project_proposals" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_pp_supplier"
            ON "apps_kuaiplm_project_proposals" ("tenant_id", "supplier_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_pp_uuid"
            ON "apps_kuaiplm_project_proposals" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_project_proposals" IS '快研发 - 项目建议书';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_project_proposals";
    """
