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

const RESOURCE = 'kuaizhizao:measuring-instrument-report-calibration-detail';

const request = createKuaizhizaoCustomReportRequest((query) => {
  const mapped = mapLegacyReportDateQuery(query);
  return equipmentApi.reportMeasuringInstrumentCalibrationDetail({
    skip: mapped.skip as number | undefined,
    limit: mapped.limit as number | undefined,
    calibration_start_date: mapped.date_from as string | undefined,
    calibration_end_date: mapped.date_to as string | undefined,
  });
});

const MeasuringInstrumentCalibrationDetailReport: React.FC = () => {
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
        title: t('app.kuaizhizao.measuringInstrumentReport.colCalibrationDate'),
        dataIndex: 'calibration_date',
        width: 120,
        hideInSearch: true,
        render: (_, r) => {
          const v = (r as { calibration_date?: string }).calibration_date;
          return v ? formatDateBySiteSetting(v) : '-';
        },
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colResult'),
        dataIndex: 'result',
        width: 90,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colCertificateNo'),
        dataIndex: 'certificate_no',
        width: 140,
        hideInSearch: true,
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colExpiryDate'),
        dataIndex: 'expiry_date',
        width: 120,
        hideInSearch: true,
        render: (_, r) => {
          const v = (r as { expiry_date?: string }).expiry_date;
          return v ? formatDateBySiteSetting(v) : '-';
        },
      },
      {
        title: t('app.kuaizhizao.measuringInstrumentReport.colAttachmentCount'),
        dataIndex: 'attachment_count',
        width: 90,
        hideInSearch: true,
      },
      {
        title: t('common.remark'),
        dataIndex: 'remark',
        ellipsis: true,
        hideInSearch: true,
      },
      {
        title: t('common.createdBy'),
        dataIndex: 'created_by_name',
        width: 100,
        hideInSearch: true,
      },
    ],
    [t],
  );

  return (
    <KuaizhizaoReport
      title={t('app.kuaizhizao.menu.reports.measuring-instrument-calibration-detail')}
      reportType="measuring-instrument-calibration-detail"
      columns={columns}
      columnPersistenceId="apps.kuaizhizao.pages.equipment-management.measuring-instruments.reports.calibration-detail-v1"
      permissionResource={RESOURCE}
      request={request}
    />
  );
};

export default MeasuringInstrumentCalibrationDetailReport;
