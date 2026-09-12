"""
设备台账：点检人

apps_kuaizhizao_equipment 增加：
- spot_check_person_id
- spot_check_person_name
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        DO $migration$
        DECLARE
            tbl_name TEXT;
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'apps_kuaizhizao_equipment'
            ) THEN
                tbl_name := 'apps_kuaizhizao_equipment';
            ELSIF EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'core_equipment'
            ) THEN
                tbl_name := 'core_equipment';
            ELSE
                RETURN;
            END IF;

            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'spot_check_person_id'
            ) THEN
                EXECUTE format(
                    'ALTER TABLE %I ADD COLUMN "spot_check_person_id" INT NULL',
                    tbl_name
                );
                EXECUTE format(
                    'COMMENT ON COLUMN %I."spot_check_person_id" IS ''点检人ID''',
                    tbl_name
                );
            END IF;

            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'spot_check_person_name'
            ) THEN
                EXECUTE format(
                    'ALTER TABLE %I ADD COLUMN "spot_check_person_name" VARCHAR(100) NULL',
                    tbl_name
                );
                EXECUTE format(
                    'COMMENT ON COLUMN %I."spot_check_person_name" IS ''点检人姓名''',
                    tbl_name
                );
            END IF;

            EXECUTE format(
                'CREATE INDEX IF NOT EXISTS idx_%s_spot_check_person_id ON %I ("spot_check_person_id")',
                replace(tbl_name, '.', '_'),
                tbl_name
            );
        END $migration$;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DO $migration$
        DECLARE
            tbl_name TEXT;
        BEGIN
            IF EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'apps_kuaizhizao_equipment'
            ) THEN
                tbl_name := 'apps_kuaizhizao_equipment';
            ELSIF EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_schema = 'public' AND table_name = 'core_equipment'
            ) THEN
                tbl_name := 'core_equipment';
            ELSE
                RETURN;
            END IF;

            EXECUTE format('DROP INDEX IF EXISTS idx_%s_spot_check_person_id', replace(tbl_name, '.', '_'));
            EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "spot_check_person_name"', tbl_name);
            EXECUTE format('ALTER TABLE %I DROP COLUMN IF EXISTS "spot_check_person_id"', tbl_name);
        END $migration$;
    """
