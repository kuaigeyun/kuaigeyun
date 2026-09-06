"""INF-03：提醒事件账本表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "core_reminder_events" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "rule_id" VARCHAR(100) NOT NULL,
            "rule_code" VARCHAR(100),
            "entity_type" VARCHAR(100) NOT NULL,
            "entity_id" INT NOT NULL,
            "entity_uuid" VARCHAR(36),
            "channel" VARCHAR(20) NOT NULL,
            "planned_at" TIMESTAMPTZ NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "attempt_count" INT NOT NULL DEFAULT 0,
            "last_error" TEXT,
            "sent_at" TIMESTAMPTZ,
            "stopped_reason" VARCHAR(200),
            "payload" JSONB,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_core_reminder_events_dedupe"
            ON "core_reminder_events" (
                "tenant_id", "rule_id", "entity_type", "entity_id", "planned_at", "channel"
            );
        CREATE INDEX IF NOT EXISTS "idx_core_reminder_events_due"
            ON "core_reminder_events" ("tenant_id", "status", "planned_at");
        CREATE INDEX IF NOT EXISTS "idx_core_reminder_events_entity"
            ON "core_reminder_events" ("tenant_id", "entity_type", "entity_id");
        CREATE INDEX IF NOT EXISTS "idx_core_reminder_events_uuid"
            ON "core_reminder_events" ("uuid");
        COMMENT ON TABLE "core_reminder_events" IS '提醒事件账本（防重复发送）';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "core_reminder_events";
    """
