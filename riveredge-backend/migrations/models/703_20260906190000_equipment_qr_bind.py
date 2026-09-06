"""R-10 WP-10.4：设备台账二维码手工绑定码。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_equipment"
            ADD COLUMN IF NOT EXISTS "qr_bind_code" VARCHAR(200);
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_equipment_qr_bind"
            ON "apps_kuaizhizao_equipment" ("tenant_id", "qr_bind_code")
            WHERE "qr_bind_code" IS NOT NULL AND "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "idx_kz_equipment_qr_bind"
            ON "apps_kuaizhizao_equipment" ("tenant_id", "qr_bind_code");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "uidx_kz_equipment_qr_bind";
        DROP INDEX IF EXISTS "idx_kz_equipment_qr_bind";
        ALTER TABLE "apps_kuaizhizao_equipment" DROP COLUMN IF EXISTS "qr_bind_code";
    """
