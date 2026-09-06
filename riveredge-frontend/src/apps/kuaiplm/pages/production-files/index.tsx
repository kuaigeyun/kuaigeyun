/**
 * 生产文件（R-06）
 * PE：工序→型号，生产方仅最新生产版；研发：项目→发布日，保留历史。
 * 不替代产品固件（R-15）与 R-16 扫码打印。
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ActionType,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { App, Button, Descriptions, Input, Modal, Result, Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { UniTable } from '../../../../components/uni-table';
import { rowActionKind } from '../../../../components/uni-action';
import {
  DetailDrawerTemplate,
  FormModalTemplate,
  MultiTabListPageTemplate,
  detailDrawerBasicColumn,
} from '../../../../components/layout-templates';
import { detailDrawerDescriptionItems } from '../../../../components/layout-templates/detailDrawerDescriptionItems';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { getApiErrorMessage } from '../../../../utils/errorHandler';
import {
  formatDateBySiteSetting,
  formatDateTimeBySiteSetting,
  todaySiteDateString,
} from '../../../../utils/format';
import { downloadRecordsAsXlsx, type ExportXlsxColumn } from '../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../utils/fetchAllListPages';
import { renderDocumentStatusTag } from '../../../../utils/documentLifecycleStatusTag';
import { MarkerTag } from '../../../../constants/statusBadges';
import { uploadMultipleFiles } from '../../../../services/file';
import {
  alignDescriptionColumns,
  alignProColumns,
  GLOBAL_DOC_DETAIL_BASIC_FIELD_RANK,
  GLOBAL_DOC_LIST_FIELD_RANK,
} from '../../../kuaizhizao/pages/sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../../kuaizhizao/pages/shared/documentAuditColumns';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../utils/uniTableLayoutColumns';
import { NEW_SHORTCUT_HINT } from '../../../../utils/globalNewShortcut';
import Phase2ProjectSelect from '../../components/Phase2ProjectSelect';
import {
  productionFileApi,
  type ProductionFile,
  type ProductionFileAccessLog,
  type ProductionFileCatalogKind,
  type ProductionFileStatus,
  type ProductionFileVersion,
} from '../../services/production-file';

const RESOURCE = 'kuaiplm:production-file';
const FILE_CATEGORY = 'production_file';

const PE_TYPES = ['burn', 'laser', 'bluetooth_ir', 'aoi', 'label_template', 'other_pe'] as const;
const RD_TYPES = ['rd_burn_tool', 'rd_prod_test', 'other_rd'] as const;
const STATUS_KEYS: ProductionFileStatus[] = [
  'draft',
  'pending',
  'effective',
  'obsolete',
  'rejected',
];

const EXPORT_COLUMNS: ExportXlsxColumn[] = [
  { key: 'file_code', title: '文件单号' },
  { key: 'catalog_kind_label', title: '目录策略' },
  { key: 'file_type_label', title: '文件类型' },
  { key: 'title', title: '标题' },
  { key: 'process_name', title: '工序' },
  { key: 'product_model', title: '产品型号' },
  { key: 'project_code', title: '项目代号' },
  { key: 'version', title: '版本' },
  { key: 'release_date', title: '发布日期' },
  { key: 'status_label', title: '状态' },
  { key: 'file_name', title: '文件名' },
  { key: 'issued_by_name', title: '发放人' },
  { key: 'receiver_names', title: '接收人' },
  { key: 'created_by_name', title: '创建人' },
  { key: 'updated_by_name', title: '更新人' },
  { key: 'created_at', title: '创建时间' },
  { key: 'updated_at', title: '更新时间' },
];

const ProductionFilesPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi, modal } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);

  const [catalogKind, setCatalogKind] = useState<ProductionFileCatalogKind>('pe_production');
  const actionRef = useRef<ActionType>(null);
  const tableRowsRef = useRef<ProductionFile[]>([]);
  const formRef = useRef<ProFormInstance | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductionFile | null>(null);
  const [detail, setDetail] = useState<ProductionFile | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [versions, setVersions] = useState<ProductionFileVersion[]>([]);
  const [accessLogs, setAccessLogs] = useState<ProductionFileAccessLog[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [issueOpen, setIssueOpen] = useState(false);
  const [issueRow, setIssueRow] = useState<ProductionFile | null>(null);
  const [receiverNames, setReceiverNames] = useState('');

  const reload = useCallback(() => actionRef.current?.reload(), []);
  const isPe = catalogKind === 'pe_production';

  const statusLabel = useCallback(
    (s: string) => t(`app.kuaiplm.productionFile.status.${s}`, { defaultValue: s }),
    [t],
  );
  const typeLabel = useCallback(
    (s: string) => t(`app.kuaiplm.productionFile.fileType.${s}`, { defaultValue: s }),
    [t],
  );
  const catalogLabel = useCallback(
    (s: string) => t(`app.kuaiplm.productionFile.catalog.${s}`, { defaultValue: s }),
    [t],
  );

  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const loadDetailExtras = useCallback(async (id: number) => {
    const [verRes, logRes] = await Promise.all([
      productionFileApi.listVersions(id, false),
      productionFileApi.listAccessLogs(id, { limit: 50 }),
    ]);
    setVersions(verRes.items);
    setAccessLogs(logRes.items);
  }, []);

  const openDetail = useCallback(
    async (row: ProductionFile) => {
      if (!row.id) return;
      setDetailLoading(true);
      setDetailError(null);
      setDetail(row);
      setVersions([]);
      setAccessLogs([]);
      try {
        const full = await productionFileApi.get(row.id);
        setDetail(full);
        await loadDetailExtras(row.id);
      } catch (e) {
        setDetailError(getApiErrorMessage(e));
      } finally {
        setDetailLoading(false);
      }
    },
    [loadDetailExtras],
  );

  const columns = useMemo<ProColumns<ProductionFile>[]>(() => {
    const cols: ProColumns<ProductionFile>[] = [
      {
        title: t('app.kuaiplm.productionFile.fields.code'),
        dataIndex: 'file_code',
        key: 'document_code',
        width: 140,
        copyable: true,
        uniTableKeepWidth: true,
      },
      {
        title: t('app.kuaiplm.productionFile.fields.fileType'),
        dataIndex: 'file_type',
        key: 'doc_type',
        width: 120,
        uniTableKeepWidth: true,
        render: (_, r) => (
          <MarkerTag>{typeLabel(r.file_type)}</MarkerTag>
        ),
      },
      {
        title: t('app.kuaiplm.productionFile.fields.title'),
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        uniTableRemainderFlex: true,
      },
    ];
    if (isPe) {
      cols.push(
        {
          title: t('app.kuaiplm.productionFile.fields.process'),
          dataIndex: 'process_name',
          key: 'process_name',
          width: 140,
          ellipsis: true,
          render: (_, r) => r.process_name || r.process_code || '—',
        },
        {
          title: t('app.kuaiplm.productionFile.fields.productModel'),
          dataIndex: 'product_model',
          key: 'product_model',
          width: 140,
          ellipsis: true,
        },
      );
    } else {
      cols.push(
        {
          title: t('app.kuaiplm.productionFile.fields.project'),
          dataIndex: 'project_name',
          key: 'project_name',
          width: 180,
          ellipsis: true,
          render: (_, r) =>
            r.project_name ? `${r.project_name} (${r.project_code || ''})` : r.project_code || '—',
        },
        {
          title: t('app.kuaiplm.productionFile.fields.releaseDate'),
          dataIndex: 'release_date',
          key: 'business_date',
          width: 120,
          uniTableKeepWidth: true,
          render: (_, r) => formatDateBySiteSetting(r.release_date) || '—',
        },
      );
    }
    cols.push(
      {
        title: t('app.kuaiplm.productionFile.fields.version'),
        dataIndex: 'version',
        key: 'version',
        width: 90,
        uniTableKeepWidth: true,
      },
      {
        ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
        title: t('common.status'),
        dataIndex: 'status',
        key: 'lifecycle',
        fixed: 'right',
        valueEnum: Object.fromEntries(STATUS_KEYS.map((k) => [k, { text: statusLabel(k) }])),
        render: (_, r) => renderDocumentStatusTag(statusLabel(r.status), r.status),
      },
      ...buildDocumentAuditColumns(t),
      {
        title: t('common.action'),
        valueType: 'option',
        key: 'option',
        fixed: 'right',
        render: (_, row) => {
          const actions: React.ReactNode[] = [
            <Button
              key="detail"
              type="link"
              size="small"
              {...rowActionKind('detail')}
              onClick={() => void openDetail(row)}
            />,
          ];
          if ((row.status === 'draft' || row.status === 'rejected') && perms.canUpdate) {
            actions.push(
              <Button
                key="edit"
                type="link"
                size="small"
                {...rowActionKind('edit')}
                onClick={() => {
                  setEditing(row);
                  setModalOpen(true);
                }}
              />,
            );
          }
          if (
            (row.status === 'draft' || row.status === 'rejected') &&
            perms.canAction?.('submit')
          ) {
            actions.push(
              <Button
                key="submit"
                type="link"
                size="small"
                {...rowActionKind('submit')}
                onClick={async () => {
                  try {
                    await productionFileApi.submit(row.id);
                    messageApi.success(t('app.kuaiplm.productionFile.messages.submitSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'pending' && perms.canAction?.('approve')) {
            actions.push(
              <Button
                key="approve"
                type="link"
                size="small"
                {...rowActionKind('approve')}
                onClick={async () => {
                  try {
                    await productionFileApi.approve(row.id);
                    messageApi.success(t('app.kuaiplm.productionFile.messages.approveSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'pending' && perms.canAction?.('reject')) {
            actions.push(
              <Button
                key="reject"
                type="link"
                size="small"
                {...rowActionKind('reject')}
                onClick={async () => {
                  try {
                    await productionFileApi.reject(row.id);
                    messageApi.success(t('app.kuaiplm.productionFile.messages.rejectSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'effective' && perms.canUpdate) {
            actions.push(
              <Button
                key="revise"
                type="link"
                size="small"
                {...rowActionKind('edit')}
                onClick={() => {
                  modal.confirm({
                    title: t('app.kuaiplm.productionFile.messages.reviseConfirm'),
                    onOk: async () => {
                      try {
                        await productionFileApi.revise(row.id, {
                          change_summary: t('app.kuaiplm.productionFile.messages.reviseDefault'),
                        });
                        messageApi.success(t('app.kuaiplm.productionFile.messages.reviseSuccess'));
                        reload();
                      } catch (e) {
                        messageApi.error(getApiErrorMessage(e));
                      }
                    },
                  });
                }}
              >
                {t('app.kuaiplm.productionFile.actions.revise')}
              </Button>,
            );
          }
          if (row.status === 'effective' && perms.canAction?.('execute')) {
            actions.push(
              <Button
                key="issue"
                type="link"
                size="small"
                {...rowActionKind('execute')}
                onClick={() => {
                  setIssueRow(row);
                  setReceiverNames('');
                  setIssueOpen(true);
                }}
              >
                {t('app.kuaiplm.productionFile.actions.issue')}
              </Button>,
            );
          }
          if (row.status === 'effective' && perms.canAction?.('obsolete')) {
            actions.push(
              <Button
                key="obsolete"
                type="link"
                size="small"
                danger
                {...rowActionKind('obsolete')}
                onClick={() => {
                  modal.confirm({
                    title: t('app.kuaiplm.productionFile.messages.obsoleteConfirm'),
                    onOk: async () => {
                      try {
                        await productionFileApi.obsolete(row.id);
                        messageApi.success(
                          t('app.kuaiplm.productionFile.messages.obsoleteSuccess'),
                        );
                        reload();
                      } catch (e) {
                        messageApi.error(getApiErrorMessage(e));
                      }
                    },
                  });
                }}
              />,
            );
          }
          return actions;
        },
      },
    );
    return alignProColumns(cols, GLOBAL_DOC_LIST_FIELD_RANK);
  }, [
    t,
    isPe,
    typeLabel,
    statusLabel,
    openDetail,
    perms,
    messageApi,
    reload,
    modal,
  ]);

  const basicColumns = useMemo(() => {
    const cols: ProDescriptionsItemProps<ProductionFile>[] = [
      {
        key: 'document_code',
        title: t('app.kuaiplm.productionFile.fields.code'),
        dataIndex: 'file_code',
      },
      {
        key: 'doc_type',
        title: t('app.kuaiplm.productionFile.fields.fileType'),
        dataIndex: 'file_type',
        render: (_, r) => typeLabel(r.file_type),
      },
      {
        key: 'title',
        title: t('app.kuaiplm.productionFile.fields.title'),
        dataIndex: 'title',
      },
      {
        key: 'version',
        title: t('app.kuaiplm.productionFile.fields.version'),
        dataIndex: 'version',
      },
      {
        key: 'lifecycle',
        title: t('common.status'),
        dataIndex: 'status',
        render: (_, r) => renderDocumentStatusTag(statusLabel(r.status), r.status),
      },
      {
        key: 'process_name',
        title: t('app.kuaiplm.productionFile.fields.process'),
        dataIndex: 'process_name',
        render: (_, r) => r.process_name || r.process_code || '—',
      },
      {
        key: 'product_model',
        title: t('app.kuaiplm.productionFile.fields.productModel'),
        dataIndex: 'product_model',
      },
      {
        key: 'project_name',
        title: t('app.kuaiplm.productionFile.fields.project'),
        dataIndex: 'project_name',
        render: (_, r) =>
          r.project_name ? `${r.project_name} (${r.project_code || ''})` : r.project_code || '—',
      },
      {
        key: 'business_date',
        title: t('app.kuaiplm.productionFile.fields.releaseDate'),
        dataIndex: 'release_date',
        render: (_, r) => formatDateBySiteSetting(r.release_date) || '—',
      },
      {
        key: 'file_name',
        title: t('app.kuaiplm.productionFile.fields.file'),
        dataIndex: 'file_name',
      },
      {
        key: 'change_summary',
        title: t('app.kuaiplm.productionFile.fields.changeSummary'),
        dataIndex: 'change_summary',
      },
      {
        key: 'issued_by_name',
        title: t('app.kuaiplm.productionFile.fields.issuedBy'),
        dataIndex: 'issued_by_name',
      },
      {
        key: 'receiver_names',
        title: t('app.kuaiplm.productionFile.fields.receivers'),
        dataIndex: 'receiver_names',
      },
      {
        key: 'remarks',
        title: t('common.remarks'),
        dataIndex: 'remarks',
      },
    ];
    return alignDescriptionColumns(cols, GLOBAL_DOC_DETAIL_BASIC_FIELD_RANK);
  }, [t, typeLabel, statusLabel]);

  const typeOptions = useMemo(() => {
    const keys = isPe ? PE_TYPES : RD_TYPES;
    return keys.map((k) => ({ label: typeLabel(k), value: k }));
  }, [isPe, typeLabel]);

  const renderCatalogTable = (kind: ProductionFileCatalogKind) => (
    <UniTable<ProductionFile>
      key={kind}
      actionRef={actionRef}
      rowKey="id"
      columns={columns}
      permissionResource={RESOURCE}
      columnPersistenceId={`apps.kuaiplm.pages.production-files.${kind}.v2`}
      enableRowSelection
      selectedRowKeys={selectedRowKeys}
      onSelectedRowKeysChange={setSelectedRowKeys}
      onTableDataChange={(rows) => {
        tableRowsRef.current = rows;
      }}
      showCreateButton={perms.canCreate}
      createButtonText={t('app.kuaiplm.productionFile.createButton')}
      onCreate={openCreate}
      showExportButton={perms.canAction?.('export')}
      onExport={async () => {
        const items = await fetchAllListItems((skip, limit) =>
          productionFileApi.list({ skip, limit, catalog_kind: kind }),
        );
        if (!items.length) {
          messageApi.warning(t('app.kuaiplm.productionFile.messages.noExportData'));
          return;
        }
        await downloadRecordsAsXlsx(
          items.map((r) => ({
            ...r,
            catalog_kind_label: catalogLabel(r.catalog_kind),
            file_type_label: typeLabel(r.file_type),
            status_label: statusLabel(r.status),
          })),
          EXPORT_COLUMNS,
          `production-files-${kind}-${todaySiteDateString()}.xlsx`,
        );
      }}
      toolBarRender={() => []}
      headerTitle={t('app.kuaiplm.productionFile.title')}
      request={async (params) => {
        const res = await productionFileApi.list({
          skip: ((params.current || 1) - 1) * (params.pageSize || 20),
          limit: params.pageSize || 20,
          keyword: params.keyword as string | undefined,
          status: params.status as string | undefined,
          catalog_kind: kind,
        });
        return { data: res.items, success: true, total: res.total };
      }}
      search={{ labelWidth: 'auto' }}
    />
  );

  return (
    <>
      <MultiTabListPageTemplate
        activeTabKey={catalogKind}
        onTabChange={(key) => {
          setCatalogKind(key as ProductionFileCatalogKind);
          setSelectedRowKeys([]);
        }}
        tabs={[
          {
            key: 'pe_production',
            label: catalogLabel('pe_production'),
            children: renderCatalogTable('pe_production'),
          },
          {
            key: 'rd_tool',
            label: catalogLabel('rd_tool'),
            children: renderCatalogTable('rd_tool'),
          },
        ]}
      />

      <FormModalTemplate
        title={
          editing
            ? t('app.kuaiplm.productionFile.editTitle')
            : t('app.kuaiplm.productionFile.createTitle')
        }
        open={modalOpen}
        onOpenChange={setModalOpen}
        formRef={formRef}
        grid
        initialValues={
          editing
            ? {
                ...editing,
                catalog_kind: editing.catalog_kind,
                file_upload: editing.file_uuid
                  ? [
                      {
                        uid: editing.file_uuid,
                        name: editing.file_name || editing.file_uuid,
                        status: 'done',
                        response: {
                          uuid: editing.file_uuid,
                          original_name: editing.file_name || editing.file_uuid,
                        },
                      },
                    ]
                  : [],
              }
            : {
                catalog_kind: catalogKind,
                version: 'A0',
                file_type: isPe ? 'burn' : 'rd_burn_tool',
                file_upload: [],
              }
        }
        onFinish={async (values) => {
          try {
            const uploadList = Array.isArray(values.file_upload) ? values.file_upload : [];
            const done = uploadList.find(
              (f: { status?: string }) => f.status === 'done' || !f.status,
            );
            const response = done?.response as
              | { uuid?: string; original_name?: string; name?: string }
              | undefined;
            const fileUuid =
              response?.uuid || done?.uid || values.file_uuid || null;
            const fileName =
              response?.original_name || response?.name || done?.name || values.file_name || null;
            const payload = {
              catalog_kind: catalogKind,
              file_type: values.file_type,
              title: values.title,
              version: values.version,
              process_code: values.process_code,
              process_name: values.process_name,
              product_model: values.product_model,
              project_id: values.project_id,
              release_date: values.release_date,
              file_uuid: fileUuid,
              file_name: fileName,
              change_summary: values.change_summary,
              remarks: values.remarks,
            };
            if (!payload.file_uuid) {
              messageApi.error(t('app.kuaiplm.productionFile.messages.fileRequired'));
              return false;
            }
            if (editing?.id) {
              await productionFileApi.update(editing.id, payload);
            } else {
              await productionFileApi.create(payload);
            }
            messageApi.success(t('common.saveSuccess'));
            setModalOpen(false);
            reload();
            return true;
          } catch (e) {
            messageApi.error(getApiErrorMessage(e));
            return false;
          }
        }}
      >
        <ProFormText name="catalog_kind" hidden />
        <ProFormText name="file_uuid" hidden />
        <ProFormText name="file_name" hidden />
        <ProFormSelect
          name="file_type"
          label={t('app.kuaiplm.productionFile.fields.fileType')}
          options={typeOptions}
          rules={[{ required: true }]}
          colProps={{ span: 12 }}
        />
        <ProFormText
          name="title"
          label={t('app.kuaiplm.productionFile.fields.title')}
          rules={[{ required: true }]}
          colProps={{ span: 12 }}
          fieldProps={{ placeholder: NEW_SHORTCUT_HINT }}
        />
        <ProFormText
          name="version"
          label={t('app.kuaiplm.productionFile.fields.version')}
          rules={[{ required: true }]}
          colProps={{ span: 12 }}
          disabled={Boolean(editing)}
        />
        {isPe ? (
          <>
            <ProFormText
              name="process_code"
              label={t('app.kuaiplm.productionFile.fields.processCode')}
              rules={[{ required: true }]}
              colProps={{ span: 12 }}
            />
            <ProFormText
              name="process_name"
              label={t('app.kuaiplm.productionFile.fields.process')}
              colProps={{ span: 12 }}
            />
            <ProFormText
              name="product_model"
              label={t('app.kuaiplm.productionFile.fields.productModel')}
              rules={[{ required: true }]}
              colProps={{ span: 12 }}
            />
          </>
        ) : (
          <>
            <Phase2ProjectSelect
              name="project_id"
              label={t('app.kuaiplm.productionFile.fields.project')}
              rules={[{ required: true }]}
              colProps={{ span: 12 }}
            />
            <ProFormDatePicker
              name="release_date"
              label={t('app.kuaiplm.productionFile.fields.releaseDate')}
              colProps={{ span: 12 }}
              fieldProps={{ style: { width: '100%' } }}
            />
          </>
        )}
        <ProFormUploadDragger
          name="file_upload"
          label={t('app.kuaiplm.productionFile.fields.file')}
          max={1}
          colProps={{ span: 24 }}
          icon={<InboxOutlined />}
          title={t('app.kuaiplm.productionFile.fields.fileUploadHint')}
          description={t('app.kuaiplm.productionFile.fields.fileUploadSubHint')}
          fieldProps={{
            multiple: false,
            maxCount: 1,
            style: { width: '100%' },
            customRequest: async (options) => {
              try {
                const res = await uploadMultipleFiles([options.file as File], {
                  category: FILE_CATEGORY,
                });
                options.onSuccess?.(res[0], options.file as File);
              } catch (err) {
                options.onError?.(err as Error);
              }
            },
          }}
        />
        <ProFormTextArea
          name="change_summary"
          label={t('app.kuaiplm.productionFile.fields.changeSummary')}
          colProps={{ span: 24 }}
        />
        <ProFormTextArea
          name="remarks"
          label={t('common.remark')}
          colProps={{ span: 24 }}
        />
      </FormModalTemplate>

      <DetailDrawerTemplate
        open={Boolean(detail)}
        onClose={() => {
          setDetail(null);
          setDetailError(null);
        }}
        title={detail?.file_code || t('app.kuaiplm.productionFile.title')}
        loading={detailLoading}
        plainBody={
          detailError ? (
            <Result
              status="error"
              title={t('common.loadFailed')}
              subTitle={detailError}
              extra={
                detail?.id ? (
                  <Button type="primary" onClick={() => void openDetail(detail)}>
                    {t('common.retry')}
                  </Button>
                ) : null
              }
            />
          ) : undefined
        }
        basic={
          detail && !detailError ? (
            <Descriptions
              column={detailDrawerBasicColumn(false)}
              size="small"
              items={detailDrawerDescriptionItems(basicColumns, detail)}
            />
          ) : detailError ? null : (
            <div style={{ minHeight: 80 }} />
          )
        }
        lines={
          detail && !detailError ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {t('app.kuaiplm.productionFile.sections.versions')}
                </div>
                <Table
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={versions}
                  columns={[
                    {
                      title: t('app.kuaiplm.productionFile.fields.version'),
                      dataIndex: 'version',
                      width: 90,
                    },
                    {
                      title: t('common.status'),
                      dataIndex: 'status',
                      width: 100,
                      render: (s: string) => renderDocumentStatusTag(statusLabel(s), s),
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.releaseDate'),
                      dataIndex: 'release_date',
                      width: 120,
                      render: (v) => formatDateBySiteSetting(v) || '—',
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.file'),
                      dataIndex: 'file_name',
                      ellipsis: true,
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.changeSummary'),
                      dataIndex: 'change_summary',
                      ellipsis: true,
                    },
                    {
                      title: t('common.action'),
                      width: 100,
                      render: (_, ver: ProductionFileVersion) =>
                        ver.file_uuid ? (
                          <Button
                            type="link"
                            size="small"
                            onClick={async () => {
                              try {
                                await productionFileApi.recordAccess(detail.id, {
                                  action: 'download',
                                  version_id: ver.id,
                                });
                                messageApi.success(
                                  t('app.kuaiplm.productionFile.messages.downloadLogged'),
                                );
                                await loadDetailExtras(detail.id);
                              } catch (e) {
                                messageApi.error(getApiErrorMessage(e));
                              }
                            }}
                          >
                            {t('app.kuaiplm.productionFile.actions.download')}
                          </Button>
                        ) : (
                          '—'
                        ),
                    },
                  ]}
                />
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {t('app.kuaiplm.productionFile.sections.accessLogs')}
                </div>
                <Table
                  size="small"
                  rowKey="id"
                  pagination={false}
                  dataSource={accessLogs}
                  columns={[
                    {
                      title: t('app.kuaiplm.productionFile.fields.action'),
                      dataIndex: 'action',
                      width: 90,
                      render: (a: string) =>
                        t(`app.kuaiplm.productionFile.accessAction.${a}`, { defaultValue: a }),
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.version'),
                      dataIndex: 'version',
                      width: 90,
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.actor'),
                      dataIndex: 'actor_name',
                      width: 120,
                    },
                    {
                      title: t('app.kuaiplm.productionFile.fields.receivers'),
                      dataIndex: 'receiver_names',
                      ellipsis: true,
                    },
                    {
                      title: t('common.time'),
                      dataIndex: 'created_at',
                      width: 160,
                      render: (v) => formatDateTimeBySiteSetting(v) || '—',
                    },
                  ]}
                />
              </div>
            </>
          ) : null
        }
      />

      <Modal
        title={t('app.kuaiplm.productionFile.actions.issue')}
        open={issueOpen}
        destroyOnHidden
        onCancel={() => setIssueOpen(false)}
        onOk={async () => {
          if (!issueRow || !receiverNames.trim()) {
            messageApi.error(t('app.kuaiplm.productionFile.messages.receiverRequired'));
            return;
          }
          try {
            await productionFileApi.issue(issueRow.id, {
              receiver_names: receiverNames.trim(),
            });
            messageApi.success(t('app.kuaiplm.productionFile.messages.issueSuccess'));
            setIssueOpen(false);
            reload();
          } catch (e) {
            messageApi.error(getApiErrorMessage(e));
          }
        }}
      >
        <Input.TextArea
          rows={3}
          value={receiverNames}
          onChange={(e) => setReceiverNames(e.target.value)}
          placeholder={t('app.kuaiplm.productionFile.fields.receiversPlaceholder')}
        />
      </Modal>
    </>
  );
};

export default ProductionFilesPage;
