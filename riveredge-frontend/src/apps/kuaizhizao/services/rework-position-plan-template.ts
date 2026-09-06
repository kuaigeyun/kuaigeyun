import { apiRequest } from '../../../services/api';

export interface ReworkPositionPlanTemplateItem {
  id?: number;
  template_id?: number;
  line_no?: number;
  sequence?: number;
  station_name?: string;
  section_name?: string;
  station_code?: string;
  planned_headcount?: number;
  standard_minutes?: number;
  planned_qty?: number;
  owner_user_id?: number;
  owner_user_name?: string;
  remarks?: string;
}

export interface ReworkPositionPlanTemplate {
  id?: number;
  uuid?: string;
  template_code?: string;
  template_name?: string;
  product_line_code?: string;
  is_active?: boolean;
  total_items?: number;
  remarks?: string;
  created_by_name?: string;
  updated_by_name?: string;
  created_at?: string;
  updated_at?: string;
  items?: ReworkPositionPlanTemplateItem[];
}

const BASE = '/apps/kuaizhizao/rework-position-plan-templates';

export const reworkPositionPlanTemplateApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: ReworkPositionPlanTemplate[]; total: number; success: boolean }>(BASE, {
      method: 'GET',
      params,
    }),
  get: async (id: string | number) =>
    apiRequest<ReworkPositionPlanTemplate>(`${BASE}/${id}`, { method: 'GET' }),
  create: async (data: Partial<ReworkPositionPlanTemplate>) =>
    apiRequest<ReworkPositionPlanTemplate>(BASE, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<ReworkPositionPlanTemplate>) =>
    apiRequest<ReworkPositionPlanTemplate>(`${BASE}/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/${id}`, { method: 'DELETE' }),
};
