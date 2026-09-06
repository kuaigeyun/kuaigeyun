"""R-12：培训部门申请、年度计划审批字段、特殊作业资格、培训模板、记录确认。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaioa_training_plans"
            ADD COLUMN IF NOT EXISTS "plan_year" INT,
            ADD COLUMN IF NOT EXISTS "due_date" DATE,
            ADD COLUMN IF NOT EXISTS "source_application_id" INT,
            ADD COLUMN IF NOT EXISTS "distributed_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "applicant_id" INT,
            ADD COLUMN IF NOT EXISTS "applicant_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "submitted_at" TIMESTAMPTZ;
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_training_plans_year"
            ON "apps_kuaioa_training_plans" ("tenant_id", "plan_year");
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_training_plans_due"
            ON "apps_kuaioa_training_plans" ("tenant_id", "due_date");

        ALTER TABLE "apps_kuaioa_training_records"
            ADD COLUMN IF NOT EXISTS "record_kind" VARCHAR(30) NOT NULL DEFAULT 'production',
            ADD COLUMN IF NOT EXISTS "due_date" DATE,
            ADD COLUMN IF NOT EXISTS "attachment_file_uuid" VARCHAR(36),
            ADD COLUMN IF NOT EXISTS "content_summary" TEXT,
            ADD COLUMN IF NOT EXISTS "template_id" INT,
            ADD COLUMN IF NOT EXISTS "hr_confirmed_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "hr_confirmed_by" INT,
            ADD COLUMN IF NOT EXISTS "hr_confirmed_by_name" VARCHAR(100);
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_training_records_due"
            ON "apps_kuaioa_training_records" ("tenant_id", "due_date");
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_training_records_kind"
            ON "apps_kuaioa_training_records" ("tenant_id", "record_kind");

        CREATE TABLE IF NOT EXISTS "apps_kuaioa_dept_training_applications" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "request_code" VARCHAR(50) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "plan_year" INT NOT NULL,
            "department_name" VARCHAR(100),
            "training_content" TEXT,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "applicant_id" INT,
            "applicant_name" VARCHAR(100),
            "notes" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kuaioa_dept_train_app_code" UNIQUE ("tenant_id", "request_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_dept_train_app_status"
            ON "apps_kuaioa_dept_training_applications" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_dept_train_app_year"
            ON "apps_kuaioa_dept_training_applications" ("tenant_id", "plan_year");

        CREATE TABLE IF NOT EXISTS "apps_kuaioa_special_work_qualifications" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "request_code" VARCHAR(50) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "qualification_year" INT NOT NULL,
            "holder_id" INT,
            "holder_name" VARCHAR(100),
            "job_type" VARCHAR(100),
            "confirmation_content" TEXT,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "applicant_id" INT,
            "applicant_name" VARCHAR(100),
            "department_name" VARCHAR(100),
            "notes" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kuaioa_special_work_code" UNIQUE ("tenant_id", "request_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_special_work_status"
            ON "apps_kuaioa_special_work_qualifications" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_special_work_year"
            ON "apps_kuaioa_special_work_qualifications" ("tenant_id", "qualification_year");

        CREATE TABLE IF NOT EXISTS "apps_kuaioa_training_templates" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "template_code" VARCHAR(50) NOT NULL,
            "template_name" VARCHAR(200) NOT NULL,
            "template_kind" VARCHAR(30) NOT NULL,
            "content_body" TEXT,
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kuaioa_training_tpl_code" UNIQUE ("tenant_id", "template_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_training_tpl_kind"
            ON "apps_kuaioa_training_templates" ("tenant_id", "template_kind", "is_active");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaioa_training_templates";
        DROP TABLE IF EXISTS "apps_kuaioa_special_work_qualifications";
        DROP TABLE IF EXISTS "apps_kuaioa_dept_training_applications";
        ALTER TABLE "apps_kuaioa_training_records"
            DROP COLUMN IF EXISTS "record_kind",
            DROP COLUMN IF EXISTS "due_date",
            DROP COLUMN IF EXISTS "attachment_file_uuid",
            DROP COLUMN IF EXISTS "content_summary",
            DROP COLUMN IF EXISTS "template_id",
            DROP COLUMN IF EXISTS "hr_confirmed_at",
            DROP COLUMN IF EXISTS "hr_confirmed_by",
            DROP COLUMN IF EXISTS "hr_confirmed_by_name";
        ALTER TABLE "apps_kuaioa_training_plans"
            DROP COLUMN IF EXISTS "plan_year",
            DROP COLUMN IF EXISTS "due_date",
            DROP COLUMN IF EXISTS "source_application_id",
            DROP COLUMN IF EXISTS "distributed_at",
            DROP COLUMN IF EXISTS "applicant_id",
            DROP COLUMN IF EXISTS "applicant_name",
            DROP COLUMN IF EXISTS "submitted_at";
    """
