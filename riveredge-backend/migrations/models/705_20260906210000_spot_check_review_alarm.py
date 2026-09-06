"""R-10 WP-10.6：点检审核流与未点检/未审核超时报警。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ADD COLUMN IF NOT EXISTS "reviewer_user_id" INT,
            ADD COLUMN IF NOT EXISTS "reviewer_user_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "overdue_hours" INT DEFAULT 8,
            ADD COLUMN IF NOT EXISTS "review_overdue_hours" INT DEFAULT 4;
        UPDATE "apps_kuaizhizao_equipment_inspection_schemes"
            SET "overdue_hours" = 8
            WHERE "overdue_hours" IS NULL;
        UPDATE "apps_kuaizhizao_equipment_inspection_schemes"
            SET "review_overdue_hours" = 4
            WHERE "review_overdue_hours" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ALTER COLUMN "overdue_hours" SET NOT NULL,
            ALTER COLUMN "overdue_hours" SET DEFAULT 8,
            ALTER COLUMN "review_overdue_hours" SET NOT NULL,
            ALTER COLUMN "review_overdue_hours" SET DEFAULT 4;

        ALTER TABLE "apps_kuaizhizao_equipment_spot_checks"
            ADD COLUMN IF NOT EXISTS "reviewer_user_id" INT,
            ADD COLUMN IF NOT EXISTS "reviewer_user_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "reviewed_by" INT,
            ADD COLUMN IF NOT EXISTS "reviewed_by_name" VARCHAR(100),
            ADD COLUMN IF NOT EXISTS "reviewed_at" TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS "reject_reason" TEXT;
        UPDATE "apps_kuaizhizao_equipment_spot_checks"
            SET "status" = '已审核'
            WHERE "status" = '已完成' AND "deleted_at" IS NULL;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        UPDATE "apps_kuaizhizao_equipment_spot_checks"
            SET "status" = '已完成'
            WHERE "status" = '已审核' AND "deleted_at" IS NULL;
        ALTER TABLE "apps_kuaizhizao_equipment_spot_checks"
            DROP COLUMN IF EXISTS "reviewer_user_id",
            DROP COLUMN IF EXISTS "reviewer_user_name",
            DROP COLUMN IF EXISTS "reviewed_by",
            DROP COLUMN IF EXISTS "reviewed_by_name",
            DROP COLUMN IF EXISTS "reviewed_at",
            DROP COLUMN IF EXISTS "reject_reason";
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            DROP COLUMN IF EXISTS "reviewer_user_id",
            DROP COLUMN IF EXISTS "reviewer_user_name",
            DROP COLUMN IF EXISTS "overdue_hours",
            DROP COLUMN IF EXISTS "review_overdue_hours";
    """
