/**
 * R-05 质量投诉数据分析（直接读投诉真源，禁止第二统计表）
 */
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProColumns } from '@ant-design/pro-components';
import { ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { App, Button, Input, Space } from 'antd';
import { ThemedSegmented } from '../../../../../components/themed-segmented/ThemedSegmented';
import { FormModalTemplate, MODAL_CONFIG } from '../../../../../components/layout-templates';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import { formatDateTimeBySiteSetting } from '../../../../../utils/format';
import KuaizhizaoReport from '../../../components/KuaizhizaoReport';
import { QUALITY_REPORT_TYPES } from '../../../constants/qualityReportTypes';
import { qualityComplaintBatchMonthApi } from '../../../services/quality-complaint-batch-month';

type AnalysisView =
  | 'monthly_list'
  | 'defect_distribution'
  | 'supplier_rank'
  | 'supplier_trend'
  | 'alert'
  | 'batch_rate';

const VIEW_REPORT_TYPE: Record<AnalysisView, string> = {
  monthly_list: QUALITY_REPORT_TYPES.COMPLAINT_MONTHLY_LIST,
  defect_distribution: QUALITY_REPORT_TYPES.COMPLAINT_DEFECT_DISTRIBUTION,
  supplier_rank: QUALITY_REPORT_TYPES.COMPLAINT_SUPPLIER_RANK,
  supplier_trend: QUALITY_REPORT_TYPES.COMPLAINT_SUPPLIER_TREND,
  alert: QUALITY_REPORT_TYPES.COMPLAINT_ALERT,
  batch_rate: QUALITY_REPORT_TYPES.COMPLAINT_BATCH_RATE,
};

const QualityComplaintAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions('kuaizhizao:quality-analysis');
  const [view, setView] = useState<AnalysisView>('monthly_list');
  const [supplierName, setSupplierName] = useState<string>('');
  const [batchModalOpen, setBatchModalOpen] = useState(false);
  const [batchFormKey, setBatchFormKey] = useState(0);
  const [reloadNonce, setReloadNonce] = useState(0);

  const reportType = VIEW_REPORT_TYPE[view];

  const columns = useMemo<ProColumns<Record<string, unknown>>[]>(() => {
    if (view === 'defect_distribution') {
      return [
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colDefectCategory'),
          dataIndex: 'defect_category_label',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colCount'),
          dataIndex: 'count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colSharePct'),
          dataIndex: 'share_pct',
          render: (v) => (v == null || v === '' ? '' : `${v}%`),
        },
      ];
    }
    if (view === 'supplier_rank') {
      return [
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colSupplierCode'),
          dataIndex: 'supplier_code',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colSupplierName'),
          dataIndex: 'supplier_name',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colBatchFailCount'),
          dataIndex: 'batch_fail_count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colComplaintCount'),
          dataIndex: 'complaint_count',
        },
      ];
    }
    if (view === 'supplier_trend') {
      return [
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colYearMonth'),
          dataIndex: 'year_month',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colComplaintCount'),
          dataIndex: 'complaint_count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colBatchFailCount'),
          dataIndex: 'batch_fail_count',
        },
      ];
    }
    if (view === 'alert') {
      return [
        {
          title: t('app.kuaizhizao.qualityComplaint.colCode'),
          dataIndex: 'code',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colAlertType'),
          dataIndex: 'alert_type_label',
        },
        {
          title: t('app.kuaizhizao.qualityComplaint.colBusinessType'),
          dataIndex: 'business_type_label',
        },
        {
          title: t('app.kuaizhizao.qualityComplaint.colTitle'),
          dataIndex: 'title',
        },
        {
          title: t('app.kuaizhizao.qualityComplaint.colSupplier'),
          dataIndex: 'supplier_name',
        },
        {
          title: t('app.kuaizhizao.qualityComplaint.colMaterialCode'),
          dataIndex: 'material_code',
        },
        {
          title: t('app.kuaizhizao.qualityComplaint.colDueAt'),
          dataIndex: 'due_at',
          render: (v) => formatDateTimeBySiteSetting(v as string),
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colStatus'),
          dataIndex: 'status',
        },
      ];
    }
    if (view === 'batch_rate') {
      return [
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colYearMonth'),
          dataIndex: 'year_month',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colComplaintCount'),
          dataIndex: 'complaint_count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colBatchFailCount'),
          dataIndex: 'batch_fail_count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colTotalBatchCount'),
          dataIndex: 'total_batch_count',
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colComplaintRatePct'),
          dataIndex: 'complaint_rate_pct',
          render: (v) => (v == null || v === '' ? '' : `${v}%`),
        },
        {
          title: t('app.kuaizhizao.qualityComplaintAnalysis.colRemarks'),
          dataIndex: 'remarks',
        },
      ];
    }
    return [
      {
        title: t('app.kuaizhizao.qualityComplaintAnalysis.colYearMonth'),
        dataIndex: 'year_month',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colCode'),
        dataIndex: 'code',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colBusinessType'),
        dataIndex: 'business_type_label',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colDefectCategory'),
        dataIndex: 'defect_category_label',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colTitle'),
        dataIndex: 'title',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colSupplier'),
        dataIndex: 'supplier_name',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colMaterialCode'),
        dataIndex: 'material_code',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colMaterialName'),
        dataIndex: 'material_name',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colBatchNo'),
        dataIndex: 'batch_no',
      },
      {
        title: t('app.kuaizhizao.qualityComplaintAnalysis.colStatus'),
        dataIndex: 'status',
      },
      {
        title: t('app.kuaizhizao.qualityComplaint.colDueAt'),
        dataIndex: 'due_at',
        render: (v) => formatDateTimeBySiteSetting(v as string),
      },
    ];
  }, [t, view]);

  const rowKey =
    view === 'monthly_list' || view === 'alert'
      ? 'id'
      : view === 'supplier_rank'
        ? 'id'
        : view === 'defect_distribution'
          ? 'id'
          : 'year_month';

  return (
    <>
      <KuaizhizaoReport
        title={t('app.kuaizhizao.menu.reports.quality-complaint-analysis')}
        reportType={reportType}
        columnPersistenceId={`apps.kuaizhizao.pages.quality-management.reports.QualityComplaintAnalysis-${view}-v1`}
        permissionResource="kuaizhizao:quality-analysis"
        domain="quality"
        rowKey={rowKey}
        columns={columns}
        summaryFields={
          view === 'defect_distribution' || view === 'alert'
            ? ['count']
            : view === 'supplier_rank'
              ? ['count', 'batch_fail_count']
              : ['count']
        }
        params={{
          _reload: reloadNonce,
          ...(view === 'supplier_trend' && supplierName.trim()
            ? { supplier_name: supplierName.trim() }
            : {}),
        }}
        beforeSearchButtons={
          <Space wrap>
            <ThemedSegmented
              surfaceBackground
              size="small"
              value={view}
              onChange={(value) => setView(value as AnalysisView)}
              options={[
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabMonthlyList'),
                  value: 'monthly_list',
                },
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabDefect'),
                  value: 'defect_distribution',
                },
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabSupplierRank'),
                  value: 'supplier_rank',
                },
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabSupplierTrend'),
                  value: 'supplier_trend',
                },
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabAlert'),
                  value: 'alert',
                },
                {
                  label: t('app.kuaizhizao.qualityComplaintAnalysis.tabBatchRate'),
                  value: 'batch_rate',
                },
              ]}
            />
            {view === 'supplier_trend' ? (
              <Input
                allowClear
                style={{ width: 200 }}
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder={t('app.kuaizhizao.qualityComplaintAnalysis.supplierTrendPlaceholder')}
              />
            ) : null}
            {view === 'batch_rate' && perms.canUpdate ? (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  setBatchFormKey((k) => k + 1);
                  setBatchModalOpen(true);
                }}
              >
                {t('app.kuaizhizao.qualityComplaintAnalysis.enterBatchTotal')}
              </Button>
            ) : null}
          </Space>
        }
      />

      <FormModalTemplate
        key={batchFormKey}
        title={t('app.kuaizhizao.qualityComplaintAnalysis.enterBatchTotal')}
        open={batchModalOpen}
        onOpenChange={setBatchModalOpen}
        width={MODAL_CONFIG.STANDARD_WIDTH}
        modalProps={{ destroyOnHidden: true }}
        onFinish={async (values) => {
          try {
            await qualityComplaintBatchMonthApi.upsert({
              year_month: values.year_month,
              total_batch_count: Number(values.total_batch_count),
              remarks: values.remarks,
            });
            messageApi.success(t('app.kuaizhizao.qualityComplaintAnalysis.batchSaveSuccess'));
            setBatchModalOpen(false);
            setReloadNonce((n) => n + 1);
            return true;
          } catch (error) {
            messageApi.error(getApiErrorMessage(error));
            return false;
          }
        }}
      >
        <ProFormText
          name="year_month"
          label={t('app.kuaizhizao.qualityComplaintAnalysis.colYearMonth')}
          rules={[{ required: true }, { pattern: /^\d{4}-\d{2}$/, message: 'YYYY-MM' }]}
          placeholder="YYYY-MM"
        />
        <ProFormDigit
          name="total_batch_count"
          label={t('app.kuaizhizao.qualityComplaintAnalysis.colTotalBatchCount')}
          rules={[{ required: true }]}
          min={0}
          fieldProps={{ precision: 0 }}
        />
        <ProFormTextArea
          name="remarks"
          label={t('app.kuaizhizao.qualityComplaintAnalysis.colRemarks')}
        />
      </FormModalTemplate>
    </>
  );
};

export default QualityComplaintAnalysis;
