/**
 * 样品加工申请 API（R-15 #33）
 * 种类/附件/字段文案由 /meta/form-profile 驱动（通用或电子行业包）。
 */

import { api } from '../../../services/api';

const BASE = '/apps/kuaiplm/sample-process-applications';

export type SampleProcessStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'closed';

export interface SampleProcessAttachment {
  attachment_type: string;
  file_uuid: string;
  file_name?: string | null;
}

export interface SampleProcessApplication {
  id: number;
  uuid: string;
  application_code: string;
  project_id: number;
  project_code: string;
  project_name: string;
  request_kind: string;
  title: string;
  material_code?: string | null;
  material_version?: string | null;
  release_date?: string | null;
  purpose?: string | null;
  status: SampleProcessStatus;
  attachments?: SampleProcessAttachment[];
  remarks?: string | null;
  submitted_at?: string | null;
  approved_at?: string | null;
  closed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by_name?: string | null;
  updated_by_name?: string | null;
}

export interface SampleProcessPayload {
  project_id: number;
  request_kind: string;
  title: string;
  application_code?: string;
  material_code?: string | null;
  material_version?: string | null;
  release_date?: string | null;
  purpose?: string | null;
  attachments?: SampleProcessAttachment[];
  remarks?: string | null;
}

export interface SampleProcessFormProfileItem {
  code: string;
  label: string;
  sort?: number;
  active?: boolean;
}

export interface SampleProcessFormProfile {
  request_kinds: SampleProcessFormProfileItem[];
  attachment_types: SampleProcessFormProfileItem[];
  field_labels: Record<string, string>;
  validation_rules: Array<{
    when_kind_in?: string[];
    require?: string[];
    message?: string;
  }>;
}

function unwrapList(res: unknown): { items: SampleProcessApplication[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as SampleProcessApplication[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const sampleProcessApi = {
  formProfile: async () => {
    const res = await api.get(`${BASE}/meta/form-profile`);
    return res as SampleProcessFormProfile;
  },
  list: async (params: {
    skip?: number;
    limit?: number;
    keyword?: string;
    status?: string;
    project_id?: number;
    request_kind?: string;
  }) => {
    const res = await api.get(BASE, { params });
    return unwrapList(res);
  },
  get: async (id: number) => {
    const res = await api.get(`${BASE}/${id}`);
    return res as SampleProcessApplication;
  },
  create: async (data: SampleProcessPayload) => {
    const res = await api.post(BASE, data);
    return res as SampleProcessApplication;
  },
  update: async (id: number, data: Partial<SampleProcessPayload>) => {
    const res = await api.put(`${BASE}/${id}`, data);
    return res as SampleProcessApplication;
  },
  submit: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/submit`);
    return res as SampleProcessApplication;
  },
  approve: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/approve`);
    return res as SampleProcessApplication;
  },
  reject: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/reject`);
    return res as SampleProcessApplication;
  },
  close: async (id: number) => {
    const res = await api.post(`${BASE}/${id}/close`);
    return res as SampleProcessApplication;
  },
  remove: async (id: number) => {
    await api.delete(`${BASE}/${id}`);
  },
};
