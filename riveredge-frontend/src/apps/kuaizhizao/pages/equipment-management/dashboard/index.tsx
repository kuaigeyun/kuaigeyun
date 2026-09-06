import React, { Suspense, lazy, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Segmented,
  Space,
  Switch,
  Table,
  Typography,
  theme,
  message,
} from 'antd';
import {
  ToolOutlined,
  CalendarOutlined,
  DashboardOutlined,
  SettingOutlined,
  AlertOutlined,
  SafetyCertificateOutlined,
  BuildOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mesDashboardService } from '../../../services/dashboard';
import { equipmentFaultApi, maintenancePlanApi, sparePartApi } from '../../../services/equipment';
import { spotChecksApi } from '../../../services/equipmentOps';
import { useDashboardRequest } from '../../../utils/dashboardRequestOptions';
import { useResourcePermissions } from '../../../../../hooks/useResourcePermissions';
import {
  ModuleCenterLayout,
  ModuleKpiRow,
  ModuleShortcutGrid,
  ModuleActionPanel,
  ModuleActionMasonry,
  ModuleTodoList,
  ModuleChartPanel,
  ModuleChartMount,
  ModuleFeedList,
  showMasonryCard,
  masonryWeightFromRows,
  resolveMasonryEmptyFallback,
  MASONRY_CHART_WEIGHT,
} from '../../../components/module-center';
import type { ModuleKpiDef, ModuleShortcutDef } from '../../../components/module-center';
import type { ModuleFeedItem } from '../../../components/module-center';
import { StatusTag, MarkerTag } from '../../../../../constants/statusBadges';

const { Text } = Typography;

const VISIT_METRIC_FIELDS = [
  'total_count',
  'faulty_count',
  'spot_check_due',
  'spot_check_done',
  'spot_check_pending',
  'spot_check_rate',
  'failure_rate',
  'alert_count',
] as const;

const EquipmentTrendColumn = lazy(async () => {
  const { Column } = await import('@ant-design/charts');
  return { default: (props: React.ComponentProps<typeof Column>) => <Column {...props} /> };
});

const EquipmentStatusPie = lazy(async () => {
  const { Pie } = await import('@ant-design/charts');
  return { default: (props: React.ComponentProps<typeof Pie>) => <Pie {...props} /> };
});

const SPOT_CHECK_PENDING = new Set(['draft', 'pending', '待执行', '草稿', 'DRAFT', 'PENDING']);
const TABLE_DISPLAY_ROWS = 6;
const TODO_DISPLAY_ROWS = 8;
const ALERT_KIND_COLOR: Record<string, string> = {
  spot_abnormal: 'error',
  fault_open: 'warning',
  spot_review_pending: 'processing',
  spot_incomplete: 'default',
  repair_arrival_overdue: 'error',
};

function stripLeadingAlertLabel(label: string, text: string): string {
  const trimmed = text.trim();
  if (!label || !trimmed) return trimmed;
  if (trimmed === label) return '';
  if (trimmed.startsWith(label)) {
    return trimmed.slice(label.length).replace(/^[\s:：\-—|/]+/, '').trim();
  }
  return trimmed;
}

function unwrapList(res: unknown): Record<string, unknown>[] {
  if (Array.isArray(res)) return res as Record<string, unknown>[];
  const payload = res as { items?: Record<string, unknown>[]; data?: Record<string, unknown>[] };
  return payload?.items ?? payload?.data ?? [];
}

const EquipmentDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [plantKey, setPlantKey] = useState<string>('all');
  const plantId = plantKey === 'all' ? undefined : Number(plantKey);
  const [visitMode, setVisitMode] = useState(false);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [visitSaving, setVisitSaving] = useState(false);
  const [visitForm] = Form.useForm();
  const visitPerms = useResourcePermissions('kuaizhizao:equipment-board-visit');

  const { data: plantsResult } = useDashboardRequest(
    () => mesDashboardService.getEquipmentBoardPlants(),
    'kz:equipment-dashboard:board-plants',
  );
  const { data: board, loading: boardLoading, refresh: refreshBoard } = useDashboardRequest(
    () => mesDashboardService.getEquipmentBoard(plantId, 30, visitMode),
    `kz:equipment-dashboard:board:${plantKey}:visit-${visitMode ? 1 : 0}`,
    { pollingInterval: 60_000 },
  );
  const { data: summary, loading: summaryLoading } = useDashboardRequest(
    mesDashboardService.getEquipmentSummary,
    'kz:equipment-dashboard:summary',
  );
  const { data: todosData, loading: todosLoading } = useDashboardRequest(
    () => mesDashboardService.getTodosByModule('equipment', 8),
    'kz:equipment-dashboard:todos',
  );
  const { data: recentFaultsResult, loading: faultsLoading } = useDashboardRequest(async () => {
    const res = await equipmentFaultApi.list({ limit: 6 });
    return unwrapList(res);
  }, 'kz:equipment-dashboard:faults');
  const { data: recentMaintenanceResult, loading: maintenanceLoading } = useDashboardRequest(async () => {
    const res = await maintenancePlanApi.list({ limit: 6 });
    return unwrapList(res);
  }, 'kz:equipment-dashboard:maintenance');
  const { data: spotChecksResult, loading: spotChecksLoading } = useDashboardRequest(async () => {
    const res = await spotChecksApi.list({ limit: 12 });
    return unwrapList(res).filter((row) => SPOT_CHECK_PENDING.has(String(row.status ?? '')));
  }, 'kz:equipment-dashboard:spot-checks');
  const { data: spareAlertsResult, loading: spareAlertsLoading } = useDashboardRequest(async () => {
    const res = await sparePartApi.getAlerts();
    return Array.isArray(res) ? res : unwrapList(res);
  }, 'kz:equipment-dashboard:spare-alerts');
  const { data: trendData, loading: trendLoading } = useDashboardRequest(
    mesDashboardService.getEquipmentTrend,
    'kz:equipment-dashboard:trend',
  );

  const s = summary as Record<string, number> | undefined;
  const m = board?.metrics;
  const plants = plantsResult?.items ?? [];
  const alerts = board?.alerts ?? [];
  const recentFaults = recentFaultsResult || [];
  const recentMaintenance = recentMaintenanceResult || [];
  const spotChecks = spotChecksResult || [];
  const spareAlerts = spareAlertsResult || [];
  const todos = todosData?.items || [];

  const plantOptions = useMemo(
    () => [
      { label: t('app.kuaizhizao.equipmentDashboard.plantOverview'), value: 'all' },
      ...plants.map((p) => ({
        label: p.name || p.code,
        value: String(p.id),
      })),
    ],
    [plants, t],
  );

  const alertKindLabel = (kind: string) =>
    t(`app.kuaizhizao.equipmentDashboard.alertKind.${kind}`);

  const kpis: ModuleKpiDef[] = useMemo(
    () => [
      {
        key: 'equipment',
        title: t('app.kuaizhizao.equipmentDashboard.kpi.totalEquipment'),
        value: m?.total_count ?? s?.total_count ?? 0,
        subtitle:
          (m?.faulty_count ?? s?.faulty_count ?? 0) > 0
            ? t('app.kuaizhizao.equipmentDashboard.kpi.faultSubtitleWithCount', {
                count: m?.faulty_count ?? s?.faulty_count ?? 0,
              })
            : t('app.kuaizhizao.equipmentDashboard.kpi.faultSubtitleHealthy'),
        icon: <BuildOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
        onClick: () => navigate('/apps/kuaizhizao/equipment-management/equipment'),
        sideMetrics: [
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.faultInProgress'),
            value: m?.faulty_count ?? s?.faulty_count ?? 0,
          },
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.openFaults'),
            value: m?.open_fault_count ?? 0,
          },
        ],
      },
      {
        key: 'spotCheck',
        title: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckRate'),
        value: `${m?.spot_check_rate ?? 0}%`,
        subtitle: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckSubtitle', {
          date: board?.spot_check_date ?? '',
        }),
        icon: <CheckCircleOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
        progress: m?.spot_check_rate ?? 0,
        onClick: () => navigate('/apps/kuaizhizao/equipment-management/spot-checks'),
        sideMetrics: [
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckDue'),
            value: m?.spot_check_due ?? 0,
          },
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckDone'),
            value: m?.spot_check_done ?? 0,
          },
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckPending'),
            value: m?.spot_check_pending ?? 0,
          },
        ],
      },
      {
        key: 'failure',
        title: t('app.kuaizhizao.equipmentDashboard.kpi.failureRate'),
        value: `${m?.failure_rate ?? s?.failure_rate ?? 0}%`,
        subtitle: t('app.kuaizhizao.equipmentDashboard.kpi.failureSubtitle'),
        icon: <ToolOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
        onClick: () =>
          navigate('/apps/kuaizhizao/equipment-management/equipment-faults?status=处理中'),
        sideMetrics: [
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.spotCheckReviewPending'),
            value: m?.spot_check_review_pending ?? 0,
          },
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.alertCount'),
            value: m?.alert_count ?? 0,
          },
        ],
      },
      {
        key: 'calibration',
        title: t('app.kuaizhizao.equipmentDashboard.kpi.calibrationNeeded'),
        value: s?.calibration_needed ?? 0,
        subtitle: t('app.kuaizhizao.equipmentDashboard.kpi.calibrationSubtitle'),
        icon: <SafetyCertificateOutlined style={{ fontSize: 24, color: '#fff' }} />,
        gradient: 'linear-gradient(135deg, #faad14 0%, #ffbb33 100%)',
        onClick: () => navigate('/apps/kuaizhizao/equipment-management/equipment'),
        sideMetrics: [
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.availability'),
            value: `${s?.availability_rate ?? 0}%`,
          },
          {
            label: t('app.kuaizhizao.equipmentDashboard.kpi.oee'),
            value: `${s?.average_oee ?? 0}%`,
          },
        ],
      },
    ],
    [board?.spot_check_date, m, navigate, s, t],
  );

  const shortcuts: ModuleShortcutDef[] = useMemo(
    () => [
      {
        key: 'ledger',
        title: t('app.kuaizhizao.equipmentDashboard.shortcut.ledger'),
        icon: <BuildOutlined style={{ fontSize: 22, color: '#1890ff' }} />,
        path: '/apps/kuaizhizao/equipment-management/equipment',
      },
      {
        key: 'maint',
        title: t('app.kuaizhizao.equipmentDashboard.shortcut.maintenance'),
        icon: <CalendarOutlined style={{ fontSize: 22, color: '#52c41a' }} />,
        path: '/apps/kuaizhizao/equipment-management/maintenance-plans',
      },
      {
        key: 'fault',
        title: t('app.kuaizhizao.equipmentDashboard.shortcut.fault'),
        icon: <AlertOutlined style={{ fontSize: 22, color: '#ff4d4f' }} />,
        path: '/apps/kuaizhizao/equipment-management/equipment-faults',
      },
      {
        key: 'spotCheck',
        title: t('app.kuaizhizao.menu.equipment-management.spot-checks'),
        icon: <SafetyCertificateOutlined style={{ fontSize: 22, color: '#722ed1' }} />,
        path: '/apps/kuaizhizao/equipment-management/spot-checks',
      },
      {
        key: 'spare',
        title: t('app.kuaizhizao.equipmentDashboard.shortcut.spareParts'),
        icon: <SettingOutlined style={{ fontSize: 22, color: '#fa8c16' }} />,
        path: '/apps/kuaizhizao/equipment-management/spare-parts',
      },
    ],
    [t],
  );

  const statusPieData = useMemo(() => {
    const breakdown = board?.status_breakdown ?? [];
    if (breakdown.length > 0) {
      return breakdown.map((row) => ({ type: row.status, value: row.count }));
    }
    return [
      {
        type: t('app.kuaizhizao.equipmentDashboard.chart.statusNormal'),
        value: Math.max(0, (m?.total_count ?? s?.total_count ?? 0) - (m?.faulty_count ?? s?.faulty_count ?? 0)),
      },
      {
        type: t('app.kuaizhizao.equipmentDashboard.chart.statusFault'),
        value: m?.faulty_count ?? s?.faulty_count ?? 0,
      },
    ];
  }, [board?.status_breakdown, m, s, t]);

  const alertFeedItems: ModuleFeedItem[] = useMemo(
    () =>
      alerts.slice(0, 12).map((row, idx) => {
        const kindLabel = alertKindLabel(row.kind);
        const title =
          stripLeadingAlertLabel(kindLabel, row.title || '') || row.title || kindLabel;
        return {
          id: `${row.kind}-${row.document_no ?? row.equipment_code ?? idx}`,
          title,
          subtitle: row.detail,
          tag: {
            label: kindLabel,
            color: ALERT_KIND_COLOR[row.kind] || 'default',
          },
          onClick: row.link_path
            ? () => navigate(row.link_path as string)
            : undefined,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t via alertKindLabel
    [alerts, navigate, t],
  );

  const tickerItems = useMemo(() => {
    if (!alerts.length) return [];
    return alerts.slice(0, 20).map((a, idx) => {
      const kindLabel = alertKindLabel(a.kind);
      const primary = stripLeadingAlertLabel(kindLabel, a.title || '') || a.title || kindLabel;
      const secondary = (a.detail || '').trim();
      return {
        id: `${a.kind}-${a.document_no ?? a.equipment_code ?? idx}`,
        kind: a.kind,
        kindLabel,
        primary,
        secondary,
        linkPath: a.link_path as string | undefined,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- t via alertKindLabel
  }, [alerts, t]);

  const tickerDurationSec = Math.max(36, tickerItems.length * 5);

  const faultColumns = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.equipmentDashboard.colFaultNo'),
        dataIndex: 'fault_no',
        render: (text: string, record: { id?: number }) => (
          <a
            onClick={() =>
              navigate(
                record.id
                  ? `/apps/kuaizhizao/equipment-management/equipment-faults/${record.id}`
                  : '/apps/kuaizhizao/equipment-management/equipment-faults',
              )
            }
          >
            {text}
          </a>
        ),
      },
      {
        title: t('app.kuaizhizao.equipmentDashboard.colEquipment'),
        dataIndex: 'equipment_name',
        ellipsis: true,
      },
      {
        title: t('common.status'),
        dataIndex: 'status',
        width: 80,
        render: (status: string) => <StatusTag color="error">{status}</StatusTag>,
      },
    ],
    [navigate, t],
  );

  const maintenanceColumns = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.equipmentDashboard.colMaintenanceName'),
        dataIndex: 'plan_name',
        ellipsis: true,
        render: (text: string, record: Record<string, unknown>) =>
          String(text || record.name || '—'),
      },
      {
        title: t('app.kuaizhizao.equipmentDashboard.colNextPlanDate'),
        dataIndex: 'planned_start_date',
        width: 110,
        render: (value: string, record: Record<string, unknown>) => {
          const raw = value || record.next_execution_date;
          const label =
            raw == null
              ? '—'
              : String(raw).includes('T')
                ? String(raw).slice(0, 10)
                : String(raw).slice(0, 10);
          return (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {label}
            </Text>
          );
        },
      },
    ],
    [t],
  );

  const spotCheckColumns = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.equipmentDashboard.colSpotCheckCode'),
        dataIndex: 'document_no',
        render: (text: string, record: { id?: number; check_code?: string }) => (
          <a onClick={() => navigate('/apps/kuaizhizao/equipment-management/spot-checks')}>
            {text || record.check_code || record.id}
          </a>
        ),
      },
      {
        title: t('app.kuaizhizao.equipmentDashboard.colEquipment'),
        dataIndex: 'equipment_name',
        ellipsis: true,
      },
    ],
    [navigate, t],
  );

  const spareAlertColumns = useMemo(
    () => [
      {
        title: t('app.kuaizhizao.equipmentDashboard.colSparePart'),
        dataIndex: 'part_name',
        ellipsis: true,
        render: (text: string, record: Record<string, unknown>) =>
          String(text || record.spare_part_name || record.name || record.material_name || '—'),
      },
      {
        title: t('app.kuaizhizao.equipmentDashboard.colStockQty'),
        dataIndex: 'current_stock',
        width: 72,
        render: (_: unknown, record: Record<string, unknown>) =>
          String(record.current_stock ?? record.current_quantity ?? record.quantity ?? '—'),
      },
    ],
    [t],
  );

  const pendingFaults = recentFaults
    .filter((f) => !String(f.status).includes('完成') && !String(f.status).includes('fixed'))
    .slice(0, TABLE_DISPLAY_ROWS);
  const spotCheckRows = spotChecks.slice(0, TABLE_DISPLAY_ROWS);
  const maintenanceRows = recentMaintenance.slice(0, TABLE_DISPLAY_ROWS);
  const spareAlertRows = spareAlerts.slice(0, TABLE_DISPLAY_ROWS);
  const hasTrendData = (trendData?.items || []).some((it: { count?: number }) => Number(it.count) > 0);
  const hasStatusPieData = statusPieData.some((d) => Number(d.value) > 0);
  const hasAlerts = alertFeedItems.length > 0;

  const masonryLoading =
    todosLoading ||
    faultsLoading ||
    spotChecksLoading ||
    maintenanceLoading ||
    spareAlertsLoading ||
    trendLoading ||
    boardLoading;
  const masonryEmptyFallback = resolveMasonryEmptyFallback(masonryLoading, [
    todos.length > 0,
    hasAlerts,
    pendingFaults.length > 0,
    spotCheckRows.length > 0,
    maintenanceRows.length > 0,
    spareAlertRows.length > 0,
    hasTrendData,
    hasStatusPieData,
  ]);

  return (
    <>
    <ModuleCenterLayout
      loading={(summaryLoading && !s) || (boardLoading && !board)}
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
              <Text strong>{t('app.kuaizhizao.equipmentDashboard.boardTitle')}</Text>
              {board?.spot_check_date ? (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t('app.kuaizhizao.equipmentDashboard.spotCheckDate', {
                    date: board.spot_check_date,
                  })}
                </Text>
              ) : null}
              {(visitPerms.canRead || visitPerms.canAction?.('display')) && (
                <Space size={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t('app.kuaizhizao.equipmentDashboard.visitMode')}
                  </Text>
                  <Switch
                    size="small"
                    checked={visitMode}
                    onChange={(checked) => setVisitMode(checked)}
                  />
                  {visitMode && visitPerms.canAction?.('display') ? (
                    <Button
                      size="small"
                      type="link"
                      onClick={() => {
                        const source = board?.source_metrics || board?.metrics || {};
                        const overrides = board?.visit_overrides || [];
                        const overrideMap = Object.fromEntries(
                          overrides.map((o) => [o.metric_key, o.metric_value]),
                        );
                        visitForm.setFieldsValue({
                          reason: '',
                          ...Object.fromEntries(
                            VISIT_METRIC_FIELDS.map((key) => [
                              key,
                              overrideMap[key] ?? (source as Record<string, number>)[key],
                            ]),
                          ),
                        });
                        setVisitModalOpen(true);
                      }}
                    >
                      {t('app.kuaizhizao.equipmentDashboard.visitEdit')}
                    </Button>
                  ) : null}
                </Space>
              )}
            </Space>
            <Segmented
              value={plantKey}
              options={plantOptions}
              onChange={(value) => setPlantKey(String(value))}
            />
          </div>
          {visitMode ? (
            <Alert
              type="warning"
              showIcon
              title={t('app.kuaizhizao.equipmentDashboard.visitBannerTitle')}
              description={t('app.kuaizhizao.equipmentDashboard.visitBannerDesc')}
            />
          ) : null}
          {tickerItems.length > 0 ? (
            <div
              className="kz-equipment-alert-ticker"
              style={{
                overflow: 'hidden',
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: 6,
                background: token.colorFillAlter,
                padding: '8px 0',
              }}
            >
              <div
                className="kz-equipment-alert-ticker__track"
                style={{
                  display: 'flex',
                  width: 'max-content',
                  gap: 10,
                  animation: `kz-equipment-alert-marquee ${tickerDurationSec}s linear infinite`,
                }}
              >
                {[...tickerItems, ...tickerItems].map((item, idx) => (
                  <div
                    key={`${item.id}-${idx}`}
                    role={item.linkPath ? 'button' : undefined}
                    tabIndex={item.linkPath ? 0 : undefined}
                    onClick={
                      item.linkPath
                        ? () => navigate(item.linkPath as string)
                        : undefined
                    }
                    onKeyDown={
                      item.linkPath
                        ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              navigate(item.linkPath as string);
                            }
                          }
                        : undefined
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      flexShrink: 0,
                      maxWidth: 420,
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1px solid ${token.colorBorderSecondary}`,
                      background: token.colorBgContainer,
                      cursor: item.linkPath ? 'pointer' : 'default',
                    }}
                  >
                    <MarkerTag
                      color={ALERT_KIND_COLOR[item.kind] || 'default'}
                      style={{ margin: 0, flexShrink: 0 }}
                    >
                      {item.kindLabel}
                    </MarkerTag>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: token.colorText,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.primary}
                    </span>
                    {item.secondary ? (
                      <span
                        style={{
                          fontSize: 12,
                          color: token.colorTextSecondary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: 220,
                        }}
                      >
                        {item.secondary}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
              <style>{`
                @keyframes kz-equipment-alert-marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .kz-equipment-alert-ticker:hover .kz-equipment-alert-ticker__track {
                  animation-play-state: paused;
                }
              `}</style>
            </div>
          ) : null}
          <ModuleKpiRow items={kpis} colProps={{ xs: 24, sm: 12, lg: 6 }} />
        </Space>
      }
      shortcutRow={<ModuleShortcutGrid items={shortcuts} />}
      actionRow={
        <ModuleActionMasonry>
          {showMasonryCard(boardLoading, hasAlerts, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.alertsTitle')}
              loading={boardLoading}
              masonryWeight={masonryWeightFromRows(Math.min(alertFeedItems.length, 8))}
            >
              <ModuleFeedList
                items={alertFeedItems}
                emptyText={t('app.kuaizhizao.equipmentDashboard.noAlerts')}
              />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(todosLoading, todos.length > 0, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.todosTitle')}
              loading={todosLoading}
              masonryWeight={masonryWeightFromRows(Math.min(todos.length, TODO_DISPLAY_ROWS))}
            >
              <ModuleTodoList items={todos} emptyText={t('app.kuaizhizao.equipmentDashboard.noTodos')} />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(faultsLoading, pendingFaults.length > 0, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.pendingFaultsTitle')}
              loading={faultsLoading}
              masonryWeight={masonryWeightFromRows(pendingFaults.length, TABLE_DISPLAY_ROWS)}
              extra={
                <a onClick={() => navigate('/apps/kuaizhizao/equipment-management/equipment-faults')}>
                  {t('app.kuaizhizao.equipmentDashboard.all')}
                </a>
              }
            >
              <Table
                tableLayout="fixed"
                size="small"
                dataSource={pendingFaults}
                pagination={false}
                rowKey={(r) => String(r.id ?? r.uuid)}
                columns={faultColumns}
              />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(spotChecksLoading, spotCheckRows.length > 0, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.spotChecksTitle')}
              loading={spotChecksLoading}
              masonryWeight={masonryWeightFromRows(spotCheckRows.length, TABLE_DISPLAY_ROWS)}
              extra={
                <a onClick={() => navigate('/apps/kuaizhizao/equipment-management/spot-checks')}>
                  {t('app.kuaizhizao.equipmentDashboard.all')}
                </a>
              }
            >
              <Table
                tableLayout="fixed"
                size="small"
                dataSource={spotCheckRows}
                pagination={false}
                rowKey={(r) => String(r.id ?? r.uuid)}
                columns={spotCheckColumns}
              />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(maintenanceLoading, maintenanceRows.length > 0, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.maintenanceDueTitle')}
              loading={maintenanceLoading}
              masonryWeight={masonryWeightFromRows(maintenanceRows.length, TABLE_DISPLAY_ROWS)}
              extra={
                <a onClick={() => navigate('/apps/kuaizhizao/equipment-management/maintenance-plans')}>
                  {t('app.kuaizhizao.equipmentDashboard.all')}
                </a>
              }
            >
              <Table
                tableLayout="fixed"
                size="small"
                dataSource={maintenanceRows}
                pagination={false}
                rowKey={(r) => String(r.id ?? r.uuid)}
                columns={maintenanceColumns}
              />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(spareAlertsLoading, spareAlertRows.length > 0, masonryEmptyFallback) ? (
            <ModuleActionPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.spareLowStockTitle')}
              loading={spareAlertsLoading}
              masonryWeight={masonryWeightFromRows(spareAlertRows.length, TABLE_DISPLAY_ROWS)}
              extra={
                <a onClick={() => navigate('/apps/kuaizhizao/equipment-management/spare-parts')}>
                  {t('app.kuaizhizao.equipmentDashboard.all')}
                </a>
              }
            >
              <Table
                tableLayout="fixed"
                size="small"
                dataSource={spareAlertRows}
                pagination={false}
                rowKey={(r, idx) => String(r.id ?? r.spare_part_id ?? idx)}
                columns={spareAlertColumns}
              />
            </ModuleActionPanel>
          ) : null}
          {showMasonryCard(trendLoading, hasTrendData, masonryEmptyFallback) ? (
            <ModuleChartPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.faultTrendTitle')}
              loading={trendLoading}
              masonryWeight={MASONRY_CHART_WEIGHT}
            >
              <ModuleChartMount height={240}>
                {({ width, height }) => (
                  <Suspense fallback={null}>
                    <EquipmentTrendColumn
                      data={trendData?.items || []}
                      xField="date"
                      yField="count"
                      width={width}
                      height={height}
                      autoFit={false}
                      animation={false}
                    />
                  </Suspense>
                )}
              </ModuleChartMount>
            </ModuleChartPanel>
          ) : null}
          {showMasonryCard(boardLoading, hasStatusPieData, masonryEmptyFallback) ? (
            <ModuleChartPanel
              layout="masonry"
              title={t('app.kuaizhizao.equipmentDashboard.statusDistributionTitle')}
              masonryWeight={MASONRY_CHART_WEIGHT}
            >
              <ModuleChartMount height={240}>
                {({ width, height }) => (
                  <Suspense fallback={null}>
                    <EquipmentStatusPie
                      data={statusPieData}
                      angleField="value"
                      colorField="type"
                      radius={0.75}
                      innerRadius={0.55}
                      width={width}
                      height={height}
                      autoFit={false}
                      animation={false}
                      legend={{ color: { position: 'bottom' } }}
                    />
                  </Suspense>
                )}
              </ModuleChartMount>
            </ModuleChartPanel>
          ) : null}
        </ModuleActionMasonry>
      }
    />
    <Modal
      title={t('app.kuaizhizao.equipmentDashboard.visitEditTitle')}
      open={visitModalOpen}
      destroyOnHidden
      confirmLoading={visitSaving}
      onCancel={() => setVisitModalOpen(false)}
      okText={t('app.kuaizhizao.equipmentDashboard.visitSave')}
      onOk={async () => {
        const values = await visitForm.validateFields();
        setVisitSaving(true);
        try {
          const items = VISIT_METRIC_FIELDS.filter((key) => values[key] != null).map((key) => ({
            metric_key: key,
            metric_value: Number(values[key]),
          }));
          await mesDashboardService.upsertEquipmentBoardVisitOverrides({
            board_domain: 'equipment',
            plant_id: plantId,
            reason: values.reason,
            items,
          });
          message.success(t('app.kuaizhizao.equipmentDashboard.visitSaveOk'));
          setVisitModalOpen(false);
          setVisitMode(true);
          refreshBoard();
        } finally {
          setVisitSaving(false);
        }
      }}
      footer={(_, { OkBtn, CancelBtn }) => (
        <Space>
          <Button
            danger
            disabled={visitSaving}
            onClick={async () => {
              setVisitSaving(true);
              try {
                await mesDashboardService.clearEquipmentBoardVisitOverrides({
                  board_domain: 'equipment',
                  plant_id: plantId,
                  reason: visitForm.getFieldValue('reason'),
                });
                message.success(t('app.kuaizhizao.equipmentDashboard.visitClearOk'));
                setVisitModalOpen(false);
                refreshBoard();
              } finally {
                setVisitSaving(false);
              }
            }}
          >
            {t('app.kuaizhizao.equipmentDashboard.visitClear')}
          </Button>
          <CancelBtn />
          <OkBtn />
        </Space>
      )}
    >
      <Alert
        type="info"
        showIcon
        title={t('app.kuaizhizao.equipmentDashboard.visitEditHint')}
        style={{ marginBottom: 16 }}
      />
      <Form form={visitForm} layout="vertical">
        <Form.Item
          name="reason"
          label={t('app.kuaizhizao.equipmentDashboard.visitReason')}
          rules={[{ required: true, message: t('app.kuaizhizao.equipmentDashboard.visitReasonRequired') }]}
        >
          <Input.TextArea rows={2} maxLength={500} />
        </Form.Item>
        {VISIT_METRIC_FIELDS.map((key) => (
          <Form.Item
            key={key}
            name={key}
            label={t(`app.kuaizhizao.equipmentDashboard.visitMetric.${key}`)}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        ))}
      </Form>
    </Modal>
    </>
  );
};

export default EquipmentDashboard;
