/** 销售退货冲减应收（红字往来，非正向待收款） */

export const RECEIVABLE_SOURCE_SALES_RETURN = '销售退货';

export function isSalesReturnOffsetReceivable(record: {
  source_type?: string | null;
} | null | undefined): boolean {
  return String(record?.source_type || '').trim() === RECEIVABLE_SOURCE_SALES_RETURN;
}
