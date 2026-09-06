import React, { useRef, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionType,
  ProColumns,
  ProDescriptionsItemProps,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App, Row, Col, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { UniTable } from '../../../../../components/uni-table';
import { ListPageTemplate, FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { FormListDetailTable } from '../../../../../components/form-list-detail-table';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import { useNewShortcut } from '../../../../../hooks/useNewShortcut';
import { withSingleNewShortcutHint } from '../../../../../utils/globalNewShortcut';
import { EquipmentPersonSelect, resolveUserUuidById } from '../../../components/EquipmentPersonSelect';
import { inspectionItemsApi, inspectionSchemesApi } from '../../../services/equipmentOps';
import { formDateRangeFormItemProps } from '../../../../../utils/formDate';
import { alignProColumns, SALES_DOC_LIST_FIELD_RANK } from '../../sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../shared/documentAuditColumns';
import {
  MASTER_DATA_PINNED_ACTIVE_FIELD,
  buildActiveStatusValueEnum,
  normalizeEquipmentListResponse,
  resolveMasterDataListParams,
} from '../../../utils/equipmentListCore';
import {
  buildDetailDrawerEditExtra,
  buildIsActiveDescriptionColumn,
  EquipmentMasterDetailDrawer,
  MasterDataLinesTable,
  renderEquipmentMasterRowActions,
  renderIsActiveTag,
} from '../shared/equipmentMasterDataDetail';
import { buildDocumentListHelpViewConfig, DOCUMENT_LIST_HELP_KEYS } from '../../../../../components/page-help-wiki';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../../utils/uniTableLayoutColumns';

const P = 'app.kuaizhizao.equipmentOps.inspectionScheme';
const RESOURCE = 'kuaizhizao:equipment-inspection-scheme';

interface SchemeLine {
  item_id?: number;
  sort_order?: number;
  item_code?: string;
  item_name?: string;
  is_critical?: boolean;
  photo_required?: boolean;
}

interface InspectionScheme {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  cycle_type?: string;
  capture_mode?: string;
  reviewer_user_id?: number;
  reviewer_user_name?: string;
  overdue_hours?: number;
  review_overdue_hours?: number;
  is_active?: boolean;
  lines?: SchemeLine[];
  updated_at?: string;
}

const InspectionSchemesPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState<InspectionScheme | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<Record<string, unknown> | undefined>(
    undefined,
  );
  const [itemOptions, setItemOptions] = useState<{ label: string; value: number }[]>([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<InspectionScheme | null>(null);

  const loadItemOptions = async () => {
    const res = await inspectionItemsApi.list({ limit: 1000, is_active: true });
    setItemOptions(
      (res.items ?? []).map((it: { id: number; code: string; name: string }) => ({
        label: `${it.code} - ${it.name}`,
        value: it.id,
      })),
    );
  };

  const handleCreate = () => {
    setIsEdit(false);
    setCurrent(null);
    // FormModal destroyOnHidden：须用 initialValues，打开瞬间 setFieldsValue 无效
    setFormInitialValues({
      is_active: true,
      cycle_type: '每班',
      capture_mode: 'A',
      overdue_hours: 8,
      review_overdue_hours: 4,
      lines: [{ sort_order: 0 }],
    });
    setModalVisible(true);
    void loadItemOptions();
  };
  useNewShortcut(handleCreate);

  const handleEdit = async (record: InspectionScheme) => {
    if (!record.id) return;
    try {
      const loaded = await inspectionSchemesApi.get(record.id);
      setIsEdit(true);
      setCurrent(loaded);
      const reviewerUuid = await resolveUserUuidById(loaded.reviewer_user_id);
      setFormInitialValues({
        ...loaded,
        reviewer_uuid: reviewerUuid,
        overdue_hours: loaded.overdue_hours ?? 8,
        review_overdue_hours: loaded.review_overdue_hours ?? 4,
        lines: (loaded.lines ?? []).map((l: SchemeLine, i: number) => ({
          item_id: l.item_id,
          sort_order: l.sort_order ?? i,
          is_critical: l.is_critical ?? false,
          photo_required: l.photo_required ?? false,
        })),
      });
      setModalVisible(true);
      void loadItemOptions();
    } catch (error: unknown) {
      messageApi.error(error instanceof Error ? error.message : t('common.loadFailed'));
    }
  };

  const handleDetail = useCallback(async (record: InspectionScheme) => {
    if (!record.id) return;
    setDetailVisible(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const loaded = await inspectionSchemesApi.get(record.id);
      setDetail(loaded);
    } catch (error: unknown) {
      messageApi.error(error instanceof Error ? error.message : t('common.loadFailed'));
      setDetailVisible(false);
    } finally {
      setDetailLoading(false);
    }
  }, [messageApi, t]);

  const closeDetail = () => {
    setDetailVisible(false);
    setDetail(null);
  };

  const handleDelete = async (keys: React.Key[]) => {
    for (const id of keys) {
          await inspectionSchemesApi.delete(Number(id));
        }
    messageApi.success(t('common.batchDeleteSuccess', { count: keys.length }));
    actionRef.current?.reload();
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const captureMode = String(values.capture_mode || '').trim().toUpperCase();
    const rawLines = ((values.lines as SchemeLine[]) ?? []).filter((l) => l.item_id != null);
    const lines =
      captureMode === 'B'
        ? []
        : rawLines.map((l, i) => ({
            item_id: l.item_id,
            sort_order: l.sort_order ?? i,
            is_critical: Boolean(l.is_critical),
            photo_required: Boolean(l.photo_required),
          }));
    if (captureMode !== 'B' && !lines.length) {
      messageApi.warning(t(`${P}.linesRequired`));
      return;
    }
    if (captureMode === 'C' && !lines.some((l) => l.photo_required)) {
      messageApi.warning(t(`${P}.photoRequiredLineNeeded`));
      return;
    }
    const payload = {
      code: values.code,
      name: values.name,
      description: values.description,
      cycle_type: values.cycle_type,
      capture_mode: captureMode,
      reviewer_user_id: values.reviewer_user_id ?? null,
      reviewer_user_name: values.reviewer_user_name ?? null,
      overdue_hours: Number(values.overdue_hours ?? 8),
      review_overdue_hours: Number(values.review_overdue_hours ?? 4),
      is_active: Boolean(values.is_active),
      lines,
    };
    if (isEdit && current?.id) {
      await inspectionSchemesApi.update(current.id, payload);
      messageApi.success(t('common.updateSuccess'));
    } else {
      await inspectionSchemesApi.create(payload);
      messageApi.success(t('common.createSuccess'));
    }
    setModalVisible(false);
    actionRef.current?.reload();
    if (detailVisible && detail?.id === current?.id && current?.id) {
      void handleDetail({ id: current.id });
    }
  };

  const activeStatusValueEnum = useMemo(() => buildActiveStatusValueEnum(t), [t]);

  const detailBasicColumns = useMemo<ProDescriptionsItemProps<InspectionScheme>[]>(
    () => [
      { title: t('common.code'), dataIndex: 'code' },
      { title: t('common.name'), dataIndex: 'name' },
      { title: t(`${P}.col.cycleType`), dataIndex: 'cycle_type' },
      {
        title: t(`${P}.col.captureMode`),
        dataIndex: 'capture_mode',
        render: (_, r) =>
          r.capture_mode
            ? t(`${P}.captureMode.${String(r.capture_mode).toUpperCase()}`, String(r.capture_mode))
            : '-',
      },
      { title: t(`${P}.col.reviewer`), dataIndex: 'reviewer_user_name' },
      { title: t(`${P}.col.overdueHours`), dataIndex: 'overdue_hours' },
      { title: t(`${P}.col.reviewOverdueHours`), dataIndex: 'review_overdue_hours' },
      { title: t('common.remark'), dataIndex: 'description', span: 2 },
      buildIsActiveDescriptionColumn<InspectionScheme>(t),
    ],
    [t],
  );

  const detailLineColumns = useMemo<ColumnsType<SchemeLine>>(
    () => [
      { title: t(`${P}.form.item`), key: 'item', render: (_, row) => `${row.item_code ?? '-'} - ${row.item_name ?? '-'}` },
      {
        title: t(`${P}.form.isCritical`),
        dataIndex: 'is_critical',
        width: 90,
        render: (v) => (v ? '是' : '否'),
      },
      {
        title: t(`${P}.form.photoRequired`),
        dataIndex: 'photo_required',
        width: 110,
        render: (v) => (v ? '是' : '否'),
      },
      { title: t(`${P}.form.sortOrder`), dataIndex: 'sort_order', width: 80, align: 'right' },
    ],
    [t],
  );

  const columns: ProColumns<InspectionScheme>[] = useMemo(() => alignProColumns<InspectionScheme>([
      {
        title: t('common.updatedAt'),
        dataIndex: 'updated_at_range',
        valueType: 'dateRange',
        hideInTable: true,
        formItemProps: formDateRangeFormItemProps,
        search: { order: 10 } as ProColumns['search'],
      },
      {
        title: t('common.enabled'),
        dataIndex: 'is_active',
        valueType: 'select',
        valueEnum: activeStatusValueEnum,
        hideInTable: true,
        search: { order: 20 } as ProColumns['search'],
      },
      {
        title: t('common.code'),
        dataIndex: 'code',
        width: 160,
        minWidth: 160,
        uniTableKeepWidth: true,
        resizable: false,
        ellipsis: true,
        fixed: 'left',
        sorter: true,
        search: { order: 30 } as ProColumns['search'],
      },
      {
        title: t('common.name'),
        dataIndex: 'name',
        width: 160,
        minWidth: 160,
        uniTableKeepWidth: true,
        resizable: false,
        ellipsis: true,
        sorter: true,
        hideInSearch: true,
      },
      {
        title: t(`${P}.col.cycleType`),
        dataIndex: 'cycle_type',
        width: 100,
        minWidth: 100,
        uniTableKeepWidth: true,
        resizable: false,
        hideInSearch: true,
        render: (_, r) => (r.cycle_type != null && r.cycle_type !== '' ? String(r.cycle_type) : '-'),
      },
      {
        title: t(`${P}.col.captureMode`),
        dataIndex: 'capture_mode',
        width: 140,
        minWidth: 140,
        uniTableKeepWidth: true,
        resizable: false,
        hideInSearch: true,
        render: (_, r) =>
          r.capture_mode
            ? t(`${P}.captureMode.${String(r.capture_mode).toUpperCase()}`, String(r.capture_mode))
            : '-',
      },
      {
        title: t(`${P}.col.reviewer`),
        dataIndex: 'reviewer_user_name',
        width: 100,
        minWidth: 100,
        uniTableKeepWidth: true,
        resizable: false,
        ellipsis: true,
        hideInSearch: true,
        render: (_, r) =>
          r.reviewer_user_name != null && r.reviewer_user_name !== ''
            ? String(r.reviewer_user_name)
            : '-',
      },
      {
        title: t(`${P}.col.lineCount`),
        key: 'line_count',
        dataIndex: 'lines',
        width: 90,
        minWidth: 90,
        uniTableKeepWidth: true,
        resizable: false,
        hideInSearch: true,
        render: (_, r) => r.lines?.length ?? 0,
      },
      {
        title: t('common.remark'),
        dataIndex: 'description',
        minWidth: 160,
        uniTablePrimaryFlex: true,
        uniTableRemainderFlex: true,
        resizable: false,
        ellipsis: true,
        hideInSearch: true,
        render: (_, r) => (r.description != null && r.description !== '' ? String(r.description) : '-'),
      },
      {
        title: t('common.enabled'),
        dataIndex: 'is_active',
        ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
        sorter: true,
        hideInSearch: true,
        render: (_, r) => renderIsActiveTag(t, r.is_active),
      },
      ...buildDocumentAuditColumns<InspectionScheme>(t),
      {
        title: t('common.actions'),
        key: 'option',
        fixed: 'right',
        hideInSearch: true,
        render: (_, record) =>
          renderEquipmentMasterRowActions({
            record,
            t,
            canRead: perms.canRead,
            canUpdate: perms.canUpdate,
            canDelete: perms.canDelete,
            onDetail: (row) => {
              void handleDetail(row);
            },
            onEdit: (row) => {
              void handleEdit(row);
            },
            onDelete: (row) => {
              if (row.id != null) {
                void handleDelete([row.id]);
              }
            },
          }),
      },
    ], SALES_DOC_LIST_FIELD_RANK),
    [t, perms, activeStatusValueEnum, handleDetail],
  );

  return (
    <>
      <ListPageTemplate>
        <UniTable<InspectionScheme>
        viewTypes={['table', 'help']}
          helpViewConfig={buildDocumentListHelpViewConfig(DOCUMENT_LIST_HELP_KEYS.inspectionSchemes)}
          headerTitle={t(`${P}.title`)}
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.inspection-schemes-review-r10-v1"
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          showAdvancedSearch={true}
          pinnedTabsField={MASTER_DATA_PINNED_ACTIVE_FIELD}
          skipFuzzyPinyinClientFilter
          request={async (params, sort, _filter, searchFormValues) => {
            try {
              const listParams = resolveMasterDataListParams(searchFormValues, sort);
              const res = await inspectionSchemesApi.list({
                skip: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
                limit: params.pageSize,
                ...listParams,
              });
              const { data, total } = normalizeEquipmentListResponse(res);
              return { data: data as InspectionScheme[], success: true, total };
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
          deleteConfirmDescription={(count) => t('common.batchDeleteContent', { count: count })}
          
          onDelete={handleDelete}
          enableRowSelection={perms.canDelete}
        />
      </ListPageTemplate>

      <EquipmentMasterDetailDrawer
        open={detailVisible}
        loading={detailLoading}
        detail={detail}
        title={`${t(`${P}.detailTitle`)}${detail?.code ? ` - ${detail.code}` : ''}`}
        onClose={closeDetail}
        basicColumns={detailBasicColumns}
        linesTitle={t(`${P}.form.lines`)}
        lines={
          <MasterDataLinesTable
            rows={detail?.lines ?? []}
            columns={detailLineColumns}
            rowKey={(row) => String(row.item_id ?? row.sort_order ?? '')}
            emptyDescription={t('common.noData')}
          />
        }
        extra={buildDetailDrawerEditExtra(t, Boolean(detail && perms.canUpdate), () => {
          if (!detail) return;
          closeDetail();
          void handleEdit(detail);
        })}
      />

      <FormModalTemplate
        title={isEdit ? t(`${P}.editModal`) : t(`${P}.createModal`)}
        open={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setFormInitialValues(undefined);
        }}
        onFinish={handleSubmit}
        isEdit={isEdit}
        initialValues={formInitialValues}
        width={MODAL_CONFIG.LARGE_WIDTH}
        formRef={formRef}
        grid={false}
      >
        <Row gutter={16}>
          <Col span={8}>
            <ProFormText name="code" label={t('common.code')} rules={[{ required: true }]} />
          </Col>
          <Col span={8}>
            <ProFormText name="name" label={t('common.name')} rules={[{ required: true }]} />
          </Col>
          <Col span={8}>
            <ProFormSelect
              name="cycle_type"
              label={t(`${P}.col.cycleType`)}
              rules={[{ required: true, message: t(`${P}.cycleRequired`) }]}
              options={[
                { label: t(`${P}.cycle.shift`), value: '每班' },
                { label: t(`${P}.cycle.daily`), value: '每天' },
                { label: t(`${P}.cycle.weekly`), value: '每周' },
                { label: t(`${P}.cycle.monthly`), value: '每月' },
                { label: t(`${P}.cycle.quarterly`), value: '每季度' },
              ]}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="capture_mode"
              label={t(`${P}.col.captureMode`)}
              rules={[{ required: true, message: t(`${P}.captureModeRequired`) }]}
              options={[
                { label: t(`${P}.captureMode.A`), value: 'A' },
                { label: t(`${P}.captureMode.B`), value: 'B' },
                { label: t(`${P}.captureMode.C`), value: 'C' },
              ]}
            />
          </Col>
          <Col span={12}>
            <EquipmentPersonSelect
              uuidFieldName="reviewer_uuid"
              idFieldName="reviewer_user_id"
              nameFieldName="reviewer_user_name"
              label={t(`${P}.col.reviewer`)}
              formRef={formRef}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="overdue_hours"
              label={t(`${P}.col.overdueHours`)}
              rules={[{ required: true, message: t(`${P}.overdueHoursRequired`) }]}
              min={1}
              max={720}
              fieldProps={{ precision: 0, style: { width: '100%' } }}
            />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="review_overdue_hours"
              label={t(`${P}.col.reviewOverdueHours`)}
              rules={[{ required: true, message: t(`${P}.reviewOverdueHoursRequired`) }]}
              min={1}
              max={720}
              fieldProps={{ precision: 0, style: { width: '100%' } }}
            />
          </Col>
        </Row>
        <ProFormDependency name={['capture_mode']}>
          {({ capture_mode }) => {
            const mode = String(capture_mode || '').toUpperCase();
            if (mode === 'B') {
              return (
                <Typography.Paragraph type="secondary" style={{ marginTop: 8 }}>
                  {t(`${P}.captureModeBHint`)}
                </Typography.Paragraph>
              );
            }
            return (
              <FormListDetailTable
                name="lines"
                label={t(`${P}.form.lines`)}
                addButtonText={t(`${P}.form.addLine`)}
                defaultRow={{ sort_order: 0, is_critical: false, photo_required: false }}
                bulkAdd={{
                  title: t('common.bulkAddPickTitle', { item: t(`${P}.form.item`) }),
                  options: itemOptions,
                  valueField: 'item_id',
                }}
                columns={[
                  {
                    title: t(`${P}.form.item`),
                    key: 'item_id',
                    render: (field) => (
                      <ProFormSelect
                        name={[field.name, 'item_id']}
                        options={itemOptions}
                        rules={[{ required: true }]}
                        showSearch
                        formItemProps={{ noStyle: true }}
                        fieldProps={{ style: { width: '100%' }, placeholder: t('common.select') }}
                      />
                    ),
                  },
                  {
                    title: t(`${P}.form.isCritical`),
                    key: 'is_critical',
                    width: 100,
                    render: (field) => (
                      <ProFormSwitch
                        name={[field.name, 'is_critical']}
                        formItemProps={{ noStyle: true }}
                      />
                    ),
                  },
                  ...(mode === 'C'
                    ? [
                        {
                          title: t(`${P}.form.photoRequired`),
                          key: 'photo_required',
                          width: 110,
                          render: (field: { name: number }) => (
                            <ProFormSwitch
                              name={[field.name, 'photo_required']}
                              formItemProps={{ noStyle: true }}
                            />
                          ),
                        },
                      ]
                    : []),
                  {
                    title: t(`${P}.form.sortOrder`),
                    key: 'sort_order',
                    width: 100,
                    align: 'right' as const,
                    render: (field) => (
                      <ProFormDigit
                        name={[field.name, 'sort_order']}
                        min={0}
                        formItemProps={{ noStyle: true }}
                        fieldProps={{ style: { width: '100%' } }}
                      />
                    ),
                  },
                ]}
              />
            );
          }}
        </ProFormDependency>
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={24}>
            <ProFormTextArea name="description" label={t('common.remark')} fieldProps={{ rows: 2 }} />
          </Col>
          <Col span={24}>
            <ProFormSwitch name="is_active" label={t('common.enabled')} />
          </Col>
        </Row>
      </FormModalTemplate>
    </>
  );
};

export default InspectionSchemesPage;
