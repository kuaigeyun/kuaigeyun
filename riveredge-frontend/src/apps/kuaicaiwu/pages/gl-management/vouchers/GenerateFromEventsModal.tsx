import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { App, Button, Modal, Select, Space, Table, Tabs, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import { ActionConfirmPopconfirm } from '../../../../../components/action-confirm';
import { getApiErrorMessage } from '../../../../../utils/errorHandler';
import {
  glService,
  type GlPendingAccountingEvent,
} from '../../../services/gl';

const NS = 'app.kuaicaiwu.gl.vouchers';

const MODULE_LABELS: Record<string, string> = {
  payable: '应付',
  receivable: '应收',
  purchase_invoice: '采购发票',
  invoice: '发票',
  settlement: '收付款结算',
  payment: '付款',
  receipt: '收款',
  fixed_asset: '固定资产折旧',
  fixed_asset_adjustment: '固定资产调整',
  fixed_asset_disposal: '固定资产处置',
  fx_revaluation: '汇兑损益',
};

type TabKey = 'pending' | 'generated';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const GenerateFromEventsModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { message: messageApi } = App.useApp();
  const [tab, setTab] = useState<TabKey>('pending');
  const [businessType, setBusinessType] = useState<string | undefined>();
  const [sourceDocType, setSourceDocType] = useState<string | undefined>();
  const [businessTypes, setBusinessTypes] = useState<string[]>([]);
  const [sourceDocTypes, setSourceDocTypes] = useState<Array<{ value: string; label: string }>>(
    [],
  );
  const [rows, setRows] = useState<GlPendingAccountingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await glService.listPendingVoucherEvents({
        business_type: businessType,
        source_doc_type: sourceDocType,
        voucher_status: tab,
        limit: 200,
      });
      setRows(res.items ?? []);
      setBusinessTypes(res.business_types ?? []);
      setSourceDocTypes(res.source_doc_types ?? []);
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, t(`${NS}.eventsLoadFailed`, { defaultValue: '加载业务事件失败' })),
      );
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [businessType, messageApi, sourceDocType, t, tab]);

  useEffect(() => {
    if (!open) return;
    setSelectedRowKeys([]);
    void loadEvents();
  }, [loadEvents, open]);

  const businessTypeOptions = useMemo(
    () =>
      businessTypes.map((bt) => ({
        value: bt,
        label:
          rows.find((r) => r.business_type === bt)?.business_type_label ||
          MODULE_LABELS[bt] ||
          bt,
      })),
    [businessTypes, rows],
  );

  const columns: ColumnsType<GlPendingAccountingEvent> = useMemo(
    () => [
      {
        title: t(`${NS}.events.col.date`, { defaultValue: '事件日期' }),
        dataIndex: 'event_date',
        width: 110,
      },
      {
        title: t(`${NS}.events.col.module`, { defaultValue: '业务模块' }),
        dataIndex: 'business_type_label',
        width: 120,
        ellipsis: true,
      },
      {
        title: t(`${NS}.events.col.sourceType`, { defaultValue: '来源类型' }),
        dataIndex: 'source_doc_type_label',
        width: 120,
        ellipsis: true,
        render: (v: string | null | undefined, r) => v || r.source_doc_type || '—',
      },
      {
        title: t(`${NS}.events.col.source`, { defaultValue: '来源单号' }),
        key: 'source',
        width: 140,
        ellipsis: true,
        render: (_, r) => {
          const code = r.source_doc_code || r.target_doc_code;
          if (code) return code;
          const type = r.source_doc_type || r.target_doc_type;
          if (type && r.source_doc_id) return `${type}#${r.source_doc_id}`;
          return '—';
        },
      },
      {
        title: t(`${NS}.events.col.amount`, { defaultValue: '金额' }),
        dataIndex: 'amount',
        width: 110,
        align: 'right',
        render: (v: number) => Number(v || 0).toFixed(2),
      },
      {
        title: t(`${NS}.events.col.summary`, { defaultValue: '摘要' }),
        dataIndex: 'notes',
        ellipsis: true,
        render: (v: string | null, r) => v || r.event_type || '—',
      },
      {
        title: t(`${NS}.events.col.voucher`, { defaultValue: '凭证' }),
        key: 'voucher',
        width: 120,
        render: (_, r) =>
          r.voucher_code ? (
            <Typography.Text type="secondary">{r.voucher_code}</Typography.Text>
          ) : (
            <Typography.Text type="secondary">
              {t(`${NS}.events.notGenerated`, { defaultValue: '未生成' })}
            </Typography.Text>
          ),
      },
    ],
    [t],
  );

  const handleGenerate = async () => {
    const ids = selectedRowKeys.map((k) => Number(k)).filter((id) => id > 0);
    if (!ids.length) {
      messageApi.warning(t(`${NS}.events.selectFirst`, { defaultValue: '请先选择业务事件' }));
      return;
    }
    setSubmitting(true);
    try {
      const res = await glService.generateFromEvents(ids);
      const created = res.created_count ?? 0;
      messageApi.success(
        t(`${NS}.generateSuccess`, {
          defaultValue: '已生成 {{count}} 张凭证',
          count: created,
        }),
      );
      if (res.errors?.length) {
        messageApi.warning(res.errors.slice(0, 3).join('；'));
      }
      setSelectedRowKeys([]);
      onSuccess();
      void loadEvents();
    } catch (error) {
      messageApi.error(getApiErrorMessage(error, t(`${NS}.generateFailed`, { defaultValue: '生成失败' })));
    } finally {
      setSubmitting(false);
    }
  };

  const handleObsolete = async () => {
    const ids = selectedRowKeys.map((k) => Number(k)).filter((id) => id > 0);
    if (!ids.length) {
      messageApi.warning(t(`${NS}.events.selectFirst`, { defaultValue: '请先选择业务事件' }));
      return;
    }
    setSubmitting(true);
    try {
      const res = await glService.obsoleteVouchersFromEvents(ids);
      messageApi.success(
        t(`${NS}.events.obsoleteSuccess`, {
          defaultValue: '已作废 {{count}} 张凭证',
          count: res.obsoleted_count ?? 0,
        }),
      );
      if (res.skipped > 0) {
        messageApi.warning(
          t(`${NS}.events.obsoleteSkipped`, {
            defaultValue: '{{count}} 张已记账凭证未作废，请先反记账',
            count: res.skipped,
          }),
        );
      }
      setSelectedRowKeys([]);
      onSuccess();
      void loadEvents();
    } catch (error) {
      messageApi.error(
        getApiErrorMessage(error, t(`${NS}.events.obsoleteFailed`, { defaultValue: '作废失败' })),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={t(`${NS}.generateFromEvents`, { defaultValue: '从业务事件生成' })}
      open={open}
      onCancel={onClose}
      width={960}
      destroyOnHidden
      footer={null}
    >
      <Space orientation="vertical" style={{ width: '100%' }} size={12}>
        <Space wrap>
          <Select
            allowClear
            placeholder={t(`${NS}.events.filterModule`, { defaultValue: '按业务模块筛选' })}
            style={{ minWidth: 200 }}
            value={businessType}
            options={businessTypeOptions}
            onChange={(v) => {
              setBusinessType(v || undefined);
              setSourceDocType(undefined);
            }}
          />
          <Select
            allowClear
            placeholder={t(`${NS}.events.filterSourceType`, { defaultValue: '按来源单据类型筛选' })}
            style={{ minWidth: 200 }}
            value={sourceDocType}
            options={sourceDocTypes}
            disabled={sourceDocTypes.length === 0}
            onChange={(v) => setSourceDocType(v || undefined)}
          />
          <Button onClick={() => void loadEvents()} loading={loading}>
            {t('common.refresh', { defaultValue: '刷新' })}
          </Button>
        </Space>

        <Tabs
          activeKey={tab}
          onChange={(k) => {
            setTab(k as TabKey);
            setSelectedRowKeys([]);
          }}
          items={[
            {
              key: 'pending',
              label: t(`${NS}.events.tabPending`, { defaultValue: '待生成' }),
            },
            {
              key: 'generated',
              label: t(`${NS}.events.tabGenerated`, { defaultValue: '已生成' }),
            },
          ]}
        />

        <Table<GlPendingAccountingEvent>
          rowKey="id"
          size="small"
          loading={loading}
          columns={columns}
          dataSource={rows}
          pagination={{ pageSize: 10, showSizeChanger: false }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          scroll={{ x: 980, y: 360 }}
        />

        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button onClick={onClose}>{t('common.cancel', { defaultValue: '取消' })}</Button>
          {tab === 'pending' ? (
            <Button type="primary" loading={submitting} onClick={() => void handleGenerate()}>
              {t(`${NS}.events.generateSelected`, { defaultValue: '生成所选凭证' })}
            </Button>
          ) : (
            <ActionConfirmPopconfirm
              title={t(`${NS}.events.obsoleteConfirm`, { defaultValue: '确认作废所选事件关联的凭证？' })}
              onConfirm={() => void handleObsolete()}
            >
              <Button danger loading={submitting}>
                {t(`${NS}.events.obsoleteSelected`, { defaultValue: '作废所选凭证' })}
              </Button>
            </ActionConfirmPopconfirm>
          )}
        </Space>
      </Space>
    </Modal>
  );
};

export default GenerateFromEventsModal;
