"""R-08：试流单头、物料行、工序结果表。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_trial_flows" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "trial_code" VARCHAR(50) NOT NULL,
            "project_id" INT NOT NULL,
            "project_code" VARCHAR(50) NOT NULL,
            "project_name" VARCHAR(200) NOT NULL,
            "business_type" VARCHAR(20) NOT NULL,
            "title" VARCHAR(200) NOT NULL,
            "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
            "current_step_key" VARCHAR(50),
            "conclusion" VARCHAR(20),
            "conclusion_summary" TEXT,
            "remarks" TEXT,
            "submitted_at" TIMESTAMPTZ,
            "approved_at" TIMESTAMPTZ,
            "concluded_at" TIMESTAMPTZ,
            "closed_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_trial_code"
            ON "apps_kuaiplm_trial_flows" ("tenant_id", "trial_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_trial_project"
            ON "apps_kuaiplm_trial_flows" ("tenant_id", "project_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_trial_type"
            ON "apps_kuaiplm_trial_flows" ("tenant_id", "business_type");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_trial_status"
            ON "apps_kuaiplm_trial_flows" ("tenant_id", "status");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_trial_uuid"
            ON "apps_kuaiplm_trial_flows" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_trial_flows" IS '快研发 - 试流单';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_trial_flow_materials" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "trial_flow_id" INT NOT NULL,
            "line_no" INT NOT NULL DEFAULT 1,
            "material_id" INT,
            "material_code" VARCHAR(80) NOT NULL,
            "material_name" VARCHAR(200) NOT NULL,
            "qty" DECIMAL(18,4),
            "unit" VARCHAR(20),
            "remarks" VARCHAR(500),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_tf_mat"
            ON "apps_kuaiplm_trial_flow_materials" ("tenant_id", "trial_flow_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_tf_mat_uuid"
            ON "apps_kuaiplm_trial_flow_materials" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_trial_flow_materials" IS '快研发 - 试流物料行';

        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_trial_flow_steps" (
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "id" SERIAL NOT NULL PRIMARY KEY,
            "trial_flow_id" INT NOT NULL,
            "step_key" VARCHAR(50) NOT NULL,
            "step_name" VARCHAR(100) NOT NULL,
            "dept_code" VARCHAR(50) NOT NULL,
            "sort_order" INT NOT NULL DEFAULT 0,
            "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
            "result" VARCHAR(20),
            "result_notes" TEXT,
            "filled_by" INT,
            "filled_by_name" VARCHAR(100),
            "filled_at" TIMESTAMPTZ,
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uidx_kuaiplm_tf_step"
            ON "apps_kuaiplm_trial_flow_steps" ("tenant_id", "trial_flow_id", "step_key");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_tf_step"
            ON "apps_kuaiplm_trial_flow_steps" ("tenant_id", "trial_flow_id");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_tf_step_uuid"
            ON "apps_kuaiplm_trial_flow_steps" ("uuid");
        COMMENT ON TABLE "apps_kuaiplm_trial_flow_steps" IS '快研发 - 试流工序结果';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP TABLE IF EXISTS "apps_kuaiplm_trial_flow_steps";
        DROP TABLE IF EXISTS "apps_kuaiplm_trial_flow_materials";
        DROP TABLE IF EXISTS "apps_kuaiplm_trial_flows";
    """
