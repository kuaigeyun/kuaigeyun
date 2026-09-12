import React, { useCallback, useMemo } from 'react';
import type { ProColumns } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import { UniReport } from '../../../../../../components/uni-report';
import { fixedAssetService } from '../../../../services/fixed-assets';

const RESOURCE = 'kuaicaiwu:fixed-asset-report';
const NS = 'app.kuaicaiwu.fixedAssets.reports.detail';

const DepreciationDetailReportPage: React.FC = () => {
  const { t } = useTranslation();

  const columns: ProColumns<Record<string, unknown>>[] = useMemo(
    () => [
      {
        title: t(`${NS}.col.period`),
        width: 104,
        uniTableKeepWidth: true,
        hideInSearch: true,
        render: (_, r) => `${r.period_year}-${String(r.period_month).padStart(2, '0')}`,
      },
      {
        title: t(`${NS}.col.runCode`),
        dataIndex: 'run_code',
        width: 132,
        uniTableKeepWidth: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.assetCode`),
        dataIndex: 'asset_code',
        width: 118,
        uniTableKeepWidth: true,
      },
      {
        title: t(`${NS}.col.assetName`),
        dataIndex: 'asset_name',
        uniTableRemainderFlex: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.category`),
        dataIndex: 'category_name',
        width: 112,
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.department`),
        dataIndex: 'department_name',
        width: 112,
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.user`),
        dataIndex: 'user_name',
        width: 88,
        uniTableKeepWidth: true,
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.originalValue`),
        dataIndex: 'original_value',
        valueType: 'money',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.accumDepr`),
        dataIndex: 'accumulated_depreciation',
        valueType: 'money',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.netValue`),
        dataIndex: 'net_value',
        valueType: 'money',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.calculated`),
        dataIndex: 'calculated_amount',
        valueType: 'money',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.final`),
        dataIndex: 'final_amount',
        valueType: 'money',
        width: 112,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.adjustment`),
        dataIndex: 'adjustment_amount',
        valueType: 'money',
        width: 104,
        uniTableKeepWidth: true,
        hideInSearch: true,
        align: 'right',
      },
      {
        title: t(`${NS}.col.expenseAccount`),
        dataIndex: 'expense_account_code',
        width: 96,
        uniTableKeepWidth: true,
        hideInSearch: true,
      },
      {
        title: t(`${NS}.col.confirmedBy`),
        dataIndex: 'confirmed_by_name',
        width: 88,
        uniTableKeepWidth: true,
        ellipsis: true,
        hideInSearch: true,
      },
      { title: t(`${NS}.field.year`), dataIndex: 'period_year', hideInTable: true, valueType: 'digit' },
      { title: t(`${NS}.field.month`), dataIndex: 'period_month', hideInTable: true, valueType: 'digit' },
      { title: t(`${NS}.col.assetName`), dataIndex: 'asset_name', hideInTable: true },
    ],
    [t],
  );

  const request = useCallback(
    async (params, _sort, _filter, searchFormValues) => {
      const items = await fixedAssetService.depreciationDetailReport({
        period_year: searchFormValues?.period_year,
        period_month: searchFormValues?.period_month,
        asset_code: searchFormValues?.asset_code,
        asset_name: searchFormValues?.asset_name,
      });
      const pageSize = Number(params.pageSize ?? 20);
      const skip = (Number(params.current ?? 1) - 1) * pageSize;
      return {
        data: items.slice(skip, skip + pageSize),
        success: true,
        total: items.length,
      };
    },
    [],
  );

  return (
    <UniReport
      title={t('app.kuaicaiwu.menu.fixed-assets.reports.depreciation-detail')}
      columnPersistenceId="apps.kuaicaiwu.fixed-assets.reports.depr-detail-v3"
      columns={columns}
      permissionResource={RESOURCE}
      rowKey="id"
      periodFilter={false}
      request={request}
      skipFuzzyPinyinClientFilter
    />
  );
};

export default DepreciationDetailReportPage;
