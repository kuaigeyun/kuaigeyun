"""INF-05 / R-09：设备校准外校计划类型。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_calibrations"
            ADD COLUMN IF NOT EXISTS "plan_type" VARCHAR(20) NOT NULL DEFAULT 'internal';
        COMMENT ON COLUMN "apps_kuaizhizao_equipment_calibrations"."plan_type"
            IS '校准计划类型 internal/external（外校）';
        CREATE INDEX IF NOT EXISTS "idx_kz_eq_calib_plan"
            ON "apps_kuaizhizao_equipment_calibrations" ("tenant_id", "plan_type");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_eq_calib_plan";
        ALTER TABLE "apps_kuaizhizao_equipment_calibrations" DROP COLUMN IF EXISTS "plan_type";
    """
