import type { PriceTypeValue } from '../components/price-type-switch/PriceTypeSwitch';
import { convertDocumentLineForPriceTypeChange } from '../apps/kuaizhizao/utils/documentLineAmounts';

type FormLike = {
  getFieldValue: (name: string | string[]) => unknown;
  setFieldsValue: (values: Record<string, unknown>) => void;
  setFieldValue?: (name: string | string[], value: unknown) => void;
};

export function setFormPriceType(form: FormLike | null | undefined, priceType: PriceTypeValue): void {
  if (!form) return;
  if (typeof form.setFieldValue === 'function') {
    form.setFieldValue('price_type', priceType);
  } else {
    form.setFieldsValue({ price_type: priceType });
  }
}

export type DeferConvertLineItemsOptions = {
  /** 行数量字段：销售订单 required_quantity / 报价 quote_quantity / 合同 contract_quantity */
  quantityField: string;
  priceDecimals?: number;
  /** 写入过程中跳过「按单价重算行金额」副作用（销售订单 skipLineAmountResyncRef） */
  beginSkipLineAmountResync?: () => void;
  endSkipLineAmountResync?: () => void;
};

/**
 * 切换价类后异步换算明细：以当前行金额为真源反算单价，并写回 item_amount。
 * price_type 与 items 必须同一次 setFieldsValue，禁止先改价类再换算（否则会用新价类解读旧 item_amount）。
 * 禁止仅换算单价再 × 数量（会产生价差）。
 */
export function deferConvertLineItemsByPriceType(
  form: FormLike | null | undefined,
  fromType: PriceTypeValue,
  toType: PriceTypeValue,
  options: DeferConvertLineItemsOptions,
): void {
  if (!form || fromType === toType) return;

  const items = form.getFieldValue('items');
  if (!Array.isArray(items) || items.length === 0) {
    setFormPriceType(form, toType);
    return;
  }

  const snapshot = items;
  const quantityField = options.quantityField;
  const priceDecimals = options.priceDecimals;
  // 等 Switch onChange 结束再写表单，避免嵌套 shouldUpdate 重挂载吞掉点击；
  // 但价类与明细必须同一次写入，中间不得出现「新价类 + 旧金额」。
  queueMicrotask(() => {
    options.beginSkipLineAmountResync?.();
    try {
      const convertedItems = snapshot.map((row: Record<string, unknown>) => {
        const converted = convertDocumentLineForPriceTypeChange({
          qty: row?.[quantityField],
          unit_price: row?.unit_price,
          tax_rate: row?.tax_rate,
          item_amount: row?.item_amount,
          is_gift: row?.is_gift,
          fromPriceType: fromType,
          toPriceType: toType,
          priceDecimals,
        });
        return {
          ...row,
          unit_price: converted.unit_price,
          item_amount: converted.item_amount,
        };
      });
      form.setFieldsValue({
        price_type: toType,
        items: convertedItems,
      });
    } finally {
      options.endSkipLineAmountResync?.();
    }
  });
}
