/**
 * 出库 Hub 编辑弹窗（生产领料 / 销售出库）。
 * 列表「编辑」与详情抽屉内「编辑」均打开本 Modal，详情抽屉保持只读。
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Input, InputNumber, Row, Col, Select, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate, MODAL_CONFIG, WAREHOUSE_FORM_DETAIL_TABLE_FRAME_STYLES } from '../../../../../components/layout-templates';
import { warehouseApi } from '../../../services/production';
import { warehouseApi as masterWarehouseApi } from '../../../../master-data/services/warehouse';
import { mapWarehouseSelectOptions, type WarehouseSelectOption } from './outboundEntryShared';
import OutboundSerialPickerField from './OutboundSerialPickerField';
import {
  filterWarehouseTrackingColumns,
  isMaterialBatchEntryEnabled,
  isMaterialSerialEntryEnabled,
  useWarehouseTrackingFlags,
} from '../shared/warehouseTrackingFlags';
import {
  loadConfirmPreviewMaterialMeta,
  type ConfirmPreviewMaterialMeta,
} from './outboundItemTracking';
import {
  loadBatchOptionsByMaterialId,
  loadInStockSerialOptions,
  isValidOutboundBatchSelection,
  resolveOutboundConfirmBatchValue,
  type InventoryPickOption,
} from './outboundConfirmInventoryOptions';
import { formatQuantity } from '../../../../../utils/format';
import { useNumericPrecisionPlaces } from '../../../../../hooks/useNumericPrecision';
import { appendWarehouseLineAmountColumns } from '../shared/warehouseAmountDisplay';
import {
  isOutboundEditable,
  outboundDocumentCode,
  outboundUpdateCapabilityReasonMessage,
  type OutboundHubOrder,
  type OutboundIssueType,
} from './outboundHubTypes';

type OutboundLineItem = {
  id?: number;
  material_id?: number;
  material_code?: string;
  material_name?: string;
  material_unit?: string;
  required_quantity?: number;
  picked_quantity?: number;
  delivery_quantity?: number;
  warehouse_id?: number;
  warehouse_name?: string;
  batch_number?: string;
  serial_numbers?: unknown;
};

type OutboundEditDetail = OutboundHubOrder & {
  items?: OutboundLineItem[];
};

function parseOutboundLineSerialNumbers(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map((x) => String(x).trim()).filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((x) => String(x).trim()).filter(Boolean);
      }
    } catch {
      /* ignore */
    }
  }
  return [];
}

export type OutboundHubEditModalProps = {
  open: boolean;
  record: { id?: number; outbound_type?: OutboundIssueType | string } | null;
  onClose: () => void;
  onSuccess?: () => void;
};

export const OutboundHubEditModal: React.FC<OutboundHubEditModalProps> = ({
  open,
  record,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const trackingFlags = useWarehouseTrackingFlags();
  const quantityDecimals = useNumericPrecisionPlaces('quantity');
  const { message: messageApi } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<OutboundEditDetail | null>(null);

  const [editablePickingQuantities, setEditablePickingQuantities] = useState<Record<number, number>>({});
  const [editablePickingWarehouses, setEditablePickingWarehouses] = useState<
    Record<number, { id: number; name: string }>
  >({});
  const [editablePickingBatches, setEditablePickingBatches] = useState<Record<number, string>>({});
  const [editablePickingNotes, setEditablePickingNotes] = useState('');

  const [editableDeliveryQuantities, setEditableDeliveryQuantities] = useState<Record<number, number>>({});
  const [editableDeliveryBatches, setEditableDeliveryBatches] = useState<Record<number, string>>({});
  const [editableDeliverySerials, setEditableDeliverySerials] = useState<Record<number, string[]>>({});
  const [editableDeliveryNotes, setEditableDeliveryNotes] = useState('');
  const [editableDeliveryWarehouse, setEditableDeliveryWarehouse] = useState<{ id: number; name: string }>({
    id: 0,
    name: '',
  });

  const [pickingWarehouseOptions, setPickingWarehouseOptions] = useState<WarehouseSelectOption[]>([]);
  const [deliveryWarehouseOptions, setDeliveryWarehouseOptions] = useState<WarehouseSelectOption[]>([]);
  const [deliveryMaterialMeta, setDeliveryMaterialMeta] = useState<Record<number, ConfirmPreviewMaterialMeta>>({});
  const [deliverySerialOptionsByLineId, setDeliverySerialOptionsByLineId] = useState<
    Record<number, { label: string; value: string }[]>
  >({});
  const [deliverySerialOptionsLoadingByLineId, setDeliverySerialOptionsLoadingByLineId] = useState<
    Record<number, boolean>
  >({});
  const deliverySerialOptionsLoadingRef = useRef<Record<number, boolean>>({});
  const [deliveryBatchOptionsByMaterialId, setDeliveryBatchOptionsByMaterialId] = useState<
    Record<number, InventoryPickOption[]>
  >({});
  const [pickingBatchOptionsByLineId, setPickingBatchOptionsByLineId] = useState<
    Record<number, InventoryPickOption[]>
  >({});
  const [batchOptionsLoading, setBatchOptionsLoading] = useState(false);

  const outboundType = record?.outbound_type;
  const isPicking = outboundType === 'production_picking';
  const isDelivery = outboundType === 'sales_delivery';
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const loadKey =
    open && record?.id && (isPicking || isDelivery) ? `${outboundType}:${record.id}` : null;

  const resetState = useCallback(() => {
    setDetail(null);
    setEditablePickingQuantities({});
    setEditablePickingWarehouses({});
    setEditablePickingBatches({});
    setEditablePickingNotes('');
    setEditableDeliveryQuantities({});
    setEditableDeliveryBatches({});
    setEditableDeliverySerials({});
    setEditableDeliveryNotes('');
    setEditableDeliveryWarehouse({ id: 0, name: '' });
    setPickingWarehouseOptions([]);
    setDeliveryWarehouseOptions([]);
    setDeliveryMaterialMeta({});
    setDeliverySerialOptionsByLineId({});
    setDeliverySerialOptionsLoadingByLineId({});
    deliverySerialOptionsLoadingRef.current = {};
    setDeliveryBatchOptionsByMaterialId({});
    setPickingBatchOptionsByLineId({});
    setBatchOptionsLoading(false);
  }, []);

  const batchOptionLabel = useCallback(
    (batch: string, qty: number, warehouseName?: string) =>
      warehouseName
        ? t('app.kuaizhizao.warehouseOutbound.confirm.batchAvailableWithWh', {
            batch,
            qty,
            warehouse: warehouseName,
          })
        : t('app.kuaizhizao.warehouseOutbound.confirm.batchAvailable', { batch, qty }),
    [t],
  );

  const mergeBatchSelectOptions = useCallback(
    (options: InventoryPickOption[], current?: string) => {
      const merged = [...options];
      const raw = String(current ?? '').trim();
      if (raw && !merged.some((o) => o.value === raw)) {
        merged.unshift({ value: raw, label: raw });
      }
      return merged;
    },
    [],
  );

  const loadPickingBatchOptions = useCallback(
    async (
      detailData: OutboundEditDetail,
      meta: Record<number, ConfirmPreviewMaterialMeta>,
      warehouses: Record<number, { id: number; name: string }>,
    ) => {
      const items = detailData.items || [];
      const lineIds = items
        .filter((it) => {
          const rid = Number(it.id);
          return (
            Number.isFinite(rid) &&
            rid > 0 &&
            isMaterialBatchEntryEnabled(trackingFlags, meta[rid]?.batchManaged)
          );
        })
        .map((it) => Number(it.id));
      if (!lineIds.length) {
        setPickingBatchOptionsByLineId({});
        return;
      }
      setBatchOptionsLoading(true);
      try {
        const next: Record<number, InventoryPickOption[]> = {};
        await Promise.all(
          items.map(async (it) => {
            const rid = Number(it.id);
            const mid = Number(it.material_id);
            if (!Number.isFinite(rid) || rid <= 0 || !Number.isFinite(mid) || mid <= 0) return;
            if (!isMaterialBatchEntryEnabled(trackingFlags, meta[rid]?.batchManaged)) return;
            const wh = warehouses[rid];
            const whFilter = Number(wh?.id ?? it.warehouse_id ?? 0);
            const batchByMid = await loadBatchOptionsByMaterialId(
              [mid],
              whFilter > 0 ? whFilter : undefined,
              batchOptionLabel,
            );
            next[rid] = batchByMid[mid] ?? [];
          }),
        );
        setPickingBatchOptionsByLineId(next);
      } finally {
        setBatchOptionsLoading(false);
      }
    },
    [batchOptionLabel, trackingFlags],
  );

  const loadDeliveryBatchOptions = useCallback(
    async (
      detailData: OutboundEditDetail,
      meta: Record<number, ConfirmPreviewMaterialMeta>,
      warehouseId: number,
    ) => {
      const batchMids = [
        ...new Set(
          (detailData.items || [])
            .map((it) => {
              const rid = Number(it.id);
              const mid = Number(it.material_id);
              if (!Number.isFinite(mid) || mid <= 0) return 0;
              if (!isMaterialBatchEntryEnabled(trackingFlags, meta[rid]?.batchManaged)) return 0;
              return mid;
            })
            .filter((mid) => mid > 0),
        ),
      ];
      if (!batchMids.length) {
        setDeliveryBatchOptionsByMaterialId({});
        return;
      }
      setBatchOptionsLoading(true);
      try {
        const whFilter = warehouseId > 0 ? warehouseId : undefined;
        const batchMap = await loadBatchOptionsByMaterialId(
          batchMids,
          whFilter,
          batchOptionLabel,
        );
        setDeliveryBatchOptionsByMaterialId(batchMap);
      } finally {
        setBatchOptionsLoading(false);
      }
    },
    [batchOptionLabel, trackingFlags],
  );

  const initPickingEditState = useCallback((detailData: OutboundEditDetail) => {
    const quantities: Record<number, number> = {};
    const warehouses: Record<number, { id: number; name: string }> = {};
    const batches: Record<number, string> = {};
    (detailData.items || []).forEach((it) => {
      if (it?.id == null) return;
      const rid = Number(it.id);
      quantities[rid] = Number(it.required_quantity ?? 0);
      warehouses[rid] = {
        id: Number(it.warehouse_id ?? 0),
        name: String(it.warehouse_name ?? ''),
      };
      batches[rid] = String(it.batch_number ?? '');
    });
    setEditablePickingQuantities(quantities);
    setEditablePickingWarehouses(warehouses);
    setEditablePickingBatches(batches);
    setEditablePickingNotes(String(detailData.notes ?? ''));
  }, []);

  const initDeliveryEditState = useCallback((detailData: OutboundEditDetail) => {
    const quantities: Record<number, number> = {};
    const batches: Record<number, string> = {};
    const serials: Record<number, string[]> = {};
    (detailData.items || []).forEach((it) => {
      if (it?.id == null) return;
      const rid = Number(it.id);
      quantities[rid] = Number(it.delivery_quantity ?? 0);
      batches[rid] = String(it.batch_number ?? '');
      serials[rid] = parseOutboundLineSerialNumbers(it.serial_numbers);
    });
    setEditableDeliveryQuantities(quantities);
    setEditableDeliveryBatches(batches);
    setEditableDeliverySerials(serials);
    setEditableDeliveryNotes(String(detailData.notes ?? ''));
    setEditableDeliveryWarehouse({
      id: Number(detailData.warehouse_id ?? 0),
      name: String(detailData.warehouse_name ?? ''),
    });
  }, []);

  const loadDeliveryEditMaterialMeta = useCallback(async (detailData: OutboundEditDetail) => {
    const items = detailData.items || [];
    if (!items.length) {
      setDeliveryMaterialMeta({});
      return {};
    }
    const meta = await loadConfirmPreviewMaterialMeta(items);
    setDeliveryMaterialMeta(meta);
    return meta;
  }, []);

  const ensureDeliverySerialOptions = useCallback(
    async (lineId: number) => {
      if (lineId <= 0 || deliverySerialOptionsLoadingRef.current[lineId]) return;
      if (deliverySerialOptionsByLineId[lineId]?.length) return;

      const meta = deliveryMaterialMeta[lineId];
      if (!meta?.serialManaged || !meta.materialUuid) return;

      deliverySerialOptionsLoadingRef.current[lineId] = true;
      setDeliverySerialOptionsLoadingByLineId((prev) => ({ ...prev, [lineId]: true }));
      try {
        const opts = await loadInStockSerialOptions(meta.materialUuid);
        const selected = editableDeliverySerials[lineId] ?? [];
        const merged = [...opts];
        for (const sn of selected) {
          if (!merged.some((o) => o.value === sn)) {
            merged.push({ value: sn, label: sn });
          }
        }
        setDeliverySerialOptionsByLineId((prev) => ({ ...prev, [lineId]: merged }));
      } catch {
        const selected = editableDeliverySerials[lineId] ?? [];
        setDeliverySerialOptionsByLineId((prev) => ({
          ...prev,
          [lineId]: selected.map((sn) => ({ value: sn, label: sn })),
        }));
      } finally {
        deliverySerialOptionsLoadingRef.current[lineId] = false;
        setDeliverySerialOptionsLoadingByLineId((prev) => ({ ...prev, [lineId]: false }));
      }
    },
    [deliveryMaterialMeta, deliverySerialOptionsByLineId, editableDeliverySerials],
  );

  useEffect(() => {
    if (!open) {
      resetState();
      setLoading(false);
    }
  }, [open, resetState]);

  useEffect(() => {
    if (!loadKey) return;

    const sep = loadKey.indexOf(':');
    const type = loadKey.slice(0, sep);
    const recordId = loadKey.slice(sep + 1);
    const picking = type === 'production_picking';
    const delivery = type === 'sales_delivery';

    let cancelled = false;
    setLoading(true);
    setDetail(null);

    void (async () => {
      try {
        let detailData: OutboundEditDetail;
        if (picking) {
          detailData = (await warehouseApi.productionPicking.get(recordId)) as OutboundEditDetail;
        } else if (delivery) {
          detailData = (await warehouseApi.salesDelivery.get(recordId)) as OutboundEditDetail;
        } else {
          return;
        }
        const merged = {
          ...detailData,
          outbound_type: type,
        } as OutboundEditDetail;
        if (cancelled) return;
        if (!isOutboundEditable(merged)) {
          messageApi.warning(
            outboundUpdateCapabilityReasonMessage(merged, t) ||
              t('app.kuaizhizao.warehouseOutbound.msg.pickingEditFailed'),
          );
          onCloseRef.current();
          return;
        }
        setDetail(merged);
        const whRes = await masterWarehouseApi.list({ is_active: true, limit: 500 });
        const whOptions = mapWarehouseSelectOptions(whRes);
        if (cancelled) return;
        if (picking) {
          initPickingEditState(merged);
          setPickingWarehouseOptions(whOptions);
          const meta = await loadConfirmPreviewMaterialMeta(merged.items || []);
          if (cancelled) return;
          setDeliveryMaterialMeta(meta);
          const warehouses: Record<number, { id: number; name: string }> = {};
          (merged.items || []).forEach((it) => {
            if (it?.id == null) return;
            warehouses[Number(it.id)] = {
              id: Number(it.warehouse_id ?? 0),
              name: String(it.warehouse_name ?? ''),
            };
          });
          await loadPickingBatchOptions(merged, meta, warehouses);
        } else {
          initDeliveryEditState(merged);
          setDeliveryWarehouseOptions(whOptions);
          const meta = await loadDeliveryEditMaterialMeta(merged);
          if (cancelled) return;
          await loadDeliveryBatchOptions(
            merged,
            meta,
            Number(merged.warehouse_id ?? 0),
          );
        }
      } catch (e: unknown) {
        if (cancelled) return;
        const err = e as { message?: string };
        messageApi.error(err?.message || t('app.kuaizhizao.warehouseOutbound.msg.loadDetailFailed'));
        onCloseRef.current();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    loadKey,
    initPickingEditState,
    initDeliveryEditState,
    loadDeliveryEditMaterialMeta,
    loadDeliveryBatchOptions,
    loadPickingBatchOptions,
    messageApi,
    t,
  ]);

  useEffect(() => {
    if (!open || batchOptionsLoading || !isDelivery || !detail?.items?.length) return;
    setEditableDeliveryBatches((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const it of detail.items || []) {
        if (it.id == null) continue;
        const rid = Number(it.id);
        const mid = Number(it.material_id);
        const meta = deliveryMaterialMeta[rid];
        if (!isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) continue;
        const opts = deliveryBatchOptionsByMaterialId[mid] ?? [];
        if (!opts.length) continue;
        const resolved = resolveOutboundConfirmBatchValue(prev[rid] ?? it.batch_number, opts);
        if (resolved && resolved !== prev[rid]) {
          next[rid] = resolved;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [
    open,
    batchOptionsLoading,
    isDelivery,
    detail,
    deliveryMaterialMeta,
    deliveryBatchOptionsByMaterialId,
    trackingFlags,
  ]);

  useEffect(() => {
    if (!open || batchOptionsLoading || !isPicking || !detail?.items?.length) return;
    setEditablePickingBatches((prev) => {
      let changed = false;
      const next = { ...prev };
      for (const it of detail.items || []) {
        if (it.id == null) continue;
        const rid = Number(it.id);
        const meta = deliveryMaterialMeta[rid];
        if (!isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) continue;
        const opts = pickingBatchOptionsByLineId[rid] ?? [];
        if (!opts.length) continue;
        const resolved = resolveOutboundConfirmBatchValue(prev[rid] ?? it.batch_number, opts);
        if (resolved && resolved !== prev[rid]) {
          next[rid] = resolved;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [
    open,
    batchOptionsLoading,
    isPicking,
    detail,
    deliveryMaterialMeta,
    pickingBatchOptionsByLineId,
    trackingFlags,
  ]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleSavePicking = async () => {
    if (!detail?.id) return;
    const items = detail.items || [];
    if (!items.length) {
      messageApi.warning(t('app.kuaizhizao.warehouseOutbound.msg.noEditableLines'));
      return;
    }
    const mappedItems = items
      .filter((it) => it.id != null)
      .map((it) => {
        const rid = Number(it.id);
        const qty = Number(editablePickingQuantities[rid] ?? it.required_quantity ?? 0);
        if (!(qty > 0)) {
          throw new Error(
            t('app.kuaizhizao.warehouseOutbound.msg.requiredQtyMustBePositive', {
              material: it.material_code || it.material_name || '-',
            }),
          );
        }
        const wh = editablePickingWarehouses[rid];
        const warehouseId = Number(wh?.id ?? it.warehouse_id ?? 0);
        if (!(warehouseId > 0)) {
          throw new Error(
            t('app.kuaizhizao.warehouseOutbound.msg.selectLineWarehouse', {
              material: it.material_code || it.material_name || '-',
            }),
          );
        }
        const batchRaw = editablePickingBatches[rid] ?? it.batch_number ?? '';
        return {
          id: rid,
          required_quantity: qty,
          warehouse_id: warehouseId,
          warehouse_name: String(wh?.name ?? it.warehouse_name ?? ''),
          batch_number: batchRaw,
        };
      });

    for (const it of mappedItems) {
      const row = items.find((line) => Number(line.id) === it.id);
      const meta = deliveryMaterialMeta[it.id];
      if (!isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) continue;
      const opts = pickingBatchOptionsByLineId[it.id] ?? [];
      if (!isValidOutboundBatchSelection(it.batch_number, opts)) {
        const code = String(row?.material_code ?? row?.material_name ?? '-');
        if (!opts.length) {
          messageApi.error(
            t('app.kuaizhizao.warehouseOutbound.confirm.batchNotInStock', {
              material: code,
              warehouse:
                String(
                  editablePickingWarehouses[it.id]?.name ?? row?.warehouse_name ?? '',
                ).trim() || t('app.kuaizhizao.warehouseOutbound.field.selectWarehouse'),
            }),
          );
        } else {
          messageApi.error(
            t('app.kuaizhizao.warehouseOutbound.confirm.batchRequired', {
              material: code,
              batches: opts.map((o) => o.value).join('、'),
            }),
          );
        }
        return;
      }
    }

    setSaving(true);
    try {
      await warehouseApi.productionPicking.update(String(detail.id), {
        notes: editablePickingNotes,
        items: mappedItems,
      });
      messageApi.success(t('app.kuaizhizao.warehouseOutbound.msg.pickingEditSaved'));
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { detail?: string } } };
      messageApi.error(
        err?.message || err?.response?.data?.detail || t('app.kuaizhizao.warehouseOutbound.msg.pickingEditFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    if (!detail?.id) return;
    const items = detail.items || [];
    if (!items.length) {
      messageApi.warning(t('app.kuaizhizao.warehouseOutbound.msg.noEditableLines'));
      return;
    }
    const warehouseId = Number(editableDeliveryWarehouse.id ?? detail.warehouse_id ?? 0);
    if (!(warehouseId > 0)) {
      messageApi.warning(t('app.kuaizhizao.warehouseOutbound.msg.selectWarehouse'));
      return;
    }
    const mappedItems = items
      .filter((it) => it.id != null)
      .map((it) => {
        const rid = Number(it.id);
        const qty = Number(editableDeliveryQuantities[rid] ?? it.delivery_quantity ?? 0);
        if (!(qty > 0)) {
          throw new Error(
            t('app.kuaizhizao.warehouseOutbound.msg.requiredQtyMustBePositive', {
              material: it.material_code || it.material_name || '-',
            }),
          );
        }
        return {
          id: rid,
          delivery_quantity: qty,
          batch_number: editableDeliveryBatches[rid] ?? it.batch_number ?? '',
          serial_numbers: editableDeliverySerials[rid] ?? parseOutboundLineSerialNumbers(it.serial_numbers),
        };
      });

    for (const it of mappedItems) {
      const row = items.find((line) => Number(line.id) === it.id);
      const meta = deliveryMaterialMeta[it.id];
      if (isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) {
        const mid = Number(row?.material_id ?? 0);
        const opts = deliveryBatchOptionsByMaterialId[mid] ?? [];
        const batchRaw = it.batch_number;
        if (!isValidOutboundBatchSelection(batchRaw, opts)) {
          const code = String(row?.material_code ?? row?.material_name ?? '-');
          if (!opts.length) {
            messageApi.error(
              t('app.kuaizhizao.warehouseOutbound.confirm.batchNotInStock', {
                material: code,
                warehouse:
                  String(editableDeliveryWarehouse.name || detail.warehouse_name || '').trim() ||
                  t('app.kuaizhizao.warehouseOutbound.field.selectWarehouse'),
              }),
            );
          } else {
            messageApi.error(
              t('app.kuaizhizao.warehouseOutbound.confirm.batchRequired', {
                material: code,
                batches: opts.map((o) => o.value).join('、'),
              }),
            );
          }
          return;
        }
      }
      if (!meta?.serialManaged) continue;
      const qty = Number(it.delivery_quantity ?? 0);
      const serials = (it.serial_numbers ?? []).filter(Boolean);
      if (qty > 0 && serials.length !== Math.round(qty)) {
        messageApi.warning(
          t('app.kuaizhizao.warehouseOutbound.entry.serialCountMismatch', {
            material:
              items.find((row) => Number(row.id) === it.id)?.material_code ||
              items.find((row) => Number(row.id) === it.id)?.material_name ||
              '-',
            required: Math.round(qty),
            actual: serials.length,
          }),
        );
        return;
      }
    }

    setSaving(true);
    try {
      await warehouseApi.salesDelivery.update(String(detail.id), {
        notes: editableDeliveryNotes,
        warehouse_id: warehouseId,
        warehouse_name: String(editableDeliveryWarehouse.name || detail.warehouse_name || ''),
        items: mappedItems,
      });
      messageApi.success(t('app.kuaizhizao.warehouseOutbound.msg.pickingEditSaved'));
      handleClose();
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { message?: string; response?: { data?: { detail?: string } } };
      messageApi.error(
        err?.message || err?.response?.data?.detail || t('app.kuaizhizao.warehouseOutbound.msg.pickingEditFailed'),
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (isPicking) {
      await handleSavePicking();
      return;
    }
    if (isDelivery) {
      await handleSaveDelivery();
    }
  };

  const modalTitle = useMemo(() => {
    const code = detail
      ? outboundDocumentCode(detail)
      : record
        ? outboundDocumentCode(record as OutboundHubOrder)
        : '';
    const typeLabel = isPicking
      ? t('app.kuaizhizao.warehouseOutbound.entry.productionPicking')
      : isDelivery
        ? t('app.kuaizhizao.warehouseOutbound.entry.salesDelivery')
        : t('common.edit');
    return `${t('common.edit')}${typeLabel ? ` ${typeLabel}` : ''}${code ? ` - ${code}` : ''}`;
  }, [detail, isDelivery, isPicking, record, t]);

  const pickingColumns = useMemo(
    () =>
      filterWarehouseTrackingColumns(
        [
      { title: t('app.kuaizhizao.warehouseOutbound.col.materialCode'), dataIndex: 'material_code', width: 120 },
      { title: t('app.kuaizhizao.warehouseOutbound.col.materialName'), dataIndex: 'material_name', width: 150 },
      {
        title: t('app.kuaizhizao.warehouseOutbound.col.requiredQty'),
        dataIndex: 'required_quantity',
        width: 120,
        align: 'right' as const,
        render: (_: unknown, row: OutboundLineItem) => {
          if (row.id == null) return formatQuantity(row.required_quantity);
          const rid = Number(row.id);
          return (
            <InputNumber
              min={0.01}
              precision={quantityDecimals}
              value={editablePickingQuantities[rid] ?? Number(row.required_quantity ?? 0)}
              onChange={(v) =>
                setEditablePickingQuantities((prev) => ({ ...prev, [rid]: Number(v) || 0 }))
              }
              style={{ width: 100 }}
              size="small"
            />
          );
        },
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.col.pickedQty'),
        dataIndex: 'picked_quantity',
        width: 100,
        align: 'right' as const,
        render: (v: unknown) => formatQuantity(v),
      },
      { title: t('common.unit'), dataIndex: 'material_unit', width: 60 },
      {
        title: t('app.kuaizhizao.warehouseOutbound.col.warehouseName'),
        dataIndex: 'warehouse_name',
        width: 160,
        render: (_: unknown, row: OutboundLineItem) => {
          if (row.id == null) return row.warehouse_name || '-';
          const rid = Number(row.id);
          const current = editablePickingWarehouses[rid];
          return (
            <Select
              size="small"
              style={{ width: 140 }}
              options={pickingWarehouseOptions}
              value={current?.id > 0 ? current.id : undefined}
              placeholder={t('app.kuaizhizao.warehouseOutbound.msg.selectWarehouse')}
              onChange={(value, option) => {
                const opt = option as { label?: string; name?: string } | undefined;
                const name =
                  (typeof opt?.label === 'string' ? opt.label : undefined) ||
                  opt?.name ||
                  pickingWarehouseOptions.find((o) => o.value === value)?.name ||
                  '';
                setEditablePickingWarehouses((prev) => {
                  const next = {
                    ...prev,
                    [rid]: { id: Number(value), name },
                  };
                  if (detail) {
                    void loadPickingBatchOptions(detail, deliveryMaterialMeta, next);
                  }
                  return next;
                });
              }}
              showSearch
              optionFilterProp="label"
            />
          );
        },
      },
      {
        title: t('app.kuaizhizao.warehouseOutbound.col.batchNo'),
        dataIndex: 'batch_number',
        width: 160,
        render: (_: unknown, row: OutboundLineItem) => {
          if (row.id == null) return row.batch_number || '-';
          const rid = Number(row.id);
          const meta = deliveryMaterialMeta[rid];
          if (!isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) return '—';
          const opts = pickingBatchOptionsByLineId[rid] ?? [];
          const current = editablePickingBatches[rid] ?? '';
          return (
            <Select
              size="small"
              style={{ width: 150 }}
              allowClear
              showSearch
              optionFilterProp="label"
              options={mergeBatchSelectOptions(opts, current)}
              value={current || undefined}
              placeholder={t('app.kuaizhizao.warehouseOutbound.field.selectBatch')}
              loading={batchOptionsLoading}
              notFoundContent={
                batchOptionsLoading
                  ? t('app.kuaizhizao.warehouseOutbound.confirm.loadingBatches')
                  : t('app.kuaizhizao.warehouseOutbound.confirm.noBatchAvailable')
              }
              onChange={(v) =>
                setEditablePickingBatches((prev) => ({ ...prev, [rid]: String(v ?? '') }))
              }
            />
          );
        },
      },
        ],
        trackingFlags,
      ),
    [
      t,
      trackingFlags,
      quantityDecimals,
      editablePickingQuantities,
      editablePickingWarehouses,
      editablePickingBatches,
      pickingWarehouseOptions,
      deliveryMaterialMeta,
      pickingBatchOptionsByLineId,
      batchOptionsLoading,
      mergeBatchSelectOptions,
      detail,
      loadPickingBatchOptions,
    ],
  );

  const deliveryColumns = useMemo(
    () =>
      filterWarehouseTrackingColumns(
      appendWarehouseLineAmountColumns(
        [
          { title: t('app.kuaizhizao.warehouseOutbound.col.materialCode'), dataIndex: 'material_code', width: 120 },
          { title: t('app.kuaizhizao.warehouseOutbound.col.materialName'), dataIndex: 'material_name', width: 150 },
          {
            title: t('app.kuaizhizao.warehouseOutbound.col.deliveryQty'),
            dataIndex: 'delivery_quantity',
            width: 120,
            align: 'right' as const,
            render: (_: unknown, row: OutboundLineItem) => {
              if (row.id == null) return formatQuantity(row.delivery_quantity);
              const rid = Number(row.id);
              return (
                <InputNumber
                  min={0.01}
                  precision={quantityDecimals}
                  value={editableDeliveryQuantities[rid] ?? Number(row.delivery_quantity ?? 0)}
                  onChange={(v) =>
                    setEditableDeliveryQuantities((prev) => ({ ...prev, [rid]: Number(v) || 0 }))
                  }
                  style={{ width: 100 }}
                  size="small"
                />
              );
            },
          },
          { title: t('common.unit'), dataIndex: 'material_unit', width: 60 },
          {
            title: t('app.kuaizhizao.warehouseOutbound.col.batchNo'),
            dataIndex: 'batch_number',
            width: 160,
            render: (_: unknown, row: OutboundLineItem) => {
              if (row.id == null) return row.batch_number || '-';
              const rid = Number(row.id);
              const meta = deliveryMaterialMeta[rid];
              if (!isMaterialBatchEntryEnabled(trackingFlags, meta?.batchManaged)) return '—';
              const mid = Number(row.material_id ?? 0);
              const opts = deliveryBatchOptionsByMaterialId[mid] ?? [];
              const current = editableDeliveryBatches[rid] ?? '';
              return (
                <Select
                  size="small"
                  style={{ width: 150 }}
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  options={mergeBatchSelectOptions(opts, current)}
                  value={current || undefined}
                  placeholder={t('app.kuaizhizao.warehouseOutbound.field.selectBatch')}
                  loading={batchOptionsLoading}
                  notFoundContent={
                    batchOptionsLoading
                      ? t('app.kuaizhizao.warehouseOutbound.confirm.loadingBatches')
                      : t('app.kuaizhizao.warehouseOutbound.confirm.noBatchAvailable')
                  }
                  onChange={(v) =>
                    setEditableDeliveryBatches((prev) => ({ ...prev, [rid]: String(v ?? '') }))
                  }
                />
              );
            },
          },
          {
            title: t('app.kuaizhizao.warehouseOutbound.col.serialNo'),
            dataIndex: 'serial_numbers',
            width: 160,
            render: (_: unknown, row: OutboundLineItem) => {
              if (row.id == null) return '-';
              const rid = Number(row.id);
              const meta = deliveryMaterialMeta[rid];
              const serials =
                editableDeliverySerials[rid] ?? parseOutboundLineSerialNumbers(row.serial_numbers);
              if (meta && !isMaterialSerialEntryEnabled(trackingFlags, meta.serialManaged)) {
                return '—';
              }
              const qty = Math.max(
                1,
                Math.round(Number(editableDeliveryQuantities[rid] ?? row.delivery_quantity ?? 0)),
              );
              if (!isMaterialSerialEntryEnabled(trackingFlags, meta?.serialManaged) && !serials.length) {
                return '—';
              }
              return (
                <OutboundSerialPickerField
                  value={serials}
                  onChange={(next) =>
                    setEditableDeliverySerials((prev) => ({ ...prev, [rid]: next }))
                  }
                  options={deliverySerialOptionsByLineId[rid] ?? []}
                  maxCount={qty}
                  loading={!!deliverySerialOptionsLoadingByLineId[rid]}
                  onOpenPicker={() => ensureDeliverySerialOptions(rid)}
                  materialLabel={String(row.material_code || row.material_name || '')}
                />
              );
            },
          },
        ],
        t,
        true,
      ),
      trackingFlags,
      ),
    [
      t,
      trackingFlags,
      quantityDecimals,
      editableDeliveryQuantities,
      editableDeliveryBatches,
      editableDeliverySerials,
      deliveryMaterialMeta,
      deliveryBatchOptionsByMaterialId,
      batchOptionsLoading,
      mergeBatchSelectOptions,
      deliverySerialOptionsByLineId,
      deliverySerialOptionsLoadingByLineId,
      ensureDeliverySerialOptions,
    ],
  );

  if (!isPicking && !isDelivery) {
    return null;
  }

  return (
    <FormModalTemplate
      title={modalTitle}
      open={open}
      onClose={handleClose}
      onFinish={handleSubmit}
      isEdit
      loading={saving}
      width={MODAL_CONFIG.LARGE_WIDTH}
      grid={false}
    >
      {isDelivery ? (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
              {t('app.kuaizhizao.warehouseOutbound.field.warehouse')}
            </Typography.Text>
            <Select
              style={{ width: '100%' }}
              options={deliveryWarehouseOptions}
              value={editableDeliveryWarehouse.id > 0 ? editableDeliveryWarehouse.id : undefined}
              placeholder={t('app.kuaizhizao.warehouseOutbound.msg.selectWarehouse')}
              onChange={(value, option) => {
                const opt = option as { label?: string; name?: string } | undefined;
                const name =
                  (typeof opt?.label === 'string' ? opt.label : undefined) ||
                  opt?.name ||
                  deliveryWarehouseOptions.find((o) => o.value === value)?.name ||
                  '';
                const nextWh = { id: Number(value), name };
                setEditableDeliveryWarehouse(nextWh);
                if (detail) {
                  void loadDeliveryBatchOptions(detail, deliveryMaterialMeta, nextWh.id);
                }
              }}
              showSearch
              optionFilterProp="label"
            />
          </Col>
        </Row>
      ) : null}
      <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
        {t('app.kuaizhizao.warehouseOutbound.section.outboundDetails')}
      </Typography.Text>
      <style>{WAREHOUSE_FORM_DETAIL_TABLE_FRAME_STYLES}</style>
      <div className="warehouse-form-detail-table-frame">
        <Table
          className="warehouse-detail-table"
          size="small"
          pagination={false}
          loading={loading}
          rowKey={(row) => String(row.id ?? row.material_code)}
          dataSource={detail?.items || []}
          columns={isPicking ? pickingColumns : deliveryColumns}
          scroll={{ x: 'max-content' }}
          style={{ width: '100%', margin: 0 }}
        />
      </div>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
            {t('common.remark')}
          </Typography.Text>
          <Input.TextArea
            rows={2}
            value={isPicking ? editablePickingNotes : editableDeliveryNotes}
            onChange={(e) => {
              if (isPicking) setEditablePickingNotes(e.target.value);
              else setEditableDeliveryNotes(e.target.value);
            }}
            placeholder={t('common.remark')}
          />
        </Col>
      </Row>
    </FormModalTemplate>
  );
};

export default OutboundHubEditModal;
