"""
补全企业会计准则科目表缺口：4102 一般风险准备；5401/5402/5403 成本类（工程施工等）。

对已启用总账（已有科目表）的租户幂等插入，不覆盖、不重命名既有科目。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True

_SEED_ROWS = (
    ("4102", "一般风险准备", "equity", "credit", False, False, False),
    ("5401", "工程施工", "cost", "debit", True, False, False),
    ("5402", "工程结算", "cost", "credit", False, False, False),
    ("5403", "机械作业", "cost", "debit", True, False, False),
)


def _values_sql() -> str:
    parts = []
    for code, name, account_type, direction, aux_dept, aux_project, is_controlled in _SEED_ROWS:
        parts.append(
            f"('{code}', '{name}', '{account_type}', '{direction}', "
            f"{'TRUE' if aux_dept else 'FALSE'}, "
            f"{'TRUE' if aux_project else 'FALSE'}, "
            f"{'TRUE' if is_controlled else 'FALSE'})"
        )
    return ",\n        ".join(parts)


async def upgrade(db: BaseDBAsyncClient) -> str:
    values = _values_sql()
    return f"""
INSERT INTO "apps_kuaicaiwu_chart_of_accounts" (
    "uuid",
    "tenant_id",
    "account_code",
    "account_name",
    "account_type",
    "level",
    "is_leaf",
    "balance_direction",
    "is_active",
    "aux_department",
    "aux_project",
    "is_controlled"
)
SELECT
    gen_random_uuid()::varchar(36),
    t."id",
    v."account_code",
    v."account_name",
    v."account_type",
    1,
    TRUE,
    v."balance_direction",
    TRUE,
    v."aux_department",
    v."aux_project",
    v."is_controlled"
FROM "infra_tenants" AS t
CROSS JOIN (
    VALUES
        {values}
) AS v("account_code", "account_name", "account_type", "balance_direction", "aux_department", "aux_project", "is_controlled")
WHERE EXISTS (
    SELECT 1
    FROM "apps_kuaicaiwu_chart_of_accounts" AS c
    WHERE c."tenant_id" = t."id"
      AND c."deleted_at" IS NULL
)
AND NOT EXISTS (
    SELECT 1
    FROM "apps_kuaicaiwu_chart_of_accounts" AS c
    WHERE c."tenant_id" = t."id"
      AND c."account_code" = v."account_code"
      AND c."deleted_at" IS NULL
);
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: chart of accounts gap backfill is irreversible"
