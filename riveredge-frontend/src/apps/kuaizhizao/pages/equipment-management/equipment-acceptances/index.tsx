/**
 * 设备工装验收目录与履历（R-10 WP-10.3）
 */

import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Button, Col, Input, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import DocumentAttachmentsField from '../../../components/DocumentAttachmentsField';
import { mapAttachmentsToUploadList, normalizeDocumentAttachments } from '../../../utils/documentAttachments';
import { ListPageTemplate, FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { UniTable } from '../../../../../components/uni-table';
import { UniTableStackedPrimaryCell } from '../../../../../components/uni-table/stackedPrimaryColumn';
import { rowActionKind } from '../../../../../components/uni-action';
import { ActionConfirmPopconfirm } from '../../../../../components/action-confirm';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import { useNewShortcut } from '../../../../../hooks/useNewShortcut';
import { withSingleNewShortcutHint } from '../../../../../utils/globalNewShortcut';
import { renderDocumentStatusTag } from '../../../../../utils/documentLifecycleStatusTag';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../../utils/uniTableLayoutColumns';
import { formDateFormItemProps, formDateRangeFormItemProps, toApiDateString, toApiDateTimeString } from '../../../../../utils/formDate';
import { todaySiteDateString } from '../../../../../utils/format';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../utils/fetchAllListPages';
import { alignProColumns, SALES_DOC_LIST_FIELD_RANK } from '../../sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../shared/documentAuditColumns';
import {
  APPROVAL_DOC_PINNED_STATUS_FIELD,
  buildApprovalDocStatusValueEnum,
  normalizeEquipmentListResponse,
  resolveApprovalDocListParams,
} from '../../../utils/equipmentListCore';
import { EQUIPMENT_DATE_FIELD_PROPS } from '../../../utils/equipmentFormFieldProps';
import {
  EquipmentMasterDetailDrawer,
  buildDetailDrawerEditExtra,
  useEquipmentDetailDrawer,
} from '../shared/equipmentMasterDataDetail';
import { equipmentApi, toolApi } from '../../../services/equipment';
import { equipmentAcceptanceApi } from '../../../services/equipmentAcceptance';

const P = 'app.kuaizhizao.equipmentAcceptance';
const RESOURCE = 'kuaizhizao:equipment-acceptance';

interface EquipmentAcceptanceRow {
  id?: number;
  acceptance_no?: string;
  target_type?: string;
  target_id?: number;
  target_code?: string;
  target_name?: string;
  category?: string;
  due_date?: string;
  accepted_at?: string;
  result?: string;
  exception_problem?: string;
  solution?: string;
  handled_at?: string;
  applicant_name?: string;
  status?: string;
  reject_reason?: string;
  attachments?: Array<{ uid?: string; name?: string; url?: string }>;
  remark?: string;
  updated_at?: string;
}

const EquipmentAcceptancesPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const canAudit = perms.canAction?.('approve') ?? false;
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState<EquipmentAcceptanceRow | null>(null);
  const [targetOptions, setTargetOptions] = useState<{ label: string; value: number }[]>([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<EquipmentAcceptanceRow | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const { open: detailVisible, loading: detailLoading, detail, openDetail, closeDetail } =
    useEquipmentDetailDrawer<EquipmentAcceptanceRow>();

  const loadTargetOptions = async (targetType: string) => {
    if (targetType === 'tool') {
      const res = await toolApi.list({ limit: 1000 });
      setTargetOptions(
        (res.items ?? []).map((row: { id: number; code: string; name: string }) => ({
          label: `${row.code} - ${row.name}`,
          value: row.id,
        })),
      );
      return;
    }
    const res = await equipmentApi.list({ limit: 1000 });
    setTargetOptions(
      (res.items ?? []).map((row: { id: number; code: string; name: string }) => ({
        label: `${row.code} - ${row.name}`,
        value: row.id,
      })),
    );
  };

  const handleCreate = () => {
    setIsEdit(false);
    setCurrent(null);
    setModalVisible(true);
    void loadTargetOptions('equipment');
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({
      target_type: 'equipment',
      due_date: dayjs(todaySiteDateString()).add(7, 'day'),
      result: '合格',
    });
  };
  useNewShortcut(handleCreate);

  const handleDetail = (record: EquipmentAcceptanceRow) => {
    if (!record.id) return;
    void openDetail(
      () => equipmentAcceptanceApi.get(record.id!) as Promise<EquipmentAcceptanceRow>,
      t(`${P}.listFailed`),
    );
  };

  const handleEdit = async (record: EquipmentAcceptanceRow) => {
    if (!record.id) return;
    const detailRow = (await equipmentAcceptanceApi.get(record.id)) as EquipmentAcceptanceRow;
    setIsEdit(true);
    setCurrent(detailRow);
    setModalVisible(true);
    await loadTargetOptions(detailRow.target_type || 'equipment');
    formRef.current?.setFieldsValue({
      target_type: detailRow.target_type,
      target_id: detailRow.target_id,
      category: detailRow.category,
      due_date: detailRow.due_date ? dayjs(detailRow.due_date) : null,
      accepted_at: detailRow.accepted_at ? dayjs(detailRow.accepted_at) : null,
      result: detailRow.result,
      exception_problem: detailRow.exception_problem,
      solution: detailRow.solution,
      handled_at: detailRow.handled_at ? dayjs(detailRow.handled_at) : null,
      attachments: mapAttachmentsToUploadList(detailRow.attachments),
      remark: detailRow.remark,
    });
  };

  const executeDelete = async (keys: React.Key[]) => {
    for (const id of keys) {
      await equipmentAcceptanceApi.delete(Number(id));
    }
    messageApi.success(t('common.batchDeleteSuccess', { count: keys.length }));
    actionRef.current?.reload();
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const payload = {
      target_type: values.target_type,
      target_id: values.target_id,
      category: values.category,
      due_date: toApiDateString(values.due_date),
      accepted_at: toApiDateString(values.accepted_at) ?? null,
      result: values.result,
      exception_problem: values.exception_problem,
      solution: values.solution,
      handled_at: toApiDateTimeString(values.handled_at) ?? null,
      attachments: normalizeDocumentAttachments(values.attachments),
      remark: values.remark,
    };
    if (isEdit && current?.id) {
      const { target_type: _tt, target_id: _ti, ...updatePayload } = payload;
      await equipmentAcceptanceApi.update(current.id, updatePayload);
      messageApi.success(t('common.updateSuccess'));
    } else {
      await equipmentAcceptanceApi.create(payload);
      messageApi.success(t('common.createSuccess'));
    }
    setModalVisible(false);
    actionRef.current?.reload();
  };

  const handleSubmitDoc = async (record: EquipmentAcceptanceRow) => {
    if (!record.id) return;
    await equipmentAcceptanceApi.submit(record.id);
    messageApi.success(t(`${P}.submitSuccess`));
    actionRef.current?.reload();
  };

  const handleApprove = async (record: EquipmentAcceptanceRow) => {
    if (!record.id) return;
    await equipmentAcceptanceApi.approve(record.id);
    messageApi.success(t(`${P}.approveSuccess`));
    actionRef.current?.reload();
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget?.id || !rejectReason.trim()) return;
    await equipmentAcceptanceApi.reject(rejectTarget.id, { reject_reason: rejectReason });
    messageApi.success(t(`${P}.rejectSuccess`));
    setRejectModalVisible(false);
    setRejectTarget(null);
    setRejectReason('');
    actionRef.current?.reload();
  };

  const approvalStatusValueEnum = useMemo(() => buildApprovalDocStatusValueEnum(), []);

  const detailColumns: ProDescriptionsItemProps<EquipmentAcceptanceRow>[] = useMemo(
    () => [
      { title: t(`${P}.col.acceptanceNo`), dataIndex: 'acceptance_no' },
      {
        title: t(`${P}.col.targetType`),
        dataIndex: 'target_type',
        render: (_, r) =>
          r.target_type === 'tool'
            ? t(`${P}.targetType.tool`)
            : t(`${P}.targetType.equipment`),
      },
      { title: t(`${P}.col.target`), dataIndex: 'target_name' },
      { title: t(`${P}.col.category`), dataIndex: 'category' },
      { title: t(`${P}.col.dueDate`), dataIndex: 'due_date', valueType: 'date' },
      { title: t(`${P}.col.acceptedAt`), dataIndex: 'accepted_at', valueType: 'date' },
      { title: t(`${P}.col.result`), dataIndex: 'result' },
      { title: t(`${P}.col.exceptionProblem`), dataIndex: 'exception_problem', span: 2 },
      { title: t(`${P}.col.solution`), dataIndex: 'solution', span: 2 },
      { title: t(`${P}.col.handledAt`), dataIndex: 'handled_at', valueType: 'dateTime' },
      { title: t(`${P}.col.applicant`), dataIndex: 'applicant_name' },
      {
        title: t('common.status'),
        dataIndex: 'status',
        render: (_, r) => renderDocumentStatusTag(r.status ?? '-', r.status ?? '-'),
      },
      { title: t(`${P}.form.rejectReason`), dataIndex: 'reject_reason', span: 2 },
      { title: t('common.remark'), dataIndex: 'remark', span: 2 },
    ],
    [t],
  );

  const columns: ProColumns<EquipmentAcceptanceRow>[] = useMemo(
    () =>
      alignProColumns<EquipmentAcceptanceRow>(
        [
          {
            title: t(`${P}.col.dueDate`),
            dataIndex: 'due_date_range',
            valueType: 'dateRange',
            hideInTable: true,
            formItemProps: formDateRangeFormItemProps,
            search: { order: 10 } as ProColumns['search'],
          },
          {
            title: t('common.updatedAt'),
            dataIndex: 'updated_at_range',
            valueType: 'dateRange',
            hideInTable: true,
            formItemProps: formDateRangeFormItemProps,
            search: { order: 11 } as ProColumns['search'],
          },
          {
            title: t('common.status'),
            dataIndex: 'status',
            valueType: 'select',
            valueEnum: approvalStatusValueEnum,
            hideInTable: true,
            search: { order: 20 } as ProColumns['search'],
          },
          {
            title: t(`${P}.col.targetType`),
            dataIndex: 'target_type',
            valueType: 'select',
            valueEnum: {
              equipment: { text: t(`${P}.targetType.equipment`) },
              tool: { text: t(`${P}.targetType.tool`) },
            },
            hideInTable: true,
            search: { order: 21 } as ProColumns['search'],
          },
          {
            title: t(`${P}.col.category`),
            dataIndex: 'category',
            hideInTable: true,
            search: { order: 22 } as ProColumns['search'],
          },
          {
            title: t(`${P}.col.nameCode`),
            dataIndex: 'acceptance_no',
            minWidth: 200,
            uniTablePrimaryFlex: true,
            uniTableRemainderFlex: true,
            resizable: false,
            ellipsis: false,
            fixed: 'left',
            sorter: true,
            search: { order: 30 } as ProColumns['search'],
            render: (_, r) => (
              <UniTableStackedPrimaryCell
                primary={String(r.target_name ?? '') || '-'}
                secondary={String(r.acceptance_no ?? '') || '-'}
              />
            ),
          },
          {
            title: t(`${P}.col.targetType`),
            dataIndex: 'target_type',
            width: 100,
            minWidth: 100,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) =>
              r.target_type === 'tool'
                ? t(`${P}.targetType.tool`)
                : t(`${P}.targetType.equipment`),
          },
          {
            title: t(`${P}.col.category`),
            dataIndex: 'category',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) => (r.category ? String(r.category) : '-'),
          },
          {
            title: t(`${P}.col.dueDate`),
            dataIndex: 'due_date',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            sorter: true,
            hideInSearch: true,
            valueType: 'date',
          },
          {
            title: t(`${P}.col.result`),
            dataIndex: 'result',
            ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
            hideInSearch: true,
            render: (_, r) => {
              if (!r.result) return '-';
              const color =
                r.result === '合格' ? 'success' : r.result === '延期异常' ? 'warning' : 'error';
              return <MarkerTag color={color}>{r.result}</MarkerTag>;
            },
          },
          {
            title: t(`${P}.col.applicant`),
            dataIndex: 'applicant_name',
            width: 100,
            minWidth: 100,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) => (r.applicant_name ? String(r.applicant_name) : '-'),
          },
          ...buildDocumentAuditColumns<Record<string, unknown>>(t),
          {
            title: t('common.status'),
            key: 'lifecycle',
            dataIndex: 'status',
            hideInSearch: true,
            fixed: 'right',
            render: (_, r) => renderDocumentStatusTag(r.status ?? '-', r.status ?? '-'),
          },
          {
            title: t('common.actions'),
            key: 'option',
            fixed: 'right',
            hideInSearch: true,
            render: (_, record) => (
              <>
                <Button
                  {...rowActionKind('read')}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetail(record);
                  }}
                >
                  {t('common.detail')}
                </Button>
                {perms.canUpdate && record.status === '草稿' && (
                  <Button
                    {...rowActionKind('update')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleEdit(record);
                    }}
                  >
                    {t('common.edit')}
                  </Button>
                )}
                {perms.canAction?.('submit') && record.status === '草稿' && (
                  <Button
                    {...rowActionKind('submit')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleSubmitDoc(record);
                    }}
                  >
                    {t('common.submit')}
                  </Button>
                )}
                {canAudit && record.status === '已提交' && (
                  <Button
                    {...rowActionKind('approve')}
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleApprove(record);
                    }}
                  >
                    {t(`${P}.action.approve`)}
                  </Button>
                )}
                {canAudit && record.status === '已提交' && (
                  <Button
                    {...rowActionKind('reject')}
                    danger
                    onClick={(e) => {
                      e.stopPropagation();
                      setRejectTarget(record);
                      setRejectReason('');
                      setRejectModalVisible(true);
                    }}
                  >
                    {t(`${P}.action.reject`)}
                  </Button>
                )}
                {perms.canDelete && (record.status === '草稿' || record.status === '已驳回') && (
                  <ActionConfirmPopconfirm
                    title={t('common.deleteTitle')}
                    onConfirm={() => record.id && void executeDelete([record.id])}
                  >
                    <Button {...rowActionKind('delete')} danger onClick={(e) => e.stopPropagation()}>
                      {t('common.delete')}
                    </Button>
                  </ActionConfirmPopconfirm>
                )}
              </>
            ),
          },
        ],
        SALES_DOC_LIST_FIELD_RANK,
      ),
    [t, perms, canAudit, approvalStatusValueEnum],
  );

  return (
    <>
      <ListPageTemplate>
        <UniTable<EquipmentAcceptanceRow>
          headerTitle={t(`${P}.title`)}
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.equipment-acceptances-r10-v1"
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          showAdvancedSearch
          pinnedTabsField={APPROVAL_DOC_PINNED_STATUS_FIELD}
          skipFuzzyPinyinClientFilter
          permissionResource={RESOURCE}
          request={async (params, sort, _filter, searchFormValues) => {
            try {
              const listParams = resolveApprovalDocListParams(searchFormValues, sort, {
                docDateRangeKeys: ['due_date_range', 'dueDateRange'],
                docDateParamPrefix: 'due',
              });
              const res = await equipmentAcceptanceApi.list({
                skip: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
                limit: params.pageSize,
                target_type: searchFormValues?.target_type,
                category: searchFormValues?.category,
                ...listParams,
              });
              const { data, total } = normalizeEquipmentListResponse(res);
              return { data: data as EquipmentAcceptanceRow[], success: true, total };
            } catch {
              messageApi.error(t(`${P}.listFailed`));
              return { data: [], success: false, total: 0 };
            }
          }}
          showCreateButton={perms.canCreate}
          createButtonText={withSingleNewShortcutHint(t(`${P}.create`))}
          onCreate={handleCreate}
          showDeleteButton={perms.canDelete}
          deleteConfirmTitle={t('common.batchDeleteTitle')}
          deleteConfirmDescription={(count) => t('common.batchDeleteContent', { count })}
          onDelete={executeDelete}
          enableRowSelection={perms.canDelete}
          showExportButton={perms.canExport}
          onExport={async (type, keys, pageData) => {
            try {
              let items: EquipmentAcceptanceRow[] =
                type === 'currentPage' && pageData?.length
                  ? (pageData as EquipmentAcceptanceRow[])
                  : ((await fetchAllListItems((p) => equipmentAcceptanceApi.list(p))) as EquipmentAcceptanceRow[]);
              if (type === 'selected' && keys?.length) {
                items = items.filter((d) => d.id != null && keys.includes(d.id));
              }
              if (!items.length) {
                messageApi.warning(t('common.noDataToExport'));
                return;
              }
              await downloadRecordsAsXlsx(
                items as Array<Record<string, unknown>>,
                `equipment-acceptances-${todaySiteDateString()}.xlsx`,
                {
                  columns: [
                    { key: 'acceptance_no', title: t(`${P}.col.acceptanceNo`) },
                    { key: 'target_type', title: t(`${P}.col.targetType`) },
                    { key: 'target_code', title: t(`${P}.col.targetCode`) },
                    { key: 'target_name', title: t(`${P}.col.target`) },
                    { key: 'category', title: t(`${P}.col.category`) },
                    { key: 'due_date', title: t(`${P}.col.dueDate`) },
                    { key: 'accepted_at', title: t(`${P}.col.acceptedAt`) },
                    { key: 'result', title: t(`${P}.col.result`) },
                    { key: 'status', title: t('common.status') },
                    { key: 'exception_problem', title: t(`${P}.col.exceptionProblem`) },
                    { key: 'solution', title: t(`${P}.col.solution`) },
                  ],
                  sheetName: t(`${P}.title`),
                },
              );
              messageApi.success(t('common.exportCountSuccess', { count: items.length }));
            } catch (error: any) {
              messageApi.error(error?.message || t('common.exportFailed'));
            }
          }}
        />
      </ListPageTemplate>

      <EquipmentMasterDetailDrawer
        open={detailVisible}
        loading={detailLoading}
        detail={detail}
        title={`${t('common.detail')}${detail?.acceptance_no ? ` - ${detail.acceptance_no}` : ''}`}
        onClose={closeDetail}
        basicColumns={detailColumns}
        extra={buildDetailDrawerEditExtra(
          t,
          Boolean(detail && perms.canUpdate && detail.status === '草稿'),
          () => {
            if (!detail) return;
            closeDetail();
            void handleEdit(detail);
          },
        )}
      />

      <FormModalTemplate
        title={isEdit ? t(`${P}.editModal`) : t(`${P}.createModal`)}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onFinish={handleSubmit}
        isEdit={isEdit}
        width={MODAL_CONFIG.LARGE_WIDTH}
        formRef={formRef}
        grid={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <ProFormSelect
              name="target_type"
              label={t(`${P}.col.targetType`)}
              options={[
                { label: t(`${P}.targetType.equipment`), value: 'equipment' },
                { label: t(`${P}.targetType.tool`), value: 'tool' },
              ]}
              rules={[{ required: true }]}
              disabled={isEdit}
              fieldProps={{
                onChange: (v: string) => {
                  formRef.current?.setFieldsValue({ target_id: undefined });
                  void loadTargetOptions(v);
                },
              }}
            />
          </Col>
          <Col span={12}>
            <ProFormDependency name={['target_type']}>
              {() => (
                <ProFormSelect
                  name="target_id"
                  label={t(`${P}.col.target`)}
                  options={targetOptions}
                  rules={[{ required: true }]}
                  showSearch
                  disabled={isEdit}
                />
              )}
            </ProFormDependency>
          </Col>
          <Col span={12}>
            <ProFormText name="category" label={t(`${P}.col.category`)} />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="due_date"
              label={t(`${P}.col.dueDate`)}
              rules={[{ required: true, message: t(`${P}.rule.dueDateRequired`) }]}
              formItemProps={formDateFormItemProps}
              fieldProps={{ ...EQUIPMENT_DATE_FIELD_PROPS, style: { width: '100%' } }}
            />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="accepted_at"
              label={t(`${P}.col.acceptedAt`)}
              formItemProps={formDateFormItemProps}
              fieldProps={{ ...EQUIPMENT_DATE_FIELD_PROPS, style: { width: '100%' } }}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="result"
              label={t(`${P}.col.result`)}
              options={[
                { label: t(`${P}.result.pass`), value: '合格' },
                { label: t(`${P}.result.fail`), value: '不合格' },
                { label: t(`${P}.result.delayed`), value: '延期异常' },
              ]}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea
              name="exception_problem"
              label={t(`${P}.col.exceptionProblem`)}
              fieldProps={{ rows: 2 }}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="solution" label={t(`${P}.col.solution`)} fieldProps={{ rows: 2 }} />
          </Col>
          <Col span={12}>
            <ProFormDateTimePicker
              name="handled_at"
              label={t(`${P}.col.handledAt`)}
              fieldProps={{ style: { width: '100%' } }}
            />
          </Col>
          <Col span={24}>
            <DocumentAttachmentsField
              name="attachments"
              category="equipment_acceptance_attachments"
              label={t(`${P}.col.attachments`)}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="remark" label={t('common.remark')} fieldProps={{ rows: 2 }} />
          </Col>
        </Row>
      </FormModalTemplate>

      <Modal
        title={t(`${P}.rejectModal`)}
        open={rejectModalVisible}
        onOk={() => void handleRejectConfirm()}
        onCancel={() => setRejectModalVisible(false)}
        destroyOnHidden
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder={t(`${P}.form.rejectReason`)}
        />
      </Modal>
    </>
  );
};

export default EquipmentAcceptancesPage;
