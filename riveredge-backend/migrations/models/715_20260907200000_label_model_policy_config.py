"""R-16 补：型号配置 policy_config（周期唯一等策略参数，行业包填值，禁止客户名）。"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_label_model_configs"
            ADD COLUMN IF NOT EXISTS "policy_config" JSONB NOT NULL DEFAULT '{}'::jsonb;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        ALTER TABLE "apps_kuaizhizao_label_model_configs"
            DROP COLUMN IF EXISTS "policy_config";
    """
