from tortoise import BaseDBAsyncClient


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_mold_sample_orders" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "uuid" UUID NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "order_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "doc_kind" VARCHAR(32) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "contract_no" VARCHAR(80),
            "party_name" VARCHAR(200),
            "file_uuid" VARCHAR(36),
            "file_name" VARCHAR(200),
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "sealed_at" TIMESTAMPTZ,
            "sealed_by" INT,
            "sealed_by_name" VARCHAR(100),
            "archived_at" TIMESTAMPTZ,
            "archived_by" INT,
            "archived_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uid_apps_kuaiplm_mold_sample_orders_tenant_code"
            ON "apps_kuaiplm_mold_sample_orders" ("tenant_id", "order_code");
        CREATE INDEX IF NOT EXISTS "idx_apps_kuaiplm_mold_sample_orders_tenant_project"
            ON "apps_kuaiplm_mold_sample_orders" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_apps_kuaiplm_mold_sample_orders_tenant_status"
            ON "apps_kuaiplm_mold_sample_orders" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_apps_kuaiplm_mold_sample_orders_tenant_kind"
            ON "apps_kuaiplm_mold_sample_orders" ("tenant_id", "doc_kind");
        CREATE INDEX IF NOT EXISTS "idx_apps_kuaiplm_mold_sample_orders_uuid"
            ON "apps_kuaiplm_mold_sample_orders" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_mold_sample_orders" IS '快研发 - 开模合同与打样订单';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_mold_sample_orders";
    """
