/**
 * 跨项目待办 API（优先一联调）
 */

import { api } from '../../../services/api';

export type PendingInboxDocType =
  | 'product_firmware'
  | 'sample_process'
  | 'material_review'
  | 'bom_collab'
  | 'project_proposal'
  | 'mold_sample'
  | 'trial_flow'
  | 'engineering_change';

export interface PendingInboxItem {
  doc_type: PendingInboxDocType | string;
  doc_id: number;
  doc_code: string;
  title: string;
  status: string;
  project_id?: number | null;
  project_code?: string | null;
  project_name?: string | null;
  updated_at?: string | null;
  list_path: string;
}

function unwrapList(res: unknown): { items: PendingInboxItem[]; total: number } {
  const r = (res || {}) as Record<string, unknown>;
  const items = (r.items ?? r.data ?? []) as PendingInboxItem[];
  return { items: Array.isArray(items) ? items : [], total: Number(r.total ?? items.length) };
}

export const pendingInboxApi = {
  list: async (params: {
    skip?: number;
    limit?: number;
    project_id?: number;
    doc_type?: string;
  }) => {
    const res = await api.get('/apps/kuaiplm/dashboard/pending-inbox', { params });
    return unwrapList(res);
  },
};
