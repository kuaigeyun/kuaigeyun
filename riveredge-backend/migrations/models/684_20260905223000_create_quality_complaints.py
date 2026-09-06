"""R-11：质量投诉单表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_quality_complaints" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "code" VARCHAR(50) NOT NULL,
            "business_type" VARCHAR(30) NOT NULL DEFAULT 'iqc_incoming',
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "defect_category" VARCHAR(50),
            "description" TEXT,
            "supplier_id" INT,
            "supplier_code" VARCHAR(80),
            "supplier_name" VARCHAR(200),
            "customer_id" INT,
            "customer_code" VARCHAR(80),
            "customer_name" VARCHAR(200),
            "material_id" INT,
            "material_code" VARCHAR(80),
            "material_name" VARCHAR(200),
            "batch_no" VARCHAR(100),
            "quantity" DECIMAL(18,4),
            "unit" VARCHAR(20),
            "sla_workdays" INT NOT NULL DEFAULT 5,
            "due_at" TIMESTAMPTZ,
            "supplier_response" TEXT,
            "supplier_response_attachments" JSONB,
            "attachments" JSONB,
            "export_masked" BOOL NOT NULL DEFAULT FALSE,
            "eight_d_report_id" INT,
            "source_inspection_type" VARCHAR(50),
            "source_inspection_id" INT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "closed_at" TIMESTAMPTZ,
            "closed_by" INT,
            "closed_by_name" VARCHAR(100),
            "revoked_at" TIMESTAMPTZ,
            "revoked_by" INT,
            "revoked_by_name" VARCHAR(100),
            "revoke_reason" TEXT,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_quality_complaint_code"
            ON "apps_kuaizhizao_quality_complaints" ("tenant_id", "code");
        CREATE INDEX IF NOT EXISTS "idx_kz_qc_status"
            ON "apps_kuaizhizao_quality_complaints" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kz_qc_type"
            ON "apps_kuaizhizao_quality_complaints" ("tenant_id", "business_type");
        CREATE INDEX IF NOT EXISTS "idx_kz_qc_due"
            ON "apps_kuaizhizao_quality_complaints" ("tenant_id", "due_at");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_quality_complaints";
    """
