"""R-10 WP-10.3：设备工装验收目录与履历。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_equipment_acceptances" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "acceptance_no" VARCHAR(64) NOT NULL,
            "target_type" VARCHAR(20) NOT NULL,
            "target_id" INT NOT NULL,
            "target_uuid" VARCHAR(36) NOT NULL,
            "target_code" VARCHAR(50),
            "target_name" VARCHAR(200),
            "category" VARCHAR(100),
            "due_date" DATE NOT NULL,
            "accepted_at" DATE,
            "result" VARCHAR(32),
            "exception_problem" TEXT,
            "solution" TEXT,
            "handled_at" TIMESTAMPTZ,
            "applicant_id" INT,
            "applicant_name" VARCHAR(100),
            "status" VARCHAR(32) NOT NULL DEFAULT '草稿',
            "approver_id" INT,
            "approver_name" VARCHAR(100),
            "approved_at" TIMESTAMPTZ,
            "reject_reason" TEXT,
            "attachments" JSONB,
            "remark" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_eq_acceptance_no" UNIQUE ("tenant_id", "acceptance_no")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_acc_status"
            ON "apps_kuaizhizao_equipment_acceptances" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_acc_target"
            ON "apps_kuaizhizao_equipment_acceptances" ("tenant_id", "target_type", "target_id");
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_acc_due"
            ON "apps_kuaizhizao_equipment_acceptances" ("tenant_id", "due_date");
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_acc_category"
            ON "apps_kuaizhizao_equipment_acceptances" ("tenant_id", "category");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_equipment_acceptances";
    """
