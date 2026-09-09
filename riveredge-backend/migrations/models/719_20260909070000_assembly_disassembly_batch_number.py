"""
组装单 / 拆卸单增加批号字段：出库扣减须指定在库批号。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_disassembly_orders"
            ADD COLUMN IF NOT EXISTS "product_batch_number" VARCHAR(100);
        COMMENT ON COLUMN "apps_kuaizhizao_disassembly_orders"."product_batch_number"
            IS '成品出库批号（批号管理物料拆卸扣减必填）';

        ALTER TABLE "apps_kuaizhizao_assembly_orders"
            ADD COLUMN IF NOT EXISTS "product_batch_number" VARCHAR(100);
        COMMENT ON COLUMN "apps_kuaizhizao_assembly_orders"."product_batch_number"
            IS '成品入库批号（可选；空则按批号规则自动生成）';

        ALTER TABLE "apps_kuaizhizao_assembly_order_items"
            ADD COLUMN IF NOT EXISTS "batch_number" VARCHAR(100);
        COMMENT ON COLUMN "apps_kuaizhizao_assembly_order_items"."batch_number"
            IS '组件出库批号（批号管理物料组装扣减必填）';

        ALTER TABLE "apps_kuaizhizao_disassembly_order_items"
            ADD COLUMN IF NOT EXISTS "batch_number" VARCHAR(100);
        COMMENT ON COLUMN "apps_kuaizhizao_disassembly_order_items"."batch_number"
            IS '组件入库批号（可选；空则按批号规则自动生成）';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_disassembly_orders"
            DROP COLUMN IF EXISTS "product_batch_number";
        ALTER TABLE "apps_kuaizhizao_assembly_orders"
            DROP COLUMN IF EXISTS "product_batch_number";
        ALTER TABLE "apps_kuaizhizao_assembly_order_items"
            DROP COLUMN IF EXISTS "batch_number";
        ALTER TABLE "apps_kuaizhizao_disassembly_order_items"
            DROP COLUMN IF EXISTS "batch_number";
    """
