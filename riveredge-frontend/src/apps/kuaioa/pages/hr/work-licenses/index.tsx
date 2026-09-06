import React from 'react';
import { useTranslation } from 'react-i18next';
import { App } from 'antd';
import KuaioaCrudListPage from '../../../components/KuaioaCrudListPage';
import {
  createWorkLicense,
  deleteWorkLicense,
  getWorkLicense,
  listExpiringWorkLicenses,
  listWorkLicenses,
  printWorkLicense,
  updateWorkLicense,
} from '../../../services/training';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';

const WorkLicensesPage: React.FC = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const perms = useResourcePermissions('kuaioa:work-license');

  return (
    <KuaioaCrudListPage
      createButtonKey="app.kuaioa.workLicense.createButton"
      resource="kuaioa:work-license"
      codeField="license_code"
      nameField="license_name"
      autoGenerateCode
      statusPresentation="marker"
      detailVariant="master"
      getDetailFn={getWorkLicense}
      columnPersistenceId="apps.kuaioa.work-license.list-v6"
      fields={[
        { name: 'license_code', labelKey: 'app.kuaioa.workLicense.code', width: 140 },
        { name: 'license_name', labelKey: 'app.kuaioa.workLicense.name', required: true, width: 200 },
        { name: 'license_type', labelKey: 'app.kuaioa.workLicense.type', width: 120 },
        { name: 'holder_name', labelKey: 'app.kuaioa.workLicense.holder', width: 120 },
        {
          name: 'department_name',
          labelKey: 'app.kuaioa.common.department',
          width: 120,
          hideInTable: true,
        },
        {
          name: 'issue_date',
          labelKey: 'app.kuaioa.workLicense.issueDate',
          width: 120,
          type: 'date',
          hideInTable: true,
        },
        { name: 'expiry_date', labelKey: 'app.kuaioa.workLicense.expiry', width: 120, type: 'date' },
        {
          name: 'reminder_days',
          labelKey: 'app.kuaioa.common.reminderDays',
          width: 100,
          type: 'number',
          hideInTable: true,
        },
        { name: 'status', labelKey: 'common.status', width: 100 },
        { name: 'notes', labelKey: 'common.remark', hideInTable: true, type: 'textarea' },
      ]}
      listFn={listWorkLicenses}
      expiringListFn={() => listExpiringWorkLicenses(30)}
      createFn={createWorkLicense}
      updateFn={updateWorkLicense}
      deleteFn={deleteWorkLicense}
      extraActions={
        perms.canPrint
          ? [
              {
                key: 'print',
                labelKey: 'app.kuaioa.workLicense.print',
                deferSuccess: true,
                onClick: async (record) => {
                  const payload = await printWorkLicense(Number(record.id));
                  const lines = (payload.fields || [])
                    .map((f) => `<tr><th>${f.label}</th><td>${f.value ?? ''}</td></tr>`)
                    .join('');
                  const win = window.open('', '_blank', 'width=720,height=900');
                  if (!win) {
                    message.error(t('app.kuaioa.workLicense.printBlocked'));
                    return;
                  }
                  win.document.write(
                    `<!doctype html><html><head><title>${payload.title}</title>` +
                      `<style>body{font-family:sans-serif;padding:24px}table{width:100%;border-collapse:collapse}` +
                      `th,td{border:1px solid #333;padding:8px;text-align:left}th{width:140px;background:#f5f5f5}` +
                      `h1{text-align:center}</style></head><body>` +
                      `<h1>${payload.title}</h1><table>${lines}</table>` +
                      `<script>window.onload=function(){window.print();}</script></body></html>`,
                  );
                  win.document.close();
                },
              },
            ]
          : []
      }
    />
  );
};

export default WorkLicensesPage;
