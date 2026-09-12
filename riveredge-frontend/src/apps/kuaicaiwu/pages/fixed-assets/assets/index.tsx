import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { App, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { ListPageTemplate } from '../../../../../components/layout-templates';
import FaAssetFormModal from './FaAssetFormModal';
import { UniTable } from '../../../../../components/uni-table';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { parseSpreadsheetDateToApiString } from '../../../../../utils/formDate';
import { fetchAllListItems } from '../../../../../utils/fetchAllListPages';
import { resolveFactoryImportHeaderIndexMap } from '../../../../../utils/spreadsheetImportTemplate';
import { fixedAssetService, type FaAsset, type FaCategory } from '../../../services/fixed-assets';
import {
  buildFaAssetImportTemplate,
  parseFaAssetStatusLabel,
  parseFaDepreciationMethodLabel,
  parseFaResidualRate,
} from './faAssetImportTemplate';

const RESOURCE = 'kuaicaiwu:fixed-asset';
const NS = 'app.kuaicaiwu.fixedAssets.assets';

const STATUS_ENUM: Record<string, string> = {
  active: '在用',
  idle: '闲置',
  disposed: '已清理',
  scrapped: '已报废',
};

const FaAssetsPage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const tableRowsRef = useRef<FaAsset[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FaAsset | null>(null);
  const [categories, setCategories] = useState<FaCategory[]>([]);

  const loadCategories = async () => {
    const items = await fixedAssetService.listCategories({ is_active: true });
    setCategories(items);
    return items;
  };

  useEffect(() => {
    void loadCategories();
  }, []);

  const importTemplate = useMemo(
    () => buildFaAssetImportTemplate(t, categories.map((c) => c.category_name)),
    [t, categories],
  );

  const openCreate = async () => {
    await loadCategories();
    setEditing(null);
    setModalOpen(true);
  };

  const handleBatchDelete = async (keys: React.Key[]) => {
    for (const key of keys) {
      await fixedAssetService.deleteAsset(Number(key));
    }
    message.success(t(`${NS}.batchDeleted`, { count: keys.length }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const columns: ProColumns<FaAsset>[] = useMemo(
    () => [
      { title: t(`${NS}.col.code`), dataIndex: 'asset_code', width: 130, uniTableKeepWidth: true },
      { title: t(`${NS}.col.name`), dataIndex: 'asset_name', ellipsis: true },
      { title: t(`${NS}.col.category`), dataIndex: 'category_name', width: 120, ellipsis: true },
      {
        title: t(`${NS}.col.status`),
        dataIndex: 'status',
        width: 88,
        uniTableKeepWidth: true,
        render: (_, r) => <MarkerTag variant="filled">{STATUS_ENUM[r.status] || r.status}</MarkerTag>,
      },
      { title: t(`${NS}.col.originalValue`), dataIndex: 'original_value', valueType: 'money', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.accumDepr`), dataIndex: 'accumulated_depreciation', valueType: 'money', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.netValue`), dataIndex: 'net_value', valueType: 'money', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.department`), dataIndex: 'department_name', width: 120, ellipsis: true },
      {
        title: t('common.actions'),
        valueType: 'option',
        width: 120,
        render: (_, record) => [
          <a key="edit" onClick={async () => { await loadCategories(); setEditing(record); setModalOpen(true); }}>
            {t('common.edit')}
          </a>,
          <Popconfirm
            key="del"
            title={t('common.confirmDelete')}
            onConfirm={async () => {
              await fixedAssetService.deleteAsset(record.id);
              message.success(t('common.deleteSuccess'));
              actionRef.current?.reload();
            }}
          >
            <a>{t('common.delete')}</a>
          </Popconfirm>,
        ],
      },
    ],
    [t, message],
  );

  return (
    <ListPageTemplate>
      <UniTable<FaAsset>
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.assets.list-v1"
        columns={columns}
        permissionResource={RESOURCE}
        enableRowSelection
        selectedRowKeys={selectedRowKeys}
        onRowSelectionChange={setSelectedRowKeys}
        onTableDataChange={(rows) => {
          tableRowsRef.current = rows;
        }}
        showCreateButton
        createButtonText={t(`${NS}.createButton`)}
        onCreate={openCreate}
        showDeleteButton
        onDelete={handleBatchDelete}
        deleteConfirmTitle={t('app.kuaicaiwu.common.confirmBatchDelete')}
        deleteConfirmDescription={(count) => t(`${NS}.batchDeleteConfirm`, { count })}
        showImportButton
        importHeaders={importTemplate.importHeaders}
        importExampleRow={importTemplate.importExampleRow}
        importFieldMap={importTemplate.importHeaderMap}
        importColumnOptions={importTemplate.importColumnOptions}
        importTemplateName={t(`${NS}.importTemplateName`)}
        onImport={async (data) => {
          if (!data || data.length < 2) {
            message.warning(t('app.kuaicaiwu.common.importEmpty'));
            return false;
          }
          const cats = await loadCategories();
          const headerIndexMap = resolveFactoryImportHeaderIndexMap(
            (data[0] || []).map((h) => String(h ?? '').trim()),
            importTemplate.importHeaderMap,
          );
          if (headerIndexMap.asset_name === undefined) {
            message.error(t(`${NS}.importHeaderMissingName`));
            return false;
          }
          const cellAt = (row: unknown[], field: string) => {
            const idx = headerIndexMap[field];
            if (idx === undefined) return '';
            return String(row[idx] ?? '').trim();
          };
          const numAt = (row: unknown[], field: string) => {
            const raw = cellAt(row, field);
            if (!raw) return undefined;
            const n = Number(raw);
            return Number.isFinite(n) ? n : undefined;
          };
          const importRows = data.slice(2).filter((row) =>
            row?.some((c) => c != null && String(c).trim() !== ''),
          );
          let created = 0;
          const errors: string[] = [];
          for (let i = 0; i < importRows.length; i += 1) {
            const row = importRows[i];
            const assetName = cellAt(row, 'asset_name');
            if (!assetName) {
              errors.push(t(`${NS}.importRowNameRequired`, { row: i + 3 }));
              continue;
            }
            const categoryName = cellAt(row, 'category_name');
            if (!categoryName) {
              errors.push(t(`${NS}.importRowCategoryRequired`, { row: i + 3 }));
              continue;
            }
            const cat = cats.find(
              (c) => c.category_name === categoryName || c.category_code === categoryName,
            );
            if (!cat) {
              errors.push(t(`${NS}.importRowCategoryMissing`, { row: i + 3, name: categoryName }));
              continue;
            }
            const statusRaw = cellAt(row, 'status');
            const status = parseFaAssetStatusLabel(statusRaw) || 'active';
            const residualRate = parseFaResidualRate(cellAt(row, 'residual_rate'));
            try {
              await fixedAssetService.createAsset({
                asset_code: cellAt(row, 'asset_code') || undefined,
                asset_name: assetName,
                category_id: cat.id,
                change_method: cellAt(row, 'change_method') || 'import',
                quantity: numAt(row, 'quantity') ?? 1,
                unit: cellAt(row, 'unit') || undefined,
                useful_life_months: numAt(row, 'useful_life_months'),
                department_name: cellAt(row, 'department_name') || undefined,
                user_name: cellAt(row, 'user_name') || undefined,
                status,
                location: cellAt(row, 'location') || undefined,
                start_use_date: parseSpreadsheetDateToApiString(cellAt(row, 'start_use_date')),
                entry_date: parseSpreadsheetDateToApiString(cellAt(row, 'entry_date')),
                specification: cellAt(row, 'specification') || undefined,
                notes: cellAt(row, 'notes') || undefined,
                depreciation_method: parseFaDepreciationMethodLabel(cellAt(row, 'depreciation_method')),
                original_value: numAt(row, 'original_value') ?? 0,
                impairment_value: numAt(row, 'impairment_value') ?? 0,
                depreciated_periods: numAt(row, 'depreciated_periods') ?? 0,
                accumulated_depreciation: numAt(row, 'accumulated_depreciation') ?? 0,
                residual_rate: residualRate,
                accumulated_depreciation_account_code:
                  cellAt(row, 'accumulated_depreciation_account_code') || undefined,
                expense_account_code: cellAt(row, 'expense_account_code') || undefined,
                asset_account_code: cellAt(row, 'asset_account_code') || undefined,
              });
              created += 1;
            } catch (err) {
              errors.push(String((err as Error)?.message || err));
            }
          }
          if (created > 0) {
            message.success(t(`${NS}.importResult`, { count: created }));
            actionRef.current?.reload();
          }
          if (errors.length) {
            message.warning(errors.slice(0, 3).join('；'));
          }
          return created > 0;
        }}
        showExportButton
        onExport={async (type, keys, pageData) => {
          if (type === 'all') {
            const blob = await fixedAssetService.exportAssets();
            const url = URL.createObjectURL(blob as Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${t(`${NS}.exportFileName`)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            return;
          }
          let items: FaAsset[] =
            type === 'currentPage' && pageData?.length
              ? pageData
              : await fetchAllListItems((p) =>
                  fixedAssetService.listAssets({
                    skip: ((p.page || 1) - 1) * (p.pageSize || 200),
                    limit: p.pageSize || 200,
                  }).then((res) => ({ items: res.items, total: res.total })),
                );
          if (type === 'selected' && keys?.length) {
            items = items.filter((row) => keys.includes(row.id));
          }
          if (items.length === 0) {
            message.warning(t('common.exportNoData'));
            return;
          }
          await downloadRecordsAsXlsx(
            items as unknown as Record<string, unknown>[],
            [
              { key: 'asset_code', title: t(`${NS}.col.code`) },
              { key: 'asset_name', title: t(`${NS}.col.name`) },
              { key: 'category_name', title: t(`${NS}.col.category`) },
              { key: 'status', title: t(`${NS}.col.status`) },
              { key: 'original_value', title: t(`${NS}.col.originalValue`) },
              { key: 'accumulated_depreciation', title: t(`${NS}.col.accumDepr`) },
              { key: 'net_value', title: t(`${NS}.col.netValue`) },
              { key: 'department_name', title: t(`${NS}.col.department`) },
              { key: 'user_name', title: t(`${NS}.col.user`) },
              { key: 'location', title: t(`${NS}.col.location`) },
              { key: 'entry_date', title: t(`${NS}.col.entryDate`) },
            ],
            t(`${NS}.exportFileName`),
          );
        }}
        request={async (params) => {
          const res = await fixedAssetService.listAssets({
            skip: ((params.current || 1) - 1) * (params.pageSize || 20),
            limit: params.pageSize || 20,
            keyword: params.keyword as string | undefined,
            status: params.status as string | undefined,
          });
          return { data: res.items, success: true, total: res.total };
        }}
      />
      <FaAssetFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={editing}
        categories={categories}
        onSuccess={() => {
          message.success(t('common.saveSuccess'));
          setModalOpen(false);
          actionRef.current?.reload();
        }}
      />
    </ListPageTemplate>
  );
};

export default FaAssetsPage;
