"""
采购申请/采购订单明细增加工单关联字段，供工单齐套缺料与补料下推现采追溯。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_purchase_requisition_items"
            ADD COLUMN IF NOT EXISTS "work_order_id" INT;
        ALTER TABLE "apps_kuaizhizao_purchase_requisition_items"
            ADD COLUMN IF NOT EXISTS "work_order_code" VARCHAR(50);
        COMMENT ON COLUMN "apps_kuaizhizao_purchase_requisition_items"."work_order_id" IS '关联工单ID（现采/补领请购）';
        COMMENT ON COLUMN "apps_kuaizhizao_purchase_requisition_items"."work_order_code" IS '关联工单编码快照';

        ALTER TABLE "apps_kuaizhizao_purchase_order_items"
            ADD COLUMN IF NOT EXISTS "work_order_id" INT;
        ALTER TABLE "apps_kuaizhizao_purchase_order_items"
            ADD COLUMN IF NOT EXISTS "work_order_code" VARCHAR(50);
        COMMENT ON COLUMN "apps_kuaizhizao_purchase_order_items"."work_order_id" IS '关联工单ID（由采购申请行带入）';
        COMMENT ON COLUMN "apps_kuaizhizao_purchase_order_items"."work_order_code" IS '关联工单编码快照';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_purchase_requisition_items"
            DROP COLUMN IF EXISTS "work_order_code";
        ALTER TABLE "apps_kuaizhizao_purchase_requisition_items"
            DROP COLUMN IF EXISTS "work_order_id";
        ALTER TABLE "apps_kuaizhizao_purchase_order_items"
            DROP COLUMN IF EXISTS "work_order_code";
        ALTER TABLE "apps_kuaizhizao_purchase_order_items"
            DROP COLUMN IF EXISTS "work_order_id";
    """
