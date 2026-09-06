/**
 * 生产日报汇总（R-13）
 */
import React, { useEffect, useMemo, useState } from 'react';
import { ProColumns } from '@ant-design/pro-components';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import KuaizhizaoReport from '../../../components/KuaizhizaoReport';
import { reportDocumentStatusText } from '../../../utils/reportPresentation';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import {
  productionDailyTemplateApi,
  type ProductionDailyTemplate,
} from '../../../services/production-daily';

const ProductionDailySummaryReport: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [templates, setTemplates] = useState<ProductionDailyTemplate[]>([]);

  useEffect(() => {
    void (async () => {
      try {
        const res = await productionDailyTemplateApi.list({ active_only: true });
        setTemplates(res.items);
      } catch (error) {
        setTemplates([]);
        message.error(getApiErrorMessage(error, t('common.loadFailed')));
      }
    })();
  }, [message, t]);

  const templateEnum = useMemo(() => {
    const map: Record<string, { text: string }> = {};
    templates.forEach((tpl) => {
      map[tpl.template_code] = { text: tpl.template_name };
    });
    return map;
  }, [templates]);

  const dynamicFieldColumns = useMemo<ProColumns[]>(() => {
    const seen = new Map<string, string>();
    templates.forEach((tpl) => {
      (tpl.field_schema || []).forEach((field) => {
        if (!seen.has(field.key)) {
          seen.set(field.key, field.label);
        }
      });
    });
    return Array.from(seen.entries()).map(([key, label]) => ({
      title: label,
      dataIndex: `f_${key}`,
      width: 120,
      hideInSearch: true,
      ellipsis: true,
    }));
  }, [templates]);

  const columns: ProColumns[] = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.productionDaily.reportCode'),
        dataIndex: 'code',
        width: 140,
        sorter: true,
        search: { order: 10 } as ProColumns['search'],
      },
      {
        title: t('app.kuaizhizao.productionDaily.reportDate'),
        dataIndex: 'report_date',
        valueType: 'date',
        width: 120,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.productionDaily.templateName'),
        dataIndex: 'template_code',
        width: 140,
        valueEnum: templateEnum,
        search: { order: 20 } as ProColumns['search'],
        render: (_, record) => record.template_name || record.template_code,
      },
      {
        title: t('app.kuaizhizao.productionDaily.teamName'),
        dataIndex: 'team_name',
        width: 120,
        search: { order: 30 } as ProColumns['search'],
      },
      {
        title: t('app.kuaizhizao.productionDaily.shiftName'),
        dataIndex: 'shift_name',
        width: 100,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.productionDaily.workshopName'),
        dataIndex: 'workshop_name',
        width: 120,
        hideInSearch: true,
      },
      ...dynamicFieldColumns,
      {
        title: t('common.status'),
        dataIndex: 'status',
        width: 100,
        hideInSearch: true,
        render: (_, record) =>
          reportDocumentStatusText(
            t,
            record.status === 'submitted' ? 'approved' : 'draft',
          ),
      },
    ],
    [dynamicFieldColumns, t, templateEnum],
  );

  return (
    <KuaizhizaoReport
      title={t('app.kuaizhizao.menu.reports.production-daily')}
      reportType="production_daily"
      domain="production"
      columnPersistenceId="apps.kuaizhizao.pages.production-execution.reports.ProductionDaily-v1"
      rowKey="id"
      columns={columns}
    />
  );
};

export default ProductionDailySummaryReport;
