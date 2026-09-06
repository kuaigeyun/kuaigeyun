/**
 * 物料评审 API（R-15 #37）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/material-reviews';

export type MaterialReviewStatus = 'draft' | 'pending' | 'approved' | 'rejected';
export type MaterialUsageStatus = 'preferred' | 'limited' | 'forbidden';

export interface MaterialReviewLine {
  id?: number;
  uuid?: string;
  line_no?: number;
  material_id?: number | null;
  material_code: string;
  material_name: string;
  usage_status: MaterialUsageStatus | string;
  remarks?: string | null;
}

export interface MaterialReview {
  id: number;
  uuid: string;
  review_code: string;
  project_id: number;
  project_code: string;
  project_name: string;
  title: string;
  status: MaterialReviewStatus;
  remarks?: string | null;
  line_count?: number;
  lines?: MaterialReviewLine[];
  submitted_at?: string | null;
  approved_at?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

export interface MaterialReviewPayload {
  project_id: number;
  title: string;
  review_code?: string;
  remarks?: string | null;
  lines?: MaterialReviewLine[];
}

function unwrapList(res: unknown): { items: MaterialReview[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as MaterialReview[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const materialReviewApi = {
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
    return res as MaterialReview;
  },
  create: async (data: MaterialReviewPayload) => {
    const res = await api.post(BASE, data);
    return res as MaterialReview;
  },
  update: async (id: number, data: Partial<MaterialReviewPayload>) => {
    const res = await api.put(`${BASE}/${id}`, data);
    return res as MaterialReview;
  },
  submit: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/submit`);
    return res as MaterialReview;
  },
  approve: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/approve`);
    return res as MaterialReview;
  },
  reject: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/reject`);
    return res as MaterialReview;
  },
  remove: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
