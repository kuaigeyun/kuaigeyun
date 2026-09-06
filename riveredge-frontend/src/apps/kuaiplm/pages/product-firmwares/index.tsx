/**
 * 产品固件列表（R-15 #28）
 */

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import type { ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ActionType,
  ProFormDatePicker,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
  ProFormUploadDragger,
} from '@ant-design/pro-components';
import { App, Alert, Button, Descriptions, Result } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { UniTable } from '../../../../components/uni-table';
import { rowActionKind } from '../../../../components/uni-action';
import {
  DetailDrawerTemplate,
  FormModalTemplate,
  ListPageTemplate,
  detailDrawerBasicColumn,
} from '../../../../components/layout-templates';
import { detailDrawerDescriptionItems } from '../../../../components/layout-templates/detailDrawerDescriptionItems';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { getApiErrorMessage } from '../../../../utils/errorHandler';
import { formatDateBySiteSetting, todaySiteDateString } from '../../../../utils/format';
import { downloadRecordsAsXlsx, type ExportXlsxColumn } from '../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../utils/fetchAllListPages';
import { renderDocumentStatusTag } from '../../../../utils/documentLifecycleStatusTag';
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
  productFirmwareApi,
  type ProductFirmware,
  type ProductFirmwareStatus,
} from '../../services/product-firmware';

const RESOURCE = 'kuaiplm:product-firmware';
const FIRMWARE_FILE_CATEGORY = 'product_firmware';

const FIRMWARE_EXPORT_COLUMNS: ExportXlsxColumn[] = [
  { key: 'firmware_code', title: '固件单号' },
  { key: 'project_code', title: '项目代号' },
  { key: 'project_name', title: '项目名称' },
  { key: 'version', title: '版本' },
  { key: 'title', title: '标题' },
  { key: 'release_date', title: '发布日期' },
  { key: 'status_label', title: '状态' },
  { key: 'file_name', title: '文件名' },
  { key: 'created_by_name', title: '创建人' },
  { key: 'updated_by_name', title: '更新人' },
  { key: 'created_at', title: '创建时间' },
  { key: 'updated_at', title: '更新时间' },
];
const STATUS_KEYS: ProductFirmwareStatus[] = [
  'draft',
  'pending',
  'approved',
  'released',
  'obsolete',
];

const ProductFirmwaresPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const [searchParams] = useSearchParams();
  const filterProjectId = searchParams.get('project_id')
    ? Number(searchParams.get('project_id'))
    : undefined;

  const actionRef = useRef<ActionType>(null);
  const tableRowsRef = useRef<ProductFirmware[]>([]);
  const formRef = useRef<ProFormInstance | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductFirmware | null>(null);
  const [detail, setDetail] = useState<ProductFirmware | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const reload = useCallback(() => actionRef.current?.reload(), []);
  const openCreate = useCallback(() => {
    setEditing(null);
    setModalOpen(true);
  }, []);

  const statusLabel = useCallback(
    (s: string) => t(`app.kuaiplm.productFirmware.status.${s}`, { defaultValue: s }),
    [t],
  );

  const openDetail = useCallback(async (row: ProductFirmware) => {
    if (!row.id) return;
    setDetailLoading(true);
    setDetailError(null);
    setDetail(row);
    try {
      const full = await productFirmwareApi.get(row.id);
      setDetail(full);
    } catch (e) {
      setDetailError(getApiErrorMessage(e));
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const columns = useMemo<ProColumns<ProductFirmware>[]>(() => {
    const cols: ProColumns<ProductFirmware>[] = [
      {
        title: t('app.kuaiplm.productFirmware.fields.code'),
        dataIndex: 'firmware_code',
        key: 'document_code',
        width: 140,
        copyable: true,
        uniTableKeepWidth: true,
      },
      {
        title: t('app.kuaiplm.productFirmware.fields.project'),
        dataIndex: 'project_name',
        key: 'project_name',
        width: 180,
        ellipsis: true,
        render: (_, r) => `${r.project_name || ''} (${r.project_code || ''})`,
      },
      {
        title: t('app.kuaiplm.productFirmware.fields.version'),
        dataIndex: 'version',
        key: 'version',
        width: 100,
        uniTableKeepWidth: true,
      },
      {
        title: t('app.kuaiplm.productFirmware.fields.title'),
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        uniTableRemainderFlex: true,
      },
      {
        title: t('app.kuaiplm.productFirmware.fields.releaseDate'),
        dataIndex: 'release_date',
        key: 'business_date',
        width: 120,
        uniTableKeepWidth: true,
        render: (_, r) => formatDateBySiteSetting(r.release_date) || '—',
      },
      {
        ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
        title: t('common.status'),
        dataIndex: 'status',
        key: 'lifecycle',
        fixed: 'right',
        valueEnum: Object.fromEntries(
          STATUS_KEYS.map((k) => [k, { text: statusLabel(k) }]),
        ),
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
          if (row.status === 'draft' && perms.canUpdate) {
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
          if (row.status === 'draft' && perms.canAction?.('submit') && row.id) {
            actions.push(
              <Button
                key="submit"
                type="link"
                size="small"
                {...rowActionKind('submit')}
                onClick={async () => {
                  try {
                    await productFirmwareApi.submit(row.id!);
                    messageApi.success(t('app.kuaiplm.productFirmware.messages.submitSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'pending' && perms.canAction?.('approve') && row.id) {
            actions.push(
              <Button
                key="approve"
                type="link"
                size="small"
                {...rowActionKind('approve')}
                onClick={async () => {
                  try {
                    await productFirmwareApi.approve(row.id!);
                    messageApi.success(t('app.kuaiplm.productFirmware.messages.approveSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'pending' && perms.canAction?.('reject') && row.id) {
            actions.push(
              <Button
                key="reject"
                type="link"
                size="small"
                {...rowActionKind('reject')}
                onClick={async () => {
                  try {
                    await productFirmwareApi.reject(row.id!);
                    messageApi.success(t('app.kuaiplm.productFirmware.messages.rejectSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          if (row.status === 'approved' && perms.canAction?.('execute') && row.id) {
            actions.push(
              <Button
                key="release"
                type="link"
                size="small"
                {...rowActionKind('execute')}
                onClick={async () => {
                  try {
                    await productFirmwareApi.release(row.id!);
                    messageApi.success(t('app.kuaiplm.productFirmware.messages.releaseSuccess'));
                    reload();
                  } catch (e) {
                    messageApi.error(getApiErrorMessage(e));
                  }
                }}
              />,
            );
          }
          return actions;
        },
      },
    ];
    return cols;
  }, [t, statusLabel, openDetail, perms, messageApi, reload]);

  const basicColumns = useMemo(() => {
    const cols: ProDescriptionsItemProps<ProductFirmware>[] = [
      {
        key: 'document_code',
        title: t('app.kuaiplm.productFirmware.fields.code'),
        dataIndex: 'firmware_code',
      },
      {
        key: 'project_name',
        title: t('app.kuaiplm.productFirmware.fields.project'),
        dataIndex: 'project_name',
        render: (_, r) => `${r.project_name || ''} (${r.project_code || ''})`,
      },
      {
        key: 'version',
        title: t('app.kuaiplm.productFirmware.fields.version'),
        dataIndex: 'version',
      },
      {
        key: 'title',
        title: t('app.kuaiplm.productFirmware.fields.title'),
        dataIndex: 'title',
      },
      {
        key: 'business_date',
        title: t('app.kuaiplm.productFirmware.fields.releaseDate'),
        dataIndex: 'release_date',
        render: (_, r) => formatDateBySiteSetting(r.release_date) || '—',
      },
      {
        key: 'lifecycle',
        title: t('common.status'),
        dataIndex: 'status',
        render: (_, r) => renderDocumentStatusTag(statusLabel(r.status), r.status),
      },
      {
        key: 'file_name',
        title: t('app.kuaiplm.productFirmware.fields.file'),
        dataIndex: 'file_name',
        render: (_, r) => r.file_name || r.file_uuid || '—',
      },
      {
        key: 'change_summary',
        title: t('app.kuaiplm.productFirmware.fields.changeSummary'),
        dataIndex: 'change_summary',
      },
      {
        key: 'updated_at',
        title: t('common.updatedAt'),
        dataIndex: 'updated_at',
      },
    ];
    return alignDescriptionColumns(cols as ProDescriptionsItemProps<Record<string, unknown>>[], GLOBAL_DOC_DETAIL_BASIC_FIELD_RANK);
  }, [t, statusLabel]);

  return (
    <ListPageTemplate>
      {filterProjectId ? (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 12 }}
          title={t('app.kuaiplm.phase2.common.projectFilterHint', { id: filterProjectId })}
        />
      ) : null}
      <UniTable<ProductFirmware>
        headerTitle={t('app.kuaiplm.productFirmware.title')}
        actionRef={actionRef}
        rowKey="uuid"
        permissionResource={RESOURCE}
        enableRowSelection
        selectedRowKeys={selectedRowKeys}
        onRowSelectionChange={setSelectedRowKeys}
        onTableDataChange={(rows) => {
          tableRowsRef.current = rows;
        }}
        columns={alignProColumns(columns, GLOBAL_DOC_LIST_FIELD_RANK)}
        columnPersistenceId="apps.kuaiplm.pages.product-firmwares.v1"
        showCreateButton={perms.canCreate}
        createButtonText={t('app.kuaiplm.productFirmware.createButton') + NEW_SHORTCUT_HINT}
        onCreate={openCreate}
        showDeleteButton={perms.canDelete}
        onDelete={async (keys) => {
          const rows = tableRowsRef.current.filter((r) => keys.includes(r.uuid));
          const drafts = rows.filter((r) => r.status === 'draft' && r.id);
          if (!drafts.length) {
            messageApi.warning(t('app.kuaiplm.productFirmware.messages.deleteOnlyDraft'));
            return;
          }
          await Promise.all(drafts.map((r) => productFirmwareApi.remove(r.id!)));
          messageApi.success(t('common.deleteSuccess'));
          setSelectedRowKeys([]);
          reload();
        }}
        showExportButton={perms.canExport}
        onExport={async (type, keys, pageData) => {
          try {
            let items =
              type === 'currentPage' && pageData?.length
                ? (pageData as ProductFirmware[])
                : await fetchAllListItems((p) =>
                    productFirmwareApi.list({
                      ...p,
                      project_id: filterProjectId,
                    }),
                  );
            if (type === 'selected' && keys?.length) {
              items = items.filter((d) => d.uuid != null && keys.includes(d.uuid));
            }
            if (items.length === 0) {
              messageApi.warning(t('app.kuaiplm.productFirmware.messages.noExportData'));
              return;
            }
            const rows = items.map((r) => ({
              ...r,
              status_label: statusLabel(r.status),
            }));
            await downloadRecordsAsXlsx(
              rows as Array<Record<string, unknown>>,
              `product-firmwares-${todaySiteDateString()}.xlsx`,
              { columns: FIRMWARE_EXPORT_COLUMNS, sheetName: '产品固件' },
            );
            messageApi.success(t('common.exportSuccess', { count: items.length }));
          } catch (err) {
            messageApi.error(getApiErrorMessage(err, t('common.exportFailed')));
          }
        }}
        request={async (params) => {
          const res = await productFirmwareApi.list({
            skip: ((params.current || 1) - 1) * (params.pageSize || 20),
            limit: params.pageSize || 20,
            status: params.status as string | undefined,
            keyword: (params.keyword || params.title) as string | undefined,
            project_id: filterProjectId,
          });
          return { data: res.items, total: res.total, success: true };
        }}
      />

      <FormModalTemplate
        key={editing?.uuid ?? 'create'}
        title={editing ? t('common.edit') : t('common.create')}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        formRef={formRef}
        grid
        initialValues={
          editing
            ? {
                project_id: editing.project_id,
                version: editing.version,
                title: editing.title,
                release_date: editing.release_date,
                file_uuid: editing.file_uuid,
                file_name: editing.file_name,
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
                change_summary: editing.change_summary,
                remarks: editing.remarks,
              }
            : filterProjectId
              ? { project_id: filterProjectId, file_upload: [] }
              : { file_upload: [] }
        }
        onFinish={async (values) => {
          try {
            const uploadList = Array.isArray(values.file_upload) ? values.file_upload : [];
            const done = uploadList.find((f: { status?: string }) => f.status === 'done' || !f.status);
            const response = done?.response;
            const fileUuid =
              (typeof response === 'object' && response?.uuid) ||
              done?.uid ||
              values.file_uuid ||
              null;
            const fileName =
              (typeof response === 'object' &&
                (response.original_name || response.name)) ||
              done?.name ||
              values.file_name ||
              null;
            const payload = {
              project_id: Number(values.project_id),
              version: String(values.version || '').trim(),
              title: String(values.title || '').trim(),
              release_date: values.release_date || null,
              file_uuid: fileUuid,
              file_name: fileName,
              change_summary: values.change_summary || null,
              remarks: values.remarks || null,
            };
            if (editing?.id) {
              await productFirmwareApi.update(editing.id, payload);
            } else {
              await productFirmwareApi.create(payload);
            }
            messageApi.success(t('common.saveSuccess'));
            setModalOpen(false);
            setEditing(null);
            reload();
          } catch (e) {
            messageApi.error(getApiErrorMessage(e));
            throw e;
          }
        }}
      >
        <Phase2ProjectSelect
          name="project_id"
          label={t('app.kuaiplm.productFirmware.fields.project')}
          rules={[{ required: true }]}
          disabled={!!editing}
          colProps={{ span: 12 }}
        />
        <ProFormText
          name="version"
          label={t('app.kuaiplm.productFirmware.fields.version')}
          rules={[{ required: true }]}
          colProps={{ span: 12 }}
        />
        <ProFormText
          name="title"
          label={t('app.kuaiplm.productFirmware.fields.title')}
          rules={[{ required: true }]}
          colProps={{ span: 24 }}
        />
        <ProFormDatePicker
          name="release_date"
          label={t('app.kuaiplm.productFirmware.fields.releaseDate')}
          colProps={{ span: 12 }}
          fieldProps={{ style: { width: '100%' } }}
        />
        <ProFormUploadDragger
          name="file_upload"
          label={t('app.kuaiplm.productFirmware.fields.file')}
          max={1}
          colProps={{ span: 24 }}
          icon={<InboxOutlined />}
          title={t('app.kuaiplm.productFirmware.fields.fileUploadHint')}
          description={t('app.kuaiplm.productFirmware.fields.fileUploadSubHint')}
          rules={[]}
          fieldProps={{
            multiple: false,
            maxCount: 1,
            style: { width: '100%' },
            customRequest: async (options) => {
              try {
                const res = await uploadMultipleFiles([options.file as File], {
                  category: FIRMWARE_FILE_CATEGORY,
                });
                options.onSuccess?.(res[0], options.file as any);
              } catch (err) {
                options.onError?.(err as Error);
              }
            },
          }}
        />
        <ProFormTextArea
          name="change_summary"
          label={t('app.kuaiplm.productFirmware.fields.changeSummary')}
          colProps={{ span: 24 }}
        />
        <ProFormTextArea name="remarks" label={t('common.remark')} colProps={{ span: 24 }} />
      </FormModalTemplate>

      <DetailDrawerTemplate
        open={!!detail}
        onClose={() => {
          setDetail(null);
          setDetailError(null);
        }}
        title={detail?.firmware_code || t('app.kuaiplm.productFirmware.title')}
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
      />
    </ListPageTemplate>
  );
};

export default ProductFirmwaresPage;
