/**
 * 工序卡「质检」行 Hover：检验情况概览（用工序接口已返回的质检字段，禁止另拉接口）。
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getOperationInspectionMode,
  getOperationQualityMetrics,
  getProcessInspectionCardStatus,
} from '../../../../utils/workOrderReporting';

function pickText(operation: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const raw = operation[key];
    if (raw == null) continue;
    const text = String(raw).trim();
    if (text) return text;
  }
  return '';
}

function pickNumber(operation: Record<string, unknown>, ...keys: string[]): number | null {
  for (const key of keys) {
    const raw = operation[key];
    if (raw == null || raw === '') continue;
    const n = Number(raw);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function pickStringList(operation: Record<string, unknown>, ...keys: string[]): string[] {
  for (const key of keys) {
    const raw = operation[key];
    if (!Array.isArray(raw)) continue;
    return raw.map((item) => String(item ?? '').trim()).filter(Boolean);
  }
  return [];
}

function OverviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, lineHeight: 1.5, marginBottom: 4 }}>
      <span style={{ flexShrink: 0, opacity: 0.85 }}>{label}</span>
      <span style={{ minWidth: 0, wordBreak: 'break-word' }}>{value}</span>
    </div>
  );
}

export interface OperationInspectionOverviewTooltipProps {
  operation: Record<string, unknown> | null | undefined;
}

export const OperationInspectionOverviewTooltip: React.FC<OperationInspectionOverviewTooltipProps> = ({
  operation,
}) => {
  const { t } = useTranslation();
  const row = (operation ?? {}) as Record<string, unknown>;
  const mode = getOperationInspectionMode(row);
  const metrics = getOperationQualityMetrics(row);
  const qcStatus = getProcessInspectionCardStatus(row);

  const planLabels = (() => {
    const labels = pickStringList(row, 'inspection_plan_labels', 'inspectionPlanLabels');
    if (labels.length) return labels;
    const joined = pickText(row, 'inspection_plan_label', 'inspectionPlanLabel');
    return joined ? [joined] : [];
  })();

  const pendingCodes = pickStringList(row, 'process_inspection_pending_codes', 'processInspectionPendingCodes');
  const pendingCount =
    pickNumber(row, 'process_inspection_pending_count', 'processInspectionPendingCount') ??
    pendingCodes.length;
  const qcPendingQty = pickNumber(row, 'qc_pending_quantity', 'qcPendingQuantity');
  const transferQty = pickNumber(row, 'transfer_qualified_quantity', 'transferQualifiedQuantity');

  const modeLabel =
    mode === 'simple'
      ? t('app.kuaizhizao.workOrder.opCard.inspectionSimple')
      : mode === 'plan'
        ? t('app.kuaizhizao.workOrder.opCard.inspectionPlan')
        : t('app.kuaizhizao.workOrder.opCard.inspectionNone');

  return (
    <div style={{ maxWidth: 280, padding: '2px 0' }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t('app.kuaizhizao.workOrder.opCard.inspectionOverview.title')}
      </div>
      <OverviewRow
        label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.mode')}
        value={modeLabel}
      />
      {mode === 'none' ? (
        <div style={{ opacity: 0.9 }}>
          {t('app.kuaizhizao.workOrder.opCard.inspectionOverview.noneHint')}
        </div>
      ) : null}
      {mode === 'plan' && planLabels.length > 0 ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.plans')}
          value={
            <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 2 }}>
              {planLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </span>
          }
        />
      ) : null}
      {mode === 'plan' && qcStatus ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.status')}
          value={t(`app.kuaizhizao.workOrder.opCard.processInspectionStatus.${qcStatus}`)}
        />
      ) : null}
      {mode === 'plan' && pendingCount > 0 ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.pendingCount')}
          value={String(pendingCount)}
        />
      ) : null}
      {mode === 'plan' && pendingCodes.length > 0 ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.pendingCodes')}
          value={pendingCodes.join('、')}
        />
      ) : null}
      {mode === 'plan' && qcPendingQty != null && qcPendingQty > 0 ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.qcPendingQty')}
          value={String(qcPendingQty)}
        />
      ) : null}
      {mode !== 'none' ? (
        <>
          <OverviewRow
            label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.qualified')}
            value={String(metrics.qualified)}
          />
          <OverviewRow
            label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.unqualified')}
            value={String(metrics.unqualified)}
          />
        </>
      ) : null}
      {mode === 'plan' && transferQty != null ? (
        <OverviewRow
          label={t('app.kuaizhizao.workOrder.opCard.inspectionOverview.transferQualified')}
          value={String(transferQty)}
        />
      ) : null}
    </div>
  );
};

export default OperationInspectionOverviewTooltip;
