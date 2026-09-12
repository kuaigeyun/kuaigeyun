import React, { useCallback, useMemo } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { UniReport } from '../../../../../../components/uni-report';
import { fixedAssetService } from '../../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset-report';
const NS = 'app.kuaicaiwu.fixedAssets.reports.summary';

const DepreciationSummaryReportPage: React.FC = () => {
  const { t } = useTranslation();

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      {
        title: t(`${NS}.col.period`),
        dataIndex: 'period',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.runCount`),
        dataIndex: 'run_count',
        width: 96,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.lineCount`),
        dataIndex: 'line_count',
        width: 96,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.calculatedTotal`),
        dataIndex: 'calculated_total',
        valueType: 'money',
        width: 128,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.adjustmentTotal`),
        dataIndex: 'adjustment_total',
        valueType: 'money',
        width: 120,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.total`),
        dataIndex: 'total_amount',
        valueType: 'money',
        width: 128,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      { title: t(`${NS}.field.year`), dataIndex: 'period_year', hideInTable: true, valueType: 'digit' },
      { title: t(`${NS}.field.month`), dataIndex: 'period_month', hideInTable: true, valueType: 'digit' },
    ],
    [t],
  );

  const request = useCallback(
    async (params, _sort, _filter, searchFormValues) => {
      const items = await fixedAssetService.depreciationSummaryReport({
        period_year: searchFormValues?.period_year,
        period_month: searchFormValues?.period_month,
      });
      const pageSize = Number(params.pageSize ?? 20);
      const skip = (Number(params.current ?? 1) - 1) * pageSize;
      const summary = items.reduce(
        (acc, row) => ({
          run_count: acc.run_count + Number(row.run_count || 0),
          line_count: acc.line_count + Number(row.line_count || 0),
          calculated_total: acc.calculated_total + Number(row.calculated_total || 0),
          adjustment_total: acc.adjustment_total + Number(row.adjustment_total || 0),
          total_amount: acc.total_amount + Number(row.total_amount || 0),
        }),
        {
          run_count: 0,
          line_count: 0,
          calculated_total: 0,
          adjustment_total: 0,
          total_amount: 0,
        },
      );
      return {
        data: items.slice(skip, skip + pageSize),
        success: true,
        total: items.length,
        summary,
      };
    },
    [],
  );

  return (
    <UniReport
      title={t('app.kuaicaiwu.menu.fixed-assets.reports.depreciation-summary')}
      columnPersistenceId="apps.kuaicaiwu.fixed-assets.reports.depr-summary-v3"
      columns={columns}
      permissionResource={RESOURCE}
      rowKey="period"
      periodFilter={false}
      showSummaryRow
      summaryFields={['run_count', 'line_count', 'calculated_total', 'adjustment_total', 'total_amount']}
      request={request}
      skipFuzzyPinyinClientFilter
    />
  );
};

export default DepreciationSummaryReportPage;
