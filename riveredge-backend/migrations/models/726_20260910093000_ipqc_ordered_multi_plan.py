"""工单工序有序多过程检验方案 + 过程检验单方案落章。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_work_order_operations"
            ADD COLUMN IF NOT EXISTS "inspection_plan_ids" JSONB;
        COMMENT ON COLUMN "apps_kuaizhizao_work_order_operations"."inspection_plan_ids"
            IS '过程检验方案ID有序列表（多方案按序建单；空则用 inspection_plan_id）';

        UPDATE "apps_kuaizhizao_work_order_operations"
        SET "inspection_plan_ids" = jsonb_build_array("inspection_plan_id")
        WHERE "inspection_plan_id" IS NOT NULL
          AND ("inspection_plan_ids" IS NULL OR "inspection_plan_ids" = 'null'::jsonb);

        ALTER TABLE "apps_kuaizhizao_process_inspections"
            ADD COLUMN IF NOT EXISTS "inspection_plan_id" INT;
        COMMENT ON COLUMN "apps_kuaizhizao_process_inspections"."inspection_plan_id"
            IS '本单对应的过程检验方案ID（有序多方案时区分步骤）';

        CREATE INDEX IF NOT EXISTS "idx_process_insp_wo_op_plan"
            ON "apps_kuaizhizao_process_inspections" ("tenant_id", "work_order_id", "operation_id", "inspection_plan_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_process_insp_wo_op_plan";
        ALTER TABLE "apps_kuaizhizao_process_inspections" DROP COLUMN IF EXISTS "inspection_plan_id";
        ALTER TABLE "apps_kuaizhizao_work_order_operations" DROP COLUMN IF EXISTS "inspection_plan_ids";
    """
