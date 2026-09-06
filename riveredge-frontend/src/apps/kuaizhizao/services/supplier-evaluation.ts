import { apiRequest } from '../../../services/api';

export type SupplierEvaluationStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'revoked';

export type SupplierEvalPlanStatus = 'draft' | 'released' | 'closed';

export type SupplierEvalPeriodType = 'annual' | 'quarterly';
export type SupplierEvalAuditMode = 'onsite' | 'document';
export type SupplierEvalRectStatus = 'none' | 'open' | 'closed';
export type SupplierEnvDocType =
  | 'rohs'
  | 'reach'
  | 'conflict_minerals'
  | 'msds'
  | 'other';

export interface SupplierEvalGradeBand {
  min: number;
  grade: string;
}

export const DEFAULT_GRADE_BANDS: SupplierEvalGradeBand[] = [
  { min: 90, grade: 'A' },
  { min: 80, grade: 'B' },
  { min: 70, grade: 'C' },
  { min: 0, grade: 'D' },
];

export interface SupplierEvalTemplateClause {
  id?: number;
  uuid?: string;
  template_id?: number;
  line_no?: number;
  clause_code: string;
  clause_name: string;
  weight?: number | string;
  max_score?: number | string;
  remarks?: string | null;
}

export interface SupplierEvalTemplate {
  id?: number;
  uuid?: string;
  code?: string;
  name: string;
  version?: string;
  grade_version?: string;
  grade_bands?: SupplierEvalGradeBand[] | null;
  period_type?: SupplierEvalPeriodType | string | null;
  is_active?: boolean;
  remarks?: string | null;
  clauses?: SupplierEvalTemplateClause[];
  clause_count?: number;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SupplierEvaluationLine {
  id?: number;
  uuid?: string;
  evaluation_id?: number;
  line_no?: number;
  clause_code: string;
  clause_name: string;
  weight?: number | string;
  max_score?: number | string;
  score?: number | string | null;
  remarks?: string | null;
}

export interface SupplierEvaluation {
  id?: number;
  uuid?: string;
  code?: string;
  period_type?: SupplierEvalPeriodType | string;
  period_year?: number;
  period_quarter?: number | null;
  supplier_id?: number;
  supplier_code?: string;
  supplier_name?: string;
  template_id?: number | null;
  template_code?: string | null;
  template_name?: string | null;
  plan_id?: number | null;
  plan_code?: string | null;
  audit_mode?: SupplierEvalAuditMode | string;
  score?: number | string | null;
  grade?: string | null;
  formula_version?: string | null;
  grade_version?: string | null;
  needs_rectification?: boolean;
  rectification_plan?: string | null;
  rectification_due?: string | null;
  rectification_status?: SupplierEvalRectStatus | string;
  rectification_result?: string | null;
  rectification_closed_at?: string | null;
  rectification_closed_by_name?: string | null;
  status?: SupplierEvaluationStatus | string;
  attachments?: Record<string, unknown>[] | null;
  lines?: SupplierEvaluationLine[];
  submitted_at?: string | null;
  approved_at?: string | null;
  remarks?: string | null;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SupplierEvalPlanLine {
  id?: number;
  uuid?: string;
  plan_id?: number;
  line_no?: number;
  supplier_id: number;
  supplier_code?: string | null;
  supplier_name?: string | null;
  remarks?: string | null;
  evaluation_id?: number | null;
  evaluation_code?: string | null;
  evaluation_status?: string | null;
}

export interface SupplierEvalPlan {
  id?: number;
  uuid?: string;
  code?: string;
  name: string;
  period_type?: SupplierEvalPeriodType | string;
  period_year?: number;
  period_quarter?: number | null;
  template_id?: number;
  template_code?: string | null;
  template_name?: string | null;
  audit_mode?: SupplierEvalAuditMode | string;
  status?: SupplierEvalPlanStatus | string;
  remarks?: string | null;
  lines?: SupplierEvalPlanLine[];
  line_count?: number;
  generated_count?: number;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface SupplierEvalPlanGenerateResult {
  created: number;
  skipped: number;
  evaluation_ids: number[];
  skipped_supplier_ids: number[];
}

export interface SupplierEvalSummary {
  period_type?: string | null;
  period_year?: number | null;
  period_quarter?: number | null;
  total: number;
  by_status: Record<string, number>;
  by_grade: Record<string, number>;
  approved_count: number;
  avg_score?: number | string | null;
  open_rectification: number;
  needs_rectification: number;
}

export interface SupplierEvalEnvDocument {
  id?: number;
  uuid?: string;
  supplier_id?: number;
  supplier_code?: string | null;
  supplier_name?: string | null;
  doc_type?: SupplierEnvDocType | string;
  title?: string;
  issued_at?: string | null;
  expires_at?: string | null;
  attachments?: Record<string, unknown>[] | null;
  remarks?: string | null;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

const BASE = '/apps/kuaizhizao/supplier-evaluations';

export const supplierEvalTemplateApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: SupplierEvalTemplate[]; total: number; success: boolean }>(
      `${BASE}/templates`,
      { method: 'GET', params },
    ),
  get: async (id: string | number) =>
    apiRequest<SupplierEvalTemplate>(`${BASE}/templates/${id}`, { method: 'GET' }),
  create: async (data: Partial<SupplierEvalTemplate>) =>
    apiRequest<SupplierEvalTemplate>(`${BASE}/templates`, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<SupplierEvalTemplate>) =>
    apiRequest<SupplierEvalTemplate>(`${BASE}/templates/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/templates/${id}`, { method: 'DELETE' }),
};

export const supplierEvalPlanApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: SupplierEvalPlan[]; total: number; success: boolean }>(`${BASE}/plans`, {
      method: 'GET',
      params,
    }),
  get: async (id: string | number) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans/${id}`, { method: 'GET' }),
  create: async (data: Partial<SupplierEvalPlan>) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans`, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<SupplierEvalPlan>) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/plans/${id}`, { method: 'DELETE' }),
  release: async (id: string | number) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans/${id}/release`, { method: 'POST' }),
  reopenDraft: async (id: string | number) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans/${id}/reopen-draft`, { method: 'POST' }),
  close: async (id: string | number) =>
    apiRequest<SupplierEvalPlan>(`${BASE}/plans/${id}/close`, { method: 'POST' }),
  generate: async (id: string | number) =>
    apiRequest<SupplierEvalPlanGenerateResult>(`${BASE}/plans/${id}/generate`, {
      method: 'POST',
    }),
};

export const supplierEvalSummaryApi = {
  get: async (params?: Record<string, unknown>) =>
    apiRequest<SupplierEvalSummary>(`${BASE}/summary`, { method: 'GET', params }),
};

export const supplierEvaluationApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: SupplierEvaluation[]; total: number; success: boolean }>(BASE, {
      method: 'GET',
      params,
    }),
  get: async (id: string | number) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}`, { method: 'GET' }),
  create: async (data: Partial<SupplierEvaluation>) =>
    apiRequest<SupplierEvaluation>(BASE, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<SupplierEvaluation>) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/${id}`, { method: 'DELETE' }),
  submit: async (id: string | number) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/submit`, { method: 'POST' }),
  approve: async (id: string | number) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/approve`, { method: 'POST' }),
  reject: async (id: string | number) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/reject`, { method: 'POST' }),
  revoke: async (id: string | number, reason: string) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/revoke`, {
      method: 'POST',
      data: { reason },
    }),
  recalculate: async (id: string | number) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/recalculate`, { method: 'POST' }),
  closeRectification: async (id: string | number, result: string) =>
    apiRequest<SupplierEvaluation>(`${BASE}/${id}/close-rectification`, {
      method: 'POST',
      data: { result },
    }),
};

export const supplierEvalEnvDocumentApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: SupplierEvalEnvDocument[]; total: number; success: boolean }>(
      `${BASE}/env-documents`,
      { method: 'GET', params },
    ),
  get: async (id: string | number) =>
    apiRequest<SupplierEvalEnvDocument>(`${BASE}/env-documents/${id}`, { method: 'GET' }),
  create: async (data: Partial<SupplierEvalEnvDocument>) =>
    apiRequest<SupplierEvalEnvDocument>(`${BASE}/env-documents`, { method: 'POST', data }),
  update: async (id: string | number, data: Partial<SupplierEvalEnvDocument>) =>
    apiRequest<SupplierEvalEnvDocument>(`${BASE}/env-documents/${id}`, { method: 'PUT', data }),
  delete: async (id: string | number) =>
    apiRequest(`${BASE}/env-documents/${id}`, { method: 'DELETE' }),
};
