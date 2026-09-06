"""R-15：样品加工申请表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_sample_process_applications" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "application_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "request_kind" VARCHAR(30) NOT NULL DEFAULT 'general',
            "title" VARCHAR(200) NOT NULL,
            "pcb_material_code" VARCHAR(100),
            "pcb_version" VARCHAR(50),
            "release_date" DATE,
            "purpose" TEXT,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "attachments" JSONB NOT NULL DEFAULT '[]',
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "closed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_spa_code"
            ON "apps_kuaiplm_sample_process_applications" ("tenant_id", "application_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_spa_project"
            ON "apps_kuaiplm_sample_process_applications" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_spa_status"
            ON "apps_kuaiplm_sample_process_applications" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_spa_kind"
            ON "apps_kuaiplm_sample_process_applications" ("tenant_id", "request_kind");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_spa_uuid"
            ON "apps_kuaiplm_sample_process_applications" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_sample_process_applications" IS '快研发 - 样品加工申请';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_sample_process_applications";
    """
