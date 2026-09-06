import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Segmented, Space, Typography, theme, Result, Switch } from 'antd';
import { AlertOutlined, CheckCircleOutlined, DashboardOutlined } from '@ant-design/icons';
import { ListPageTemplate } from '../../../../components/layout-templates';
import { useResourcePermissions } from '../../../../hooks/useResourcePermissions';
import { useRequest } from 'ahooks';
import { kuaielectronicsEsdApi } from '../../services/esd';
import {
  ModuleCenterLayout,
  ModuleKpiRow,
  ModuleActionMasonry,
  ModuleActionPanel,
  ModuleFeedList,
  showMasonryCard,
  masonryWeightFromRows,
  resolveMasonryEmptyFallback,
} from '../../../kuaizhizao/components/module-center';
import type { ModuleKpiDef } from '../../../kuaizhizao/components/module-center';
import type { ModuleFeedItem } from '../../../kuaizhizao/components/module-center';

const { Text } = Typography;

const ALERT_KIND_COLOR: Record<string, string> = {
  spot_abnormal: 'error',
  spot_review_pending: 'processing',
  spot_incomplete: 'default',
};

/** ESD 专项看板：总览 + 主数据厂区切换。 */
export default function KuaiElectronicsEsdDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const perms = useResourcePermissions('kuaielectronics:esd');
  const [plantKey, setPlantKey] = useState('all');
  const plantId = plantKey === 'all' ? undefined : Number(plantKey);
  const [visitMode, setVisitMode] = useState(false);

  const { data: plantsResult } = useRequest(() => kuaielectronicsEsdApi.getBoardPlants(), {
    ready: !perms.enabled || perms.canRead,
  });
  const { data: board, loading } = useRequest(
    () => kuaielectronicsEsdApi.getBoard(plantId, visitMode),
    {
      ready: !perms.enabled || perms.canRead,
      refreshDeps: [plantKey, visitMode],
      pollingInterval: 60_000,
    },
  );

  if (perms.enabled && !perms.canRead) {
    return (
      <ListPageTemplate>
        <Result status="403" title={t('common.noPermission')} />
      </ListPageTemplate>
    );
  }

  const m = board?.metrics;
  const plants = plantsResult?.items ?? [];
  const alerts = board?.alerts ?? [];

  const plantOptions = useMemo(
    () => [
      { label: t('app.kuaielectronics.esd.plantOverview'), value: 'all' },
      ...plants.map((p) => ({ label: p.name || p.code, value: String(p.id) })),
    ],
    [plants, t],
  );

  const kpis: ModuleKpiDef[] = useMemo(
    () => [
      {
        key: 'due',
        title: t('app.kuaielectronics.esd.kpi.due'),
        value: m?.spot_check_due ?? 0,
        icon: <DashboardOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
        sideMetrics: [
          { label: t('app.kuaielectronics.esd.kpi.equipment'), value: m?.total_count ?? 0 },
        ],
      },
      {
        key: 'rate',
        title: t('app.kuaielectronics.esd.kpi.rate'),
        value: `${m?.spot_check_rate ?? 0}%`,
        progress: m?.spot_check_rate ?? 0,
        icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
        sideMetrics: [
          { label: t('app.kuaielectronics.esd.kpi.done'), value: m?.spot_check_done ?? 0 },
          { label: t('app.kuaielectronics.esd.kpi.pending'), value: m?.spot_check_pending ?? 0 },
        ],
      },
      {
        key: 'alerts',
        title: t('app.kuaielectronics.esd.kpi.alerts'),
        value: m?.alert_count ?? 0,
        icon: <AlertOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        onClick: () => navigate('/apps/kuaielectronics/esd/inspection'),
        sideMetrics: [
          {
            label: t('app.kuaielectronics.esd.kpi.reviewPending'),
            value: m?.spot_check_review_pending ?? 0,
          },
        ],
      },
    ],
    [m, navigate, t],
  );

  const alertFeedItems: ModuleFeedItem[] = useMemo(
    () =>
      alerts.slice(0, 12).map((row, idx) => ({
        id: `${row.kind}-${row.document_no ?? row.equipment_code ?? idx}`,
        title: row.title,
        subtitle: row.detail,
        tag: {
          label: t(`app.kuaielectronics.esd.alertKind.${row.kind}`),
          color: ALERT_KIND_COLOR[row.kind] || 'default',
        },
        onClick: row.link_path ? () => navigate(row.link_path as string) : undefined,
      })),
    [alerts, navigate, t],
  );

  const tickerText = useMemo(() => {
    if (!alerts.length) return '';
    return alerts
      .slice(0, 20)
      .map((a) => `${a.title}${a.detail ? ` ${a.detail}` : ''}`)
      .join('    |    ');
  }, [alerts]);

  const hasAlerts = alertFeedItems.length > 0;
  const masonryEmptyFallback = resolveMasonryEmptyFallback(loading, [hasAlerts]);

  return (
    <ListPageTemplate>
      <ModuleCenterLayout
        loading={loading && !board}
        showSidebar={false}
        kpiRow={
          <Space orientation="vertical" size={12} style={{ width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <Space size={8} wrap>
                <DashboardOutlined style={{ color: token.colorPrimary }} />
                <Text strong>{t('app.kuaielectronics.menu.esdDashboard')}</Text>
                {board?.spot_check_date ? (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('app.kuaielectronics.esd.spotCheckDate', { date: board.spot_check_date })}
                  </Text>
                ) : null}
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('app.kuaizhizao.equipmentDashboard.visitMode')}
                </Text>
                <Switch size="small" checked={visitMode} onChange={setVisitMode} />
              </Space>
              <Segmented
                value={plantKey}
                options={plantOptions}
                onChange={(value) => setPlantKey(String(value))}
              />
            </div>
            {tickerText ? (
              <div
                style={{
                  overflow: 'hidden',
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: 6,
                  background: token.colorFillAlter,
                  padding: '6px 0',
                }}
              >
                <div
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    paddingLeft: '100%',
                    animation: 'kz-esd-alert-marquee 40s linear infinite',
                    fontSize: 12,
                    color: token.colorTextSecondary,
                  }}
                >
                  {tickerText}
                </div>
                <style>{`
                  @keyframes kz-esd-alert-marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                  }
                `}</style>
              </div>
            ) : null}
            <ModuleKpiRow items={kpis} />
          </Space>
        }
        actionRow={
          <ModuleActionMasonry>
            {showMasonryCard(loading, hasAlerts, masonryEmptyFallback) ? (
              <ModuleActionPanel
                layout="masonry"
                title={t('app.kuaielectronics.esd.alertsTitle')}
                loading={loading}
                masonryWeight={masonryWeightFromRows(Math.min(alertFeedItems.length, 8))}
              >
                <ModuleFeedList
                  items={alertFeedItems}
                  emptyText={t('app.kuaielectronics.esd.noAlerts')}
                />
              </ModuleActionPanel>
            ) : null}
          </ModuleActionMasonry>
        }
      />
    </ListPageTemplate>
  );
}
