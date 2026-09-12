"""
回填报价单/销售订单自定义「制单日期」少一天的历史数据。

根因（2026-08-30 前）：东八区 DatePicker 选 3 号经 JSON 序列化为 UTC ISO 前一日，
若直接 slice(0,10) 或误解析会落成 2 号写入 value_date；原生 quotation_date/order_date
多数仍正确，列表叠列与「制单日期」自定义列因此差一天。

策略：仅当自定义制单日期比同行原生业务日稳定少 1 天，且值写入于修复前，才回填为原生业务日。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True

# 自定义日期 UTC 偏一天修复上线日（Asia/Shanghai 日历日起算）
_FIX_CUTOFF = "2026-08-30 00:00:00+08"


async def upgrade(db: BaseDBAsyncClient) -> str:
    return f"""
UPDATE "core_custom_field_values" AS v
SET
    "value_date" = q."quotation_date",
    "updated_at" = NOW()
FROM "core_custom_fields" AS cf,
     "apps_kuaizhizao_quotations" AS q
WHERE v."custom_field_id" = cf."id"
  AND cf."table_name" = 'apps_kuaizhizao_quotations'
  AND cf."field_type" = 'date'
  AND cf."deleted_at" IS NULL
  AND (cf."label" = '制单日期' OR cf."name" = '制单日期')
  AND v."deleted_at" IS NULL
  AND v."value_date" IS NOT NULL
  AND v."created_at" < TIMESTAMPTZ '{_FIX_CUTOFF}'
  AND v."record_table" = cf."table_name"
  AND q."id" = v."record_id"
  AND q."deleted_at" IS NULL
  AND q."quotation_date" IS NOT NULL
  AND q."quotation_date" = v."value_date" + INTERVAL '1 day';

UPDATE "core_custom_field_values" AS v
SET
    "value_date" = s."order_date",
    "updated_at" = NOW()
FROM "core_custom_fields" AS cf,
     "apps_kuaizhizao_sales_orders" AS s
WHERE v."custom_field_id" = cf."id"
  AND cf."table_name" = 'apps_kuaizhizao_sales_orders'
  AND cf."field_type" = 'date'
  AND cf."deleted_at" IS NULL
  AND (cf."label" = '制单日期' OR cf."name" = '制单日期')
  AND v."deleted_at" IS NULL
  AND v."value_date" IS NOT NULL
  AND v."created_at" < TIMESTAMPTZ '{_FIX_CUTOFF}'
  AND v."record_table" = cf."table_name"
  AND s."id" = v."record_id"
  AND s."deleted_at" IS NULL
  AND s."order_date" IS NOT NULL
  AND s."order_date" = v."value_date" + INTERVAL '1 day';
"""


async def downgrade(db: BaseDBAsyncClient) -> str:
    return "-- noop: custom document date off-by-one backfill is irreversible"
