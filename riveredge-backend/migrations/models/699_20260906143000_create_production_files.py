"""INF-05 / R-06：生产文件中心表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_production_files" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "file_code" VARCHAR(50) NOT NULL,
            "catalog_kind" VARCHAR(20) NOT NULL,
            "file_type" VARCHAR(40) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "process_code" VARCHAR(80),
            "process_name" VARCHAR(200),
            "product_model" VARCHAR(120),
            "project_id" INT,
            "project_code" VARCHAR(50),
            "project_name" VARCHAR(200),
            "release_date" DATE,
            "version" VARCHAR(30) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "file_uuid" VARCHAR(36),
            "file_name" VARCHAR(200),
            "checksum" VARCHAR(128),
            "change_summary" TEXT,
            "remarks" TEXT,
            "issued_by" INT,
            "issued_by_name" VARCHAR(100),
            "issued_at" TIMESTAMPTZ,
            "receiver_names" VARCHAR(500),
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "obsolete_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_plm_prod_file_code"
            ON "apps_kuaiplm_production_files" ("tenant_id", "file_code");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_catalog"
            ON "apps_kuaiplm_production_files" ("tenant_id", "catalog_kind", "status");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_pe_dir"
            ON "apps_kuaiplm_production_files" ("tenant_id", "process_code", "product_model");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_project"
            ON "apps_kuaiplm_production_files" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_type"
            ON "apps_kuaiplm_production_files" ("tenant_id", "file_type");

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_production_file_versions" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "file_id" INT NOT NULL,
            "file_code" VARCHAR(50) NOT NULL,
            "version" VARCHAR(30) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "is_effective" BOOL NOT NULL DEFAULT FALSE,
            "is_production_effective" BOOL NOT NULL DEFAULT FALSE,
            "title" VARCHAR(200) NOT NULL,
            "file_type" VARCHAR(40),
            "release_date" DATE,
            "file_uuid" VARCHAR(36),
            "file_name" VARCHAR(200),
            "checksum" VARCHAR(128),
            "change_summary" TEXT,
            "effective_at" TIMESTAMPTZ,
            "obsolete_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_plm_prod_file_ver"
            ON "apps_kuaiplm_production_file_versions" ("tenant_id", "file_id", "version");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_ver_status"
            ON "apps_kuaiplm_production_file_versions" ("tenant_id", "file_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_ver_eff"
            ON "apps_kuaiplm_production_file_versions" ("tenant_id", "file_id", "is_effective");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_ver_pe"
            ON "apps_kuaiplm_production_file_versions"
            ("tenant_id", "file_id", "is_production_effective");

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_production_file_access_logs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "file_id" INT NOT NULL,
            "file_code" VARCHAR(50) NOT NULL,
            "version_id" INT,
            "version" VARCHAR(30),
            "action" VARCHAR(20) NOT NULL,
            "actor_user_id" INT,
            "actor_name" VARCHAR(100),
            "receiver_names" VARCHAR(500),
            "remark" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_access_file"
            ON "apps_kuaiplm_production_file_access_logs" ("tenant_id", "file_id", "created_at");
        CREATE INDEX IF NOT EXISTS "idx_plm_prod_file_access_action"
            ON "apps_kuaiplm_production_file_access_logs" ("tenant_id", "action");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_production_file_access_logs";
        DROP TABLE IF EXISTS "apps_kuaiplm_production_file_versions";
        DROP TABLE IF EXISTS "apps_kuaiplm_production_files";
    """
