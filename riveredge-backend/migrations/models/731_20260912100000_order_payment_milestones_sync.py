from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_sales_order_milestones"
            ADD COLUMN IF NOT EXISTS "auto_generate_receivable" BOOL NOT NULL DEFAULT FALSE;
        COMMENT ON COLUMN "apps_kuaizhizao_sales_order_milestones"."auto_generate_receivable"
            IS '普通节点是否在审单后自动生成应收';

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_purchase_order_milestones" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "id" SERIAL NOT NULL PRIMARY KEY,
            "purchase_order_id" INT NOT NULL,
            "milestone_name" VARCHAR(200) NOT NULL,
            "planned_date" DATE NOT NULL,
            "planned_amount" DECIMAL(16,4) NOT NULL DEFAULT 0,
            "planned_ratio" DECIMAL(8,4),
            "billing_trigger" VARCHAR(20) NOT NULL DEFAULT 'milestone',
            "is_prepayment" BOOL NOT NULL DEFAULT FALSE,
            "auto_generate_payable" BOOL NOT NULL DEFAULT FALSE,
            "bank_account_id" INT,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "payable_id" INT,
            "payable_code" VARCHAR(50),
            "notes" TEXT
        );
        CREATE INDEX IF NOT EXISTS "idx_purchase_order_milestones_tenant_order"
            ON "apps_kuaizhizao_purchase_order_milestones" ("tenant_id", "purchase_order_id");
        CREATE INDEX IF NOT EXISTS "idx_purchase_order_milestones_planned_date"
            ON "apps_kuaizhizao_purchase_order_milestones" ("planned_date");
        CREATE INDEX IF NOT EXISTS "idx_purchase_order_milestones_status"
            ON "apps_kuaizhizao_purchase_order_milestones" ("status");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_purchase_order_milestones";
        ALTER TABLE "apps_kuaizhizao_sales_order_milestones"
            DROP COLUMN IF EXISTS "auto_generate_receivable";
    """
