"""R-15：BOM 协同表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_bom_collaborations" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "collab_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "electronics_status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "structure_status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "remarks" TEXT,
            "master_bom_id" INT,
            "master_bom_code" VARCHAR(80),
            "entered_by" INT,
            "entered_by_name" VARCHAR(100),
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "entered_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_bomc_code"
            ON "apps_kuaiplm_bom_collaborations" ("tenant_id", "collab_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomc_project"
            ON "apps_kuaiplm_bom_collaborations" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomc_status"
            ON "apps_kuaiplm_bom_collaborations" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomc_uuid"
            ON "apps_kuaiplm_bom_collaborations" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_bom_collaborations" IS '快研发 - BOM 协同';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_bom_collaboration_lines" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "collab_id" INT NOT NULL,
            "section" VARCHAR(20) NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "qty" DECIMAL(18,4),
            "unit" VARCHAR(20),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomcl_collab"
            ON "apps_kuaiplm_bom_collaboration_lines" ("tenant_id", "collab_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomcl_section"
            ON "apps_kuaiplm_bom_collaboration_lines" ("tenant_id", "collab_id", "section");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_bomcl_uuid"
            ON "apps_kuaiplm_bom_collaboration_lines" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_bom_collaboration_lines" IS '快研发 - BOM 协同明细';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_bom_collaboration_lines";
        DROP TABLE IF EXISTS "apps_kuaiplm_bom_collaborations";
    """
