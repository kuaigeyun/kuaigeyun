"""R-16：标签工位引擎（型号模板、工位会话、外箱明细、锁定/解绑事件）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_model_configs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "model_code" VARCHAR(80) NOT NULL,
            "model_name" VARCHAR(200) NOT NULL,
            "template_uuid" VARCHAR(36) NOT NULL,
            "template_version" INT,
            "qty_per_box" INT NOT NULL DEFAULT 1,
            "print_copies" INT NOT NULL DEFAULT 1,
            "device_uuid" VARCHAR(36),
            "validation_hooks" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_label_model_code" UNIQUE ("tenant_id", "model_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_model_active"
            ON "apps_kuaizhizao_label_model_configs" ("tenant_id", "is_active");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_stations" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "station_code" VARCHAR(50) NOT NULL,
            "station_name" VARCHAR(200) NOT NULL,
            "model_config_id" INT,
            "default_mode" VARCHAR(20) NOT NULL DEFAULT 'work',
            "device_uuid" VARCHAR(36),
            "unlock_requires_password" BOOL NOT NULL DEFAULT FALSE,
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "remarks" TEXT,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_label_station_code" UNIQUE ("tenant_id", "station_code")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_station_active"
            ON "apps_kuaizhizao_label_stations" ("tenant_id", "is_active");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_station_sessions" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "station_id" INT NOT NULL,
            "station_code" VARCHAR(50) NOT NULL,
            "mode" VARCHAR(20) NOT NULL DEFAULT 'work',
            "status" VARCHAR(20) NOT NULL DEFAULT 'active',
            "model_config_id" INT,
            "model_code" VARCHAR(80),
            "current_box_id" INT,
            "locked_reason" VARCHAR(200),
            "locked_at" TIMESTAMPTZ,
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "opened_at" TIMESTAMPTZ NOT NULL,
            "closed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_session_station"
            ON "apps_kuaizhizao_label_station_sessions" ("tenant_id", "station_id", "status");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_outer_boxes" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "box_no" VARCHAR(80) NOT NULL,
            "session_id" INT,
            "station_id" INT,
            "model_config_id" INT,
            "model_code" VARCHAR(80) NOT NULL,
            "qty_target" INT NOT NULL,
            "qty_current" INT NOT NULL DEFAULT 0,
            "status" VARCHAR(20) NOT NULL DEFAULT 'open',
            "print_job_id" INT,
            "print_job_code" VARCHAR(80),
            "closed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ,
            CONSTRAINT "uid_kz_label_box_no" UNIQUE ("tenant_id", "box_no")
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_box_session"
            ON "apps_kuaizhizao_label_outer_boxes" ("tenant_id", "session_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kz_label_box_model"
            ON "apps_kuaizhizao_label_outer_boxes" ("tenant_id", "model_code", "status");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_box_items" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "box_id" INT NOT NULL,
            "barcode" VARCHAR(200) NOT NULL,
            "model_code" VARCHAR(80),
            "status" VARCHAR(20) NOT NULL DEFAULT 'bound',
            "scanned_at" TIMESTAMPTZ NOT NULL,
            "unbound_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_item_box"
            ON "apps_kuaizhizao_label_box_items" ("tenant_id", "box_id", "status");
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kz_label_item_bound_barcode"
            ON "apps_kuaizhizao_label_box_items" ("tenant_id", "barcode")
            WHERE "status" = 'bound' AND "deleted_at" IS NULL;

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_scan_events" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "session_id" INT,
            "station_id" INT,
            "box_id" INT,
            "barcode" VARCHAR(200) NOT NULL,
            "result" VARCHAR(20) NOT NULL,
            "message" VARCHAR(500),
            "payload" JSONB,
            "occurred_at" TIMESTAMPTZ NOT NULL,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_scan_session"
            ON "apps_kuaizhizao_label_scan_events" ("tenant_id", "session_id", "occurred_at");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_lock_events" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "session_id" INT NOT NULL,
            "station_id" INT,
            "action" VARCHAR(20) NOT NULL,
            "reason" VARCHAR(200),
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "occurred_at" TIMESTAMPTZ NOT NULL,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_lock_session"
            ON "apps_kuaizhizao_label_lock_events" ("tenant_id", "session_id", "occurred_at");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_unbind_records" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "box_id" INT NOT NULL,
            "box_no" VARCHAR(80) NOT NULL,
            "item_id" INT,
            "barcode" VARCHAR(200),
            "reason" VARCHAR(200),
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "occurred_at" TIMESTAMPTZ NOT NULL,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kz_label_unbind_box"
            ON "apps_kuaizhizao_label_unbind_records" ("tenant_id", "box_id", "occurred_at");

        CREATE TABLE IF NOT EXISTS "apps_kuaizhizao_label_cleanup_runs" (
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
            "before_at" TIMESTAMPTZ NOT NULL,
            "summary" JSONB NOT NULL DEFAULT '{}'::jsonb,
            "operator_id" INT,
            "operator_name" VARCHAR(100),
            "occurred_at" TIMESTAMPTZ NOT NULL,
            "deleted_at" TIMESTAMPTZ
        );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_cleanup_runs";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_unbind_records";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_lock_events";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_scan_events";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_box_items";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_outer_boxes";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_station_sessions";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_stations";
        DROP TABLE IF EXISTS "apps_kuaizhizao_label_model_configs";
    """
