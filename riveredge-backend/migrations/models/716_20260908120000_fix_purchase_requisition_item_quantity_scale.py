"""
修复采购申请明细 quantity 精度：迁移 610 误写头表名，明细仍为 NUMERIC(10,2)。
小数数量（如需求计算 0.002）入库被截成 0.00，列表序列化 gt=0 整页 500。
"""

from tortoise import BaseDBAsyncClient

RUN_IN_TRANSACTION = True


async def upgrade(db: BaseDBAsyncClient) -> str:
    return """
        DO $$
        DECLARE
            col_precision INT;
        BEGIN
            SELECT c.numeric_precision
            INTO col_precision
            FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND c.table_name = 'apps_kuaizhizao_purchase_requisition_items'
              AND c.column_name = 'quantity'
              AND c.data_type = 'numeric'
              AND COALESCE(c.numeric_scale, 0) = 2;

            IF col_precision IS NOT NULL THEN
                EXECUTE format(
                    'ALTER TABLE %I ALTER COLUMN %I TYPE NUMERIC(%s, 4) USING %I::NUMERIC',
                    'apps_kuaizhizao_purchase_requisition_items',
                    'quantity',
                    col_precision + 2,
                    'quantity'
                );
            END IF;
        END $$;

        -- 被 scale=2 截成 0 的行：按来源需求计算明细建议采购量回填
        UPDATE apps_kuaizhizao_purchase_requisition_items AS pri
        SET quantity = dci.suggested_purchase_order_quantity
        FROM apps_kuaizhizao_demand_computation_items AS dci
        WHERE pri.demand_computation_item_id = dci.id
          AND pri.tenant_id = dci.tenant_id
          AND pri.quantity <= 0
          AND dci.suggested_purchase_order_quantity > 0;
    """


async def downgrade(db: BaseDBAsyncClient) -> str:
    return """
        -- 降级不自动缩 scale；若已写入第 3/4 位小数请先手工处理
        SELECT 1;
    """
