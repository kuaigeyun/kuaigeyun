"""R-02：实验判定规则主数据 + 实测行关联规则 ID。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        CREATE TABLE IF NOT EXISTS "apps_kuaiplm_lab_judgment_rules" (
            "id" SERIAL NOT NULL PRIMARY KEY,
            "uuid" VARCHAR(36) NOT NULL,
            "tenant_id" INT NOT NULL,
            "created_at" TIMESTAMPTZ NOT NULL,
            "updated_at" TIMESTAMPTZ NOT NULL,
            "rule_code" VARCHAR(50) NOT NULL,
            "rule_name" VARCHAR(200) NOT NULL,
            "version" VARCHAR(40) NOT NULL DEFAULT '1',
            "compare_type" VARCHAR(20) NOT NULL DEFAULT 'range',
            "standard_min" VARCHAR(80),
            "standard_max" VARCHAR(80),
            "standard_value" VARCHAR(80),
            "unit" VARCHAR(40),
            "item_name" VARCHAR(200),
            "is_active" BOOL NOT NULL DEFAULT TRUE,
            "remarks" TEXT,
            "created_by" INT,
            "created_by_name" VARCHAR(100),
            "updated_by" INT,
            "updated_by_name" VARCHAR(100),
            "deleted_at" TIMESTAMPTZ
        );
        CREATE UNIQUE INDEX IF NOT EXISTS "uid_kuaiplm_lab_jrule_code_ver"
            ON "apps_kuaiplm_lab_judgment_rules" ("tenant_id", "rule_code", "version");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_jrule_active"
            ON "apps_kuaiplm_lab_judgment_rules" ("tenant_id", "is_active");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_jrule_code"
            ON "apps_kuaiplm_lab_judgment_rules" ("tenant_id", "rule_code");
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_lab_jrule_uuid"
            ON "apps_kuaiplm_lab_judgment_rules" ("uuid");

        ALTER TABLE "apps_kuaiplm_lab_request_measure_items"
            ADD COLUMN IF NOT EXISTS "judgment_rule_id" INT;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaiplm_lab_request_measure_items"
            DROP COLUMN IF EXISTS "judgment_rule_id";
        DROP TABLE IF EXISTS "apps_kuaiplm_lab_judgment_rules";
    """
