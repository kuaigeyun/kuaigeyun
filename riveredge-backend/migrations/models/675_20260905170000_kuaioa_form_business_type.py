"""WP-04B：自定义审批模板/申请单增加 business_type。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaioa_form_templates"
            ADD COLUMN IF NOT EXISTS "business_type" VARCHAR(50);
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_form_tpl_biz"
            ON "apps_kuaioa_form_templates" ("tenant_id", "business_type");
        COMMENT ON COLUMN "apps_kuaioa_form_templates"."business_type" IS '通用会签业务类型（空=普通自定义）';

        ALTER TABLE "apps_kuaioa_form_requests"
            ADD COLUMN IF NOT EXISTS "business_type" VARCHAR(50);
        CREATE INDEX IF NOT EXISTS "idx_kuaioa_form_req_biz"
            ON "apps_kuaioa_form_requests" ("tenant_id", "business_type");
        COMMENT ON COLUMN "apps_kuaioa_form_requests"."business_type" IS '申请业务类型快照';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kuaioa_form_req_biz";
        ALTER TABLE "apps_kuaioa_form_requests" DROP COLUMN IF EXISTS "business_type";
        DROP INDEX IF EXISTS "idx_kuaioa_form_tpl_biz";
        ALTER TABLE "apps_kuaioa_form_templates" DROP COLUMN IF EXISTS "business_type";
    """
