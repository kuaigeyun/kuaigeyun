/**
 * 开模合同 / 打样订单 API（R-15 #71）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/mold-sample-orders';

export type MoldSampleDocKind = 'mold_contract' | 'sample_order';

export type MoldSampleStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'sealed'
  | 'archived'
  | 'rejected';

export interface MoldSampleOrder {
  id: number;
  uuid: string;
  order_code: string;
  project_id: number;
  project_code: string;
  project_name: string;
  doc_kind: MoldSampleDocKind;
  title: string;
  contract_no?: string | null;
  party_name?: string | null;
  file_uuid?: string | null;
  file_name?: string | null;
  status: MoldSampleStatus;
  remarks?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  sealed_at?: string | null;
  sealed_by_name?: string | null;
  archived_at?: string | null;
  archived_by_name?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

export interface MoldSampleOrderPayload {
  project_id: number;
  doc_kind: MoldSampleDocKind;
  title: string;
  contract_no?: string | null;
  party_name?: string | null;
  file_uuid?: string | null;
  file_name?: string | null;
  remarks?: string | null;
}

function unwrapList(res: unknown): { items: MoldSampleOrder[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as MoldSampleOrder[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const moldSampleOrderApi = {
  list: async (params: {
    skip?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    doc_kind?: string;
    project_id?: number;
  }) => {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  get: async (id: number) => {
    const res = await api.get(`${BASE}/${id}`);
    return res as MoldSampleOrder;
  },
  create: async (data: MoldSampleOrderPayload) => {
    const res = await api.post(BASE, data);
    return res as MoldSampleOrder;
  },
  update: async (id: number, data: Partial<Omit<MoldSampleOrderPayload, 'project_id'>>) => {
    const res = await api.put(`${BASE}/${id}`, data);
    return res as MoldSampleOrder;
  },
  submit: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/submit`);
    return res as MoldSampleOrder;
  },
  approve: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/approve`);
    return res as MoldSampleOrder;
  },
  reject: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/reject`);
    return res as MoldSampleOrder;
  },
  seal: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/seal`);
    return res as MoldSampleOrder;
  },
  archive: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/archive`);
    return res as MoldSampleOrder;
  },
  remove: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
