"""R-10 WP-10.11：点检方案增加业务域（equipment / esd）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ADD COLUMN IF NOT EXISTS "domain" VARCHAR(32) DEFAULT 'equipment';
        UPDATE "apps_kuaizhizao_equipment_inspection_schemes"
            SET "domain" = 'equipment'
            WHERE "domain" IS NULL OR "domain" = '';
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            ALTER COLUMN "domain" SET NOT NULL,
            ALTER COLUMN "domain" SET DEFAULT 'equipment';
        CREATE INDEX IF NOT EXISTS "idx_kz_insp_scheme_tenant_domain"
            ON "apps_kuaizhizao_equipment_inspection_schemes" ("tenant_id", "domain");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kz_insp_scheme_tenant_domain";
        ALTER TABLE "apps_kuaizhizao_equipment_inspection_schemes"
            DROP COLUMN IF EXISTS "domain";
    """
