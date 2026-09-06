"""R-10 WP-10.12：设备/ESD 看板参观展示覆盖（不改业务真源）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_equipment_board_visit_overrides" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "board_domain" VARCHAR(32) NOT NULL DEFAULT 'equipment',
            "plant_id" INT,
            "metric_key" VARCHAR(64) NOT NULL,
            "metric_value" DOUBLE PRECISION NOT NULL,
            "reason" TEXT,
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_board_visit_override_scope"
            ON "apps_kuaizhizao_equipment_board_visit_overrides"
            ("tenant_id", "board_domain", COALESCE("plant_id", -1), "metric_key")
            WHERE "deleted_at" IS NULL AND "is_active" = TRUE;
        CREATE INDEX IF NOT EXISTS "idx_kz_board_visit_override_scope"
            ON "apps_kuaizhizao_equipment_board_visit_overrides"
            ("tenant_id", "board_domain", "plant_id", "is_active");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_equipment_board_visit_audits" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "board_domain" VARCHAR(32) NOT NULL DEFAULT 'equipment',
            "plant_id" INT,
            "action" VARCHAR(32) NOT NULL,
            "metric_key" VARCHAR(64),
            "before_value" DOUBLE PRECISION,
            "after_value" DOUBLE PRECISION,
            "reason" TEXT,
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "payload" JSONB,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_board_visit_audit_scope"
            ON "apps_kuaizhizao_equipment_board_visit_audits"
            ("tenant_id", "board_domain", "plant_id", "created_at");
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_equipment_board_visit_audits";
        DROP TABLE IF EXISTS "apps_kuaizhizao_equipment_board_visit_overrides";
    """
