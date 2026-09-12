"""设备状态历史记录增加附件字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_status_histories"
        ADD COLUMN IF NOT EXISTS "attachments" JSONB;
        COMMENT ON COLUMN "apps_kuaizhizao_equipment_status_histories"."attachments" IS '附件列表';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_status_histories"
        DROP COLUMN IF EXISTS "attachments";
    """
