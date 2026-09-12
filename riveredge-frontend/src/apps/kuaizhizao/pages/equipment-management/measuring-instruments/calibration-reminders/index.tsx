import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { SettingOutlined } from '@ant-design/icons';
import { App, Button, InputNumber, Popover, Space, Tag } from 'antd';
import { UniTable } from '../../../../../../components/uni-table';
import { ListPageTemplate } from '../../../../../../components/layout-templates';
import { useResourcePermissions } from '../../../../../../hooks/useResourcePermissions';
import { equipmentApi } from '../../../../services/equipment';
import { formatDateTime, todaySiteDateString } from '../../../../../../utils/format';
import { downloadRecordsAsXlsx } from '../../../../../../utils/exportRecordsXlsx';
import { fetchAllListItems } from '../../../../../../utils/fetchAllListPages';
import { UniTableStackedPrimaryCell } from '../../../../../../components/uni-table/stackedPrimaryColumn';
import {
  EquipmentMasterDetailDrawer,
  useEquipmentDetailDrawer,
} from '../../shared/equipmentMasterDataDetail';
import { MEASURING_INSTRUMENT_NATURE } from '../measuringInstrumentConstants';

const RESOURCE = 'kuaizhizao:measuring-instrument-calibration-reminder';
const P = 'app.kuaizhizao.measuringInstrumentCalibrationReminder';

interface CalibrationReminder {
  equipment_uuid?: string;
  equipment_code?: string;
  equipment_name?: string;
  due_date?: string;
  days_until_due?: number;
  due_type?: string;
  calibration_period?: number;
  last_calibration_date?: string;
}

const buildReminderRowKey = (record: CalibrationReminder) =>
  [record.equipment_uuid, record.due_date, record.due_type].filter(Boolean).join(':') ||
  'mi-calibration-reminder';

const MeasuringInstrumentCalibrationRemindersPage: React.FC = () => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const perms = useResourcePermissions(RESOURCE);
  const actionRef = useRef<ActionType>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { open: detailVisible, loading: detailLoading, detail, openDetail, closeDetail } =
    useEquipmentDetailDrawer<CalibrationReminder>();
  const [detailTitle, setDetailTitle] = useState('');
  const [advanceDays, setAdvanceDays] = useState(30);
  const [draftAdvanceDays, setDraftAdvanceDays] = useState(30);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    if (!perms.canRead) return;
    void equipmentApi.getCalibrationReminderSettings().then((res) => {
      setAdvanceDays(res.advance_days);
      setDraftAdvanceDays(res.advance_days);
    });
  }, [perms.canRead]);

  const handleDetail = useCallback(
    (record: CalibrationReminder) => {
      setDetailTitle(record.equipment_name ?? t(`${P}.detailTitle`));
      void openDetail(async () => record);
    },
    [openDetail, t],
  );

  const detailColumns = useMemo<ProDescriptionsItemProps<CalibrationReminder>[]>(
    () => [
      { title: t(`${P}.colInstrumentCode`), dataIndex: 'equipment_code' },
      { title: t(`${P}.colInstrumentName`), dataIndex: 'equipment_name' },
      {
        title: t(`${P}.colDueDate`),
        dataIndex: 'due_date',
        render: (_, r) => (r.due_date ? formatDateTime(r.due_date, 'YYYY-MM-DD') : '-'),
      },
      {
        title: t(`${P}.colDaysUntilDue`),
        dataIndex: 'days_until_due',
        render: (_, r) => {
          const v = r.days_until_due ?? 0;
          if (v < 0) return t(`${P}.overdueDays`, { count: Math.abs(v) });
          return t(`${P}.daysRemaining`, { count: v });
        },
      },
      {
        title: t(`${P}.colLastCalibrationDate`),
        dataIndex: 'last_calibration_date',
        render: (_, r) =>
          r.last_calibration_date ? formatDateTime(r.last_calibration_date, 'YYYY-MM-DD') : '-',
      },
      {
        title: t(`${P}.colCalibrationPeriod`),
        dataIndex: 'calibration_period',
        render: (_, r) =>
          r.calibration_period != null ? t(`${P}.periodDays`, { count: r.calibration_period }) : '-',
      },
    ],
    [t],
  );

  const columns: ProColumns<CalibrationReminder>[] = useMemo(
    () => [
      {
        title: t(`${P}.colInstrumentName`),
        dataIndex: 'equipment_name',
        uniTablePrimaryFlex: true,
        hideInSearch: true,
        render: (_, r) => (
          <UniTableStackedPrimaryCell
            primary={String(r.equipment_name ?? '') || '-'}
            secondary={String(r.equipment_code ?? '') || '-'}
            onPrimaryClick={() => handleDetail(r)}
          />
        ),
      },
      {
        title: t(`${P}.colDueDate`),
        dataIndex: 'due_date',
        width: 120,
        uniTableKeepWidth: true,
        hideInSearch: true,
        render: (_, r) => (r.due_date ? formatDateTime(r.due_date, 'YYYY-MM-DD') : '-'),
      },
      {
        title: t(`${P}.colDaysUntilDue`),
        dataIndex: 'days_until_due',
        width: 100,
        uniTableKeepWidth: true,
        hideInSearch: true,
        render: (_, r) => {
          const v = r.days_until_due ?? 0;
          if (v < 0) return <Tag color="red">{t(`${P}.overdueDays`, { count: Math.abs(v) })}</Tag>;
          return <span>{t(`${P}.daysRemaining`, { count: v })}</span>;
        },
      },
      {
        title: t(`${P}.colReminderStatus`),
        dataIndex: 'due_type',
        valueType: 'select',
        valueEnum: {
          due_soon: { text: t(`${P}.statusDueSoon`) },
          overdue: { text: t(`${P}.statusOverdue`) },
        },
      },
    ],
    [handleDetail, t],
  );

  const settingsToolbar = useMemo(
    () => (
      <Popover
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (open) setDraftAdvanceDays(advanceDays);
        }}
        trigger="click"
        styles={{ body: { maxWidth: 280, padding: 12 } }}
        content={
          <Space direction="vertical" size="middle" style={{ width: 256 }}>
            <div
              style={{
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: 1.5,
                color: 'rgba(0, 0, 0, 0.65)',
              }}
            >
              {t(`${P}.advanceDaysHint`)}
            </div>
            <Space wrap>
              <span>{t(`${P}.advanceDaysLabel`)}</span>
              <InputNumber
                min={1}
                max={365}
                precision={0}
                value={draftAdvanceDays}
                disabled={!perms.canUpdate}
                onChange={(value) => {
                  if (typeof value === 'number') setDraftAdvanceDays(value);
                }}
              />
            </Space>
            <Button
              type="primary"
              block
              loading={settingsLoading}
              disabled={!perms.canUpdate}
              onClick={async () => {
                setSettingsLoading(true);
                try {
                  const res = await equipmentApi.updateCalibrationReminderSettings({
                    advance_days: draftAdvanceDays,
                  });
                  setAdvanceDays(res.advance_days);
                  setDraftAdvanceDays(res.advance_days);
                  messageApi.success(t(`${P}.settingsSaved`));
                  setSettingsOpen(false);
                  actionRef.current?.reload();
                } catch (error: unknown) {
                  const err = error as { message?: string };
                  messageApi.error(err?.message || t('common.saveFailed'));
                } finally {
                  setSettingsLoading(false);
                }
              }}
            >
              {t('common.save')}
            </Button>
          </Space>
        }
      >
        <Button icon={<SettingOutlined />}>
          {t(`${P}.advanceDaysShort`, { count: advanceDays })}
        </Button>
      </Popover>
    ),
    [
      advanceDays,
      draftAdvanceDays,
      messageApi,
      perms.canUpdate,
      settingsLoading,
      settingsOpen,
      t,
    ],
  );

  if (!perms.canRead) return null;

  return (
    <>
      <ListPageTemplate>
        <UniTable<CalibrationReminder>
          columnPersistenceId="apps.kuaizhizao.pages.equipment-management.measuring-instruments.calibration-reminders-v2"
          actionRef={actionRef}
          permissionResource={RESOURCE}
          enableRowSelection={perms.canExport}
          selectedRowKeys={selectedRowKeys}
          onRowSelectionChange={setSelectedRowKeys}
          rowKey={buildReminderRowKey}
          columns={columns}
          showExportButton={perms.canExport}
          toolBarActionsEnd={[settingsToolbar]}
          onExport={async (type, keys, pageData) => {
            try {
              let items: CalibrationReminder[] =
                type === 'currentPage' && pageData?.length
                  ? (pageData as CalibrationReminder[])
                  : ((await fetchAllListItems((p) =>
                      equipmentApi.listCalibrationReminders({
                        ...p,
                        equipment_nature: MEASURING_INSTRUMENT_NATURE,
                      }),
                    )) as CalibrationReminder[]);
              if (type === 'selected' && keys?.length) {
                items = items.filter((item) => keys.includes(buildReminderRowKey(item)));
              }
              if (!items.length) {
                messageApi.warning(t('common.noDataToExport'));
                return;
              }
              await downloadRecordsAsXlsx(
                items.map((item) => ({
                  ...item,
                  due_type:
                    item.due_type === 'overdue'
                      ? t(`${P}.statusOverdue`)
                      : item.due_type === 'due_soon'
                        ? t(`${P}.statusDueSoon`)
                        : item.due_type,
                  days_until_due:
                    (item.days_until_due ?? 0) < 0
                      ? t(`${P}.overdueDays`, { count: Math.abs(item.days_until_due ?? 0) })
                      : t(`${P}.daysRemaining`, { count: item.days_until_due ?? 0 }),
                })) as Array<Record<string, unknown>>,
                `measuring-instrument-calibration-reminders-${todaySiteDateString()}.xlsx`,
                {
                  columns: [
                    { key: 'equipment_code', title: t(`${P}.colInstrumentCode`) },
                    { key: 'equipment_name', title: t(`${P}.colInstrumentName`) },
                    { key: 'due_date', title: t(`${P}.colDueDate`) },
                    { key: 'days_until_due', title: t(`${P}.colDaysUntilDue`) },
                    { key: 'due_type', title: t(`${P}.colReminderStatus`) },
                    { key: 'last_calibration_date', title: t(`${P}.colLastCalibrationDate`) },
                    { key: 'calibration_period', title: t(`${P}.colCalibrationPeriod`) },
                  ],
                  sheetName: t(`${P}.detailTitle`),
                },
              );
              messageApi.success(t('common.exportCountSuccess', { count: items.length }));
            } catch (error: unknown) {
              const err = error as { message?: string };
              messageApi.error(err?.message || t('common.exportFailed'));
            }
          }}
          onRow={(record) => ({
            onClick: () => handleDetail(record),
            style: { cursor: 'pointer' },
          })}
          request={async (params) => {
            const res = await equipmentApi.listCalibrationReminders({
              skip: ((params.current || 1) - 1) * (params.pageSize || 20),
              limit: params.pageSize || 20,
              due_type: params.due_type as string | undefined,
              equipment_nature: MEASURING_INSTRUMENT_NATURE,
            });
            return { data: res.items || [], success: true, total: res.total || 0 };
          }}
          search={{ labelWidth: 'auto' }}
          pagination={{ defaultPageSize: 20 }}
        />
      </ListPageTemplate>

      <EquipmentMasterDetailDrawer
        open={detailVisible}
        loading={detailLoading}
        detail={detail as Record<string, unknown> | null}
        title={detailTitle}
        onClose={closeDetail}
        basicColumns={detailColumns as ProDescriptionsItemProps<Record<string, unknown>>[]}
      />
    </>
  );
};

export default MeasuringInstrumentCalibrationRemindersPage;
