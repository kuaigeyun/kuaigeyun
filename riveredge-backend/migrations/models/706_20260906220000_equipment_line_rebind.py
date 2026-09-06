"""R-10 WP-10.7：换线扫码重绑产线并强制初检。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment"
            ADD COLUMN IF NOT EXISTS "force_spot_check_required" BOOL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "force_spot_check_due_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "line_rebind_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "line_rebind_id" INT;
        UPDATE "apps_kuaizhizao_equipment"
            SET "force_spot_check_required" = FALSE
            WHERE "force_spot_check_required" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment"
            ALTER COLUMN "force_spot_check_required" SET NOT NULL,
            ALTER COLUMN "force_spot_check_required" SET DEFAULT FALSE;
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_force_spot"
            ON "apps_kuaizhizao_equipment" ("tenant_id", "force_spot_check_required");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_equipment_line_rebinds" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "document_no" VARCHAR(64) NOT NULL,
            "production_line_id" INT NOT NULL,
            "production_line_code" VARCHAR(50),
            "production_line_name" VARCHAR(200),
            "force_spot_overdue_hours" INT NOT NULL DEFAULT 4,
            "status" VARCHAR(32) NOT NULL DEFAULT '进行中',
            "completed_at" TIMESTAMPTZ,
            "completed_by" INT,
            "completed_by_name" VARCHAR(100),
            "remark" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_eq_line_rebind_no" UNIQUE ("tenant_id", "document_no")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_line_rebind_status"
            ON "apps_kuaizhizao_equipment_line_rebinds" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_line_rebind_line"
            ON "apps_kuaizhizao_equipment_line_rebinds" ("tenant_id", "production_line_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_equipment_line_rebind_items" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "rebind_id" INT NOT NULL,
            "equipment_id" INT NOT NULL,
            "equipment_uuid" VARCHAR(36) NOT NULL,
            "equipment_code" VARCHAR(50),
            "equipment_name" VARCHAR(200),
            "from_production_line_id" INT,
            "from_production_line_code" VARCHAR(50),
            "from_production_line_name" VARCHAR(200),
            "scanned_at" TIMESTAMPTZ NOT NULL,
            "force_spot_cleared_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_eq_line_rebind_item" UNIQUE ("tenant_id", "rebind_id", "equipment_id")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_line_rebind_item_eq"
            ON "apps_kuaizhizao_equipment_line_rebind_items" ("tenant_id", "equipment_id");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_equipment_line_rebind_items";
        DROP TABLE IF EXISTS "apps_kuaizhizao_equipment_line_rebinds";
        DROP INDEX IF EXISTS "idx_kz_eq_force_spot";
        ALTER TABLE "apps_kuaizhizao_equipment"
            DROP COLUMN IF EXISTS "force_spot_check_required",
            DROP COLUMN IF EXISTS "force_spot_check_due_at",
            DROP COLUMN IF EXISTS "line_rebind_at",
            DROP COLUMN IF EXISTS "line_rebind_id";
    """
