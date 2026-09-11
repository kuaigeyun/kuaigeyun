import type { CurrentUser } from '../../../../../types/api';
import { warehouseApi } from '../../../services/warehouse-execution';
import { customerMaterialRegistrationApi } from '../../../services/customer-material-registration';
import {
  outsourceMaterialReceiptApi,
  outsourceMaterialReturnApi,
  outsourceProductReturnApi,
} from '../../../services/production';
import {
  filterInboundHubRows,
  normalizeWarehouseListResponse,
  sortInboundHubRows,
} from '../../../utils/warehouseListCore';
import { shouldFetchInboundHubType } from '../../../utils/warehouseHubFetchGates';
import type { InboundHubOrder } from './inboundHubTypes';
import { resolveInboundHubDateRaw, resolveInboundHubOperator } from './inboundHubTypes';

function withInboundHubDisplayFields(row: InboundHubOrder): InboundHubOrder {
  const dateRaw = resolveInboundHubDateRaw(row);
  const operator = resolveInboundHubOperator(row);
  return {
    ...row,
    ...(dateRaw != null && String(dateRaw).trim() !== ''
      ? { receipt_date: String(dateRaw) }
      : {}),
    ...(operator ? { received_by: operator } : {}),
  };
}

const emptyList = { items: [] as unknown[], total: 0 };

/** 与入库 Hub 各源列表 API 的 limit 上限对齐（成品/采购等为 1000） */
const INBOUND_HUB_SOURCE_FETCH_MAX = 1000;

const toList = (r: unknown) => {
  const { data, total } = normalizeWarehouseListResponse(r);
  return { items: data, total };
};

export type InboundListEnrichers = {
  enrichPurchaseReceiptRecordsWithCustomFields: (rows: InboundHubOrder[]) => Promise<InboundHubOrder[]>;
  enrichFinishedGoodsReceiptRecordsWithCustomFields: (rows: InboundHubOrder[]) => Promise<InboundHubOrder[]>;
  enrichProductionReturnRecordsWithCustomFields: (rows: InboundHubOrder[]) => Promise<InboundHubOrder[]>;
};

export async function fetchInboundHubList(
  params: Record<string, unknown>,
  enrichers: InboundListEnrichers,
  user: CurrentUser | undefined,
): Promise<{ data: InboundHubOrder[]; total: number; success: boolean }> {
  const skip = (((params.current as number) || 1) - 1) * ((params.pageSize as number) || 20);
  const limit = (params.pageSize as number) || 20;
  const typeFilter = params.receipt_type as string | undefined;
  const hubStatus = params.status as string | undefined;
  const typed = Boolean(typeFilter);
  const fetchSkip = typed ? skip : 0;
  // 「全部」视图需从各源拉取 skip+limit 再前端切片；不得超过各源 API limit 上限，否则 422
  const fetchLimit = Math.min(typed ? limit : skip + limit, INBOUND_HUB_SOURCE_FETCH_MAX);

  const fetchPurchase = shouldFetchInboundHubType(user, typeFilter, 'purchase');
  const fetchFinished = shouldFetchInboundHubType(user, typeFilter, 'finished_goods');
  const fetchSemi = shouldFetchInboundHubType(user, typeFilter, 'semi_finished_goods');
  const fetchReturn = shouldFetchInboundHubType(user, typeFilter, 'production_return');
  const fetchCustomerMaterial = shouldFetchInboundHubType(user, typeFilter, 'customer_material');
  const fetchSalesReturn = shouldFetchInboundHubType(user, typeFilter, 'sales_return');
  const fetchOutsourceReceipt = shouldFetchInboundHubType(user, typeFilter, 'outsource_receipt');
  const fetchOutsourceMaterialReturn = shouldFetchInboundHubType(user, typeFilter, 'outsource_material_return');
  const fetchOutsourceProductReturn = shouldFetchInboundHubType(user, typeFilter, 'outsource_product_return');
  const fetchOtherInbound = shouldFetchInboundHubType(user, typeFilter, 'other_inbound');
  const fetchMaterialReturn = shouldFetchInboundHubType(user, typeFilter, 'material_return');

  const warehouseIdRaw =
    params.warehouse_id != null && params.warehouse_id !== ''
      ? Number(params.warehouse_id)
      : undefined;
  const warehouseId =
    warehouseIdRaw != null && Number.isFinite(warehouseIdRaw) ? warehouseIdRaw : undefined;
  const keyword =
    typeof params.keyword === 'string' && params.keyword.trim()
      ? params.keyword.trim()
      : undefined;
  const orderBy =
    typeof params.order_by === 'string' && params.order_by.trim()
      ? params.order_by.trim()
      : undefined;

  const baseParams = {
    skip: fetchSkip,
    limit: fetchLimit,
    keyword,
    order_by: orderBy,
    warehouse_id: warehouseId,
    supplier_name:
      typeof params.supplier_name === 'string' && params.supplier_name.trim()
        ? params.supplier_name.trim()
        : undefined,
    created_start_date: params.created_start_date,
    created_end_date: params.created_end_date,
    updated_start_date: params.updated_start_date,
    updated_end_date: params.updated_end_date,
  };

  const sourceStatus = (
    pendingStatus: string,
    postedStatus: string,
  ): string | undefined => {
    if (hubStatus === 'pending') return pendingStatus;
    if (hubStatus === 'posted') return postedStatus;
    if (!hubStatus || hubStatus === 'all') return undefined;
    return hubStatus;
  };

  const settled = await Promise.allSettled([
    fetchPurchase
      ? warehouseApi.purchaseReceipt.list({ ...baseParams, status: sourceStatus('待入库', '已入库') })
      : Promise.resolve(emptyList),
    fetchFinished
      ? warehouseApi.finishedGoodsReceipt.list({ ...baseParams, status: sourceStatus('待入库', '已入库') })
      : Promise.resolve(emptyList),
    fetchSemi
      ? warehouseApi.semiFinishedGoodsReceipt.list({ ...baseParams, status: sourceStatus('待入库', '已入库') })
      : Promise.resolve(emptyList),
    fetchReturn
      ? warehouseApi.productionReturn.list({ ...baseParams, status: sourceStatus('待退料', '已退料') })
      : Promise.resolve(emptyList),
    fetchCustomerMaterial
      ? customerMaterialRegistrationApi.list({ ...baseParams, status: sourceStatus('pending', 'processed') })
      : Promise.resolve(emptyList),
    fetchSalesReturn
      ? warehouseApi.salesReturn.list({
          ...baseParams,
          status: sourceStatus('待退货', '已退货'),
          include_items: true,
        })
      : Promise.resolve(emptyList),
    fetchOutsourceReceipt
      ? outsourceMaterialReceiptApi.list({ ...baseParams, status: sourceStatus('draft', 'completed') })
      : Promise.resolve(emptyList),
    fetchOutsourceMaterialReturn
      ? outsourceMaterialReturnApi.list({ ...baseParams, status: sourceStatus('draft', 'completed') })
      : Promise.resolve(emptyList),
    fetchOutsourceProductReturn
      ? outsourceProductReturnApi.list({ ...baseParams, status: sourceStatus('draft', 'completed') })
      : Promise.resolve(emptyList),
    fetchOtherInbound
      ? warehouseApi.otherInbound.list({ ...baseParams, status: sourceStatus('待入库', '已入库') })
      : Promise.resolve(emptyList),
    fetchMaterialReturn
      ? warehouseApi.materialReturn.list({ ...baseParams, status: sourceStatus('待退料', '已退料') })
      : Promise.resolve(emptyList),
  ]);

  const anySourceFailed = settled.some((s) => s.status === 'rejected');
  if (anySourceFailed) {
    const sourceNames = [
      'purchase',
      'finished_goods',
      'semi_finished_goods',
      'production_return',
      'customer_material',
      'sales_return',
      'outsource_receipt',
      'outsource_material_return',
      'outsource_product_return',
      'other_inbound',
      'material_return',
    ] as const;
    const failed = settled
      .map((s, i) => (s.status === 'rejected' ? { source: sourceNames[i], reason: s.reason } : null))
      .filter(Boolean);
    console.warn('[inboundHub] partial list source failed', failed);
  }
  const settledOrEmpty = (s: PromiseSettledResult<unknown>) =>
    s.status === 'fulfilled' ? s.value : emptyList;

  const [
    purchaseRes,
    finishedRes,
    semiRes,
    returnRes,
    customerMaterialRes,
    salesReturnRes,
    outsourceReceiptRes,
    outsourceMaterialReturnRes,
    outsourceProductReturnRes,
    otherInboundRes,
    materialReturnRes,
  ] = settled.map(settledOrEmpty);

  const purchaseListed = toList(purchaseRes);
  const purchaseData = await enrichers.enrichPurchaseReceiptRecordsWithCustomFields(
    purchaseListed.items.map(
      (item) =>
        ({
          ...(item as Record<string, unknown>),
          receipt_type: 'purchase' as const,
        }) as InboundHubOrder,
    ),
  );
  const finishedListed = toList(finishedRes);
  const finishedData = await enrichers.enrichFinishedGoodsReceiptRecordsWithCustomFields(
    finishedListed.items.map(
      (item) =>
        ({
          ...(item as Record<string, unknown>),
          receipt_type: 'finished_goods' as const,
        }) as InboundHubOrder,
    ),
  );
  const semiData = toList(semiRes).items.map(
    (item) =>
      ({
        ...(item as Record<string, unknown>),
        receipt_type: 'semi_finished_goods' as const,
      }) as InboundHubOrder,
  );
  const returnListed = toList(returnRes);
  const returnData = await enrichers.enrichProductionReturnRecordsWithCustomFields(
    returnListed.items.map(
      (item) =>
        ({
          ...(item as Record<string, unknown>),
          receipt_type: 'production_return' as const,
          receipt_code: (item as Record<string, unknown>).return_code,
        }) as InboundHubOrder,
    ),
  );
  const customerMaterialData = toList(customerMaterialRes).items.map(
    (item) =>
      ({
        ...(item as Record<string, unknown>),
        receipt_type: 'customer_material' as const,
        receipt_code: (item as Record<string, unknown>).registration_code,
        total_quantity: (item as Record<string, unknown>).total_quantity ?? (item as Record<string, unknown>).quantity,
        quantity_unit:
          (item as Record<string, unknown>).quantity_unit ??
          (item as Record<string, unknown>).material_unit ??
          (item as Record<string, unknown>).unit ??
          null,
        status:
          (item as Record<string, unknown>).status === 'pending'
            ? '待入库'
            : (item as Record<string, unknown>).status === 'processed'
              ? '已入库'
              : (item as Record<string, unknown>).status,
        receipt_date: (item as Record<string, unknown>).registration_date,
        received_by: (item as Record<string, unknown>).processed_by_name || (item as Record<string, unknown>).registered_by_name,
        items: (() => {
          const name = String(
            (item as Record<string, unknown>).mapped_material_name
              ?? (item as Record<string, unknown>).material_name
              ?? '',
          ).trim();
          return name ? [{ material_name: name }] : [];
        })(),
      }) as InboundHubOrder,
  );
  const salesReturnData = toList(salesReturnRes).items.map(
    (item) =>
      ({
        ...(item as Record<string, unknown>),
        receipt_type: 'sales_return' as const,
        receipt_code: (item as Record<string, unknown>).return_code,
        total_quantity:
          (item as Record<string, unknown>).total_quantity ?? (item as Record<string, unknown>).total_return_quantity,
      }) as InboundHubOrder,
  );
  const outsourceReceiptData = toList(outsourceReceiptRes).items.map((item) => {
    const row = item as Record<string, unknown>;
    const receivedAt = row.received_at ?? row.receivedAt;
    const operatorName =
      row.received_by_name ||
      row.receivedByName ||
      row.created_by_name ||
      row.createdByName;
    return {
      ...row,
      receipt_type: 'outsource_receipt' as const,
      receipt_code: row.code,
      outsource_work_order_code: row.outsource_work_order_code ?? row.outsourceWorkOrderCode,
      total_quantity: row.quantity,
      quantity_unit: row.quantity_unit ?? row.unit ?? null,
      // 委外收货：业务字段 received_at / received_by_name（received_by 为用户 ID）
      received_at: receivedAt,
      received_by_name: operatorName,
      receipt_date: receivedAt ?? row.receipt_date,
      received_by: operatorName,
      status:
        row.status === 'draft'
          ? '草稿'
          : row.status === 'completed'
            ? '已入库'
            : row.status,
    } as InboundHubOrder;
  });
  const outsourceMaterialReturnData = toList(outsourceMaterialReturnRes).items.map((item) => {
    const row = item as Record<string, unknown>;
    const returnedAt = row.returned_at ?? row.returnedAt;
    const operatorName =
      row.returned_by_name ||
      row.returnedByName ||
      row.created_by_name ||
      row.createdByName;
    return {
      ...row,
      receipt_type: 'outsource_material_return' as const,
      receipt_code: row.code,
      outsource_work_order_code: row.outsource_work_order_code ?? row.outsourceWorkOrderCode,
      total_quantity: row.quantity,
      quantity_unit: row.quantity_unit ?? row.unit ?? null,
      returned_at: returnedAt,
      returned_by_name: operatorName,
      receipt_date: returnedAt ?? row.receipt_date,
      received_by: operatorName,
      status:
        row.status === 'draft'
          ? '草稿'
          : row.status === 'completed'
            ? '已入库'
            : row.status,
    } as InboundHubOrder;
  });
  const outsourceProductReturnData = toList(outsourceProductReturnRes).items.map((item) => {
    const row = item as Record<string, unknown>;
    const returnedAt = row.returned_at ?? row.returnedAt;
    const operatorName =
      row.returned_by_name ||
      row.returnedByName ||
      row.created_by_name ||
      row.createdByName;
    return {
      ...row,
      receipt_type: 'outsource_product_return' as const,
      receipt_code: row.code,
      outsource_work_order_code: row.outsource_work_order_code ?? row.outsourceWorkOrderCode,
      total_quantity: row.quantity,
      quantity_unit: row.quantity_unit ?? row.unit ?? null,
      returned_at: returnedAt,
      returned_by_name: operatorName,
      receipt_date: returnedAt ?? row.receipt_date,
      received_by: operatorName,
      status:
        row.status === 'draft'
          ? '草稿'
          : row.status === 'completed'
            ? '已入库'
            : row.status,
    } as InboundHubOrder;
  });
  const otherInboundData = toList(otherInboundRes).items.map(
    (item) =>
      ({
        ...(item as Record<string, unknown>),
        receipt_type: 'other_inbound' as const,
        receipt_code: (item as Record<string, unknown>).inbound_code,
        total_quantity: (item as Record<string, unknown>).total_quantity,
      }) as InboundHubOrder,
  );
  const materialReturnData = toList(materialReturnRes).items.map(
    (item) =>
      ({
        ...(item as Record<string, unknown>),
        receipt_type: 'material_return' as const,
        receipt_code: (item as Record<string, unknown>).return_code,
        total_quantity:
          (item as Record<string, unknown>).total_quantity ?? (item as Record<string, unknown>).total_return_quantity,
      }) as InboundHubOrder,
  );

  const combinedData: InboundHubOrder[] = [
    ...purchaseData,
    ...finishedData,
    ...semiData,
    ...returnData,
    ...customerMaterialData,
    ...salesReturnData,
    ...outsourceReceiptData,
    ...outsourceMaterialReturnData,
    ...outsourceProductReturnData,
    ...otherInboundData,
    ...materialReturnData,
  ].map(withInboundHubDisplayFields);

  const filteredCombined = filterInboundHubRows(
    combinedData as Record<string, unknown>[],
    params,
  ) as InboundHubOrder[];

  const sorted = sortInboundHubRows(
    filteredCombined as Record<string, unknown>[],
    typeof params.order_by === 'string' ? params.order_by : undefined,
  ) as InboundHubOrder[];

  const sourceTotal =
    (fetchPurchase ? toList(purchaseRes).total : 0) +
    (fetchFinished ? toList(finishedRes).total : 0) +
    (fetchSemi ? toList(semiRes).total : 0) +
    (fetchReturn ? toList(returnRes).total : 0) +
    (fetchCustomerMaterial ? toList(customerMaterialRes).total : 0) +
    (fetchSalesReturn ? toList(salesReturnRes).total : 0) +
    (fetchOutsourceReceipt ? toList(outsourceReceiptRes).total : 0) +
    (fetchOutsourceMaterialReturn ? toList(outsourceMaterialReturnRes).total : 0) +
    (fetchOutsourceProductReturn ? toList(outsourceProductReturnRes).total : 0) +
    (fetchOtherInbound ? toList(otherInboundRes).total : 0) +
    (fetchMaterialReturn ? toList(materialReturnRes).total : 0);

  // 各源已返回真实 total（成品/采购等）；客户端再筛仅影响本窗口展示
  const total = sourceTotal;

  if (typed) {
    return { data: sorted, success: !anySourceFailed, total };
  }

  const page = sorted.slice(skip, skip + limit);
  return { data: page, success: !anySourceFailed, total };
}
