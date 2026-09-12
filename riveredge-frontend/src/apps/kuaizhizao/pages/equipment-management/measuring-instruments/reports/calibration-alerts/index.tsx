import React, { useMemo } from 'react';
import { ProColumns } from '@ant-design/pro-components';
import { useTranslation } from 'react-i18next';
import KuaizhizaoReport from '../../../../../components/KuaizhizaoReport';
import { equipmentApi } from '../../../../../services/equipment';
import {
  createKuaizhizaoCustomReportRequest,
  mapLegacyReportDateQuery,
} from '../../../../../utils/kuaizhizaoReportCore';
import { formatDateBySiteSetting } from '../../../../../../../utils/format';

const RESOURCE = 'kuaizhizao:measuring-instrument-report-calibration-alerts';

const request = createKuaizhizaoCustomReportRequest((query) =>
  equipmentApi.reportMeasuringInstrumentCalibrationAlerts(mapLegacyReportDateQuery(query)),
);

const MeasuringInstrumentCalibrationAlertsReport: React.FC = () => {
  const { t } = useTranslation();
  const columns: ProColumns[] = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colInstrumentCode'),
        dataIndex: 'equipment_code',
        width: 120,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colInstrumentName'),
        dataIndex: 'equipment_name',
        width: 160,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colAlertType'),
        dataIndex: 'due_type',
        width: 100,
        hideInSearch: true,
        render: (_, r) => {
          const dueType = (r as { due_type?: string }).due_type;
          if (dueType === 'overdue') return t('app.kuaizhizao.measuringInstrumentCalibrationReminder.statusOverdue');
          if (dueType === 'due_soon') return t('app.kuaizhizao.measuringInstrumentCalibrationReminder.statusDueSoon');
          return dueType ?? '-';
        },
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colDueDate'),
        dataIndex: 'due_date',
        width: 120,
        hideInSearch: true,
        render: (_, r) => {
          const v = (r as { due_date?: string }).due_date;
          return v ? formatDateBySiteSetting(v) : '-';
        },
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colDaysUntilDue'),
        dataIndex: 'days_until_due',
        width: 100,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colLastCalibrationDate'),
        dataIndex: 'last_calibration_date',
        width: 120,
        hideInSearch: true,
        render: (_, r) => {
          const v = (r as { last_calibration_date?: string }).last_calibration_date;
          return v ? formatDateBySiteSetting(v) : '-';
        },
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colCalibrationPeriod'),
        dataIndex: 'calibration_period',
        width: 100,
        hideInSearch: true,
        render: (_, r) => {
          const count = (r as { calibration_period?: number }).calibration_period;
          return count != null
            ? t('app.kuaizhizao.measuringInstrument.periodDays', { count })
            : '-';
        },
      },
    ],
    [t],
  );

  return (
    <KuaizhizaoReport
      title={t('app.kuaizhizao.menu.reports.measuring-instrument-calibration-alerts')}
      reportType="measuring-instrument-calibration-alerts"
      columns={columns}
      columnPersistenceId="apps.kuaizhizao.pages.equipment-management.measuring-instruments.reports.calibration-alerts-v1"
      permissionResource={RESOURCE}
      request={request}
    />
  );
};

export default MeasuringInstrumentCalibrationAlertsReport;
