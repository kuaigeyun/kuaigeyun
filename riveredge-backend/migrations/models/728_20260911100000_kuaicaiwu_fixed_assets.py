"""轻财务固定资产模块表结构。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


def _audit_columns() -> str:
    return """
            "id" SERIAL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "updated_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by_name" VARCHAR(100),
    """


async def upgrade(db: BaseDBAsyncClient) -> str:
    audit = _audit_columns()
    return f"""
        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_categories" (
            {audit}
            "category_code" VARCHAR(50) NOT NULL,
            "category_name" VARCHAR(200) NOT NULL,
            "depreciation_method" VARCHAR(30) NOT NULL DEFAULT 'straight_line',
            "useful_life_months" INT NOT NULL DEFAULT 60,
            "residual_rate" DECIMAL(8,4) NOT NULL DEFAULT 0.05,
            "asset_account_code" VARCHAR(20) NOT NULL DEFAULT '1601',
            "accumulated_depreciation_account_code" VARCHAR(20) NOT NULL DEFAULT '1602',
            "expense_account_code" VARCHAR(20) NOT NULL DEFAULT '6602',
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_cat_tenant_code"
            ON "apps_kuaicaiwu_fa_categories" ("tenant_id", "category_code")
            WHERE "deleted_at" IS NULL;

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_assets" (
            {audit}
            "asset_code" VARCHAR(50) NOT NULL,
            "asset_name" VARCHAR(200) NOT NULL,
            "category_id" INT,
            "category_name" VARCHAR(200),
            "quantity" DECIMAL(20,4) NOT NULL DEFAULT 1,
            "unit" VARCHAR(20),
            "change_method" VARCHAR(50),
            "department_id" INT,
            "department_name" VARCHAR(100),
            "user_id" INT,
            "user_name" VARCHAR(100),
            "status" VARCHAR(30) NOT NULL DEFAULT 'active',
            "location" VARCHAR(200),
            "start_use_date" DATE,
            "entry_date" DATE,
            "specification" VARCHAR(500),
            "notes" TEXT,
            "attachment_uuids" JSONB NOT NULL DEFAULT '[]'::jsonb,
            "depreciation_method" VARCHAR(30) NOT NULL DEFAULT 'straight_line',
            "original_value" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "impairment_value" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "useful_life_months" INT NOT NULL DEFAULT 60,
            "depreciated_periods" INT NOT NULL DEFAULT 0,
            "accumulated_depreciation" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "residual_rate" DECIMAL(8,4) NOT NULL DEFAULT 0.05,
            "monthly_depreciation" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "asset_account_code" VARCHAR(20) NOT NULL DEFAULT '1601',
            "accumulated_depreciation_account_code" VARCHAR(20) NOT NULL DEFAULT '1602',
            "expense_account_code" VARCHAR(20) NOT NULL DEFAULT '6602',
            "source_kuaioa_asset_id" INT,
            "source_purchase_id" INT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_asset_tenant_code"
            ON "apps_kuaicaiwu_fa_assets" ("tenant_id", "asset_code")
            WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "idx_fa_asset_tenant_status"
            ON "apps_kuaicaiwu_fa_assets" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_fa_asset_source_oa"
            ON "apps_kuaicaiwu_fa_assets" ("tenant_id", "source_kuaioa_asset_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_changes" (
            {audit}
            "change_code" VARCHAR(50) NOT NULL,
            "asset_id" INT NOT NULL,
            "asset_code" VARCHAR(50),
            "asset_name" VARCHAR(200),
            "change_type" VARCHAR(50) NOT NULL,
            "change_date" DATE NOT NULL,
            "before_snapshot" JSONB NOT NULL DEFAULT '{{}}'::jsonb,
            "after_snapshot" JSONB NOT NULL DEFAULT '{{}}'::jsonb,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_change_tenant_code"
            ON "apps_kuaicaiwu_fa_changes" ("tenant_id", "change_code")
            WHERE "deleted_at" IS NULL;

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_disposals" (
            {audit}
            "disposal_code" VARCHAR(50) NOT NULL,
            "asset_id" INT NOT NULL,
            "asset_code" VARCHAR(50),
            "asset_name" VARCHAR(200),
            "disposal_date" DATE NOT NULL,
            "disposal_type" VARCHAR(50) NOT NULL,
            "disposal_amount" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "voucher_id" INT,
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_disposal_tenant_code"
            ON "apps_kuaicaiwu_fa_disposals" ("tenant_id", "disposal_code")
            WHERE "deleted_at" IS NULL;

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_depr_runs" (
            {audit}
            "run_code" VARCHAR(50) NOT NULL,
            "period_year" INT NOT NULL,
            "period_month" INT NOT NULL,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "total_amount" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "confirmed_at" TIMESTAMPTZ,
            "confirmed_by" INT,
            "confirmed_by_name" VARCHAR(100),
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_depr_run_tenant_code"
            ON "apps_kuaicaiwu_fa_depr_runs" ("tenant_id", "run_code")
            WHERE "deleted_at" IS NULL;
        CREATE INDEX IF NOT EXISTS "idx_fa_depr_run_period"
            ON "apps_kuaicaiwu_fa_depr_runs" ("tenant_id", "period_year", "period_month");

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_depr_run_lines" (
            {audit}
            "run_id" INT NOT NULL,
            "asset_id" INT NOT NULL,
            "asset_code" VARCHAR(50),
            "asset_name" VARCHAR(200),
            "calculated_amount" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "final_amount" DECIMAL(20,4) NOT NULL DEFAULT 0,
            "adjusted_by" INT,
            "adjusted_by_name" VARCHAR(100),
            "adjusted_at" TIMESTAMPTZ,
            "accounting_event_id" INT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_fa_depr_line_run"
            ON "apps_kuaicaiwu_fa_depr_run_lines" ("tenant_id", "run_id");

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_depr_adjustments" (
            {audit}
            "adjustment_code" VARCHAR(50) NOT NULL,
            "asset_id" INT NOT NULL,
            "asset_code" VARCHAR(50),
            "asset_name" VARCHAR(200),
            "period_year" INT NOT NULL,
            "period_month" INT NOT NULL,
            "adjustment_amount" DECIMAL(20,4) NOT NULL,
            "reason" TEXT,
            "status" VARCHAR(30) NOT NULL DEFAULT 'draft',
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_depr_adj_tenant_code"
            ON "apps_kuaicaiwu_fa_depr_adjustments" ("tenant_id", "adjustment_code")
            WHERE "deleted_at" IS NULL;

        CREATE TABLE IF NOT EXISTS "apps_kuaicaiwu_fa_period_closes" (
            {audit}
            "period_year" INT NOT NULL,
            "period_month" INT NOT NULL,
            "closed_at" TIMESTAMPTZ NOT NULL,
            "closed_by" INT,
            "closed_by_name" VARCHAR(100),
            "notes" TEXT,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_fa_period_close"
            ON "apps_kuaicaiwu_fa_period_closes" ("tenant_id", "period_year", "period_month")
            WHERE "deleted_at" IS NULL;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_period_closes";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_depr_adjustments";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_depr_run_lines";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_depr_runs";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_disposals";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_changes";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_assets";
        DROP TABLE IF EXISTS "apps_kuaicaiwu_fa_categories";
    """
