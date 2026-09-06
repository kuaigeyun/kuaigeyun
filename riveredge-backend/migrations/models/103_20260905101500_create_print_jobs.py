"""INF-07：打印工位桥接任务表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "core_print_jobs" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "idempotency_key" VARCHAR(120) NOT NULL,
            "template_uuid" VARCHAR(36) NOT NULL,
            "template_version" INT,
            "device_uuid" VARCHAR(36),
            "copies" INT NOT NULL DEFAULT 1,
            "entity_type" VARCHAR(100),
            "entity_id" INT,
            "entity_uuid" VARCHAR(36),
            "payload_snapshot" JSONB NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "is_reprint" BOOLEAN NOT NULL DEFAULT FALSE,
            "source_job_id" INT,
            "bridge_receipt" JSONB,
            "error_message" TEXT,
            "requested_by" INT,
            "requested_by_name" VARCHAR(100),
            "completed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_core_print_jobs_idem"
            ON "core_print_jobs" ("tenant_id", "idempotency_key");
        CREATE INDEX IF NOT EXISTS "idx_core_print_jobs_status"
            ON "core_print_jobs" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_core_print_jobs_entity"
            ON "core_print_jobs" ("tenant_id", "entity_type", "entity_id");
        COMMENT ON TABLE "core_print_jobs" IS '打印工位桥接任务（幂等）';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "core_print_jobs";
    """
