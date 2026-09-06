import { apiRequest } from '../../../services/api';

export type QualityComplaintStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'closed'
  | 'revoked';

export type QualityComplaintBusinessType =
  | 'iqc_incoming'
  | 'line_incoming'
  | 'pqc'
  | 'oqc'
  | 'customer';

export interface QualityComplaint {
  id?: number;
  uuid?: string;
  code?: string;
  title?: string;
  business_type?: QualityComplaintBusinessType | string;
  status?: QualityComplaintStatus | string;
  defect_category?: string;
  description?: string;
  supplier_id?: number;
  supplier_code?: string;
  supplier_name?: string;
  customer_id?: number;
  customer_code?: string;
  customer_name?: string;
  material_id?: number;
  material_code?: string;
  material_name?: string;
  batch_no?: string;
  quantity?: number;
  unit?: string;
  sla_workdays?: number;
  due_at?: string;
  supplier_response?: string;
  attachments?: Record<string, unknown>[];
  export_masked?: boolean;
  eight_d_report_id?: number;
  remarks?: string;
  created_by_name?: string;
  updated_by_name?: string;
  created_at?: string;
  updated_at?: string;
  revoke_reason?: string;
}

const BASE = '/apps/kuaizhizao/quality-complaints';

export const qualityComplaintApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: QualityComplaint[]; total: number; success: boolean }>(BASE, {
      method: 'GET',
      params,
    }),
  get: async (id: string | number) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}`, { method: 'GET' }),
  create: async (data: Partial<QualityComplaint>) =>
    apiRequest<QualityComplaint>(BASE, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<QualityComplaint>) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/${id}`, { method: 'DELETE' }),
  submit: async (id: string | number) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/submit`, { method: 'POST' }),
  approve: async (id: string | number) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/approve`, { method: 'POST' }),
  reject: async (id: string | number) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/reject`, { method: 'POST' }),
  close: async (id: string | number) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/close`, { method: 'POST' }),
  revoke: async (id: string | number, reason: string) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/revoke`, {
      method: 'POST',
      data: { reason },
    }),
  supplierResponse: async (
    id: string | number,
    data: { supplier_response: string; supplier_response_attachments?: unknown[] },
  ) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/supplier-response`, {
      method: 'POST',
      data,
    }),
  setExportMasked: async (id: string | number, masked: boolean) =>
    apiRequest<QualityComplaint>(`${BASE}/${id}/export-mask`, {
      method: 'POST',
      params: { masked },
    }),
};
