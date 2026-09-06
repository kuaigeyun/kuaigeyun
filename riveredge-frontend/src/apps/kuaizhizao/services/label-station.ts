import { apiRequest } from '../../../services/api';

const BASE = '/apps/kuaizhizao/label-station';

export type LabelModelConfig = {
  id: number;
  model_code: string;
  model_name: string;
  template_uuid: string;
  template_version?: number | null;
  qty_per_box: number;
  print_copies: number;
  device_uuid?: string | null;
  validation_hooks?: string[];
  policy_config?: Record<string, unknown>;
  is_active: boolean;
  remarks?: string | null;
};

export type LabelStation = {
  id: number;
  station_code: string;
  station_name: string;
  model_config_id?: number | null;
  default_mode: string;
  device_uuid?: string | null;
  unlock_requires_password: boolean;
  is_active: boolean;
  remarks?: string | null;
};

export type LabelStationSnapshot = {
  session: Record<string, unknown>;
  station: LabelStation;
  model?: LabelModelConfig | null;
  current_box?: Record<string, unknown> | null;
  items?: Record<string, unknown>[];
  last_item?: Record<string, unknown>;
  print_job?: Record<string, unknown>;
};

function unwrapList<T>(res: unknown): { items: T[]; total: number } {
  if (Array.isArray(res)) return { items: res as T[], total: res.length };
  const r = res as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as T[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const labelStationApi = {
  listModels: async (params?: { active_only?: boolean }) =>
    unwrapList<LabelModelConfig>(await apiRequest(BASE + '/models', { method: 'GET', params })),
  createModel: async (data: Partial<LabelModelConfig>) =>
    (await apiRequest(BASE + '/models', { method: 'POST', data })) as LabelModelConfig,
  updateModel: async (id: number, data: Partial<LabelModelConfig>) =>
    (await apiRequest(`${BASE}/models/${id}`, { method: 'PUT', data })) as LabelModelConfig,
  listStations: async (params?: { active_only?: boolean }) =>
    unwrapList<LabelStation>(await apiRequest(BASE + '/stations', { method: 'GET', params })),
  createStation: async (data: Partial<LabelStation>) =>
    (await apiRequest(BASE + '/stations', { method: 'POST', data })) as LabelStation,
  updateStation: async (id: number, data: Partial<LabelStation>) =>
    (await apiRequest(`${BASE}/stations/${id}`, { method: 'PUT', data })) as LabelStation,
  openSession: async (data: { station_id: number; mode?: string; model_config_id?: number }) =>
    (await apiRequest(BASE + '/sessions/open', { method: 'POST', data })) as LabelStationSnapshot,
  getSession: async (id: number) =>
    (await apiRequest(`${BASE}/sessions/${id}`, { method: 'GET' })) as LabelStationSnapshot,
  closeSession: async (id: number) =>
    (await apiRequest(`${BASE}/sessions/${id}/close`, { method: 'POST' })) as LabelStationSnapshot,
  scan: async (data: { session_id: number; barcode: string; manual?: boolean }) =>
    (await apiRequest(BASE + '/scan', { method: 'POST', data })) as LabelStationSnapshot,
  lock: async (data: { session_id: number; reason: string }) =>
    (await apiRequest(BASE + '/lock', { method: 'POST', data })) as LabelStationSnapshot,
  unlock: async (data: { session_id: number; reason?: string; confirm_password?: string }) =>
    (await apiRequest(BASE + '/unlock', { method: 'POST', data })) as LabelStationSnapshot,
  unbind: async (data: { box_id: number; barcode?: string; reason?: string }) =>
    (await apiRequest(BASE + '/unbind', { method: 'POST', data })) as Record<string, unknown>,
  reprint: async (data: { box_id: number }) =>
    (await apiRequest(BASE + '/reprint', { method: 'POST', data })) as Record<string, unknown>,
  cleanup: async (data: { before_at: string }) =>
    (await apiRequest(BASE + '/cleanup', { method: 'POST', data })) as Record<string, unknown>,
};
