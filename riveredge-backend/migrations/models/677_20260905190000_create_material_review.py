"""R-15：物料评审表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_material_reviews" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "review_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_mr_code"
            ON "apps_kuaiplm_material_reviews" ("tenant_id", "review_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_mr_project"
            ON "apps_kuaiplm_material_reviews" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_mr_status"
            ON "apps_kuaiplm_material_reviews" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_mr_uuid"
            ON "apps_kuaiplm_material_reviews" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_material_reviews" IS '快研发 - 物料评审';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_material_review_lines" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "review_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "usage_status" VARCHAR(20) NOT NULL,
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_mrl_review"
            ON "apps_kuaiplm_material_review_lines" ("tenant_id", "review_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_mrl_uuid"
            ON "apps_kuaiplm_material_review_lines" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_material_review_lines" IS '快研发 - 物料评审明细';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_material_review_lines";
        DROP TABLE IF EXISTS "apps_kuaiplm_material_reviews";
    """
