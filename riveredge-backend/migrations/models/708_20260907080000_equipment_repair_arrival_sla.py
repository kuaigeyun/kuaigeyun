"""R-10 WP-10.9：设备维修报障到场时限、到场签到与完工原因内容。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_faults"
            ADD COLUMN IF NOT EXISTS "equipment_code" VARCHAR(50),
            ADD COLUMN IF NOT EXISTS "reported_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "response_minutes" INT DEFAULT 60,
            ADD COLUMN IF NOT EXISTS "response_due_at" TIMESTAMPTZ;
        UPDATE "apps_kuaizhizao_equipment_faults"
            SET "reported_at" = "fault_date"
            WHERE "reported_at" IS NULL AND "fault_date" IS NOT NULL;
        UPDATE "apps_kuaizhizao_equipment_faults"
            SET "response_minutes" = 60
            WHERE "response_minutes" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_faults"
            ALTER COLUMN "response_minutes" SET NOT NULL,
            ALTER COLUMN "response_minutes" SET DEFAULT 60;
        UPDATE "apps_kuaizhizao_equipment_faults" f
            SET "equipment_code" = e."code"
            FROM "apps_kuaizhizao_equipments" e
            WHERE f."equipment_id" = e."id"
              AND (f."equipment_code" IS NULL OR f."equipment_code" = '');
        UPDATE "apps_kuaizhizao_equipment_faults"
            SET "response_due_at" = "reported_at" + (COALESCE("response_minutes", 60) || ' minutes')::interval
            WHERE "response_due_at" IS NULL
              AND "reported_at" IS NOT NULL
              AND "status" IN ('待处理', '处理中');

        ALTER TABLE "apps_kuaizhizao_equipment_repairs"
            ADD COLUMN IF NOT EXISTS "arrival_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "arrival_by_id" INT,
            ADD COLUMN IF NOT EXISTS "arrival_by_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "fault_cause" TEXT,
            ADD COLUMN IF NOT EXISTS "repair_content" TEXT,
            ADD COLUMN IF NOT EXISTS "completed_at" TIMESTAMPTZ;
        UPDATE "apps_kuaizhizao_equipment_repairs"
            SET "completed_at" = "updated_at"
            WHERE "status" = '已完成' AND "completed_at" IS NULL;
        UPDATE "apps_kuaizhizao_equipment_repairs"
            SET "repair_content" = "repair_description"
            WHERE ("repair_content" IS NULL OR "repair_content" = '')
              AND "repair_description" IS NOT NULL
              AND "status" = '已完成';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_faults"
            DROP COLUMN IF EXISTS "equipment_code",
            DROP COLUMN IF EXISTS "reported_at",
            DROP COLUMN IF EXISTS "response_minutes",
            DROP COLUMN IF EXISTS "response_due_at";
        ALTER TABLE "apps_kuaizhizao_equipment_repairs"
            DROP COLUMN IF EXISTS "arrival_at",
            DROP COLUMN IF EXISTS "arrival_by_id",
            DROP COLUMN IF EXISTS "arrival_by_name",
            DROP COLUMN IF EXISTS "fault_cause",
            DROP COLUMN IF EXISTS "repair_content",
            DROP COLUMN IF EXISTS "completed_at";
    """
