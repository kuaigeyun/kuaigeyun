import { apiRequest } from '../../../services/api';

const TPL = '/apps/kuaizhizao/production-daily-templates';
const RPT = '/apps/kuaizhizao/production-daily-reports';

export type ProductionDailyFieldDef = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  required?: boolean;
  options?: string[];
};

export type ProductionDailyTemplate = {
  id: number;
  uuid: string;
  template_code: string;
  template_name: string;
  description?: string | null;
  field_schema: ProductionDailyFieldDef[];
  sort_order: number;
  is_active: boolean;
  is_system: boolean;
  created_by_name?: string | null;
  updated_by_name?: string | null;
};

export type ProductionDailyReport = {
  id: number;
  uuid: string;
  code: string;
  template_id: number;
  template_code: string;
  template_name: string;
  report_date: string;
  team_name?: string | null;
  shift_name?: string | null;
  workshop_name?: string | null;
  plant_name?: string | null;
  field_values: Record<string, unknown>;
  status: string;
  submitted_at?: string | null;
  remarks?: string | null;
  created_by_name?: string | null;
  updated_by_name?: string | null;
};

function unwrapList<T>(res: unknown): { items: T[]; total: number } {
  if (Array.isArray(res)) return { items: res as T[], total: res.length };
  const r = res as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as T[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const productionDailyTemplateApi = {
  list: async (params?: Record<string, unknown>) =>
    unwrapList<ProductionDailyTemplate>(await apiRequest(TPL, { method: 'GET', params })),
  get: async (id: number) =>
    (await apiRequest(`${TPL}/${id}`, { method: 'GET' })) as ProductionDailyTemplate,
  create: async (data: Partial<ProductionDailyTemplate>) =>
    (await apiRequest(TPL, { method: 'POST', data })) as ProductionDailyTemplate,
  update: async (id: number, data: Partial<ProductionDailyTemplate>) =>
    (await apiRequest(`${TPL}/${id}`, { method: 'PUT', data })) as ProductionDailyTemplate,
  remove: async (id: number) => apiRequest(`${TPL}/${id}`, { method: 'DELETE' }),
  ensureDefaults: async () =>
    apiRequest(`${TPL}/ensure-defaults`, { method: 'POST' }),
};

export const productionDailyReportApi = {
  list: async (params?: Record<string, unknown>) =>
    unwrapList<ProductionDailyReport>(await apiRequest(RPT, { method: 'GET', params })),
  get: async (id: number) =>
    (await apiRequest(`${RPT}/${id}`, { method: 'GET' })) as ProductionDailyReport,
  create: async (data: Record<string, unknown>) =>
    (await apiRequest(RPT, { method: 'POST', data })) as ProductionDailyReport,
  update: async (id: number, data: Record<string, unknown>) =>
    (await apiRequest(`${RPT}/${id}`, { method: 'PUT', data })) as ProductionDailyReport,
  submit: async (id: number) =>
    (await apiRequest(`${RPT}/${id}/submit`, { method: 'POST' })) as ProductionDailyReport,
  remove: async (id: number) => apiRequest(`${RPT}/${id}`, { method: 'DELETE' }),
};
