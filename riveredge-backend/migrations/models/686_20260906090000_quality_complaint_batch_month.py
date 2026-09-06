"""R-05：质量投诉总批次月录入表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_quality_complaint_batch_months" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "year_month" VARCHAR(7) NOT NULL,
            "total_batch_count" INT NOT NULL,
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_qc_batch_month"
            ON "apps_kuaizhizao_quality_complaint_batch_months" ("tenant_id", "year_month");
        CREATE INDEX IF NOT EXISTS "idx_kz_qc_batch_month_tenant"
            ON "apps_kuaizhizao_quality_complaint_batch_months" ("tenant_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_quality_complaint_batch_months";
    """
