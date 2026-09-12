/**
 * 业务配置 - 定时任务（内置预设 + 可编辑 cron/启用）
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { App, Button, Input, InputNumber, Select, Space, Switch, Typography } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProFormSelect, ProFormSwitch, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { ReloadOutlined } from '@ant-design/icons';
import { UniTable } from '../uni-table';
import { FormModalTemplate, MODAL_CONFIG } from '../layout-templates';
import { StatusTag } from '../../constants/statusBadges';
import { formatDateTime } from '../../utils/format';
import {
  getScheduledTaskList,
  syncScheduledTaskPresets,
  updateScheduledTask,
  startScheduledTask,
  stopScheduledTask,
  type ScheduledTask,
} from '../../services/scheduledTask';

const { Paragraph, Text } = Typography;

const MODULE_LABEL_KEYS: Record<string, string> = {
  common: 'pages.system.configCenter.category.common',
  sales: 'app.kuaizhizao.menu.sales-management',
  planning: 'app.kuaizhizao.menu.plan-management',
  procurement: 'app.kuaizhizao.menu.purchase-management',
  production: 'app.kuaizhizao.menu.production-execution',
  quality: 'app.kuaizhizao.menu.quality-management',
  equipment: 'app.kuaizhizao.menu.equipment-management',
  warehouse: 'app.kuaizhizao.menu.warehouse-management',
  finance: 'app.kuaizhizao.menu.finance-management',
};

export type ScheduledTasksPanelProps = {
  showPageHeader?: boolean;
};

export const ScheduledTasksPanel: React.FC<ScheduledTasksPanelProps> = ({
  showPageHeader = true,
}) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<ScheduledTask | null>(null);
  const [triggerType, setTriggerType] = useState<'cron' | 'interval'>('cron');
  const [triggerCron, setTriggerCron] = useState('0 8 * * *');
  const [triggerIntervalSeconds, setTriggerIntervalSeconds] = useState(1800);
  const [formInitialValues, setFormInitialValues] = useState<Record<string, unknown>>({});

  const syncPresets = useCallback(async () => {
    setLoading(true);
    try {
      await syncScheduledTaskPresets();
      actionRef.current?.reload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('pages.system.configCenter.scheduledTasks.syncFailed');
      messageApi.error(msg);
    } finally {
      setLoading(false);
    }
  }, [messageApi, t]);

  useEffect(() => {
    void syncPresets();
  }, [syncPresets]);

  const openEdit = (record: ScheduledTask) => {
    setEditRecord(record);
    setTriggerType(record.trigger_type === 'interval' ? 'interval' : 'cron');
    const tc = record.trigger_config || {};
    setTriggerCron(String(tc.cron || '0 8 * * *'));
    setTriggerIntervalSeconds(typeof tc.seconds === 'number' ? tc.seconds : 1800);
    setFormInitialValues({
      name: record.name,
      description: record.description,
      is_active: record.is_active,
    });
    setEditOpen(true);
  };

  const handleSave = async (values: Record<string, unknown>) => {
    if (!editRecord) return;
    const trigger_config =
      triggerType === 'interval'
        ? { seconds: triggerIntervalSeconds }
        : { cron: triggerCron.trim() };
    try {
      await updateScheduledTask(editRecord.uuid, {
        name: String(values.name || editRecord.name),
        description: values.description ? String(values.description) : undefined,
        trigger_type: triggerType,
        trigger_config,
        is_active: Boolean(values.is_active),
      });
      messageApi.success(t('common.saveSuccess'));
      setEditOpen(false);
      actionRef.current?.reload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('common.saveFailed');
      messageApi.error(msg);
    }
  };

  const toggleActive = async (record: ScheduledTask, active: boolean) => {
    try {
      if (active) {
        await startScheduledTask(record.uuid);
      } else {
        await stopScheduledTask(record.uuid);
      }
      actionRef.current?.reload();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : t('common.operationFailed');
      messageApi.error(msg);
    }
  };

  const columns: ProColumns<ScheduledTask>[] = useMemo(
    () => [
      {
        title: t('pages.system.configCenter.scheduledTasks.colName'),
        dataIndex: 'name',
        width: 180,
        ellipsis: true,
      },
      {
        title: t('pages.system.configCenter.scheduledTasks.colModule'),
        dataIndex: 'preset_module',
        width: 120,
        render: (_, record) => {
          const key = record.preset_module ? MODULE_LABEL_KEYS[record.preset_module] : undefined;
          return key ? t(key) : record.preset_module || '-';
        },
      },
      {
        title: t('pages.system.configCenter.scheduledTasks.colSchedule'),
        dataIndex: 'trigger_config',
        width: 160,
        render: (_, record) => {
          const cfg = record.trigger_config || {};
          if (record.trigger_type === 'interval') {
            const sec = cfg.seconds;
            return t('pages.system.configCenter.scheduledTasks.intervalSeconds', {
              seconds: sec ?? '-',
            });
          }
          return String(cfg.cron || '-');
        },
      },
      {
        title: t('pages.system.configCenter.scheduledTasks.colEnabled'),
        dataIndex: 'is_active',
        width: 88,
        align: 'center',
        render: (_, record) => (
          <Switch
            checked={record.is_active}
            onChange={(checked) => void toggleActive(record, checked)}
          />
        ),
      },
      {
        title: t('pages.system.configCenter.scheduledTasks.colLastRun'),
        dataIndex: 'last_run_at',
        width: 168,
        render: (_, record) => formatDateTime(record.last_run_at) || '-',
      },
      {
        title: t('pages.system.configCenter.scheduledTasks.colLastStatus'),
        dataIndex: 'last_run_status',
        width: 96,
        align: 'center',
        render: (_, record) => {
          if (!record.last_run_status) return '-';
          return (
            <StatusTag
              value={record.last_run_status === 'success' ? 'completed' : 'rejected'}
              text={
                record.last_run_status === 'success'
                  ? t('pages.system.configCenter.scheduledTasks.statusSuccess')
                  : t('pages.system.configCenter.scheduledTasks.statusFailed')
              }
            />
          );
        },
      },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 88,
        fixed: 'right',
        render: (_, record) => (
          <Button type="link" size="small" onClick={() => openEdit(record)}>
            {t('common.edit')}
          </Button>
        ),
      },
    ],
    [t],
  );

  return (
    <div>
      {showPageHeader ? (
        <div style={{ marginBottom: 16 }}>
          <Typography.Title level={5} style={{ marginBottom: 8 }}>
            {t('pages.system.configCenter.scheduledTasks.title')}
          </Typography.Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('pages.system.configCenter.scheduledTasks.description')}
          </Paragraph>
        </div>
      ) : null}

      <UniTable<ScheduledTask>
        actionRef={actionRef}
        rowKey="uuid"
        columns={columns}
        loading={loading}
        search={false}
        pagination={{ pageSize: 20 }}
        request={async () => {
          const items = await getScheduledTaskList({ limit: 200 });
          const presetItems = items.filter((row) => row.is_preset);
          return { data: presetItems, success: true, total: presetItems.length };
        }}
        toolBarRender={() => [
          <Button
            key="sync"
            icon={<ReloadOutlined />}
            onClick={() => void syncPresets()}
            loading={loading}
          >
            {t('pages.system.configCenter.scheduledTasks.syncPresets')}
          </Button>,
        ]}
      />

      <FormModalTemplate
        title={t('pages.system.configCenter.scheduledTasks.editTitle')}
        open={editOpen}
        onOpenChange={setEditOpen}
        initialValues={formInitialValues}
        onFinish={handleSave}
        width={MODAL_CONFIG.STANDARD_WIDTH}
        modalProps={{ destroyOnHidden: true }}
      >
        <ProFormText
          name="name"
          label={t('pages.system.configCenter.scheduledTasks.colName')}
          rules={[{ required: true }]}
        />
        <ProFormTextArea
          name="description"
          label={t('pages.system.configCenter.scheduledTasks.colDescription')}
          fieldProps={{ rows: 2 }}
        />
        <ProFormSelect
          label={t('pages.system.configCenter.scheduledTasks.triggerType')}
          fieldProps={{
            value: triggerType,
            onChange: (v) => setTriggerType(v as 'cron' | 'interval'),
            options: [
              { label: t('pages.system.configCenter.scheduledTasks.triggerCron'), value: 'cron' },
              {
                label: t('pages.system.configCenter.scheduledTasks.triggerInterval'),
                value: 'interval',
              },
            ],
          }}
        />
        {triggerType === 'cron' ? (
          <div style={{ marginBottom: 24 }}>
            <Text>{t('pages.system.configCenter.scheduledTasks.cronExpression')}</Text>
            <Input
              value={triggerCron}
              onChange={(e) => setTriggerCron(e.target.value)}
              placeholder="*/30 * * * *"
              style={{ marginTop: 8 }}
            />
            <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
              {t('pages.system.configCenter.scheduledTasks.cronHint')}
            </Paragraph>
          </div>
        ) : (
          <div style={{ marginBottom: 24 }}>
            <Text>{t('pages.system.configCenter.scheduledTasks.intervalSecondsLabel')}</Text>
            <InputNumber
              min={60}
              step={60}
              value={triggerIntervalSeconds}
              onChange={(v) => setTriggerIntervalSeconds(Number(v) || 60)}
              style={{ width: '100%', marginTop: 8 }}
            />
          </div>
        )}
        <ProFormSwitch
          name="is_active"
          label={t('pages.system.configCenter.scheduledTasks.colEnabled')}
        />
        {editRecord?.code ? (
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {t('pages.system.configCenter.scheduledTasks.presetCodeHint', {
              code: editRecord.code,
            })}
          </Paragraph>
        ) : null}
      </FormModalTemplate>
    </div>
  );
};
