"""R-10 WP-10.5：点检方案 A/B/C 采集方式与方法/判定标准。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_items"
            ADD COLUMN IF NOT EXISTS "method" TEXT,
            ADD COLUMN IF NOT EXISTS "judgment_standard" TEXT;

        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ADD COLUMN IF NOT EXISTS "capture_mode" VARCHAR(8) DEFAULT 'A';
        UPDATE "apps_kuaizhizao_equipment_inspection_schemes"
            SET "capture_mode" = 'A'
            WHERE "capture_mode" IS NULL OR TRIM("capture_mode") = '';
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ALTER COLUMN "capture_mode" SET NOT NULL,
            ALTER COLUMN "capture_mode" SET DEFAULT 'A';

        ALTER TABLE "apps_kuaizhizao_equipment_inspection_scheme_lines"
            ADD COLUMN IF NOT EXISTS "method" TEXT,
            ADD COLUMN IF NOT EXISTS "judgment_standard" TEXT,
            ADD COLUMN IF NOT EXISTS "photo_required" BOOL DEFAULT FALSE;
        UPDATE "apps_kuaizhizao_equipment_inspection_scheme_lines"
            SET "photo_required" = FALSE
            WHERE "photo_required" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_scheme_lines"
            ALTER COLUMN "photo_required" SET NOT NULL,
            ALTER COLUMN "photo_required" SET DEFAULT FALSE;

        ALTER TABLE "apps_kuaizhizao_equipment_spot_checks"
            ADD COLUMN IF NOT EXISTS "capture_mode" VARCHAR(8),
            ADD COLUMN IF NOT EXISTS "attachments" JSONB;
        UPDATE "apps_kuaizhizao_equipment_spot_checks" sc
            SET "capture_mode" = COALESCE(NULLIF(TRIM(s."capture_mode"), ''), 'A')
            FROM "apps_kuaizhizao_equipment_inspection_schemes" s
            WHERE sc."scheme_id" = s."id" AND (sc."capture_mode" IS NULL OR TRIM(sc."capture_mode") = '');
        UPDATE "apps_kuaizhizao_equipment_spot_checks"
            SET "capture_mode" = 'A'
            WHERE "capture_mode" IS NULL OR TRIM("capture_mode") = '';

        ALTER TABLE "apps_kuaizhizao_equipment_spot_check_lines"
            ADD COLUMN IF NOT EXISTS "method" TEXT,
            ADD COLUMN IF NOT EXISTS "judgment_standard" TEXT,
            ADD COLUMN IF NOT EXISTS "photo_required" BOOL DEFAULT FALSE;
        UPDATE "apps_kuaizhizao_equipment_spot_check_lines"
            SET "photo_required" = FALSE
            WHERE "photo_required" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_spot_check_lines"
            ALTER COLUMN "photo_required" SET NOT NULL,
            ALTER COLUMN "photo_required" SET DEFAULT FALSE;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_spot_check_lines"
            DROP COLUMN IF EXISTS "method",
            DROP COLUMN IF EXISTS "judgment_standard",
            DROP COLUMN IF EXISTS "photo_required";
        ALTER TABLE "apps_kuaizhizao_equipment_spot_checks"
            DROP COLUMN IF EXISTS "capture_mode",
            DROP COLUMN IF EXISTS "attachments";
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_scheme_lines"
            DROP COLUMN IF EXISTS "method",
            DROP COLUMN IF EXISTS "judgment_standard",
            DROP COLUMN IF EXISTS "photo_required";
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            DROP COLUMN IF EXISTS "capture_mode";
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_items"
            DROP COLUMN IF EXISTS "method",
            DROP COLUMN IF EXISTS "judgment_standard";
    """
