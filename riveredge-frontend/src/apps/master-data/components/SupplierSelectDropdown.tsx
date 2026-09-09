/**
 * 供应商选择下拉：快速新建 / 快速编辑 / 高级搜索
 *
 * 选中时必须带回完整引用展示（含联系人），禁止因「不在本地 200 条缓存 / 高级搜索」而 onSupplierPick(null)。
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App } from 'antd';
import { UniDropdown, type UniDropdownProps } from '../../../components/uni-dropdown';
import type { Supplier } from '../types/supply-chain';
import { SupplierFormModal } from './SupplierFormModal';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import {
  ReferenceDisplayAccessError,
  canReadReferenceResource,
  mapPartnerReferenceDisplayItem,
  referenceDisplayToIdOptions,
  resolveReferenceDisplay,
  searchReferenceDisplay,
  type ReferenceDisplayItem,
} from '../../../utils/referenceDisplay';

function formatSupplierLabel(s: Supplier | Record<string, unknown>): string {
  const row = s as Record<string, unknown>;
  return (
    `${row.code ?? row.supplier_code ?? ''} - ${row.name ?? row.supplier_name ?? ''}`.trim() ||
    String(row.id ?? row.supplier_id)
  );
}

function getSupplierId(s: Supplier | Record<string, unknown>): number | undefined {
  const row = s as Record<string, unknown>;
  const id = row.id ?? row.supplier_id;
  return id != null ? Number(id) : undefined;
}

function mapDisplayItemsToSuppliers(items: ReferenceDisplayItem[]): Supplier[] {
  return items.map((item) => mapPartnerReferenceDisplayItem(item) as Supplier);
}

export type SupplierSelectDropdownProps = Omit<
  UniDropdownProps,
  'options' | 'quickCreate' | 'quickEdit' | 'advancedSearch' | 'loading'
> & {
  suppliers?: Supplier[];
  loading?: boolean;
  onSuppliersChange?: (suppliers: Supplier[]) => void;
  onSupplierPick?: (supplier: Supplier | null) => void;
  modalZIndex?: number;
  autoLoad?: boolean;
  hostResource?: string;
};

export const SupplierSelectDropdown: React.FC<SupplierSelectDropdownProps> = ({
  suppliers: suppliersProp,
  loading: loadingProp,
  onSuppliersChange,
  onSupplierPick,
  modalZIndex,
  autoLoad = true,
  hostResource,
  onChange,
  ...rest
}) => {
  const { message: messageApi } = App.useApp();
  const currentUser = useCurrentUser();
  const [internalSuppliers, setInternalSuppliers] = useState<Supplier[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [picking, setPicking] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editUuid, setEditUuid] = useState<string | null>(null);

  const suppliers = suppliersProp ?? internalSuppliers;
  const loading = loadingProp ?? internalLoading;

  const mergeSupplierList = useCallback((prev: Supplier[], supplier: Supplier) => {
    const matchKey = supplier.uuid ?? supplier.id;
    const idx = prev.findIndex((s) => (s.uuid ?? s.id) === matchKey);
    if (idx >= 0) {
      const next = [...prev];
      next[idx] = { ...next[idx], ...supplier };
      return next;
    }
    return [...prev, supplier];
  }, []);

  const mergeManySuppliers = useCallback(
    (prev: Supplier[], incoming: Supplier[]) => {
      let next = prev;
      for (const s of incoming) {
        next = mergeSupplierList(next, s);
      }
      return next;
    },
    [mergeSupplierList],
  );

  const commitSupplierList = useCallback(
    (nextList: Supplier[]) => {
      if (suppliersProp == null) {
        setInternalSuppliers(nextList);
      }
      onSuppliersChange?.(nextList);
    },
    [onSuppliersChange, suppliersProp],
  );

  const refreshSuppliers = useCallback(async () => {
    setInternalLoading(true);
    try {
      const res = await searchReferenceDisplay({
        resource: 'master-data:supply-chain:supplier',
        hostResource,
        pageSize: 200,
      });
      const list = mapDisplayItemsToSuppliers(res.items);
      commitSupplierList(list);
      return list;
    } catch (err) {
      if (err instanceof ReferenceDisplayAccessError) {
        messageApi.warning(err.message);
      }
      return [];
    } finally {
      setInternalLoading(false);
    }
  }, [commitSupplierList, hostResource, messageApi]);

  useEffect(() => {
    if (autoLoad && suppliersProp == null) {
      void refreshSuppliers();
    }
  }, [autoLoad, refreshSuppliers, suppliersProp]);

  const options = useMemo(
    () =>
      suppliers.map((s) => ({
        value: getSupplierId(s),
        label: formatSupplierLabel(s),
      })),
    [suppliers],
  );

  const resolveSupplierById = useCallback(
    async (supplierId: number): Promise<Supplier | null> => {
      const cached = suppliers.find((x) => getSupplierId(x) === supplierId);
      if (cached) return cached;
      try {
        const items = await resolveReferenceDisplay({
          resource: 'master-data:supply-chain:supplier',
          recordIds: [supplierId],
          hostResource,
        });
        if (!items.length) return null;
        const mapped = mapPartnerReferenceDisplayItem(items[0]) as Supplier;
        commitSupplierList(mergeSupplierList(suppliers, mapped));
        return mapped;
      } catch (err) {
        if (err instanceof ReferenceDisplayAccessError) {
          messageApi.warning(err.message);
        }
        return null;
      }
    },
    [commitSupplierList, hostResource, mergeSupplierList, messageApi, suppliers],
  );

  const handleChange = useCallback(
    (value: number | undefined, option: unknown) => {
      onChange?.(value, option as Parameters<NonNullable<UniDropdownProps['onChange']>>[1]);
      if (value == null) {
        onSupplierPick?.(null);
        return;
      }
      const id = Number(value);
      if (!Number.isFinite(id) || id <= 0) {
        onSupplierPick?.(null);
        return;
      }
      const cached = suppliers.find((x) => getSupplierId(x) === id);
      if (cached) {
        onSupplierPick?.(cached);
        return;
      }
      setPicking(true);
      void resolveSupplierById(id)
        .then((s) => {
          onSupplierPick?.(s);
        })
        .finally(() => {
          setPicking(false);
        });
    },
    [onChange, onSupplierPick, resolveSupplierById, suppliers],
  );

  const openCreate = useCallback(() => {
    setEditUuid(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback(
    (supplierId: unknown) => {
      const s = suppliers.find((x) => getSupplierId(x) === supplierId);
      const uuid = s?.uuid;
      if (!uuid) {
        messageApi.warning('无法编辑该供应商，请刷新供应商列表后重试');
        return;
      }
      setEditUuid(String(uuid));
      setFormOpen(true);
    },
    [messageApi, suppliers],
  );

  const handleSuccess = useCallback(
    (supplier: Supplier) => {
      const nextList = mergeSupplierList(suppliers, supplier);
      commitSupplierList(nextList);
      onSupplierPick?.(supplier);
      onChange?.(supplier.id, {
        value: supplier.id,
        label: formatSupplierLabel(supplier),
      });
      setFormOpen(false);
      setEditUuid(null);
    },
    [commitSupplierList, mergeSupplierList, onChange, onSupplierPick, suppliers],
  );

  const canManageSupplier = canReadReferenceResource(currentUser, 'master-data:supply-chain:supplier');

  return (
    <>
      <UniDropdown
        {...rest}
        showSearch
        allowClear
        loading={loading || picking}
        options={options}
        onChange={handleChange}
        quickCreate={
          canManageSupplier
            ? {
                label: '快速新建',
                onClick: openCreate,
              }
            : undefined
        }
        quickEdit={
          canManageSupplier
            ? {
                label: '编辑供应商',
                onEdit: openEdit,
              }
            : undefined
        }
        advancedSearch={{
          label: '高级搜索',
          fields: [{ name: 'keyword', label: '关键词' }],
          onSearch: async (values) => {
            try {
              const res = await searchReferenceDisplay({
                resource: 'master-data:supply-chain:supplier',
                hostResource,
                keyword: values.keyword,
                pageSize: 200,
              });
              const mapped = mapDisplayItemsToSuppliers(res.items);
              commitSupplierList(mergeManySuppliers(suppliers, mapped));
              return referenceDisplayToIdOptions(res.items);
            } catch (err) {
              if (err instanceof ReferenceDisplayAccessError) {
                messageApi.warning(err.message);
              }
              return [];
            }
          },
        }}
      />
      <SupplierFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditUuid(null);
        }}
        editUuid={editUuid}
        onSuccess={handleSuccess}
      />
    </>
  );
};
