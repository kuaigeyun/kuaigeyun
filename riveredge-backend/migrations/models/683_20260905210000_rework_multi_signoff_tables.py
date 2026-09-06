"""R-11：返工会签型头字段 + 物料需求/报废/会签/排位策划子表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            ADD COLUMN IF NOT EXISTS "no_scrap_confirmed" BOOL NOT NULL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "need_warehouse_in" BOOL NOT NULL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "finance_signed_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "finance_signed_by" INT,
            ADD COLUMN IF NOT EXISTS "finance_signed_by_name" VARCHAR(100);
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."no_scrap_confirmed"
            IS '无报废明确确认';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."need_warehouse_in"
            IS '是否入库';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."finance_signed_at"
            IS '财务会签时间';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."finance_signed_by"
            IS '财务会签人ID';
        COMMENT ON COLUMN "apps_kuaizhizao_rework_orders"."finance_signed_by_name"
            IS '财务会签人姓名';

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_order_signoffs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "rework_order_id" INT NOT NULL,
            "dept_code" VARCHAR(50) NOT NULL,
            "dept_name" VARCHAR(100) NOT NULL,
            "sort_order" INT NOT NULL DEFAULT 0,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "result" VARCHAR(20),
            "signer_id" INT,
            "signer_name" VARCHAR(100),
            "signed_at" TIMESTAMPTZ,
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_rework_signoff_dept"
            ON "apps_kuaizhizao_rework_order_signoffs" ("tenant_id", "rework_order_id", "dept_code");
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_signoff_order"
            ON "apps_kuaizhizao_rework_order_signoffs" ("tenant_id", "rework_order_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_order_material_reqs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "rework_order_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "qty" DECIMAL(18,4) NOT NULL,
            "unit" VARCHAR(20),
            "required_at" TIMESTAMPTZ,
            "arrived_at" TIMESTAMPTZ,
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_mat_req_order"
            ON "apps_kuaizhizao_rework_order_material_reqs" ("tenant_id", "rework_order_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_order_scrap_lines" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "rework_order_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "qty" DECIMAL(18,4) NOT NULL,
            "unit" VARCHAR(20),
            "scrap_reason" VARCHAR(500),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_scrap_order"
            ON "apps_kuaizhizao_rework_order_scrap_lines" ("tenant_id", "rework_order_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_rework_order_position_plans" (
            "id" SERIAL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "rework_order_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "station_code" VARCHAR(50),
            "station_name" VARCHAR(100) NOT NULL,
            "sequence" INT NOT NULL DEFAULT 1,
            "planned_qty" DECIMAL(18,4),
            "owner_user_id" INT,
            "owner_user_name" VARCHAR(100),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_rework_pos_plan_order"
            ON "apps_kuaizhizao_rework_order_position_plans" ("tenant_id", "rework_order_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_order_position_plans";
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_order_scrap_lines";
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_order_material_reqs";
        DROP TABLE IF EXISTS "apps_kuaizhizao_rework_order_signoffs";
        ALTER TABLE "apps_kuaizhizao_rework_orders"
            DROP COLUMN IF EXISTS "no_scrap_confirmed",
            DROP COLUMN IF EXISTS "need_warehouse_in",
            DROP COLUMN IF EXISTS "finance_signed_at",
            DROP COLUMN IF EXISTS "finance_signed_by",
            DROP COLUMN IF EXISTS "finance_signed_by_name";
    """
