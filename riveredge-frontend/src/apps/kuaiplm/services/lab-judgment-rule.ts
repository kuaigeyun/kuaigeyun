/**
 * 实验判定规则 API（R-02）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/lab-judgment-rules';

export interface LabJudgmentRule {
  id?: number;
  uuid?: string;
  rule_code?: string;
  rule_name?: string;
  version?: string;
  compare_type?: string;
  standard_min?: string | null;
  standard_max?: string | null;
  standard_value?: string | null;
  unit?: string | null;
  item_name?: string | null;
  is_active?: boolean;
  remarks?: string | null;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LabJudgmentRuleOption {
  id: number;
  rule_code: string;
  rule_name: string;
  version: string;
  compare_type: string;
  standard_min?: string | null;
  standard_max?: string | null;
  standard_value?: string | null;
  unit?: string | null;
  item_name?: string | null;
  label: string;
}

function unwrapList(res: unknown): { items: LabJudgmentRule[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as LabJudgmentRule[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const labJudgmentRuleApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  get: async (id: number) => (await api.get(`${BASE}/${id}`)) as LabJudgmentRule,
  create: async (data: Partial<LabJudgmentRule>) =>
    (await api.post(BASE, data)) as LabJudgmentRule,
  update: async (id: number, data: Partial<LabJudgmentRule>) =>
    (await api.put(`${BASE}/${id}`, data)) as LabJudgmentRule,
  revise: async (id: number, data?: Record<string, unknown>) =>
    (await api.post(`${BASE}/${id}/revise`, data || {})) as LabJudgmentRule,
  delete: async (id: number) => api.delete(`${BASE}/${id}`),
  options: async (params?: { keyword?: string; limit?: number }) => {
    const res = await api.get(`${BASE}/options`, { params });
    return (Array.isArray(res) ? res : []) as LabJudgmentRuleOption[];
  },
};
