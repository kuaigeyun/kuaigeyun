"""INF-05：体系文件版本链表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_qms_system_document_versions" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "document_id" INT NOT NULL,
            "document_code" VARCHAR(50) NOT NULL,
            "version" VARCHAR(30) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "is_effective" BOOLEAN NOT NULL DEFAULT FALSE,
            "title" VARCHAR(200) NOT NULL,
            "content" TEXT,
            "file_uuid" VARCHAR(36),
            "file_url" VARCHAR(500),
            "change_summary" TEXT,
            "effective_at" TIMESTAMPTZ,
            "obsolete_at" TIMESTAMPTZ,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_qms_doc_ver"
            ON "apps_kuaizhizao_qms_system_document_versions" ("tenant_id", "document_id", "version");
        CREATE INDEX IF NOT EXISTS "idx_qms_doc_ver_status"
            ON "apps_kuaizhizao_qms_system_document_versions" ("tenant_id", "document_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_qms_doc_ver_eff"
            ON "apps_kuaizhizao_qms_system_document_versions" ("tenant_id", "document_id", "is_effective");
        COMMENT ON TABLE "apps_kuaizhizao_qms_system_document_versions" IS '质量体系文件版本链';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_qms_system_document_versions";
    """
