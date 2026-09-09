"""
客商首条联系人快照回填。

真源联系人在 contacts JSON；历史数据仅写了明细未同步 contact_person/phone，
导致采购/销售选供应商（客户）时下拉 extra 无联系人，需二次操作才带出。
本迁移将 contacts[0] 回填到快照字段（仅空快照时写入，不覆盖已有值）。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        UPDATE "apps_master_data_suppliers" AS s
        SET
            "contact_person" = COALESCE(
                NULLIF(TRIM(s."contact_person"), ''),
                NULLIF(TRIM(s."contacts"->0->>'contact_person'), ''),
                NULLIF(TRIM(s."contacts"->0->>'contactPerson'), '')
            ),
            "contact_title" = COALESCE(
                NULLIF(TRIM(s."contact_title"), ''),
                NULLIF(TRIM(s."contacts"->0->>'contact_title'), ''),
                NULLIF(TRIM(s."contacts"->0->>'contactTitle'), '')
            ),
            "phone" = COALESCE(
                NULLIF(TRIM(s."phone"), ''),
                NULLIF(TRIM(s."contacts"->0->>'phone'), '')
            ),
            "email" = COALESCE(
                NULLIF(TRIM(s."email"), ''),
                NULLIF(TRIM(s."contacts"->0->>'email'), '')
            ),
            "updated_at" = CURRENT_TIMESTAMP
        WHERE s."deleted_at" IS NULL
          AND s."contacts" IS NOT NULL
          AND jsonb_typeof(s."contacts"::jsonb) = 'array'
          AND jsonb_array_length(s."contacts"::jsonb) > 0
          AND (
            s."contact_person" IS NULL OR TRIM(s."contact_person") = ''
            OR s."phone" IS NULL OR TRIM(s."phone") = ''
          );

        UPDATE "apps_master_data_customers" AS c
        SET
            "contact_person" = COALESCE(
                NULLIF(TRIM(c."contact_person"), ''),
                NULLIF(TRIM(c."contacts"->0->>'contact_person'), ''),
                NULLIF(TRIM(c."contacts"->0->>'contactPerson'), '')
            ),
            "contact_title" = COALESCE(
                NULLIF(TRIM(c."contact_title"), ''),
                NULLIF(TRIM(c."contacts"->0->>'contact_title'), ''),
                NULLIF(TRIM(c."contacts"->0->>'contactTitle'), '')
            ),
            "phone" = COALESCE(
                NULLIF(TRIM(c."phone"), ''),
                NULLIF(TRIM(c."contacts"->0->>'phone'), '')
            ),
            "email" = COALESCE(
                NULLIF(TRIM(c."email"), ''),
                NULLIF(TRIM(c."contacts"->0->>'email'), '')
            ),
            "updated_at" = CURRENT_TIMESTAMP
        WHERE c."deleted_at" IS NULL
          AND c."contacts" IS NOT NULL
          AND jsonb_typeof(c."contacts"::jsonb) = 'array'
          AND jsonb_array_length(c."contacts"::jsonb) > 0
          AND (
            c."contact_person" IS NULL OR TRIM(c."contact_person") = ''
            OR c."phone" IS NULL OR TRIM(c."phone") = ''
          );
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        -- 快照回填不可逆；保留 contacts 明细真源
        SELECT 1;
    """
