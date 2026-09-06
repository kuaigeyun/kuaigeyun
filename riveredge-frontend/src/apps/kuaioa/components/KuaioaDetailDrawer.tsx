/**
 * 轻办公详情抽屉：审批类 HALF_WIDTH，台账类 STANDARD_WIDTH。
 */
import React, { useMemo } from 'react';
import { Descriptions, Timeline } from 'antd';
import { useTranslation } from 'react-i18next';
import { getFileDownloadUrlWithToken } from '../../../services/file';
import {
  DetailDrawerTemplate,
  DRAWER_CONFIG,
} from '../../../components/layout-templates';
import {
  alignDescriptionColumns,
  GLOBAL_DOC_DETAIL_BASIC_FIELD_RANK,
  MASTER_DATA_DETAIL_BASIC_FIELD_RANK,
} from '../../kuaizhizao/pages/sales-management/shared/documentFieldAlignment';
import { detailDrawerDescriptionItems } from '../../../components/layout-templates/detailDrawerDescriptionItems';
import { formatDateBySiteSetting, formatDateTimeBySiteSetting } from '../../../utils/format';
import {
  renderOaActiveTag,
  renderOaApprovalStatusTag,
  renderOaStatusMarker,
  renderOaTypeMarker,
  renderOaYesNoTag,
} from '../utils/oaListPresentation';
import type { KuaioaFieldConfig } from './KuaioaCrudListPage';

export type KuaioaDetailDrawerVariant = 'approval' | 'master';

type Props = {
  open: boolean;
  onClose: () => void;
  loading?: boolean;
  record: Record<string, unknown> | null;
  fields: KuaioaFieldConfig[];
  codeField?: string;
  titleField?: string;
  variant?: KuaioaDetailDrawerVariant;
  statusEnum?: Record<string, { text: string; status?: string }>;
  statusPresentation?: 'lifecycle' | 'marker';
  extra?: React.ReactNode;
};

const TYPE_MARKER_FIELDS = new Set(['category', 'plan_type', 'license_type', 'asset_category', 'leave_type', 'seal_type']);

function renderFieldValue(
  field: KuaioaFieldConfig,
  record: Record<string, unknown>,
  t: (key: string) => string,
  statusEnum?: Record<string, { text: string; status?: string }>,
  statusPresentation?: 'lifecycle' | 'marker',
) {
  const raw = record[field.name];
  if (field.type === 'switch') {
    if (field.name === 'is_active') return renderOaActiveTag(t, Boolean(raw));
    return renderOaYesNoTag(t, Boolean(raw));
  }
  if (field.name === 'status') {
    const value = raw == null ? null : String(raw);
    if (statusPresentation === 'lifecycle') {
      return renderOaApprovalStatusTag(statusEnum, value);
    }
    return renderOaStatusMarker(statusEnum, value);
  }
  if (TYPE_MARKER_FIELDS.has(field.name)) {
    const text = raw == null || raw === '' ? '' : String(raw);
    if (!text) return '-';
    const fromOptions = field.options?.find((o) => String(o.value) === text)?.label;
    const label = fromOptions || t(`${field.labelKey}.${text}`, { defaultValue: text });
    return renderOaTypeMarker(label);
  }
  if (field.type === 'date' || field.name.endsWith('_date')) {
    return raw ? formatDateBySiteSetting(String(raw)) : '-';
  }
  if (field.type === 'datetime' || field.name.endsWith('_at')) {
    return raw ? formatDateTimeBySiteSetting(String(raw)) : '-';
  }
  if (field.type === 'file') {
    const uuid = raw == null || raw === '' ? null : String(raw);
    if (!uuid) return '-';
    return (
      <a
        href="#"
        onClick={(event) => {
          event.preventDefault();
          void getFileDownloadUrlWithToken(uuid).then((url) => {
            window.open(url, '_blank', 'noopener,noreferrer');
          });
        }}
      >
        {t('app.kuaioa.common.viewAttachment')}
      </a>
    );
  }
  if (Array.isArray(raw)) {
    if (!raw.length) return '-';
    if (field.type === 'userIds') return raw.map(String).join(t('common.listSeparator'));
    if (field.options?.length) {
      return raw
        .map((v) => field.options?.find((o) => String(o.value) === String(v))?.label || String(v))
        .join(t('common.listSeparator'));
    }
    return raw.map(String).join(t('common.listSeparator'));
  }
  if (raw == null || raw === '') return '-';
  return String(raw);
}

const KuaioaDetailDrawer: React.FC<Props> = ({
  open,
  onClose,
  loading = false,
  record,
  fields,
  codeField = 'code',
  titleField = 'name',
  variant = 'master',
  statusEnum,
  statusPresentation = 'marker',
  extra,
}) => {
  const { t } = useTranslation();
  const rankMap = variant === 'approval' ? GLOBAL_DOC_DETAIL_BASIC_FIELD_RANK : MASTER_DATA_DETAIL_BASIC_FIELD_RANK;

  const descriptionItems = useMemo(() => {
    if (!record) return [];
    const cols = fields.map((field) => ({
      title: t(field.labelKey),
      dataIndex: field.name,
      render: () => renderFieldValue(field, record, t, statusEnum, statusPresentation),
    }));
    return detailDrawerDescriptionItems(alignDescriptionColumns(cols, rankMap), record);
  }, [fields, record, rankMap, statusEnum, statusPresentation, t]);

  const titleCode = record ? String(record[codeField] ?? '') : '';
  const titleName = record ? String(record[titleField] ?? record.title ?? '') : '';

  const lifecycleItems = useMemo(() => {
    const events = record?.lifecycle_events;
    if (!Array.isArray(events) || !events.length) return null;
    return events.map((event) => {
      const row = event as Record<string, unknown>;
      const stage = String(row.stage || '');
      const stageLabel = t(`app.kuaioa.asset.stage.${stage}`, { defaultValue: stage });
      const when = row.occurred_at ? formatDateTimeBySiteSetting(String(row.occurred_at)) : '';
      const who = row.operator_name ? String(row.operator_name) : '';
      const remark = row.remark ? String(row.remark) : '';
      return {
        children: (
          <div>
            <div>{stageLabel}</div>
            <div style={{ color: 'var(--ant-color-text-secondary)', fontSize: 12 }}>
              {[when, who, remark].filter(Boolean).join(' ')}
            </div>
          </div>
        ),
      };
    });
  }, [record, t]);

  return (
    <DetailDrawerTemplate
      open={open}
      onClose={onClose}
      loading={loading}
      size={variant === 'approval' ? DRAWER_CONFIG.HALF_WIDTH : DRAWER_CONFIG.STANDARD_WIDTH}
      title={
        titleName
          ? `${titleName}${titleCode ? ` (${titleCode})` : ''}`
          : t('common.detail')
      }
      extra={extra}
      basic={
        record ? (
          <Descriptions column={2} size="small" items={descriptionItems} />
        ) : null
      }
      timeline={lifecycleItems ? <Timeline items={lifecycleItems} /> : undefined}
      timelineTitle={t('app.kuaioa.asset.lifecycle')}
    />
  );
};

export default KuaioaDetailDrawer;
