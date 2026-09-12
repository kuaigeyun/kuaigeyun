/** 固定资产表单：折旧与净值计算（与后端 fa_core 一致） */

export function computeMonthlyDepreciation(
  originalValue: number,
  residualRate: number,
  usefulLifeMonths: number,
): number {
  if (!usefulLifeMonths || usefulLifeMonths <= 0) return 0;
  const original = Number(originalValue) || 0;
  const rate = Number(residualRate) || 0;
  const residual = roundMoney(original * rate);
  const depreciable = roundMoney(original - residual);
  if (depreciable <= 0) return 0;
  return roundMoney(depreciable / usefulLifeMonths);
}

export function computeNetValue(
  originalValue: number,
  accumulatedDepreciation: number,
  impairmentValue: number,
): number {
  const original = Number(originalValue) || 0;
  const accumulated = Number(accumulatedDepreciation) || 0;
  const impairment = Number(impairmentValue) || 0;
  return roundMoney(original - accumulated - impairment);
}

export function computeExpectedResidual(originalValue: number, residualRate: number): number {
  const original = Number(originalValue) || 0;
  const rate = Number(residualRate) || 0;
  return roundMoney(original * rate);
}

export function computeRemainingPeriods(usefulLifeMonths: number, depreciatedPeriods: number): number {
  const life = Number(usefulLifeMonths) || 0;
  const used = Number(depreciatedPeriods) || 0;
  return Math.max(0, life - used);
}

function roundMoney(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export function formatMoneyDisplay(value: number | undefined): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const FA_CHANGE_METHOD_OPTIONS = ['购入', '受捐', '盘盈', '自建', '导入', '其他'];

export const FA_UNIT_OPTIONS = ['台', '套', '个', '件', '辆', '张', '把', '米', '平方米'];
