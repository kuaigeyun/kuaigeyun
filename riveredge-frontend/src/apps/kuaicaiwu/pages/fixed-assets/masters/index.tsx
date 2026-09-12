import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import {
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate, ListPageTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { UniBatchMenuButton } from '../../../../../components/uni-batch';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fixedAssetService, type FaCategory } from '../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset';
const NS = 'app.kuaicaiwu.fixedAssets.masters';

const FaMastersPage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const tableRowsRef = useRef<FaCategory[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FaCategory | null>(null);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleBatchDelete = async (keys: React.Key[]) => {
    for (const key of keys) {
      await fixedAssetService.deleteCategory(Number(key));
    }
    message.success(t(`${NS}.batchDeleted`, { count: keys.length }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const handleBatchSetActive = async (keys: React.Key[], isActive: boolean) => {
    for (const key of keys) {
      await fixedAssetService.updateCategory(Number(key), { is_active: isActive });
    }
    message.success(t(isActive ? `${NS}.batchEnabled` : `${NS}.batchDisabled`, { count: keys.length }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const columns: ProColumns<FaCategory>[] = useMemo(
    () => [
      { title: t(`${NS}.col.code`), dataIndex: 'category_code', width: 120, uniTableKeepWidth: true },
      { title: t(`${NS}.col.name`), dataIndex: 'category_name', ellipsis: true },
      {
        title: t('common.enabled'),
        dataIndex: 'is_active',
        width: 88,
        uniTableKeepWidth: true,
        render: (_, r) => (
          <MarkerTag variant="filled" color={r.is_active ? 'success' : 'default'}>
            {r.is_active ? t('common.enabled') : t('common.disabled')}
          </MarkerTag>
        ),
      },
      {
        title: t('common.actions'),
        valueType: 'option',
        width: 120,
        render: (_, record) => [
          <a key="edit" onClick={() => { setEditing(record); setModalOpen(true); }}>
            {t('common.edit')}
          </a>,
          <Popconfirm
            key="del"
            title={t('common.confirmDelete')}
            onConfirm={async () => {
              await fixedAssetService.deleteCategory(record.id);
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
      <UniTable<FaCategory>
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.masters.list-v1"
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
        toolBarActionsAfterDelete={[
          <UniBatchMenuButton
            key="fa-category-batch"
            selectedRowKeys={selectedRowKeys}
            buttonText={t('components.uniBatch.batchActions')}
            menuItems={[
              {
                key: 'batch-enable',
                label: t(`${NS}.batchEnable`),
                onClick: (keys) => handleBatchSetActive(keys, true),
              },
              {
                key: 'batch-disable',
                label: t(`${NS}.batchDisable`),
                onClick: (keys) => handleBatchSetActive(keys, false),
              },
            ]}
          />,
        ]}
        showImportButton={false}
        showExportButton
        onExport={async (type, keys, pageData) => {
          let items = tableRowsRef.current;
          if (type === 'currentPage' && pageData?.length) {
            items = pageData;
          } else if (type === 'selected' && keys?.length) {
            items = items.filter((row) => keys.includes(row.id));
          }
          if (items.length === 0) {
            message.warning(t('common.exportNoData'));
            return;
          }
          await downloadRecordsAsXlsx(
            items as unknown as Record<string, unknown>[],
            [
              { key: 'category_code', title: t(`${NS}.col.code`) },
              { key: 'category_name', title: t(`${NS}.col.name`) },
              { key: 'is_active', title: t('common.enabled') },
            ],
            t(`${NS}.exportFileName`),
          );
        }}
        request={async () => {
          const items = await fixedAssetService.listCategories();
          return { data: items, success: true, total: items.length };
        }}
      />
      <FormModalTemplate
        title={editing ? t(`${NS}.editTitle`) : t(`${NS}.createTitle`)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
        onFinish={async (values) => {
          if (editing) {
            await fixedAssetService.updateCategory(editing.id, values);
          } else {
            await fixedAssetService.createCategory(values);
          }
          message.success(t('common.saveSuccess'));
          setModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
        initialValues={editing ?? { is_active: true }}
      >
        <ProFormText name="category_code" label={t(`${NS}.col.code`)} rules={[{ required: !editing }]} disabled={!!editing} />
        <ProFormText name="category_name" label={t(`${NS}.col.name`)} rules={[{ required: true }]} />
        <ProFormSwitch name="is_active" label={t('common.enabled')} />
        <ProFormTextArea name="notes" label={t('common.notes')} />
      </FormModalTemplate>
    </ListPageTemplate>
  );
};

export default FaMastersPage;
