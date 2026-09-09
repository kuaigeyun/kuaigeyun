"""
core_reminder_events 补齐 BaseModel 审计列。

101 建表未含 created_by / updated_by 等；点检创建后登记提醒会报
column "updated_by" does not exist。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
ALTER TABLE "core_reminder_events"
    ADD COLUMN IF NOT EXISTS "created_by" INT,
    ADD COLUMN IF NOT EXISTS "created_by_name" VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "updated_by" INT,
    ADD COLUMN IF NOT EXISTS "updated_by_name" VARCHAR(100),
    ADD COLUMN IF NOT EXISTS "deleted_by" INT,
    ADD COLUMN IF NOT EXISTS "deleted_by_name" VARCHAR(100);
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return ""
