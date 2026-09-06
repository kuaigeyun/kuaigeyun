"""R-02：实验报告审批字段 + NG 关联质量异常。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaiplm_lab_requests"
            ADD COLUMN IF NOT EXISTS "report_status" VARCHAR(30) NOT NULL DEFAULT 'none',
            ADD COLUMN IF NOT EXISTS "report_title" VARCHAR(200),
            ADD COLUMN IF NOT EXISTS "report_submitted_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "report_approved_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "report_rejected_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "report_reject_reason" TEXT,
            ADD COLUMN IF NOT EXISTS "report_approved_by" INT,
            ADD COLUMN IF NOT EXISTS "report_approved_by_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "report_submitted_by" INT,
            ADD COLUMN IF NOT EXISTS "report_submitted_by_name" VARCHAR(100);

        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_req_report"
            ON "apps_kuaiplm_lab_requests" ("tenant_id", "report_status");

        ALTER TABLE "apps_kuaiplm_lab_request_measure_items"
            ADD COLUMN IF NOT EXISTS "quality_exception_id" INT,
            ADD COLUMN IF NOT EXISTS "quality_exception_uuid" VARCHAR(36),
            ADD COLUMN IF NOT EXISTS "exception_linked_at" TIMESTAMPTZ;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaiplm_lab_request_measure_items"
            DROP COLUMN IF EXISTS "quality_exception_id",
            DROP COLUMN IF EXISTS "quality_exception_uuid",
            DROP COLUMN IF EXISTS "exception_linked_at";
        DROP INDEX IF EXISTS "idx_kuaiplm_lab_req_report";
        ALTER TABLE "apps_kuaiplm_lab_requests"
            DROP COLUMN IF EXISTS "report_status",
            DROP COLUMN IF EXISTS "report_title",
            DROP COLUMN IF EXISTS "report_submitted_at",
            DROP COLUMN IF EXISTS "report_approved_at",
            DROP COLUMN IF EXISTS "report_rejected_at",
            DROP COLUMN IF EXISTS "report_reject_reason",
            DROP COLUMN IF EXISTS "report_approved_by",
            DROP COLUMN IF EXISTS "report_approved_by_name",
            DROP COLUMN IF EXISTS "report_submitted_by",
            DROP COLUMN IF EXISTS "report_submitted_by_name";
    """
