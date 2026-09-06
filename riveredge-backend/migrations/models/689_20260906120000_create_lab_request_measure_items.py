"""R-02：实验委托实测行表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_lab_request_measure_items" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "lab_request_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "item_code" VARCHAR(80),
            "item_name" VARCHAR(200) NOT NULL,
            "unit" VARCHAR(40),
            "compare_type" VARCHAR(20) NOT NULL DEFAULT 'range',
            "standard_min" VARCHAR(80),
            "standard_max" VARCHAR(80),
            "standard_value" VARCHAR(80),
            "rule_version" VARCHAR(80),
            "measured_value" VARCHAR(200),
            "auto_judgment" VARCHAR(20),
            "judgment_snapshot" JSONB,
            "manual_judgment" VARCHAR(20),
            "manual_reason" TEXT,
            "manual_by" INT,
            "manual_by_name" VARCHAR(100),
            "manual_at" TIMESTAMPTZ,
            "final_judgment" VARCHAR(20),
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_meas_req"
            ON "apps_kuaiplm_lab_request_measure_items" ("tenant_id", "lab_request_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_meas_uuid"
            ON "apps_kuaiplm_lab_request_measure_items" ("uuid");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_lab_request_measure_items";
    """
