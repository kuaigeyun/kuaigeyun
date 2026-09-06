"""样品加工：pcb_* 列重命名为中性 material_*（行业扩展 profile 驱动展示文案）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaiplm_sample_process_applications"
            RENAME COLUMN "pcb_material_code" TO "material_code";
        ALTER TABLE "apps_kuaiplm_sample_process_applications"
            RENAME COLUMN "pcb_version" TO "material_version";
        CREATE INDEX IF NOT EXISTS "idx_kuaiplm_spa_material"
            ON "apps_kuaiplm_sample_process_applications" ("tenant_id", "material_code");
        COMMENT ON COLUMN "apps_kuaiplm_sample_process_applications"."material_code"
            IS '物料编码（行业包可改展示为 PCB 料号）';
        COMMENT ON COLUMN "apps_kuaiplm_sample_process_applications"."material_version"
            IS '物料版本';
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        DROP INDEX IF EXISTS "idx_kuaiplm_spa_material";
        ALTER TABLE "apps_kuaiplm_sample_process_applications"
            RENAME COLUMN "material_code" TO "pcb_material_code";
        ALTER TABLE "apps_kuaiplm_sample_process_applications"
            RENAME COLUMN "material_version" TO "pcb_version";
    """
