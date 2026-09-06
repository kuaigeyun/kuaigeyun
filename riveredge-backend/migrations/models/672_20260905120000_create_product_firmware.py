"""R-15：产品固件表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_product_firmwares" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "firmware_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "version" VARCHAR(50) NOT NULL,
            "release_date" DATE,
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "file_uuid" VARCHAR(36),
            "file_name" VARCHAR(200),
            "checksum" VARCHAR(128),
            "change_summary" TEXT,
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "released_at" TIMESTAMPTZ,
            "obsolete_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_fw_code"
            ON "apps_kuaiplm_product_firmwares" ("tenant_id", "firmware_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_fw_project"
            ON "apps_kuaiplm_product_firmwares" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_fw_status"
            ON "apps_kuaiplm_product_firmwares" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_fw_uuid"
            ON "apps_kuaiplm_product_firmwares" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_product_firmwares" IS '快研发 - 产品固件';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_product_firmwares";
    """
