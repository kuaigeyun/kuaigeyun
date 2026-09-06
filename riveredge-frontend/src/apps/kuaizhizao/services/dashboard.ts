import { apiRequest } from '../../../services/api';

/**
 * MES Dashboard (Workbench) Service
 */
export const mesDashboardService = {
  // 获取待办事项
  getTodos: async (limit = 20) => {
    return apiRequest('/apps/kuaizhizao/dashboard/todos', {
      method: 'GET',
      params: { limit },
    });
  },

  // 获取全局统计
  getStatistics: async (dateStart?: string, dateEnd?: string) => {
    return apiRequest('/apps/kuaizhizao/dashboard/statistics', {
      method: 'GET',
      params: { date_start: dateStart, date_end: dateEnd },
    });
  },

  // 获取工序进度
  getProcessProgress: async (includeUnstarted = false) => {
    return apiRequest('/apps/kuaizhizao/dashboard/process-progress', {
      method: 'GET',
      params: { include_unstarted: includeUnstarted },
    });
  },

  // 获取管理指标
  getManagementMetrics: async (dateStart?: string, dateEnd?: string) => {
    return apiRequest('/apps/kuaizhizao/dashboard/management-metrics', {
      method: 'GET',
      params: { date_start: dateStart, date_end: dateEnd },
    });
  },

  // 获取计划可信度指标
  getPlanReliability: async () => {
    return apiRequest('/apps/kuaizhizao/dashboard/plan-reliability', {
      method: 'GET',
    });
  },

  // 获取生产实时播报
  getProductionBroadcast: async (limit = 10) => {
    return apiRequest('/apps/kuaizhizao/dashboard/production-broadcast', {
      method: 'GET',
      params: { limit },
    });
  },

  // 获取菜单徽标数量
  getMenuBadgeCounts: async () => {
    return apiRequest('/apps/kuaizhizao/dashboard/menu-badge-counts', {
      method: 'GET',
    });
  },
  // 获取销售中心汇总
  getSalesSummary: async (is_active = true) => {
    return apiRequest('/apps/kuaizhizao/dashboard/sales-summary', {
      method: 'GET',
      params: { is_active },
    });
  },

  /** 销售中心待跟进 KPI（按客户最新跟进计划，含数据范围） */
  getSalesFollowUpStats: async (limit = 5) => {
    return apiRequest('/apps/kuaizhizao/dashboard/sales-follow-up-stats', {
      method: 'GET',
      params: { limit },
    });
  },

  // 获取采购中心汇总
  getPurchaseSummary: async () => {
    return apiRequest('/apps/kuaizhizao/dashboard/purchase-summary', {
      method: 'GET',
    });
  },

  // 获取制造中心汇总
  getManufacturingSummary: async () => {
    return apiRequest('/apps/kuaizhizao/dashboard/manufacturing-summary', {
      method: 'GET',
    });
  },

  // 获取设备看板汇总
  getEquipmentSummary: async () => {
    return apiRequest('/apps/kuaizhizao/dashboard/equipment-summary', {
      method: 'GET',
    });
  },

  /** 设备总览/厂区看板：厂区列表（主数据） */
  getEquipmentBoardPlants: async () => {
    return apiRequest<{
      items: { id: number; uuid: string; code: string; name: string }[];
      total: number;
    }>('/apps/kuaizhizao/dashboard/equipment-board/plants', {
      method: 'GET',
    });
  },

  /** 设备总览/厂区看板指标与滚动异常 */
  getEquipmentBoard: async (plantId?: number, alertLimit = 30, visitMode = false) => {
    return apiRequest<{
      plant: { id: number; uuid: string; code: string; name: string } | null;
      metrics: {
        total_count: number;
        faulty_count: number;
        open_fault_count: number;
        failure_rate: number;
        spot_check_due: number;
        spot_check_done: number;
        spot_check_pending: number;
        spot_check_rate: number;
        spot_check_review_pending: number;
        alert_count: number;
      };
      source_metrics?: Record<string, number>;
      visit_mode?: boolean;
      visit_overrides?: {
        metric_key: string;
        metric_value: number;
        reason?: string;
      }[];
      status_breakdown: { status: string; count: number }[];
      alerts: {
        kind: string;
        title: string;
        detail?: string;
        document_no?: string;
        equipment_code?: string;
        equipment_name?: string;
        occurred_at?: string;
        link_path?: string;
        link_uuid?: string;
      }[];
      as_of?: string;
      spot_check_date?: string;
    }>('/apps/kuaizhizao/dashboard/equipment-board', {
      method: 'GET',
      params: {
        plant_id: plantId,
        alert_limit: alertLimit,
        visit_mode: visitMode,
      },
    });
  },

  listEquipmentBoardVisitOverrides: async (plantId?: number, boardDomain = 'equipment') => {
    return apiRequest<{ items: { metric_key: string; metric_value: number; reason?: string }[] }>(
      '/apps/kuaizhizao/dashboard/equipment-board/visit-overrides',
      { method: 'GET', params: { plant_id: plantId, board_domain: boardDomain } },
    );
  },

  upsertEquipmentBoardVisitOverrides: async (payload: {
    board_domain?: string;
    plant_id?: number;
    reason?: string;
    items: { metric_key: string; metric_value: number }[];
  }) => {
    return apiRequest('/apps/kuaizhizao/dashboard/equipment-board/visit-overrides', {
      method: 'PUT',
      data: payload,
    });
  },

  clearEquipmentBoardVisitOverrides: async (payload: {
    board_domain?: string;
    plant_id?: number;
    reason?: string;
    metric_keys?: string[];
  }) => {
    return apiRequest('/apps/kuaizhizao/dashboard/equipment-board/visit-overrides/clear', {
      method: 'POST',
      data: payload,
    });
  },

  listEquipmentBoardVisitAudits: async (plantId?: number, boardDomain = 'equipment') => {
    return apiRequest<{
      items: {
        action: string;
        metric_key?: string;
        before_value?: number;
        after_value?: number;
        reason?: string;
        operator_name?: string;
        created_at?: string;
      }[];
      total: number;
    }>('/apps/kuaizhizao/dashboard/equipment-board/visit-audits', {
      method: 'GET',
      params: { plant_id: plantId, board_domain: boardDomain, limit: 30 },
    });
  },

  getTodosByModule: async (module: string, limit = 8) => {
    return apiRequest<{ items: import('../../../services/dashboard').TodoItem[]; total: number }>(
      '/apps/kuaizhizao/dashboard/todos',
      { method: 'GET', params: { limit, module } },
    );
  },

  getPurchaseTrend: async () => {
    return apiRequest<{ items: { date: string; amount: number; quantity: number }[] }>(
      '/apps/kuaizhizao/dashboard/purchase-trend',
      { method: 'GET' },
    );
  },

  getManufacturingTrend: async () => {
    return apiRequest<{ items: { date: string; output: number; qualified: number }[] }>(
      '/apps/kuaizhizao/dashboard/manufacturing-trend',
      { method: 'GET' },
    );
  },

  getEquipmentTrend: async () => {
    return apiRequest<{ items: { date: string; count: number }[] }>(
      '/apps/kuaizhizao/dashboard/equipment-trend',
      { method: 'GET' },
    );
  },

  getWarehouseTrend: async () => {
    return apiRequest<{ items: { date: string; in: number; out: number }[] }>(
      '/apps/kuaizhizao/dashboard/warehouse-trend',
      { method: 'GET' },
    );
  },
};
