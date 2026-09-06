"""R-02：快研发实验委托表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_lab_requests" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "code" VARCHAR(50) NOT NULL,
            "business_type" VARCHAR(40) NOT NULL DEFAULT 'general',
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "priority" VARCHAR(20) NOT NULL DEFAULT 'normal',
            "project_id" INT,
            "project_code" VARCHAR(80),
            "material_id" INT,
            "material_code" VARCHAR(80),
            "material_name" VARCHAR(200),
            "sample_desc" TEXT,
            "test_items" TEXT,
            "test_reason" TEXT,
            "requester_name" VARCHAR(100),
            "lab_owner_name" VARCHAR(100),
            "expected_complete_at" TIMESTAMPTZ,
            "started_at" TIMESTAMPTZ,
            "completed_at" TIMESTAMPTZ,
            "result_summary" TEXT,
            "judgment" VARCHAR(20),
            "report_file_uuid" VARCHAR(36),
            "report_url" VARCHAR(500),
            "attachments" JSONB,
            "extension_payload" JSONB,
            "submitted_at" TIMESTAMPTZ,
            "accepted_at" TIMESTAMPTZ,
            "rejected_at" TIMESTAMPTZ,
            "reject_reason" TEXT,
            "revoked_at" TIMESTAMPTZ,
            "revoke_reason" TEXT,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            CONSTRAINT "uid_kuaiplm_lab_req_tenant_code" UNIQUE ("tenant_id", "code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_status" ON "apps_kuaiplm_lab_requests" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_btype" ON "apps_kuaiplm_lab_requests" ("tenant_id", "business_type");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_due" ON "apps_kuaiplm_lab_requests" ("tenant_id", "expected_complete_at");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_prio" ON "apps_kuaiplm_lab_requests" ("tenant_id", "priority");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_uuid" ON "apps_kuaiplm_lab_requests" ("uuid");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_lab_requests";
    """
