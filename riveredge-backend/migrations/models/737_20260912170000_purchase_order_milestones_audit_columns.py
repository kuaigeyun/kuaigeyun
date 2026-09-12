"""
采购订单付款里程碑表补齐审计列（与销售订单 milestones 641 一致）。

根因：731 建表仅有 created_at/updated_at，ORM BaseModel 写入 created_by 等字段导致 INSERT 失败。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_purchase_order_milestones"
            ADD COLUMN IF NOT EXISTS "created_by" INT,
            ADD COLUMN IF NOT EXISTS "created_by_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "updated_by" INT,
            ADD COLUMN IF NOT EXISTS "updated_by_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "deleted_by" INT,
            ADD COLUMN IF NOT EXISTS "deleted_by_name" VARCHAR(100);
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_purchase_order_milestones"
            DROP COLUMN IF EXISTS "created_by",
            DROP COLUMN IF EXISTS "created_by_name",
            DROP COLUMN IF EXISTS "updated_by",
            DROP COLUMN IF EXISTS "updated_by_name",
            DROP COLUMN IF EXISTS "deleted_at",
            DROP COLUMN IF EXISTS "deleted_by",
            DROP COLUMN IF EXISTS "deleted_by_name";
    """
