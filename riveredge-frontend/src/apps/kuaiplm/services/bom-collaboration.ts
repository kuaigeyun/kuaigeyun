/**
 * BOM 协同 API（R-15 #65）
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/bom-collaborations';

export type BomCollabStatus = 'draft' | 'pending' | 'approved' | 'entered' | 'rejected';
export type BomCollabSection = 'electronics' | 'structure';

export interface BomCollabFormProfileSection {
  key: string;
  label: string;
  sort?: number;
  active?: boolean;
}

export interface BomCollabFormProfile {
  sections: BomCollabFormProfileSection[];
}

export interface BomCollabLine {
  id?: number;
  uuid?: string;
  section?: string;
  line_no?: number;
  material_id?: number | null;
  material_code: string;
  material_name: string;
  qty?: number | string | null;
  unit?: string | null;
  remarks?: string | null;
}

export interface BomCollaboration {
  id: number;
  uuid: string;
  collab_code: string;
  project_id: number;
  project_code: string;
  project_name: string;
  title: string;
  status: BomCollabStatus;
  electronics_status: string;
  structure_status: string;
  remarks?: string | null;
  master_bom_id?: number | null;
  master_bom_code?: string | null;
  electronics_line_count?: number;
  structure_line_count?: number;
  electronics_lines?: BomCollabLine[];
  structure_lines?: BomCollabLine[];
  submitted_at?: string | null;
  approved_at?: string | null;
  entered_at?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

export interface BomCollabCreatePayload {
  project_id: number;
  title: string;
  remarks?: string | null;
  electronics_lines?: BomCollabLine[];
  structure_lines?: BomCollabLine[];
}

function unwrapList(res: unknown): { items: BomCollaboration[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as BomCollaboration[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const bomCollabApi = {
  formProfile: async () => {
    const res = await api.get(`${BASE}/meta/form-profile`);
    return res as BomCollabFormProfile;
  },
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
    return res as BomCollaboration;
  },
  create: async (data: BomCollabCreatePayload) => {
    const res = await api.post(BASE, data);
    return res as BomCollaboration;
  },
  update: async (id: number, data: { title?: string; remarks?: string | null }) => {
    const res = await api.put(`${BASE}/${id}`, data);
    return res as BomCollaboration;
  },
  updateSection: async (id: number, section: BomCollabSection, lines: BomCollabLine[]) => {
    const res = await api.put(`${BASE}/${id}/sections/${section}`, { lines });
    return res as BomCollaboration;
  },
  submit: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/submit`);
    return res as BomCollaboration;
  },
  approve: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/approve`);
    return res as BomCollaboration;
  },
  reject: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/reject`);
    return res as BomCollaboration;
  },
  enter: async (id: number, data: { master_bom_id?: number | null; master_bom_code?: string | null }) => {
    const res = await api.post(`${BASE}/${id}/enter`, data);
    return res as BomCollaboration;
  },
  remove: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
