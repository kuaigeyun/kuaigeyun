"""INF-04：消息日志业务追溯字段与重试计数。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "retry_count" INT NOT NULL DEFAULT 0;
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "business_document" VARCHAR(100);
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "business_action" VARCHAR(50);
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "entity_type" VARCHAR(100);
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "entity_id" INT;
        ALTER TABLE "core_message_logs"
            ADD COLUMN IF NOT EXISTS "entity_uuid" VARCHAR(36);
        CREATE INDEX IF NOT EXISTS "idx_core_msg_logs_biz_doc"
            ON "core_message_logs" ("tenant_id", "business_document", "entity_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_core_msg_logs_biz_doc";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "entity_uuid";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "entity_id";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "entity_type";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "business_action";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "business_document";
        ALTER TABLE "core_message_logs" DROP COLUMN IF EXISTS "retry_count";
    """
