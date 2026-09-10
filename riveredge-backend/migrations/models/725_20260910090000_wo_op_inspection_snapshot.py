"""工单工序过程检验落章字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_work_order_operations"
            ADD COLUMN IF NOT EXISTS "inspection_mode" VARCHAR(20);
        COMMENT ON COLUMN "apps_kuaizhizao_work_order_operations"."inspection_mode"
            IS '过程检验模式落章（none/simple/plan；空=未落章，回落工序主数据）';

        ALTER TABLE "apps_kuaizhizao_work_order_operations"
            ADD COLUMN IF NOT EXISTS "inspection_plan_id" INT;
        COMMENT ON COLUMN "apps_kuaizhizao_work_order_operations"."inspection_plan_id"
            IS '过程检验方案ID落章（方案质检时）';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_work_order_operations" DROP COLUMN IF EXISTS "inspection_plan_id";
        ALTER TABLE "apps_kuaizhizao_work_order_operations" DROP COLUMN IF EXISTS "inspection_mode";
    """
