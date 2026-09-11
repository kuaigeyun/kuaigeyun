/**
 * 仓储出入库 Hub 头表数量展示：
 * - 明细单位一致（含单行）：数量合计 + 单位
 * - 单位不一致：展示品种数，禁止混单位加总
 */

import React from 'react';
import type { TFunction } from 'i18next';
import { QuantityWithUnitDisplay } from '../../../../../components/quantity-with-unit';

export type WarehouseHeaderQuantitySource = {
  total_quantity?: number | null;
  total_items?: number | null;
  /** 后端：明细单位一致时的单位；不一致或无明细为 null/undefined */
  quantity_unit?: string | null;
};

/** 明细行数量：始终带该行单位 */
export function renderWarehouseLineQuantity(
  quantity: unknown,
  unit?: unknown,
): React.ReactNode {
  return <QuantityWithUnitDisplay quantity={quantity} unit={unit} />;
}

/**
 * 头表数量列：同单位合计并带单位；异单位显示「N 种」。
 */
export function renderWarehouseHeaderQuantity(
  record: WarehouseHeaderQuantitySource,
  t: TFunction,
): React.ReactNode {
  const kindCount = Number(record.total_items ?? 0);
  const qty = Number(record.total_quantity ?? 0);
  const hasUnitKey = Object.prototype.hasOwnProperty.call(record, 'quantity_unit');
  const unitRaw = record.quantity_unit;

  if (kindCount <= 0 && !(qty > 0)) {
    return '-';
  }

  // 已下发 quantity_unit：null = 异单位；字符串（可空）= 同单位可合计
  if (hasUnitKey) {
    if (unitRaw == null) {
      return t('app.kuaizhizao.warehouseCommon.headerQuantityKinds', {
        count: Math.max(kindCount, 1),
      });
    }
    return <QuantityWithUnitDisplay quantity={qty} unit={unitRaw} />;
  }

  // 未下发时：多行不冒充加总，改显示种类；单行仅数量
  if (kindCount > 1) {
    return t('app.kuaizhizao.warehouseCommon.headerQuantityKinds', { count: kindCount });
  }
  return <QuantityWithUnitDisplay quantity={qty} unit={undefined} />;
}
