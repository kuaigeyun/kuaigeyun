import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionType,
  ProColumns,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProDescriptionsItemProps,
} from '@ant-design/pro-components';
import { App, Button, Col, Descriptions, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { UniTable } from '../../../../../../components/uni-table';
import { MarkerTag } from '../../../../../../constants/statusBadges';
import { useNewShortcut } from '../../../../../../hooks/useNewShortcut';
import { withSingleNewShortcutHint } from '../../../../../../utils/globalNewShortcut';
import { downloadRecordsAsXlsx } from '../../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../../utils/fetchAllListPages';
import { formatDateTime, todaySiteDateString } from '../../../../../../utils/format';
import {
  ListPageTemplate,
  FormModalTemplate,
  DetailDrawerTemplate,
  MODAL_CONFIG,
  DRAWER_CONFIG,
  useDetailDrawerDescriptionItems,
} from '../../../../../../components/layout-templates';
import { rowActionKind } from '../../../../../../components/uni-action';
import { useResourcePermissions } from '../../../../../../hooks/useResourcePermissions';
import DocumentAttachmentsField from '../../../../components/DocumentAttachmentsField';
import LineAttachmentsUpload from '../../../../components/LineAttachmentsUpload';
import { normalizeDocumentAttachments } from '../../../../utils/documentAttachments';
import { equipmentApi } from '../../../../services/equipment';
import { useEquipmentDetailDrawer } from '../../shared/equipmentMasterDataDetail';
import { formDateFormItemProps, formDateRangeFormItemProps } from '../../../../../../utils/formDate';
import { alignProColumns, SALES_DOC_LIST_FIELD_RANK } from '../../../sales-management/shared/documentFieldAlignment';
import { buildDocumentAuditColumns } from '../../../shared/documentAuditColumns';
import {
  normalizeEquipmentListResponse,
  resolveAssetWorkflowListParams,
} from '../../../../utils/equipmentListCore';
import { UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS } from '../../../../../../utils/uniTableLayoutColumns';
import { UniTableStackedPrimaryCell } from '../../../../../../components/uni-table/stackedPrimaryColumn';
import { MEASURING_INSTRUMENT_NATURE } from '../measuringInstrumentConstants';

const RESOURCE = 'kuaizhizao:measuring-instrument-calibration';
const P = 'app.kuaizhizao.measuringInstrumentCalibration';

interface CalibrationRecord {
  uuid?: string;
  equipment_uuid?: string;
  equipment_code?: string;
  equipment_name?: string;
  plan_type?: string;
  calibration_date?: string;
  result?: string;
  certificate_no?: string;
  expiry_date?: string;
  remark?: string;
  attachments?: Array<{ uid?: string; name?: string; url?: string }>;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string;
  updated_by_name?: string;
}

const MeasuringInstrumentCalibrationsPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const actionRef = useRef<ActionType>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { open: drawerVisible, loading: detailLoading, detail, openDetail, closeDetail } =
    useEquipmentDetailDrawer<CalibrationRecord>();
  const [modalVisible, setModalVisible] = useState(false);
  const formRef = useRef<any>(null);
  const [instrumentOptions, setInstrumentOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    equipmentApi
      .list({ limit: 500, equipment_nature: MEASURING_INSTRUMENT_NATURE, is_active: true })
      .then((res: { items?: Array<{ code?: string; name?: string; uuid?: string }> }) => {
        setInstrumentOptions(
          (res.items || []).map((item) => ({
            label: `${item.code} - ${item.name}`,
            value: item.uuid ?? '',
          })),
        );
      })
      .catch(() => {});
  }, []);

  const handleCreate = () => {
    setModalVisible(true);
    formRef.current?.resetFields();
    formRef.current?.setFieldsValue({ calibration_date: dayjs(), result: '合格', plan_type: 'external' });
  };

  useNewShortcut(handleCreate);

  const handleDetail = useCallback(
    (record: CalibrationRecord) => {
      if (!record.uuid) return;
      void openDetail(async () => record);
    },
    [openDetail],
  );

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      await equipmentApi.createCalibrationRecord({
        equipment_uuid: String(values.equipment_uuid ?? ''),
        plan_type: (values.plan_type as string) || 'external',
        calibration_date:
          (values.calibration_date as { format?: (f: string) => string })?.format?.('YYYY-MM-DD') ||
          (values.calibration_date as string),
        result: values.result as string,
        certificate_no: values.certificate_no as string | undefined,
        expiry_date:
          (values.expiry_date as { format?: (f: string) => string })?.format?.('YYYY-MM-DD') ||
          (values.expiry_date as string | undefined),
        remark: values.remark as string | undefined,
        attachments: normalizeDocumentAttachments(values.attachments),
      });
      messageApi.success(t(`${P}.saveSuccess`));
      setModalVisible(false);
      actionRef.current?.reload();
    } catch (e: unknown) {
      const err = e as { message?: string };
      messageApi.error(err?.message || t('common.saveFailed'));
      throw e;
    }
  };

  const resultOptions = useMemo(
    () => [
      { label: t('app.kuaizhizao.equipmentCalibration.resultPass'), value: '合格' },
      { label: t('app.kuaizhizao.equipmentCalibration.resultFail'), value: '不合格' },
      { label: t('app.kuaizhizao.equipmentCalibration.resultConditional'), value: '限制使用' },
    ],
    [t],
  );

  const detailColumns = useMemo<ProDescriptionsItemProps<CalibrationRecord>[]>(
    () => [
      { title: t(`${P}.colInstrumentCode`), dataIndex: 'equipment_code' },
      { title: t(`${P}.colInstrumentName`), dataIndex: 'equipment_name' },
      {
        title: t(`${P}.colCalibrationDate`),
        dataIndex: 'calibration_date',
        render: (_, r) => (r.calibration_date ? formatDateTime(r.calibration_date, 'YYYY-MM-DD') : '-'),
      },
      {
        title: t(`${P}.colResult`),
        dataIndex: 'result',
        render: (_, r) => {
          const color = r.result === '合格' ? 'success' : r.result === '不合格' ? 'error' : 'warning';
          return <MarkerTag color={color}>{r.result ?? '-'}</MarkerTag>;
        },
      },
      { title: t(`${P}.colCertificateNo`), dataIndex: 'certificate_no' },
      {
        title: t(`${P}.colExpiryDate`),
        dataIndex: 'expiry_date',
        render: (_, r) => (r.expiry_date ? formatDateTime(r.expiry_date, 'YYYY-MM-DD') : '-'),
      },
      { title: t('common.remark'), dataIndex: 'remark', span: 2 },
    ],
    [t],
  );

  const columns: ProColumns<CalibrationRecord>[] = useMemo(
    () =>
      alignProColumns<CalibrationRecord>(
        [
          {
            title: t(`${P}.colCalibrationDate`),
            dataIndex: 'calibration_date_range',
            valueType: 'dateRange',
            hideInTable: true,
            formItemProps: formDateRangeFormItemProps,
            search: { order: 10 } as ProColumns['search'],
          },
          {
            title: t('common.updatedAt'),
            dataIndex: 'created_at_range',
            valueType: 'dateRange',
            hideInTable: true,
            formItemProps: formDateRangeFormItemProps,
            search: { order: 11 } as ProColumns['search'],
          },
          {
            title: t(`${P}.colInstrumentCode`),
            dataIndex: 'equipment_code',
            hideInTable: true,
            search: { order: 30 } as ProColumns['search'],
          },
          {
            title: t(`${P}.colInstrumentName`),
            dataIndex: 'equipment_name',
            minWidth: 200,
            uniTablePrimaryFlex: true,
            uniTableRemainderFlex: true,
            resizable: false,
            ellipsis: false,
            hideInSearch: true,
            render: (_, r) => (
              <UniTableStackedPrimaryCell
                primary={String(r.equipment_name ?? '') || '-'}
                secondary={String(r.equipment_code ?? '') || '-'}
                onPrimaryClick={perms.canRead ? () => handleDetail(r) : undefined}
              />
            ),
          },
          {
            title: t(`${P}.colCalibrationDate`),
            dataIndex: 'calibration_date',
            width: 132,
            minWidth: 132,
            uniTableKeepWidth: true,
            resizable: false,
            sorter: true,
            hideInSearch: true,
            render: (_, r) =>
              r.calibration_date ? formatDateTime(r.calibration_date, 'YYYY-MM-DD') : '-',
          },
          {
            title: t(`${P}.colResult`),
            key: 'equipment_calibration_result',
            dataIndex: 'result',
            ...UNI_TABLE_MARKER_BADGE_COLUMN_DEFAULTS,
            sorter: true,
            hideInSearch: true,
            render: (_, r) => {
              const color =
                r.result === '合格' ? 'success' : r.result === '不合格' ? 'error' : 'warning';
              return <MarkerTag color={color}>{r.result ?? '-'}</MarkerTag>;
            },
          },
          {
            title: t(`${P}.colCertificateNo`),
            dataIndex: 'certificate_no',
            width: 140,
            minWidth: 140,
            uniTableKeepWidth: true,
            resizable: false,
            ellipsis: true,
            sorter: true,
            hideInSearch: true,
            render: (_, r) => (
              <Typography.Text copyable={{ text: String(r.certificate_no ?? '') }} ellipsis>
                {r.certificate_no ?? '-'}
              </Typography.Text>
            ),
          },
          {
            title: t(`${P}.colExpiryDate`),
            dataIndex: 'expiry_date',
            width: 132,
            minWidth: 132,
            uniTableKeepWidth: true,
            resizable: false,
            sorter: true,
            hideInSearch: true,
            render: (_, r) => (r.expiry_date ? formatDateTime(r.expiry_date, 'YYYY-MM-DD') : '-'),
          },
          ...buildDocumentAuditColumns<CalibrationRecord>(t),
          {
            title: t('common.actions'),
            key: 'option',
            fixed: 'right',
            hideInSearch: true,
            render: (_, record) =>
              perms.canRead ? (
                <Button key="detail" {...rowActionKind('read')} onClick={() => handleDetail(record)}>
                  {t('common.detail')}
                </Button>
              ) : null,
          },
        ],
        SALES_DOC_LIST_FIELD_RANK,
      ),
    [handleDetail, perms.canRead, t],
  );

  const timeconfigBasicItems = useDetailDrawerDescriptionItems(
    detailColumns,
    detail,
    'measuring_instrument_calibration',
  );

  if (!perms.canRead) return null;

  return (
    <>
      <ListPageTemplate>
        <UniTable<CalibrationRecord>
          headerTitle={t(`${P}.title`)}
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.measuring-instruments.calibrations-v3"
          actionRef={actionRef}
          permissionResource={RESOURCE}
          enableRowSelection={perms.canExport}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={setSelectedRowKeys}
          rowKey="uuid"
          columns={columns}
          showAdvancedSearch
          skipFuzzyPinyinClientFilter
          showCreateButton={perms.canCreate}
          createButtonText={withSingleNewShortcutHint(t(`${P}.create`))}
          onCreate={handleCreate}
          showExportButton={perms.canExport}
          onExport={async (type, keys, pageData) => {
            try {
              let items: CalibrationRecord[] =
                type === 'currentPage' && pageData?.length
                  ? (pageData as CalibrationRecord[])
                  : ((await fetchAllListItems((p) =>
                      equipmentApi.listCalibrations({
                        ...p,
                        equipment_nature: MEASURING_INSTRUMENT_NATURE,
                      }),
                    )) as CalibrationRecord[]);
              if (type === 'selected' && keys?.length) {
                items = items.filter((item) => item.uuid != null && keys.includes(item.uuid));
              }
              if (!items.length) {
                messageApi.warning(t('common.noDataToExport'));
                return;
              }
              await downloadRecordsAsXlsx(
                items as Array<Record<string, unknown>>,
                `measuring-instrument-calibrations-${todaySiteDateString()}.xlsx`,
                {
                  columns: [
                    { key: 'equipment_code', title: t(`${P}.colInstrumentCode`) },
                    { key: 'equipment_name', title: t(`${P}.colInstrumentName`) },
                    { key: 'calibration_date', title: t(`${P}.colCalibrationDate`) },
                    { key: 'result', title: t(`${P}.colResult`) },
                    { key: 'certificate_no', title: t(`${P}.colCertificateNo`) },
                    { key: 'expiry_date', title: t(`${P}.colExpiryDate`) },
                    { key: 'remark', title: t('common.remark') },
                  ],
                  sheetName: t(`${P}.create`),
                },
              );
              messageApi.success(t('common.exportCountSuccess', { count: items.length }));
            } catch (error: unknown) {
              const err = error as { message?: string };
              messageApi.error(err?.message || t('common.exportFailed'));
            }
          }}
          onRow={(record) => ({
            onClick: () => perms.canRead && handleDetail(record),
            style: { cursor: perms.canRead ? 'pointer' : undefined },
          })}
          request={async (params, sort, _filter, searchFormValues) => {
            const listParams = resolveAssetWorkflowListParams(searchFormValues, sort, {
              docDateRangeKeys: ['calibration_date_range', 'calibrationDateRange'],
              docDateParamPrefix: 'calibration',
            });
            const res = await equipmentApi.listCalibrations({
              skip: ((params.current || 1) - 1) * (params.pageSize || 20),
              limit: params.pageSize || 20,
              equipment_nature: MEASURING_INSTRUMENT_NATURE,
              ...listParams,
            });
            const { data, total } = normalizeEquipmentListResponse(res);
            return { data: data as CalibrationRecord[], success: true, total };
          }}
          search={{ labelWidth: 'auto' }}
          pagination={{ defaultPageSize: 20 }}
        />
      </ListPageTemplate>

      <FormModalTemplate
        title={t(`${P}.createModal`)}
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onFinish={handleSubmit}
        isEdit={false}
        width={MODAL_CONFIG.STANDARD_WIDTH}
        formRef={formRef}
        grid={false}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProFormSelect
              name="equipment_uuid"
              label={t(`${P}.formInstrument`)}
              options={instrumentOptions}
              showSearch
              rules={[{ required: true, message: t(`${P}.formInstrumentRequired`) }]}
            />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="calibration_date"
              label={t(`${P}.colCalibrationDate`)}
              formItemProps={formDateFormItemProps}
              fieldProps={{ style: { width: '100%' } }}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormDatePicker
              name="expiry_date"
              label={t(`${P}.colExpiryDate`)}
              formItemProps={formDateFormItemProps}
              fieldProps={{ style: { width: '100%' } }}
            />
          </Col>
          <Col span={12}>
            <ProFormSelect
              name="result"
              label={t(`${P}.colResult`)}
              options={resultOptions}
              rules={[{ required: true }]}
            />
          </Col>
          <Col span={12}>
            <ProFormText name="certificate_no" label={t(`${P}.colCertificateNo`)} />
          </Col>
          <Col span={24}>
            <DocumentAttachmentsField category="equipment_calibration_attachments" />
          </Col>
          <Col span={24}>
            <ProFormText name="remark" label={t('common.remark')} />
          </Col>
        </Row>
      </FormModalTemplate>

      <DetailDrawerTemplate
        title={`${t(`${P}.detailTitle`)}${detail?.equipment_code ? ` - ${detail.equipment_code}` : ''}`}
        open={drawerVisible}
        loading={detailLoading}
        onClose={closeDetail}
        size={DRAWER_CONFIG.STANDARD_WIDTH}
        basic={
          detail ? <Descriptions column={2} size="small" items={timeconfigBasicItems} /> : undefined
        }
        supplementary={
          detail?.attachments?.length ? (
            <LineAttachmentsUpload
              category="equipment_calibration_attachments"
              value={detail.attachments}
              readOnly
            />
          ) : undefined
        }
        supplementaryTitle={t(`${P}.formAttachments`)}
      />
    </>
  );
};

export default MeasuringInstrumentCalibrationsPage;
