"""
计量器具扩展：精度、测量范围

apps_kuaizhizao_equipment 增加：
- measuring_precision
- measurement_range
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
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'measuring_precision'
            ) THEN
                EXECUTE format(
                    'ALTER TABLE %I ADD COLUMN "measuring_precision" VARCHAR(100) NULL',
                    tbl_name
                );
            END IF;

            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'measurement_range'
            ) THEN
                EXECUTE format(
                    'ALTER TABLE %I ADD COLUMN "measurement_range" VARCHAR(200) NULL',
                    tbl_name
                );
            END IF;
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

            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'measuring_precision'
            ) THEN
                EXECUTE format('ALTER TABLE %I DROP COLUMN "measuring_precision"', tbl_name);
            END IF;

            IF EXISTS (
                SELECT 1 FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = tbl_name AND column_name = 'measurement_range'
            ) THEN
                EXECUTE format('ALTER TABLE %I DROP COLUMN "measurement_range"', tbl_name);
            END IF;
        END $migration$;
    """
