import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormDatePicker, ProFormMoney, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { FormModalTemplate, ListPageTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { UniBatchMenuButton } from '../../../../../components/uni-batch';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fixedAssetService, type FaAsset } from '../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset';
const NS = 'app.kuaicaiwu.fixedAssets.disposals';

const FaDisposalsPage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const tableRowsRef = useRef<Record<string, unknown>[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [assets, setAssets] = useState<FaAsset[]>([]);

  const openCreate = async () => {
    const res = await fixedAssetService.listAssets({ limit: 500, status: 'active' });
    setAssets(res.items);
    setModalOpen(true);
  };

  const handleBatchConfirm = async (keys: React.Key[]) => {
    const rows = tableRowsRef.current.filter((row) => keys.includes(Number(row.id)));
    let count = 0;
    for (const row of rows) {
      if (row.status !== 'draft') continue;
      await fixedAssetService.confirmDisposal(Number(row.id));
      count += 1;
    }
    message.success(t(`${NS}.batchConfirmSuccess`, { count }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      { title: t(`${NS}.col.code`), dataIndex: 'disposal_code', width: 140, uniTableKeepWidth: true },
      { title: t(`${NS}.col.asset`), dataIndex: 'asset_name', ellipsis: true },
      { title: t(`${NS}.col.date`), dataIndex: 'disposal_date', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.type`), dataIndex: 'disposal_type', width: 100, uniTableKeepWidth: true },
      { title: t(`${NS}.col.amount`), dataIndex: 'disposal_amount', valueType: 'money', width: 120 },
      {
        title: t(`${NS}.col.status`),
        dataIndex: 'status',
        width: 88,
        render: (_, r) => <MarkerTag variant="filled">{String(r.status)}</MarkerTag>,
      },
      {
        title: t('common.actions'),
        valueType: 'option',
        width: 100,
        render: (_, record) =>
          record.status === 'draft' ? (
            <a
              onClick={async () => {
                await fixedAssetService.confirmDisposal(Number(record.id));
                message.success(t(`${NS}.confirmSuccess`));
                actionRef.current?.reload();
              }}
            >
              {t(`${NS}.confirm`)}
            </a>
          ) : null,
      },
    ],
    [t, message],
  );

  return (
    <ListPageTemplate>
      <UniTable
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.disposals.list-v1"
        columns={columns}
        permissionResource={RESOURCE}
        enableRowSelection
        selectedRowKeys={selectedRowKeys}
        onRowSelectionChange={setSelectedRowKeys}
        onTableDataChange={(rows) => {
          tableRowsRef.current = rows as Record<string, unknown>[];
        }}
        showCreateButton
        createButtonText={t(`${NS}.createButton`)}
        onCreate={openCreate}
        showDeleteButton={false}
        toolBarActionsAfterDelete={[
          <UniBatchMenuButton
            key="fa-disposal-batch"
            selectedRowKeys={selectedRowKeys}
            buttonText={t('components.uniBatch.batchActions')}
            menuItems={[
              {
                key: 'batch-confirm',
                label: t(`${NS}.batchConfirm`),
                onClick: (keys) => handleBatchConfirm(keys),
              },
            ]}
          />,
        ]}
        showImportButton={false}
        showExportButton
        onExport={async (type, keys, pageData) => {
          let items = tableRowsRef.current;
          if (type === 'currentPage' && pageData?.length) {
            items = pageData as Record<string, unknown>[];
          } else if (type === 'selected' && keys?.length) {
            items = items.filter((row) => keys.includes(Number(row.id)));
          }
          if (items.length === 0) {
            message.warning(t('common.exportNoData'));
            return;
          }
          await downloadRecordsAsXlsx(items, [
            { key: 'disposal_code', title: t(`${NS}.col.code`) },
            { key: 'asset_name', title: t(`${NS}.col.asset`) },
            { key: 'disposal_date', title: t(`${NS}.col.date`) },
            { key: 'disposal_type', title: t(`${NS}.col.type`) },
            { key: 'disposal_amount', title: t(`${NS}.col.amount`) },
            { key: 'status', title: t(`${NS}.col.status`) },
          ], t(`${NS}.exportFileName`));
        }}
        request={async () => {
          const items = await fixedAssetService.listDisposals();
          return { data: items, success: true, total: items.length };
        }}
      />
      <FormModalTemplate
        title={t(`${NS}.createTitle`)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
        onFinish={async (values) => {
          await fixedAssetService.createDisposal({
            asset_id: values.asset_id,
            disposal_date: dayjs(values.disposal_date).format('YYYY-MM-DD'),
            disposal_type: values.disposal_type,
            disposal_amount: values.disposal_amount,
            notes: values.notes,
          });
          message.success(t('common.saveSuccess'));
          setModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormSelect
          name="asset_id"
          label={t(`${NS}.col.asset`)}
          rules={[{ required: true }]}
          options={assets.map((a) => ({ label: `${a.asset_code} ${a.asset_name}`, value: a.id }))}
          showSearch
        />
        <ProFormDatePicker name="disposal_date" label={t(`${NS}.col.date`)} rules={[{ required: true }]} />
        <ProFormSelect
          name="disposal_type"
          label={t(`${NS}.col.type`)}
          options={[
            { label: t(`${NS}.type.sale`), value: 'sale' },
            { label: t(`${NS}.type.scrap`), value: 'scrap' },
            { label: t(`${NS}.type.donate`), value: 'donate' },
          ]}
        />
        <ProFormMoney name="disposal_amount" label={t(`${NS}.col.amount`)} />
        <ProFormTextArea name="notes" label={t('common.notes')} />
      </FormModalTemplate>
    </ListPageTemplate>
  );
};

export default FaDisposalsPage;
