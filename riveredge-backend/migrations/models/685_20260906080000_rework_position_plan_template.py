"""R-11：返工排位策划模板主数据 + 单据排位行扩展字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_rework_order_position_plans"
            ADD COLUMN IF NOT EXISTS "section_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "planned_headcount" DECIMAL(18,4),
            ADD COLUMN IF NOT EXISTS "standard_minutes" DECIMAL(18,4),
            ADD COLUMN IF NOT EXISTS "planned_start_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "planned_end_at" TIMESTAMPTZ;
        COMMENT ON COLUMN "apps_kuaizhizao_rework_order_position_plans"."section_name"
            IS '工段/产线';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_order_position_plans"."planned_headcount"
            IS '计划人数';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_order_position_plans"."standard_minutes"
            IS '标准工时（分钟）';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_order_position_plans"."planned_start_at"
            IS '计划开始';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_order_position_plans"."planned_end_at"
            IS '计划完成';

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_position_plan_templates" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "template_code" VARCHAR(50) NOT NULL,
            "template_name" VARCHAR(200) NOT NULL,
            "product_line_code" VARCHAR(50),
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "total_items" INT NOT NULL DEFAULT 0,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_rework_ppt_code"
            ON "apps_kuaizhizao_rework_position_plan_templates" ("tenant_id", "template_code");
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_ppt_tenant"
            ON "apps_kuaizhizao_rework_position_plan_templates" ("tenant_id");
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_ppt_active"
            ON "apps_kuaizhizao_rework_position_plan_templates" ("tenant_id", "is_active");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_position_plan_template_items" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "template_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "sequence" INT NOT NULL DEFAULT 1,
            "station_name" VARCHAR(100) NOT NULL,
            "section_name" VARCHAR(100),
            "station_code" VARCHAR(50),
            "planned_headcount" DECIMAL(18,4),
            "standard_minutes" DECIMAL(18,4),
            "planned_qty" DECIMAL(18,4),
            "owner_user_id" INT,
            "owner_user_name" VARCHAR(100),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_ppt_item_tpl"
            ON "apps_kuaizhizao_rework_position_plan_template_items" ("tenant_id", "template_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_position_plan_template_items";
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_position_plan_templates";
        ALTER TABLE "apps_kuaizhizao_rework_order_position_plans"
            DROP COLUMN IF EXISTS "section_name",
            DROP COLUMN IF EXISTS "planned_headcount",
            DROP COLUMN IF EXISTS "standard_minutes",
            DROP COLUMN IF EXISTS "planned_start_at",
            DROP COLUMN IF EXISTS "planned_end_at";
    """
