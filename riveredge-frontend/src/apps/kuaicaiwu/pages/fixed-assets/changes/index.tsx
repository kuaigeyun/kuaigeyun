import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
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
const NS = 'app.kuaicaiwu.fixedAssets.changes';

const FaChangesPage: React.FC = () => {
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
      await fixedAssetService.confirmChange(Number(row.id));
      count += 1;
    }
    message.success(t(`${NS}.batchConfirmSuccess`, { count }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      { title: t(`${NS}.col.code`), dataIndex: 'change_code', width: 140, uniTableKeepWidth: true },
      { title: t(`${NS}.col.asset`), dataIndex: 'asset_name', ellipsis: true },
      { title: t(`${NS}.col.type`), dataIndex: 'change_type', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.date`), dataIndex: 'change_date', width: 120, uniTableKeepWidth: true },
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
                await fixedAssetService.confirmChange(Number(record.id));
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
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.changes.list-v1"
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
            key="fa-change-batch"
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
            { key: 'change_code', title: t(`${NS}.col.code`) },
            { key: 'asset_name', title: t(`${NS}.col.asset`) },
            { key: 'change_type', title: t(`${NS}.col.type`) },
            { key: 'change_date', title: t(`${NS}.col.date`) },
            { key: 'status', title: t(`${NS}.col.status`) },
          ], t(`${NS}.exportFileName`));
        }}
        request={async () => {
          const items = await fixedAssetService.listChanges();
          return { data: items, success: true, total: items.length };
        }}
      />
      <FormModalTemplate
        title={t(`${NS}.createTitle`)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
        onFinish={async (values) => {
          await fixedAssetService.createChange({
            asset_id: values.asset_id,
            change_type: values.change_type,
            change_date: dayjs(values.change_date).format('YYYY-MM-DD'),
            notes: values.notes,
            after_snapshot: {
              department_name: values.department_name,
              user_name: values.user_name,
              location: values.location,
            },
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
        <ProFormSelect
          name="change_type"
          label={t(`${NS}.col.type`)}
          rules={[{ required: true }]}
          options={[
            { label: t(`${NS}.type.department`), value: 'department' },
            { label: t(`${NS}.type.user`), value: 'user' },
            { label: t(`${NS}.type.location`), value: 'location' },
          ]}
        />
        <ProFormDatePicker name="change_date" label={t(`${NS}.col.date`)} rules={[{ required: true }]} />
        <ProFormText name="department_name" label={t(`${NS}.field.department`)} />
        <ProFormText name="user_name" label={t(`${NS}.field.user`)} />
        <ProFormText name="location" label={t(`${NS}.field.location`)} />
        <ProFormTextArea name="notes" label={t('common.notes')} />
      </FormModalTemplate>
    </ListPageTemplate>
  );
};

export default FaChangesPage;
