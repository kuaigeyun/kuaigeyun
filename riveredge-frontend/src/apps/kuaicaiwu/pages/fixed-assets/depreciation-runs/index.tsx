import React, { useMemo, useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormDigit } from '@ant-design/pro-components';
import { App, Drawer, InputNumber, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormModalTemplate, ListPageTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { UniBatchMenuButton } from '../../../../../components/uni-batch';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../utils/fetchAllListPages';
import { fixedAssetService } from '../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset-depreciation';
const NS = 'app.kuaicaiwu.fixedAssets.deprRuns';

const FaDepreciationRunsPage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const actionRef = useRef<ActionType>();
  const tableRowsRef = useRef<Record<string, unknown>[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentRun, setCurrentRun] = useState<{ id: number; lines: Record<string, unknown>[] } | null>(null);
  const [lineDrawer, setLineDrawer] = useState(false);

  const handleBatchConfirm = async (keys: React.Key[]) => {
    const rows = tableRowsRef.current.filter((row) => keys.includes(Number(row.id)));
    let count = 0;
    for (const row of rows) {
      if (row.status !== 'draft') continue;
      await fixedAssetService.confirmDeprRun(Number(row.id));
      count += 1;
    }
    message.success(t(`${NS}.batchConfirmSuccess`, { count }));
    setSelectedRowKeys([]);
    actionRef.current?.reload();
  };

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      { title: t(`${NS}.col.code`), dataIndex: 'run_code', width: 140, uniTableKeepWidth: true },
      {
        title: t(`${NS}.col.period`),
        width: 100,
        render: (_, r) => `${r.period_year}-${String(r.period_month).padStart(2, '0')}`,
      },
      { title: t(`${NS}.col.total`), dataIndex: 'total_amount', valueType: 'money', width: 120 },
      {
        title: t(`${NS}.col.status`),
        dataIndex: 'status',
        width: 88,
        render: (_, r) => <MarkerTag variant="filled">{String(r.status)}</MarkerTag>,
      },
      {
        title: t('common.actions'),
        valueType: 'option',
        width: 160,
        render: (_, record) => [
          <a
            key="view"
            onClick={async () => {
              const detail = await fixedAssetService.getDeprRun(Number(record.id));
              setCurrentRun(detail as { id: number; lines: Record<string, unknown>[] });
              setLineDrawer(true);
            }}
          >
            {t(`${NS}.viewLines`)}
          </a>,
          record.status === 'draft' ? (
            <a
              key="confirm"
              onClick={async () => {
                await fixedAssetService.confirmDeprRun(Number(record.id));
                message.success(t(`${NS}.confirmSuccess`));
                actionRef.current?.reload();
              }}
            >
              {t(`${NS}.confirm`)}
            </a>
          ) : null,
        ],
      },
    ],
    [t, message],
  );

  return (
    <ListPageTemplate>
      <UniTable
        actionRef={actionRef}
        rowKey="id"
        columnPersistenceId="apps.kuaicaiwu.fixed-assets.depr-runs.list-v1"
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
        onCreate={() => setPreviewOpen(true)}
        showDeleteButton={false}
        toolBarActionsAfterDelete={[
          <UniBatchMenuButton
            key="fa-depr-run-batch"
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
          let items: Record<string, unknown>[] =
            type === 'currentPage' && pageData?.length
              ? (pageData as Record<string, unknown>[])
              : await fetchAllListItems((p) =>
                  fixedAssetService.listDeprRuns({
                    skip: ((p.page || 1) - 1) * (p.pageSize || 200),
                    limit: p.pageSize || 200,
                  }).then((res) => ({ items: res.items, total: res.total })),
                );
          if (type === 'selected' && keys?.length) {
            items = items.filter((row) => keys.includes(Number(row.id)));
          }
          if (items.length === 0) {
            message.warning(t('common.exportNoData'));
            return;
          }
          await downloadRecordsAsXlsx(items, [
            { key: 'run_code', title: t(`${NS}.col.code`) },
            { key: 'period_year', title: t(`${NS}.field.year`) },
            { key: 'period_month', title: t(`${NS}.field.month`) },
            { key: 'total_amount', title: t(`${NS}.col.total`) },
            { key: 'status', title: t(`${NS}.col.status`) },
          ], t(`${NS}.exportFileName`));
        }}
        request={async (params) => {
          const res = await fixedAssetService.listDeprRuns({
            skip: ((params.current || 1) - 1) * (params.pageSize || 20),
            limit: params.pageSize || 20,
          });
          return { data: res.items, success: true, total: res.total };
        }}
      />
      <FormModalTemplate
        title={t(`${NS}.previewTitle`)}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        modalProps={{ ...MODAL_CONFIG, destroyOnHidden: true }}
        onFinish={async (values) => {
          const run = await fixedAssetService.previewDeprRun(values.period_year, values.period_month);
          setCurrentRun(run);
          setPreviewOpen(false);
          setLineDrawer(true);
          actionRef.current?.reload();
          return true;
        }}
      >
        <ProFormDigit name="period_year" label={t(`${NS}.field.year`)} rules={[{ required: true }]} />
        <ProFormDigit name="period_month" label={t(`${NS}.field.month`)} min={1} max={12} rules={[{ required: true }]} />
      </FormModalTemplate>
      <Drawer
        open={lineDrawer}
        onClose={() => setLineDrawer(false)}
        width={720}
        title={t(`${NS}.linesTitle`)}
        extra={
          currentRun?.id ? (
            <a
              onClick={async () => {
                await fixedAssetService.confirmDeprRun(currentRun.id);
                message.success(t(`${NS}.confirmSuccess`));
                setLineDrawer(false);
                actionRef.current?.reload();
              }}
            >
              {t(`${NS}.confirm`)}
            </a>
          ) : null
        }
      >
        <Table
          rowKey="id"
          dataSource={currentRun?.lines || []}
          pagination={false}
          columns={[
            { title: t(`${NS}.col.assetCode`), dataIndex: 'asset_code' },
            { title: t(`${NS}.col.assetName`), dataIndex: 'asset_name', ellipsis: true },
            { title: t(`${NS}.col.calculated`), dataIndex: 'calculated_amount', render: (v) => Number(v).toFixed(2) },
            {
              title: t(`${NS}.col.final`),
              dataIndex: 'final_amount',
              render: (v, record) =>
                currentRun ? (
                  <InputNumber
                    size="small"
                    value={Number(v)}
                    min={0}
                    precision={2}
                    onChange={async (val) => {
                      if (val == null) return;
                      await fixedAssetService.updateDeprLine(currentRun.id, Number(record.id), Number(val));
                      const detail = await fixedAssetService.getDeprRun(currentRun.id);
                      setCurrentRun(detail as { id: number; lines: Record<string, unknown>[] });
                    }}
                  />
                ) : (
                  Number(v).toFixed(2)
                ),
            },
          ]}
        />
      </Drawer>
    </ListPageTemplate>
  );
};

export default FaDepreciationRunsPage;
