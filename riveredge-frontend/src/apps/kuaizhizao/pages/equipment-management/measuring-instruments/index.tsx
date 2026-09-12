import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ActionType,
  ProColumns,
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
  ProFormSwitch,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { UniTable } from '../../../../../components/uni-table';
import CodeField from '../../../../../components/code-field';
import { ListPageTemplate, FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { useNewShortcut } from '../../../../../hooks/useNewShortcut';
import { withSingleNewShortcutHint } from '../../../../../utils/globalNewShortcut';
import { equipmentApi } from '../../../services/equipment';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import DocumentAttachmentsField from '../../../components/DocumentAttachmentsField';
import { mapAttachmentsToUploadList, normalizeDocumentAttachments } from '../../../utils/documentAttachments';
import { DictionarySelect } from '../../../../../components/dictionary-select';
import EquipmentFactoryBindingFields from '../../../components/EquipmentFactoryBindingFields';
import dayjs from 'dayjs';
import { alignProColumns, SALES_DOC_LIST_FIELD_RANK } from '../../sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../shared/documentAuditColumns';
import {
  formDateFormItemProps,
  formDateRangeFormItemProps,
  toApiDateString,
} from '../../../../../utils/formDate';
import {
  MASTER_DATA_PINNED_ACTIVE_FIELD,
  buildActiveStatusValueEnum,
  normalizeEquipmentListResponse,
  resolveLedgerListParams,
} from '../../../utils/equipmentListCore';
import { UniTableStackedPrimaryCell } from '../../../../../components/uni-table/stackedPrimaryColumn';
import { MarkerTag } from '../../../../../constants/statusBadges';
import { renderEquipmentMasterRowActions } from '../shared/equipmentMasterDataDetail';
import { formatDateBySiteSetting, todaySiteDateString } from '../../../../../utils/format';
import { downloadRecordsAsXlsx } from '../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../utils/fetchAllListPages';
import { MEASURING_INSTRUMENT_NATURE } from './measuringInstrumentConstants';
import { buildMeasuringInstrumentDetailPath } from './measuringInstrumentPaths';

interface MeasuringInstrument {
  id?: number;
  uuid?: string;
  code?: string;
  name?: string;
  model?: string;
  brand?: string;
  category?: string;
  workshop_name?: string;
  calibration_period?: number;
  last_calibration_date?: string;
  next_calibration_date?: string;
  measuring_precision?: string;
  measurement_range?: string;
  status?: string;
  is_active?: boolean;
  description?: string;
}

const P = 'app.kuaizhizao.measuringInstrument';

const MeasuringInstrumentsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions('kuaizhizao:equipment-management-equipment');
  const actionRef = useRef<ActionType>(null);
  const formRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [current, setCurrent] = useState<MeasuringInstrument | null>(null);
  const [formInitialValues, setFormInitialValues] = useState<Record<string, unknown> | undefined>();

  const createButtonLabel = useMemo(
    () => withSingleNewShortcutHint(t(`${P}.create`)),
    [t],
  );
  const activeStatusValueEnum = useMemo(() => buildActiveStatusValueEnum(t), [t]);

  const handleCreate = useCallback(() => {
    setIsEdit(false);
    setCurrent(null);
    setFormInitialValues({
      status: '正常',
      is_active: true,
      last_calibration_date: null,
    });
    setModalVisible(true);
  }, []);

  useNewShortcut(handleCreate);

  const handleEdit = useCallback(async (record: MeasuringInstrument) => {
    if (!record.uuid) return;
    try {
      const detail = await equipmentApi.get(record.uuid);
      setIsEdit(true);
      setCurrent(detail);
      setFormInitialValues({
        code: detail.code,
        name: detail.name,
        model: detail.model,
        brand: detail.brand,
        category: detail.category,
        measuring_precision: detail.measuring_precision,
        measurement_range: detail.measurement_range,
        workshop_id: detail.workshop_id,
        workshop_name: detail.workshop_name,
        work_center_id: detail.work_center_id,
        work_center_code: detail.work_center_code,
        work_center_name: detail.work_center_name,
        calibration_period: detail.calibration_period,
        last_calibration_date: detail.last_calibration_date ? dayjs(detail.last_calibration_date) : null,
        status: detail.status,
        is_active: detail.is_active,
        description: detail.description,
        certificate_attachments: mapAttachmentsToUploadList(detail.attachments),
      });
      setModalVisible(true);
    } catch {
      messageApi.error(t(`${P}.loadFailed`));
    }
  }, [messageApi, t]);

  useEffect(() => {
    const openEditUuid = (location.state as { openEditUuid?: string } | null)?.openEditUuid;
    if (!openEditUuid) return;
    navigate(location.pathname, { replace: true, state: null });
    void handleEdit({ uuid: openEditUuid });
  }, [handleEdit, location.pathname, location.state, navigate]);

  const handleDetail = useCallback(
    (record: MeasuringInstrument) => {
      if (!record.uuid) return;
      navigate(buildMeasuringInstrumentDetailPath(record.uuid));
    },
    [navigate],
  );

  const handleBatchEdit = useCallback(
    (keys: React.Key[]) => {
      if (keys.length !== 1) return;
      void handleEdit({ uuid: String(keys[0]) });
    },
    [handleEdit],
  );

  const handleDelete = async (keys: React.Key[]) => {
    try {
      for (const uuid of keys) {
        await equipmentApi.delete(String(uuid));
      }
      messageApi.success(t('common.batchDeleteSuccess', { count: keys.length }));
      actionRef.current?.reload();
    } catch (error: any) {
      messageApi.error(error?.message || t('common.deleteFailed'));
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    const {
      certificate_attachments: certAttachments,
      ...rest
    } = values;
    const lastCalibrationDate = toApiDateString(rest.last_calibration_date) ?? null;
    const calibrationPeriod =
      rest.calibration_period != null ? Number(rest.calibration_period) : undefined;
    const nextCalibrationDate =
      lastCalibrationDate && calibrationPeriod
        ? dayjs(lastCalibrationDate).add(calibrationPeriod, 'day').format('YYYY-MM-DD')
        : null;
    const payload = {
      ...rest,
      equipment_nature: MEASURING_INSTRUMENT_NATURE,
      needs_calibration: true,
      last_calibration_date: lastCalibrationDate,
      next_calibration_date: nextCalibrationDate,
      attachments: normalizeDocumentAttachments(certAttachments),
    };
    try {
      if (isEdit && current?.uuid) {
        await equipmentApi.update(current.uuid, payload);
        messageApi.success(t(`${P}.updateSuccess`));
      } else {
        const created = await equipmentApi.create(payload);
        const calDate = lastCalibrationDate;
        const attachments = normalizeDocumentAttachments(certAttachments);
        if (created?.uuid && calDate && attachments?.length) {
          await equipmentApi.createCalibration(created.uuid, {
            calibration_date: calDate,
            result: '合格',
            attachments,
          });
        }
        messageApi.success(t(`${P}.createSuccess`));
      }
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (error: any) {
      messageApi.error(error?.message || t('common.saveFailed'));
      throw error;
    }
  };

  const columns: ProColumns<MeasuringInstrument>[] = useMemo(
    () =>
      alignProColumns<MeasuringInstrument>(
        [
          {
            title: t('common.createdAt'),
            dataIndex: 'created_at_range',
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
            title: t('common.enabled'),
            dataIndex: 'is_active',
            valueType: 'select',
            valueEnum: activeStatusValueEnum,
            hideInTable: true,
            search: { order: 20 } as ProColumns['search'],
          },
          {
            title: t(`${P}.colCodeName`),
            dataIndex: 'code',
            minWidth: 200,
            uniTablePrimaryFlex: true,
            uniTableRemainderFlex: true,
            resizable: false,
            ellipsis: false,
            fixed: 'left',
            sorter: true,
            search: { order: 30 } as ProColumns['search'],
            render: (_, record) => (
              <UniTableStackedPrimaryCell
                primary={String(record.name ?? '') || '-'}
                secondary={String(record.code ?? '') || '-'}
                onPrimaryClick={perms.canRead ? () => handleDetail(record) : undefined}
              />
            ),
          },
          {
            title: t(`${P}.colModel`),
            dataIndex: 'model',
            width: 128,
            minWidth: 128,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) => (r.model != null && r.model !== '' ? String(r.model) : '-'),
          },
          {
            title: t(`${P}.colBrand`),
            dataIndex: 'brand',
            width: 100,
            minWidth: 100,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) => (r.brand != null && r.brand !== '' ? String(r.brand) : '-'),
          },
          {
            title: t(`${P}.colMeasuringPrecision`),
            dataIndex: 'measuring_precision',
            width: 100,
            minWidth: 100,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) =>
              r.measuring_precision != null && r.measuring_precision !== ''
                ? String(r.measuring_precision)
                : '-',
          },
          {
            title: t(`${P}.colMeasurementRange`),
            dataIndex: 'measurement_range',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) =>
              r.measurement_range != null && r.measurement_range !== ''
                ? String(r.measurement_range)
                : '-',
          },
          {
            title: t(`${P}.colLastCalibrationDate`),
            dataIndex: 'last_calibration_date',
            width: 132,
            minWidth: 132,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) =>
              r.last_calibration_date ? formatDateBySiteSetting(r.last_calibration_date) : '-',
          },
          {
            title: t(`${P}.colCalibrationPeriod`),
            dataIndex: 'calibration_period',
            width: 100,
            minWidth: 100,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) =>
              r.calibration_period != null ? t(`${P}.periodDays`, { count: r.calibration_period }) : '-',
          },
          {
            title: t(`${P}.colNextCalibrationDate`),
            dataIndex: 'next_calibration_date',
            width: 132,
            minWidth: 132,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) =>
              r.next_calibration_date ? formatDateBySiteSetting(r.next_calibration_date) : '-',
          },
          {
            title: t(`${P}.colWorkshop`),
            dataIndex: 'workshop_name',
            width: 120,
            minWidth: 120,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            hideInSearch: true,
            render: (_, r) =>
              r.workshop_name != null && r.workshop_name !== '' ? String(r.workshop_name) : '-',
          },
          {
            title: t('common.status'),
            dataIndex: 'status',
            width: 96,
            minWidth: 96,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) => <MarkerTag>{r.status ?? '-'}</MarkerTag>,
          },
          {
            title: t('common.enabled'),
            dataIndex: 'is_active',
            width: 88,
            minWidth: 88,
            uniTableKeepWidth: true,
            resizable: false,
            hideInSearch: true,
            render: (_, r) => (
              <MarkerTag color={r.is_active ? 'success' : 'default'}>
                {r.is_active ? t('common.enabled') : t('common.disabled')}
              </MarkerTag>
            ),
          },
          ...buildDocumentAuditColumns<MeasuringInstrument>(t),
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
                onDetail: handleDetail,
                onEdit: (row) => {
                  void handleEdit(row);
                },
                onDelete: (row) => {
                  if (row.uuid) void handleDelete([row.uuid]);
                },
              }),
          },
        ],
        SALES_DOC_LIST_FIELD_RANK,
      ),
    [activeStatusValueEnum, handleDetail, handleDelete, handleEdit, perms, t],
  );

  return (
    <>
      <ListPageTemplate>
        <UniTable<MeasuringInstrument>
          actionRef={actionRef}
          rowKey="uuid"
          columns={columns}
          headerTitle={t(`${P}.title`)}
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.measuring-instruments-v3"
          permissionResource="kuaizhizao:equipment-management-equipment"
          pinnedTabsField={MASTER_DATA_PINNED_ACTIVE_FIELD}
          showAdvancedSearch
          skipFuzzyPinyinClientFilter
          onRow={(record) => ({
            onClick: () => perms.canRead && handleDetail(record),
            style: { cursor: perms.canRead ? 'pointer' : undefined },
          })}
          request={async (params, sort, _filter, searchFormValues) => {
            try {
              const listParams = resolveLedgerListParams(searchFormValues, sort);
              const response = await equipmentApi.list({
                skip: ((params.current ?? 1) - 1) * (params.pageSize ?? 20),
                limit: params.pageSize,
                ...listParams,
                equipment_nature: MEASURING_INSTRUMENT_NATURE,
              });
              const { data, total } = normalizeEquipmentListResponse(response);
              return { data, success: true, total };
            } catch {
              messageApi.error(t(`${P}.loadFailed`));
              return { data: [], success: false, total: 0 };
            }
          }}
          enableRowSelection={perms.canDelete || perms.canUpdate || perms.canExport}
          showCreateButton={perms.canCreate}
          createButtonText={createButtonLabel}
          onCreate={handleCreate}
          showEditButton={perms.canUpdate}
          onEdit={handleBatchEdit}
          showDeleteButton={perms.canDelete}
          deleteConfirmTitle={t('common.batchDeleteTitle')}
          deleteConfirmDescription={(count) => t(`${P}.confirmBatchDelete`, { count })}
          onDelete={handleDelete}
          showExportButton={perms.canExport}
          onExport={async (type, keys, pageData) => {
            try {
              let items: MeasuringInstrument[] =
                type === 'currentPage' && pageData?.length
                  ? (pageData as MeasuringInstrument[])
                  : ((await fetchAllListItems((p) =>
                      equipmentApi.list({ ...p, equipment_nature: MEASURING_INSTRUMENT_NATURE }),
                    )) as MeasuringInstrument[]);
              if (type === 'selected' && keys?.length) {
                items = items.filter((item) => item.uuid && keys.includes(item.uuid));
              }
              if (!items.length) {
                messageApi.warning(t('common.noDataToExport'));
                return;
              }
              await downloadRecordsAsXlsx(
                items as Array<Record<string, unknown>>,
                `measuring-instruments-${todaySiteDateString()}.xlsx`,
                {
                  columns: [
                    { key: 'code', title: t(`${P}.fieldCode`) },
                    { key: 'name', title: t(`${P}.fieldName`) },
                    { key: 'model', title: t(`${P}.colModel`) },
                    { key: 'brand', title: t(`${P}.colBrand`) },
                    { key: 'measuring_precision', title: t(`${P}.colMeasuringPrecision`) },
                    { key: 'measurement_range', title: t(`${P}.colMeasurementRange`) },
                    { key: 'last_calibration_date', title: t(`${P}.colLastCalibrationDate`) },
                    { key: 'calibration_period', title: t(`${P}.colCalibrationPeriod`) },
                    { key: 'next_calibration_date', title: t(`${P}.colNextCalibrationDate`) },
                    { key: 'workshop_name', title: t(`${P}.colWorkshop`) },
                    { key: 'status', title: t('common.status') },
                    { key: 'is_active', title: t('common.enabled') },
                  ],
                  sheetName: t(`${P}.title`),
                },
              );
              messageApi.success(t('common.exportCountSuccess', { count: items.length }));
            } catch (error: unknown) {
              const err = error as { message?: string };
              messageApi.error(err?.message || t('common.exportFailed'));
            }
          }}
        />
      </ListPageTemplate>

      <FormModalTemplate
        title={isEdit ? t(`${P}.edit`) : t(`${P}.create`)}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onFinish={handleSubmit}
        isEdit={isEdit}
        width={MODAL_CONFIG.LARGE_WIDTH}
        formRef={formRef}
        initialValues={formInitialValues}
        grid={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <CodeField
              pageCode="kuaizhizao-equipment-management-measuring-instruments"
              name="code"
              label={t(`${P}.fieldCode`)}
              autoGenerateOnCreate={!isEdit}
              showGenerateButton={false}
              documentId={isEdit ? current?.id : undefined}
            />
          </Col>
          <Col span={12}>
            <ProFormText
              name="name"
              label={t(`${P}.fieldName`)}
              rules={[{ required: true, message: t(`${P}.ruleNameRequired`) }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText name="model" label={t(`${P}.fieldModel`)} />
          </Col>
          <Col span={12}>
            <ProFormText name="brand" label={t(`${P}.fieldBrand`)} />
          </Col>
          <Col span={12}>
            <ProFormText name="category" label={t(`${P}.fieldCategory`)} />
          </Col>
          <Col span={12}>
            <ProFormText name="measuring_precision" label={t(`${P}.fieldMeasuringPrecision`)} />
          </Col>
          <Col span={12}>
            <ProFormText name="measurement_range" label={t(`${P}.fieldMeasurementRange`)} />
          </Col>
          <Col span={12}>
            <ProFormDigit
              name="calibration_period"
              label={t(`${P}.fieldCalibrationPeriod`)}
              min={1}
              fieldProps={{ precision: 0 }}
            />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="last_calibration_date"
              label={t(`${P}.fieldLastCalibrationDate`)}
              formItemProps={formDateFormItemProps}
              fieldProps={{ style: { width: '100%' } }}
            />
          </Col>
          <EquipmentFactoryBindingFields formRef={formRef} embedInParentRow />
          <Col span={12}>
            <DictionarySelect
              dictionaryCode="EQUIPMENT_STATUS"
              name="status"
              label={t(`${P}.fieldStatus`)}
              required
              rules={[{ required: true, message: t(`${P}.ruleStatusRequired`) }]}
              formRef={formRef}
            />
          </Col>
          <Col span={24}>
            <DocumentAttachmentsField
              name="certificate_attachments"
              label={t(`${P}.fieldCertificate`)}
              category="equipment_calibration_attachments"
              max={5}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea name="description" label={t('common.remark')} />
          </Col>
          <Col span={12}>
            <ProFormSwitch name="is_active" label={t('common.enabled')} />
          </Col>
        </Row>
      </FormModalTemplate>
    </>
  );
};

export default MeasuringInstrumentsPage;
