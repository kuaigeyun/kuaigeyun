"""INF-05 / R-01：研发项目交付物版本链表与头表版本字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables"
            ADD COLUMN IF NOT EXISTS "version" VARCHAR(30) NOT NULL DEFAULT 'A0';
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables"
            ADD COLUMN IF NOT EXISTS "file_uuid" VARCHAR(36);
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables"
            ADD COLUMN IF NOT EXISTS "created_by_name" VARCHAR(100);
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables"
            ADD COLUMN IF NOT EXISTS "updated_by_name" VARCHAR(100);

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_rd_project_deliverable_versions" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "deliverable_id" INT NOT NULL,
            "project_id" INT NOT NULL,
            "version" VARCHAR(30) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "is_effective" BOOLEAN NOT NULL DEFAULT FALSE,
            "name" VARCHAR(200) NOT NULL,
            "description" TEXT,
            "deliverable_type" VARCHAR(50),
            "file_url" VARCHAR(500),
            "file_name" VARCHAR(200),
            "file_uuid" VARCHAR(36),
            "change_summary" TEXT,
            "effective_at" TIMESTAMPTZ,
            "obsolete_at" TIMESTAMPTZ,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_deliv_ver"
            ON "apps_kuaiplm_rd_project_deliverable_versions" ("tenant_id", "deliverable_id", "version");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_deliv_ver_status"
            ON "apps_kuaiplm_rd_project_deliverable_versions" ("tenant_id", "deliverable_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_deliv_ver_eff"
            ON "apps_kuaiplm_rd_project_deliverable_versions" ("tenant_id", "deliverable_id", "is_effective");
        COMMENT ON TABLE "apps_kuaiplm_rd_project_deliverable_versions" IS '研发项目交付物版本链';

        INSERT INTO "apps_kuaiplm_rd_project_deliverable_versions" (
            "uuid", "tenant_id", "created_at", "updated_at",
            "deliverable_id", "project_id", "version", "status", "is_effective",
            "name", "description", "deliverable_type",
            "file_url", "file_name",
            "created_by", "updated_by"
        )
        SELECT
            gen_random_uuid()::text,
            d."tenant_id",
            NOW(),
            NOW(),
            d."id",
            d."project_id",
            COALESCE(NULLIF(TRIM(d."version"), ''), 'A0'),
            CASE
                WHEN d."status" = 'APPROVED' THEN 'effective'
                WHEN d."status" = 'SUBMITTED' THEN 'pending'
                WHEN d."status" = 'REJECTED' THEN 'rejected'
                ELSE 'draft'
            END,
            CASE WHEN d."status" = 'APPROVED' THEN TRUE ELSE FALSE END,
            d."name",
            d."description",
            d."deliverable_type",
            d."file_url",
            d."file_name",
            d."created_by",
            d."updated_by"
        FROM "apps_kuaiplm_rd_project_deliverables" d
        WHERE d."deleted_at" IS NULL
          AND NOT EXISTS (
            SELECT 1 FROM "apps_kuaiplm_rd_project_deliverable_versions" v
            WHERE v."tenant_id" = d."tenant_id"
              AND v."deliverable_id" = d."id"
              AND v."version" = COALESCE(NULLIF(TRIM(d."version"), ''), 'A0')
              AND v."deleted_at" IS NULL
          );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_rd_project_deliverable_versions";
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables" DROP COLUMN IF EXISTS "version";
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables" DROP COLUMN IF EXISTS "file_uuid";
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables" DROP COLUMN IF EXISTS "created_by_name";
        ALTER TABLE "apps_kuaiplm_rd_project_deliverables" DROP COLUMN IF EXISTS "updated_by_name";
    """
