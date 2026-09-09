import { normalizeFormListItems } from '../../../utils/formListItems';
import { formatCurrencyAmount } from '../../../utils/format';

const toSafeNumber = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const toCents = (value: unknown): number => Math.round(toSafeNumber(value) * 100);
const fromCents = (cents: number): number => cents / 100;

/** 单据明细行价税拆分（与销售/报价/合同/采购明细一致） */
export function calcDocumentLineAmounts(
  qtyInput: unknown,
  priceInput: unknown,
  taxRateInput: unknown,
  priceTypeInput?: string,
) {
  const qty = toSafeNumber(qtyInput);
  const unitPriceCents = toCents(priceInput);
  const taxRate = toSafeNumber(taxRateInput);
  const priceType = priceTypeInput ?? 'tax_exclusive';

  if (priceType === 'tax_inclusive') {
    const inclCents = Math.round(qty * unitPriceCents);
    const exclCents = Math.round(inclCents / (1 + taxRate / 100));
    const taxCents = inclCents - exclCents;
    return {
      excl: fromCents(exclCents),
      tax: fromCents(taxCents),
      incl: fromCents(inclCents),
    };
  }

  const exclCents = Math.round(qty * unitPriceCents);
  const taxCents = Math.round((exclCents * taxRate) / 100);
  return {
    excl: fromCents(exclCents),
    tax: fromCents(taxCents),
    incl: fromCents(exclCents + taxCents),
  };
}

const roundToPlaces = (value: number, places: number): number => {
  if (!Number.isFinite(value)) return 0;
  if (!Number.isFinite(places) || places < 0) return value;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

/** 价税合计为真源时反算未税/税额（允许与 qty×单价分币结果存在尾差） */
export function calcDocumentLineAmountsFromInclTotal(inclTotal: unknown, taxRateInput: unknown) {
  const inclCents = toCents(inclTotal);
  const taxRate = toSafeNumber(taxRateInput);
  const factor = 1 + taxRate / 100;
  const exclCents = factor > 0 ? Math.round(inclCents / factor) : inclCents;
  const taxCents = inclCents - exclCents;
  return {
    excl: fromCents(exclCents),
    tax: fromCents(taxCents),
    incl: fromCents(inclCents),
  };
}

/** 未税金额为真源时正算税额/价税合计 */
export function calcDocumentLineAmountsFromExclTotal(exclTotal: unknown, taxRateInput: unknown) {
  const exclCents = toCents(exclTotal);
  const taxRate = toSafeNumber(taxRateInput);
  const taxCents = Math.round((exclCents * taxRate) / 100);
  return {
    excl: fromCents(exclCents),
    tax: fromCents(taxCents),
    incl: fromCents(exclCents + taxCents),
  };
}

function hasFiniteStoredLineAmount(value: unknown): boolean {
  if (value == null || value === '') return false;
  return Number.isFinite(Number(value));
}

/**
 * 明细行展示金额：已存 item_amount 时以之为真源拆分；否则按 qty×单价计算。
 * 含税价类 item_amount=价税合计；不含税价类 item_amount=未税金额。
 */
export function resolveDocumentLineDisplayAmounts(
  row: {
    qty?: unknown;
    unit_price?: unknown;
    tax_rate?: unknown;
    item_amount?: unknown;
    is_gift?: unknown;
  },
  priceType: string | undefined,
): { excl: number; tax: number; incl: number } {
  const pt = priceType ?? 'tax_exclusive';
  if (row.is_gift) {
    return { excl: 0, tax: 0, incl: 0 };
  }
  if (hasFiniteStoredLineAmount(row.item_amount)) {
    if (pt === 'tax_inclusive') {
      return calcDocumentLineAmountsFromInclTotal(row.item_amount, row.tax_rate);
    }
    return calcDocumentLineAmountsFromExclTotal(row.item_amount, row.tax_rate);
  }
  return calcDocumentLineAmounts(row.qty, row.unit_price, row.tax_rate, pt);
}

/**
 * 用户录入价税合计：合计为真源，反算单价（按单价小数位量化）并写回落库行金额。
 * 解决「8500 → 反算单价分币 → 再乘数量变成 8500.32」尾差回写。
 */
export function applyDocumentLineInclAmountEdit(opts: {
  qty: unknown;
  taxRate: unknown;
  priceType: string | undefined;
  inclAmount: unknown;
  priceDecimals?: number;
}): {
  unit_price: number;
  item_amount: number;
  excl: number;
  tax: number;
  incl: number;
} {
  const qty = toSafeNumber(opts.qty);
  const pt = opts.priceType ?? 'tax_exclusive';
  const amounts = calcDocumentLineAmountsFromInclTotal(opts.inclAmount, opts.taxRate);
  const rawUnit =
    qty > 0 ? (pt === 'tax_inclusive' ? amounts.incl / qty : amounts.excl / qty) : 0;
  const unit_price =
    opts.priceDecimals != null ? roundToPlaces(rawUnit, opts.priceDecimals) : rawUnit;
  return {
    unit_price,
    item_amount: pt === 'tax_inclusive' ? amounts.incl : amounts.excl,
    ...amounts,
  };
}

/** 按 qty×单价重算落库行金额（数量/单价/税率变更时） */
export function recalcDocumentStoredLineAmount(
  row: {
    qty?: unknown;
    unit_price?: unknown;
    tax_rate?: unknown;
    is_gift?: unknown;
  },
  priceType: string | undefined,
): number {
  if (row.is_gift) return 0;
  const line = calcDocumentLineAmounts(row.qty, row.unit_price, row.tax_rate, priceType);
  return resolveSalesDocumentStoredLineAmount(line, priceType);
}

export interface DocumentGoodsTotals {
  totalQuantity: number;
  goodsExcl: number;
  taxAmount: number;
  goodsIncl: number;
}

export interface DocumentTotalsWithDiscount extends DocumentGoodsTotals {
  discountAmount: number;
  goodsAfterDiscount: number;
}

export interface SalesDocumentTotals extends DocumentTotalsWithDiscount {
  customerFees: number;
  ourFees: number;
  estimatedReceivable: number;
}

export interface PurchaseDocumentTotals extends DocumentGoodsTotals {
  otherSideFees: number;
  ourSideFees: number;
  estimatedPayable: number;
  estimatedTotalCost: number;
}

type LineReader = (row: Record<string, unknown>) => {
  qty: unknown;
  price: unknown;
  taxRate: unknown;
};

function sumFeeAmounts(feeDetails: unknown[] | undefined) {
  let otherSideCents = 0;
  let ourSideCents = 0;
  for (const fee of normalizeFormListItems<Record<string, unknown>>(feeDetails)) {
    const feeCents = toCents(fee?.amount);
    if (fee?.bearer === 'other_side') otherSideCents += feeCents;
    else ourSideCents += feeCents;
  }
  return {
    otherSide: fromCents(otherSideCents),
    ourSide: fromCents(ourSideCents),
  };
}

/** 汇总明细行货值、税额、含税货值 */
export function computeDocumentGoodsTotals(
  items: unknown[] | undefined,
  priceType: string | undefined,
  readLine: LineReader,
): DocumentGoodsTotals {
  const rows = normalizeFormListItems<Record<string, unknown>>(items);
  const pt = priceType ?? 'tax_exclusive';
  let totalQuantity = 0;
  let goodsExclCents = 0;
  let taxAmountCents = 0;
  let goodsInclCents = 0;

  for (const row of rows) {
    const { qty, price, taxRate } = readLine(row);
    totalQuantity += toSafeNumber(qty);
    const line = resolveDocumentLineDisplayAmounts(
      {
        qty,
        unit_price: price,
        tax_rate: taxRate,
        item_amount: row.item_amount,
        is_gift: row.is_gift,
      },
      pt,
    );
    goodsExclCents += toCents(line.excl);
    taxAmountCents += toCents(line.tax);
    goodsInclCents += toCents(line.incl);
  }

  return {
    totalQuantity,
    goodsExcl: fromCents(goodsExclCents),
    taxAmount: fromCents(taxAmountCents),
    goodsIncl: fromCents(goodsInclCents),
  };
}

/** 整单优惠：从价税合计扣减，不低于 0（对齐用友/金蝶整单折让） */
export function applyDocumentHeaderDiscount(
  goodsIncl: number,
  discountAmountInput: unknown,
): Pick<DocumentTotalsWithDiscount, 'discountAmount' | 'goodsAfterDiscount'> {
  const inclCents = toCents(goodsIncl);
  const discountCents = Math.min(Math.max(0, toCents(discountAmountInput)), inclCents);
  return {
    discountAmount: fromCents(discountCents),
    goodsAfterDiscount: fromCents(inclCents - discountCents),
  };
}

export function computeDocumentTotalsWithDiscount(
  items: unknown[] | undefined,
  priceType: string | undefined,
  quantityField: string,
  discountAmountInput?: unknown,
): DocumentTotalsWithDiscount {
  const goods = computeDocumentGoodsTotals(items, priceType, (row) => ({
    qty: row[quantityField],
    price: row.unit_price,
    taxRate: row.tax_rate,
  }));
  const discount = applyDocumentHeaderDiscount(goods.goodsIncl, discountAmountInput);
  return { ...goods, ...discount };
}

/** 销售订单明细行数量（表单 required_quantity / 列表 order_quantity） */
function readSalesOrderLineQuantity(row: Record<string, unknown>): unknown {
  return row.required_quantity ?? row.order_quantity;
}

/** 按价类落库/展示的整单金额（不含税单存未税货值，含税单存预计应收） */
export function resolveSalesDocumentStoredTotalAmount(
  totals: SalesDocumentTotals,
  priceType: string | undefined,
): number {
  const pt = priceType ?? 'tax_exclusive';
  if (pt === 'tax_inclusive') {
    return totals.estimatedReceivable;
  }
  const discountCents = Math.min(toCents(totals.discountAmount), toCents(totals.goodsIncl));
  const inclCents = toCents(totals.goodsIncl);
  const exclCents = toCents(totals.goodsExcl);
  const exclAfterDiscountCents =
    inclCents > 0
      ? Math.round((exclCents * (inclCents - discountCents)) / inclCents)
      : exclCents;
  return fromCents(exclAfterDiscountCents + toCents(totals.customerFees));
}

/** 按价类落库/展示的行金额 */
export function resolveSalesDocumentStoredLineAmount(
  line: { excl: number; incl: number },
  priceType: string | undefined,
): number {
  return (priceType ?? 'tax_exclusive') === 'tax_inclusive' ? line.incl : line.excl;
}

/** 列表/详情展示用总金额（不含税单按明细重算，兼容历史误存含税合计） */
export function resolveSalesOrderDisplayTotalAmount(order: {
  total_amount?: number | null;
  price_type?: string | null;
  discount_amount?: number | null;
  fee_details?: unknown;
  items?: Array<Record<string, unknown>> | null;
}): number {
  const priceType = order.price_type ?? 'tax_exclusive';
  const items = normalizeFormListItems<Record<string, unknown>>(order.items);
  if (priceType === 'tax_inclusive' || items.length === 0) {
    return toSafeNumber(order.total_amount);
  }
  const normalizedItems = items.map((row) => ({
    ...row,
    required_quantity: readSalesOrderLineQuantity(row),
  }));
  return resolveSalesDocumentStoredTotalAmount(
    computeSalesDocumentTotals(
      normalizedItems,
      order.fee_details,
      priceType,
      'required_quantity',
      order.discount_amount ?? 0,
    ),
    priceType,
  );
}

/** 销售类单据：优惠后货值 + 对方承担费用 = 预计应收 */
export function computeSalesDocumentTotals(
  items: unknown[] | undefined,
  feeDetails: unknown[] | undefined,
  priceType: string | undefined,
  quantityField: string,
  discountAmountInput?: unknown,
): SalesDocumentTotals {
  const withDiscount = computeDocumentTotalsWithDiscount(
    items,
    priceType,
    quantityField,
    discountAmountInput,
  );
  const fees = sumFeeAmounts(feeDetails);
  const estimatedReceivableCents =
    toCents(withDiscount.goodsAfterDiscount) + toCents(fees.otherSide);

  return {
    ...withDiscount,
    customerFees: fees.otherSide,
    ourFees: fees.ourSide,
    estimatedReceivable: fromCents(estimatedReceivableCents),
  };
}

/** 采购类单据：应付 = 含税货值 + 对方费用；总成本 = 含税货值 + 我方成本 */
export function computePurchaseDocumentTotals(
  items: unknown[] | undefined,
  feeDetails: unknown[] | undefined,
  priceType: string | undefined,
  quantityField = 'ordered_quantity',
): PurchaseDocumentTotals {
  const goods = computeDocumentGoodsTotals(items, priceType, (row) => ({
    qty: row[quantityField],
    price: row.unit_price,
    taxRate: row.tax_rate,
  }));
  const fees = sumFeeAmounts(feeDetails);
  const estimatedPayableCents = toCents(goods.goodsIncl) + toCents(fees.otherSide);
  const estimatedTotalCostCents = toCents(goods.goodsIncl) + toCents(fees.ourSide);

  return {
    ...goods,
    otherSideFees: fees.otherSide,
    ourSideFees: fees.ourSide,
    estimatedPayable: fromCents(estimatedPayableCents),
    estimatedTotalCost: fromCents(estimatedTotalCostCents),
  };
}

export function formatDocumentMoneyYuan(n: number): string {
  return formatCurrencyAmount(n ?? 0, '¥0.00');
}
