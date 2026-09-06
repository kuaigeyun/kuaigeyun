"""R-07：年度实验计划表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_annual_lab_plans" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "plan_code" VARCHAR(50) NOT NULL,
            "plan_year" INT NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "plan_file_uuid" VARCHAR(36),
            "plan_file_name" VARCHAR(255),
            "owner_user_id" INT,
            "owner_user_name" VARCHAR(100),
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "approved_by" INT,
            "approved_by_name" VARCHAR(100),
            "rejected_at" TIMESTAMPTZ,
            "reject_reason" TEXT,
            "closed_at" TIMESTAMPTZ,
            "remarks" TEXT,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uid_kuaiplm_annual_lab_plan_code"
            ON "apps_kuaiplm_annual_lab_plans" ("tenant_id", "plan_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_plan_year"
            ON "apps_kuaiplm_annual_lab_plans" ("tenant_id", "plan_year");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_plan_status"
            ON "apps_kuaiplm_annual_lab_plans" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_plan_uuid"
            ON "apps_kuaiplm_annual_lab_plans" ("uuid");

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_annual_lab_plan_months" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "plan_id" INT NOT NULL,
            "year_month" VARCHAR(7) NOT NULL,
            "month_no" INT NOT NULL,
            "title" VARCHAR(200),
            "month_status" VARCHAR(30) NOT NULL DEFAULT 'pending',
            "owner_user_id" INT,
            "owner_user_name" VARCHAR(100),
            "due_at" TIMESTAMPTZ,
            "material_desc" TEXT,
            "issue_status" VARCHAR(30) NOT NULL DEFAULT 'none',
            "issue_submitted_at" TIMESTAMPTZ,
            "issue_approved_at" TIMESTAMPTZ,
            "issue_reject_reason" TEXT,
            "lab_request_id" INT,
            "lab_request_code" VARCHAR(50),
            "report_file_uuid" VARCHAR(36),
            "report_url" VARCHAR(500),
            "defect_desc" TEXT,
            "treatment_result" TEXT,
            "completed_at" TIMESTAMPTZ,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uid_kuaiplm_annual_lab_month"
            ON "apps_kuaiplm_annual_lab_plan_months" ("tenant_id", "plan_id", "year_month");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_month_plan"
            ON "apps_kuaiplm_annual_lab_plan_months" ("tenant_id", "plan_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_month_ym"
            ON "apps_kuaiplm_annual_lab_plan_months" ("tenant_id", "year_month");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_month_status"
            ON "apps_kuaiplm_annual_lab_plan_months" ("tenant_id", "month_status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_month_issue"
            ON "apps_kuaiplm_annual_lab_plan_months" ("tenant_id", "issue_status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_annual_lab_month_uuid"
            ON "apps_kuaiplm_annual_lab_plan_months" ("uuid");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_annual_lab_plan_months";
        DROP TABLE IF EXISTS "apps_kuaiplm_annual_lab_plans";
    """
