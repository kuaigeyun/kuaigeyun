import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormDigit, ProFormTextArea } from '@ant-design/pro-components';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate, ListPageTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fixedAssetService } from '../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset';
const NS = 'app.kuaicaiwu.fixedAssets.periodClose';

const FaPeriodClosePage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const tableRowsRef = useRef<Record<string, unknown>[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      {
        title: t(`${NS}.col.period`),
        render: (_, r) => `${r.period_year}-${String(r.period_month).padStart(2, '0')}`,
        width: 120,
      },
      { title: t(`${NS}.col.closedAt`), dataIndex: 'closed_at', width: 180 },
      { title: t(`${NS}.col.closedBy`), dataIndex: 'closed_by_name', width: 120 },
      { title: t('common.notes'), dataIndex: 'notes', ellipsis: true },
    ],
    [t],
  );

  return (
    <ListPageTemplate>
      <UniTable
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.period-close.list-v1"
        columns={columns}
        permissionResource={RESOURCE}
        enableRowSelection
        selectedRowKeys={selectedRowKeys}
        onRowSelectionChange={setSelectedRowKeys}
        onTableDataChange={(rows) => {
          tableRowsRef.current = rows as Record<string, unknown>[];
        }}
        search={false}
        showCreateButton
        createButtonText={t(`${NS}.createButton`)}
        onCreate={() => setModalOpen(true)}
        showDeleteButton={false}
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
            { key: 'period_year', title: t(`${NS}.field.year`) },
            { key: 'period_month', title: t(`${NS}.field.month`) },
            { key: 'closed_at', title: t(`${NS}.col.closedAt`) },
            { key: 'closed_by_name', title: t(`${NS}.col.closedBy`) },
            { key: 'notes', title: t('common.notes') },
          ], t(`${NS}.exportFileName`));
        }}
        request={async () => {
          const items = await fixedAssetService.listPeriodCloses();
          return { data: items, success: true, total: items.length };
        }}
      />
      <FormModalTemplate
        title={t(`${NS}.createTitle`)}
        open={modalOpen}
        onOpenChange={setModalOpen}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
        onFinish={async (values) => {
          await fixedAssetService.closePeriod(values.period_year, values.period_month, values.notes);
          message.success(t(`${NS}.success`));
          setModalOpen(false);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormDigit name="period_year" label={t(`${NS}.field.year`)} rules={[{ required: true }]} />
        <ProFormDigit name="period_month" label={t(`${NS}.field.month`)} min={1} max={12} rules={[{ required: true }]} />
        <ProFormTextArea name="notes" label={t('common.notes')} />
      </FormModalTemplate>
    </ListPageTemplate>
  );
};

export default FaPeriodClosePage;
