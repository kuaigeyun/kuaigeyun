import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  createComplianceLicense,
  deleteComplianceLicense,
  getComplianceLicense,
  listComplianceLicenses,
  listExpiringLicenses,
  updateComplianceLicense,
} from '../../../services/licenses';
import {
  buildLicenseNotifyChannelOptions,
  buildLicenseTypeOptions,
} from '../../../utils/oaFormEnums';

const LicensesPage: React.FC = () => {
  const { t } = useTranslation();
  const typeOptions = useMemo(() => buildLicenseTypeOptions(t), [t]);
  const channelOptions = useMemo(() => buildLicenseNotifyChannelOptions(t), [t]);

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.license.createButton"
      resource="kuaioa:license"
      codeField="license_code"
      nameField="license_name"
      autoGenerateCode
      statusPresentation="marker"
      detailVariant="master"
      getDetailFn={getComplianceLicense}
      columnPersistenceId="apps.kuaioa.license.list-v6"
      createFormDefaults={{
        notify_enabled: true,
        notify_channels: ['internal'],
        reminder_days: 30,
      }}
      fields={[
        { name: 'license_code', labelKey: 'app.kuaioa.license.code', width: 140 },
        { name: 'license_name', labelKey: 'app.kuaioa.license.name', required: true, width: 200 },
        {
          name: 'license_type',
          labelKey: 'app.kuaioa.license.type',
          width: 140,
          type: 'select',
          options: typeOptions,
          required: true,
        },
        { name: 'holder_name', labelKey: 'app.kuaioa.license.holder', width: 120 },
        { name: 'issue_date', labelKey: 'app.kuaioa.license.issueDate', width: 120, type: 'date', hideInTable: true },
        { name: 'expiry_date', labelKey: 'app.kuaioa.license.expiry', width: 120, type: 'date' },
        {
          name: 'reminder_days',
          labelKey: 'app.kuaioa.common.reminderDays',
          width: 100,
          type: 'number',
          hideInTable: true,
        },
        {
          name: 'notify_user_ids',
          labelKey: 'app.kuaioa.license.notifyUsers',
          type: 'userIds',
          hideInTable: true,
        },
        {
          name: 'notify_channels',
          labelKey: 'app.kuaioa.license.notifyChannels',
          type: 'select',
          mode: 'multiple',
          options: channelOptions,
          hideInTable: true,
        },
        { name: 'file_uuid', labelKey: 'app.kuaioa.license.attachment', type: 'file', hideInTable: true },
        { name: 'status', labelKey: 'common.status', width: 100, hideInForm: true },
        { name: 'issuing_authority', labelKey: 'app.kuaioa.license.authority', hideInTable: true },
        { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' },
        {
          name: 'notify_enabled',
          labelKey: 'app.kuaioa.license.notifyEnabled',
          type: 'switch',
          hideInTable: true,
        },
      ]}
      listFn={listComplianceLicenses}
      expiringListFn={() => listExpiringLicenses(30)}
      createFn={createComplianceLicense}
      updateFn={updateComplianceLicense}
      deleteFn={deleteComplianceLicense}
    />
  );
};

export default LicensesPage;
