import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProFormDatePicker,
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { FormModalTemplate, ListPageTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../utils/fetchAllListPages';
import { fixedAssetService, type FaAsset, type FaCategory } from '../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset';
const NS = 'app.kuaicaiwu.fixedAssets.assets';

const STATUS_ENUM: Record<string, string> = {
  active: '在用',
  idle: '闲置',
  disposed: '已清理',
  scrapped: '已报废',
};

const IMPORT_HEADERS = [
  '资产编号',
  '资产名称',
  '类别',
  '原值',
  '入账日期',
  '使用部门',
  '使用人',
  '存放地点',
];

const IMPORT_EXAMPLE = ['FA202609110001', '示例设备', '办公设备', '10000', '2026-09-11', '行政部', '张三', '1楼仓库'];

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
  };

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
        importHeaders={IMPORT_HEADERS}
        importExampleRow={IMPORT_EXAMPLE}
        importTemplateName={t(`${NS}.importTemplateName`)}
        onImport={async (data) => {
          if (!data || data.length < 2) {
            message.warning(t('app.kuaicaiwu.common.importEmpty'));
            return false;
          }
          const cats = await fixedAssetService.listCategories({ is_active: true });
          const importRows = data.slice(2).filter((row) => row?.some((c) => c != null && String(c).trim() !== ''));
          let created = 0;
          const errors: string[] = [];
          for (let i = 0; i < importRows.length; i += 1) {
            const row = importRows[i];
            const assetName = String(row[1] ?? '').trim();
            if (!assetName) {
              errors.push(t(`${NS}.importRowNameRequired`, { row: i + 3 }));
              continue;
            }
            const categoryName = String(row[2] ?? '').trim();
            let categoryId: number | undefined;
            if (categoryName) {
              const cat = cats.find((c) => c.category_name === categoryName || c.category_code === categoryName);
              if (!cat) {
                errors.push(t(`${NS}.importRowCategoryMissing`, { row: i + 3, name: categoryName }));
                continue;
              }
              categoryId = cat.id;
            }
            try {
              await fixedAssetService.createAsset({
                asset_code: String(row[0] ?? '').trim() || undefined,
                asset_name: assetName,
                category_id: categoryId,
                original_value: Number(row[3]) || 0,
                entry_date: row[4] ? String(row[4]).slice(0, 10) : undefined,
                department_name: row[5] ? String(row[5]).trim() : undefined,
                user_name: row[6] ? String(row[6]).trim() : undefined,
                location: row[7] ? String(row[7]).trim() : undefined,
                change_method: 'import',
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
      <FormModalTemplate
        title={editing ? t(`${NS}.editTitle`) : t(`${NS}.createTitle`)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        grid={false}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true, width: 880 }}
        onFinish={async (values) => {
          const body = {
            ...values,
            entry_date: values.entry_date ? dayjs(values.entry_date).format('YYYY-MM-DD') : undefined,
            start_use_date: values.start_use_date ? dayjs(values.start_use_date).format('YYYY-MM-DD') : undefined,
          };
          if (editing) {
            await fixedAssetService.updateAsset(editing.id, body);
          } else {
            await fixedAssetService.createAsset(body);
          }
          message.success(t('common.saveSuccess'));
          setModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
        initialValues={
          editing
            ? {
                ...editing,
                entry_date: editing.entry_date ? dayjs(editing.entry_date) : undefined,
                start_use_date: editing.entry_date ? dayjs(editing.entry_date) : undefined,
              }
            : { status: 'active', useful_life_months: 60, residual_rate: 0.05 }
        }
      >
        <ProFormText name="asset_code" label={t(`${NS}.col.code`)} />
        <ProFormText name="asset_name" label={t(`${NS}.col.name`)} rules={[{ required: true }]} />
        <ProFormSelect
          name="category_id"
          label={t(`${NS}.col.category`)}
          options={categories.map((c) => ({ label: c.category_name, value: c.id }))}
        />
        <ProFormSelect
          name="status"
          label={t(`${NS}.col.status`)}
          options={Object.entries(STATUS_ENUM).map(([value, label]) => ({ value, label }))}
        />
        <ProFormMoney name="original_value" label={t(`${NS}.col.originalValue`)} />
        <ProFormDigit name="useful_life_months" label={t(`${NS}.col.lifeMonths`)} min={1} />
        <ProFormDigit name="residual_rate" label={t(`${NS}.col.residualRate`)} min={0} max={1} fieldProps={{ step: 0.01 }} />
        <ProFormText name="department_name" label={t(`${NS}.col.department`)} />
        <ProFormText name="user_name" label={t(`${NS}.col.user`)} />
        <ProFormText name="location" label={t(`${NS}.col.location`)} />
        <ProFormDatePicker name="entry_date" label={t(`${NS}.col.entryDate`)} />
        <ProFormDatePicker name="start_use_date" label={t(`${NS}.col.startUseDate`)} />
        <ProFormTextArea name="notes" label={t('common.notes')} />
      </FormModalTemplate>
    </ListPageTemplate>
  );
};

export default FaAssetsPage;
