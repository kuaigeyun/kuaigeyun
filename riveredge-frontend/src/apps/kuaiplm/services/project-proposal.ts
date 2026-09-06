/**
 * 项目建议书 API（R-15 #68）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/project-proposals';

export type ProjectProposalStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'issued'
  | 'rejected';

export interface ProjectProposal {
  id: number;
  uuid: string;
  proposal_code: string;
  project_id: number;
  project_code: string;
  project_name: string;
  title: string;
  summary?: string | null;
  customer_name?: string | null;
  expected_date?: string | null;
  supplier_id?: number | null;
  supplier_code?: string | null;
  supplier_name?: string | null;
  supplier_contact?: string | null;
  supplier_remark?: string | null;
  status: ProjectProposalStatus;
  remarks?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  issued_at?: string | null;
  issued_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

export interface ProjectProposalPayload {
  project_id: number;
  title: string;
  summary?: string | null;
  customer_name?: string | null;
  expected_date?: string | null;
  supplier_id?: number | null;
  supplier_code?: string | null;
  supplier_name?: string | null;
  supplier_contact?: string | null;
  supplier_remark?: string | null;
  remarks?: string | null;
}

function unwrapList(res: unknown): { items: ProjectProposal[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as ProjectProposal[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const projectProposalApi = {
  list: async (params: {
    skip?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    project_id?: number;
  }) => {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  get: async (id: number) => {
    const res = await api.get(`${BASE}/${id}`);
    return res as ProjectProposal;
  },
  create: async (data: ProjectProposalPayload) => {
    const res = await api.post(BASE, data);
    return res as ProjectProposal;
  },
  update: async (
    id: number,
    data: Partial<
      Pick<ProjectProposalPayload, 'title' | 'summary' | 'customer_name' | 'expected_date' | 'remarks'>
    >,
  ) => {
    const res = await api.put(`${BASE}/${id}`, data);
    return res as ProjectProposal;
  },
  fillSupplier: async (
    id: number,
    data: {
      supplier_id?: number | null;
      supplier_code?: string | null;
      supplier_name: string;
      supplier_contact?: string | null;
      supplier_remark?: string | null;
    },
  ) => {
    const res = await api.put(`${BASE}/${id}/supplier`, data);
    return res as ProjectProposal;
  },
  submit: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/submit`);
    return res as ProjectProposal;
  },
  approve: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/approve`);
    return res as ProjectProposal;
  },
  reject: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/reject`);
    return res as ProjectProposal;
  },
  issue: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/issue`);
    return res as ProjectProposal;
  },
  remove: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
