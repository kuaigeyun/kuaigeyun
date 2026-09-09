"""
补删快财务收付款「单据编码」全局 UNIQUE。

迁移 463 误用自动命名（*_receipt_code_key），未删除建表时的
uq_apps_kuaicaiwu_receipts_receipt_code / uq_apps_kuaicaiwu_payments_payment_code，
多租户同日 count+1 拼号会撞全局唯一。
同时确保租户内未删除部分唯一索引存在。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True

_TARGETS: list[tuple[str, list[str], str, list[str]]] = [
    (
        "apps_kuaicaiwu_receipts",
        [
            "uq_apps_kuaicaiwu_receipts_receipt_code",
            "apps_kuaicaiwu_receipts_receipt_code_key",
        ],
        "uidx_receipts_tenant_receipt_code_active",
        ["tenant_id", "receipt_code"],
    ),
    (
        "apps_kuaicaiwu_payments",
        [
            "uq_apps_kuaicaiwu_payments_payment_code",
            "apps_kuaicaiwu_payments_payment_code_key",
        ],
        "uidx_payments_tenant_payment_code_active",
        ["tenant_id", "payment_code"],
    ),
]


async def upgrade(db: BaseDBAsyncClient) -> str:
    blocks: list[str] = []
    for table, old_names, new_name, cols in _TARGETS:
        col_list = ", ".join(f'"{c}"' for c in cols)
        drop_parts = []
        for name in old_names:
            drop_parts.append(
                f"""
                IF EXISTS (
                    SELECT 1 FROM pg_constraint
                    WHERE conname = '{name}' AND conrelid = '{table}'::regclass
                ) THEN
                    ALTER TABLE "{table}" DROP CONSTRAINT "{name}";
                END IF;
                DROP INDEX IF EXISTS "{name}";
                """
            )
        blocks.append(
            f"""
            DO $$
            BEGIN
                IF to_regclass('public.{table}') IS NULL THEN
                    RETURN;
                END IF;
                {"".join(drop_parts)}
                CREATE UNIQUE INDEX IF NOT EXISTS "{new_name}"
                ON "{table}" ({col_list})
                WHERE "deleted_at" IS NULL;
            END $$;
            """
        )
    return "\n".join(blocks)


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        -- 不恢复全局唯一；缩回租户唯一会再次引入多租户撞号
        SELECT 1;
    """
