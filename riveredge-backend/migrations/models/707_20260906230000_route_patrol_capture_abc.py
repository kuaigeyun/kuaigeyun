"""R-10 WP-10.8：巡检单行沿用点检 A/B/C 采集快照字段。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_route_patrol_lines"
            ADD COLUMN IF NOT EXISTS "capture_mode" VARCHAR(8),
            ADD COLUMN IF NOT EXISTS "photo_required" BOOL DEFAULT FALSE,
            ADD COLUMN IF NOT EXISTS "requirement" TEXT,
            ADD COLUMN IF NOT EXISTS "method" TEXT,
            ADD COLUMN IF NOT EXISTS "judgment_standard" TEXT,
            ADD COLUMN IF NOT EXISTS "value_type" VARCHAR(32),
            ADD COLUMN IF NOT EXISTS "unit" VARCHAR(32);
        UPDATE "apps_kuaizhizao_equipment_route_patrol_lines"
            SET "photo_required" = FALSE
            WHERE "photo_required" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_route_patrol_lines"
            ALTER COLUMN "photo_required" SET NOT NULL,
            ALTER COLUMN "photo_required" SET DEFAULT FALSE;
        UPDATE "apps_kuaizhizao_equipment_route_patrol_lines"
            SET "capture_mode" = 'A'
            WHERE "capture_mode" IS NULL;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_route_patrol_lines"
            DROP COLUMN IF EXISTS "capture_mode",
            DROP COLUMN IF EXISTS "photo_required",
            DROP COLUMN IF EXISTS "requirement",
            DROP COLUMN IF EXISTS "method",
            DROP COLUMN IF EXISTS "judgment_standard",
            DROP COLUMN IF EXISTS "value_type",
            DROP COLUMN IF EXISTS "unit";
    """
