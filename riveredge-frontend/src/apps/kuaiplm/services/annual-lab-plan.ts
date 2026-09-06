/**
 * 年度实验计划 API（R-07）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/annual-lab-plans';

export type AnnualLabPlanStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';
export type AnnualLabMonthStatus = 'pending' | 'in_progress' | 'completed';
export type AnnualLabIssueStatus =
  | 'none'
  | 'pending_dept'
  | 'pending_sales'
  | 'pending_plan'
  | 'approved'
  | 'rejected';

export interface AnnualLabPlanMonth {
  id?: number;
  uuid?: string;
  plan_id?: number;
  year_month?: string;
  month_no?: number;
  title?: string | null;
  month_status?: AnnualLabMonthStatus | string;
  owner_user_id?: number | null;
  owner_user_name?: string | null;
  due_at?: string | null;
  material_desc?: string | null;
  issue_status?: AnnualLabIssueStatus | string;
  issue_submitted_at?: string | null;
  issue_approved_at?: string | null;
  issue_reject_reason?: string | null;
  lab_request_id?: number | null;
  lab_request_code?: string | null;
  report_file_uuid?: string | null;
  report_url?: string | null;
  defect_desc?: string | null;
  treatment_result?: string | null;
  completed_at?: string | null;
  remarks?: string | null;
}

export interface AnnualLabPlan {
  id?: number;
  uuid?: string;
  plan_code?: string;
  plan_year?: number;
  title?: string;
  status?: AnnualLabPlanStatus | string;
  plan_file_uuid?: string | null;
  plan_file_name?: string | null;
  owner_user_id?: number | null;
  owner_user_name?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  approved_by_name?: string | null;
  rejected_at?: string | null;
  reject_reason?: string | null;
  closed_at?: string | null;
  remarks?: string | null;
  months?: AnnualLabPlanMonth[];
  completed_months?: number;
  total_months?: number;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
}

function unwrapList(res: unknown): { items: AnnualLabPlan[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as AnnualLabPlan[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const annualLabPlanApi = {
  list: async (params?: Record<string, unknown>) => {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  get: async (id: number) => (await api.get(`${BASE}/${id}`)) as AnnualLabPlan,
  create: async (data: Partial<AnnualLabPlan>) =>
    (await api.post(BASE, data)) as AnnualLabPlan,
  update: async (id: number, data: Partial<AnnualLabPlan>) =>
    (await api.put(`${BASE}/${id}`, data)) as AnnualLabPlan,
  delete: async (id: number) => api.delete(`${BASE}/${id}`),
  submit: async (id: number) => (await api.post(`${BASE}/${id}/submit`)) as AnnualLabPlan,
  approve: async (id: number) => (await api.post(`${BASE}/${id}/approve`)) as AnnualLabPlan,
  reject: async (id: number, reason: string) =>
    (await api.post(`${BASE}/${id}/reject`, { reason })) as AnnualLabPlan,
  close: async (id: number) => (await api.post(`${BASE}/${id}/close`)) as AnnualLabPlan,
  updateMonth: async (planId: number, monthId: number, data: Partial<AnnualLabPlanMonth>) =>
    (await api.put(`${BASE}/${planId}/months/${monthId}`, data)) as AnnualLabPlan,
  submitIssue: async (planId: number, monthId: number) =>
    (await api.post(`${BASE}/${planId}/months/${monthId}/issue/submit`)) as AnnualLabPlan,
  approveIssue: async (planId: number, monthId: number) =>
    (await api.post(`${BASE}/${planId}/months/${monthId}/issue/approve`)) as AnnualLabPlan,
  rejectIssue: async (planId: number, monthId: number, reason: string) =>
    (await api.post(`${BASE}/${planId}/months/${monthId}/issue/reject`, { reason })) as AnnualLabPlan,
};
