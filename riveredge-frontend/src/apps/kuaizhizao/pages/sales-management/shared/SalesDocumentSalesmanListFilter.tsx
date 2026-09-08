/**
 * 销售单据列表：分段选择器旁的「按销售人员」筛选。
 * 选项来自当前可见单据中的去重销售人员，不从全员用户目录拉取。
 */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UniDropdown } from '../../../../../components/uni-dropdown';
import { normalizeUserDisplayName } from '../../../../../utils/userDisplay';

export type SalesmanListFilterValue = number | undefined;

export type DocumentSalesmanOption = {
  id: number;
  name: string;
};

export function SalesDocumentSalesmanListFilter({
  value,
  onChange,
  loadOptions,
  reloadToken,
  width = 160,
}: {
  value: SalesmanListFilterValue;
  onChange: (next: SalesmanListFilterValue) => void;
  /** 拉取当前单据范围内的销售人员 */
  loadOptions: () => Promise<DocumentSalesmanOption[]>;
  /** 变化时重新加载（如 list_scope） */
  reloadToken?: string | number;
  width?: number;
}) {
  const { t } = useTranslation();
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const items = await loadOptions();
        if (cancelled) return;
        const next = (items || [])
          .filter((u) => u != null && Number.isFinite(Number(u.id)))
          .map((u) => ({
            value: Number(u.id),
            label: normalizeUserDisplayName(u.name) || t('app.kuaizhizao.quotation.userFallback', { id: u.id }),
          }));
        setOptions(next);
        if (value != null && !next.some((o) => o.value === value)) {
          onChange(undefined);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // value/onChange 不入依赖：仅在选项重载后校验当前选中是否仍有效
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOptions, reloadToken]);

  return (
    <UniDropdown
      allowClear
      showSearch
      loading={loading}
      placeholder={t('app.kuaizhizao.salesOrder.salesman')}
      style={{ width }}
      popupMatchSelectWidth={false}
      value={value}
      options={options}
      onChange={(v) => {
        onChange(v != null && v !== '' && Number.isFinite(Number(v)) ? Number(v) : undefined);
      }}
    />
  );
}

/** 工具栏已选销售人员优先；未选时回落高级搜索表单 */
export function resolveListSalesmanId(
  toolbarSalesmanId: number | undefined,
  searchFormValues: { salesman_id?: unknown } | null | undefined,
): number | undefined {
  if (toolbarSalesmanId != null) return toolbarSalesmanId;
  const raw = searchFormValues?.salesman_id;
  if (raw == null || raw === '') return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}
