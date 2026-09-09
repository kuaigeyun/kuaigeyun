/** 销项/进项开票金额录入：含税与不含税互算（税率按百分数，如 13） */

export type InvoiceAmountInputMode = 'tax_exclusive' | 'tax_inclusive';

/** 金额分位量化（元，两位小数），避免 float 比较误判「等于上限仍超限」 */
export function quantizeMoney(value: number): number {
  return Number((Number(value) || 0).toFixed(2));
}

/** 价税合计是否超过可开票上限（两侧先量化到分） */
export function moneyExceedsMax(totalIncl: number, maxTotalIncl: number): boolean {
  return quantizeMoney(totalIncl) > quantizeMoney(maxTotalIncl);
}

export function invoiceExclFromIncl(incl: number, taxRatePercent: number): number {
  const rate = Number(taxRatePercent) || 0;
  return quantizeMoney(Number(incl || 0) / (1 + rate / 100));
}

export function invoiceInclFromExcl(excl: number, taxRatePercent: number): number {
  const rate = Number(taxRatePercent) || 0;
  return quantizeMoney(Number(excl || 0) * (1 + rate / 100));
}

export function convertInvoiceAmountBetweenModes(
  amount: number,
  taxRatePercent: number,
  from: InvoiceAmountInputMode,
  to: InvoiceAmountInputMode,
): number {
  const value = Number(amount || 0);
  if (from === to) return quantizeMoney(value);
  if (from === 'tax_exclusive' && to === 'tax_inclusive') {
    return invoiceInclFromExcl(value, taxRatePercent);
  }
  return invoiceExclFromIncl(value, taxRatePercent);
}

export type ResolveInvoiceAmountsOptions = {
  /** 可开票价税合计上限；不含税正算若仅因分位超出 ≤0.01，钳到上限并以含税为真源 */
  maxTotalIncl?: number;
};

/**
 * 提交前价税拆分。
 * 含税模式：合计为真源。
 * 不含税模式：未税正算；若相对可开票上限仅 0.01 分位漂移则钳制到上限。
 */
export function resolveInvoiceAmountsForSubmit(
  entered: number,
  taxRatePercent: number,
  mode: InvoiceAmountInputMode,
  options?: ResolveInvoiceAmountsOptions,
): { invoiceAmountExcl: number; totalIncl: number } {
  const value = Number(entered || 0);
  if (mode === 'tax_inclusive') {
    const totalIncl = quantizeMoney(value);
    return {
      invoiceAmountExcl: invoiceExclFromIncl(totalIncl, taxRatePercent),
      totalIncl,
    };
  }
  const invoiceAmountExcl = quantizeMoney(value);
  let totalIncl = invoiceInclFromExcl(invoiceAmountExcl, taxRatePercent);
  const maxRaw = options?.maxTotalIncl;
  if (maxRaw != null && Number.isFinite(maxRaw) && maxRaw >= 0) {
    const maxQ = quantizeMoney(maxRaw);
    const overshoot = quantizeMoney(totalIncl - maxQ);
    if (totalIncl > maxQ && overshoot <= 0.01) {
      return {
        invoiceAmountExcl: invoiceExclFromIncl(maxQ, taxRatePercent),
        totalIncl: maxQ,
      };
    }
  }
  return { invoiceAmountExcl, totalIncl };
}

/**
 * 税率变更时重算录入金额：
 * - 不含税模式：保持价税合计不变，按新税率反算不含税
 * - 含税模式：含税金额不变（仅折合不含税提示变化）
 */
export function recalcEnteredAmountOnTaxRateChange(
  entered: number,
  prevRatePercent: number,
  nextRatePercent: number,
  mode: InvoiceAmountInputMode,
): number {
  const value = Number(entered || 0);
  const prev = Number(prevRatePercent);
  const next = Number(nextRatePercent);
  if (!(value > 0) || prev === next) return quantizeMoney(value);
  if (mode === 'tax_inclusive') {
    return quantizeMoney(value);
  }
  const incl = invoiceInclFromExcl(value, prev);
  return invoiceExclFromIncl(incl, next);
}
