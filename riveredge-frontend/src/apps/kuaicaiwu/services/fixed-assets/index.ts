import { apiRequest } from '../../../../services/api';

const API = '/apps/kuaicaiwu/fixed-assets';

export interface FaCategory {
  id: number;
  category_code: string;
  category_name: string;
  depreciation_method: string;
  useful_life_months: number;
  residual_rate: number;
  asset_account_code: string;
  accumulated_depreciation_account_code: string;
  expense_account_code: string;
  is_active: boolean;
  notes?: string;
}

export interface FaAsset {
  id: number;
  asset_code: string;
  asset_name: string;
  category_id?: number;
  category_name?: string;
  status: string;
  original_value: number;
  accumulated_depreciation: number;
  net_value?: number;
  monthly_depreciation: number;
  department_name?: string;
  user_name?: string;
  location?: string;
  entry_date?: string;
  useful_life_months: number;
  depreciated_periods: number;
  residual_rate: number;
  expense_account_code: string;
  accumulated_depreciation_account_code: string;
  notes?: string;
}

export const fixedAssetService = {
  listCategories: (params?: { keyword?: string; is_active?: boolean }) =>
    apiRequest<FaCategory[]>(`${API}/categories`, { params }),

  createCategory: (body: Partial<FaCategory>) =>
    apiRequest<FaCategory>(`${API}/categories`, { method: 'POST', body }),

  updateCategory: (id: number, body: Partial<FaCategory>) =>
    apiRequest<FaCategory>(`${API}/categories/${id}`, { method: 'PUT', body }),

  deleteCategory: (id: number) =>
    apiRequest(`${API}/categories/${id}`, { method: 'DELETE' }),

  listAssets: (params?: Record<string, unknown>) =>
    apiRequest<{ items: FaAsset[]; total: number }>(`${API}/assets`, { params }),

  getAsset: (id: number) => apiRequest<FaAsset>(`${API}/assets/${id}`),

  createAsset: (body: Partial<FaAsset>) =>
    apiRequest<FaAsset>(`${API}/assets`, { method: 'POST', body }),

  updateAsset: (id: number, body: Partial<FaAsset>) =>
    apiRequest<FaAsset>(`${API}/assets/${id}`, { method: 'PUT', body }),

  deleteAsset: (id: number) => apiRequest(`${API}/assets/${id}`, { method: 'DELETE' }),

  exportAssets: () =>
    apiRequest<Blob>(`${API}/assets/export/excel`, { responseType: 'blob' }),

  importAssets: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiRequest<{ created: number; errors: string[] }>(`${API}/assets/import/excel`, {
      method: 'POST',
      body: form,
    });
  },

  listDeprRuns: (params?: { skip?: number; limit?: number }) =>
    apiRequest<{ items: Record<string, unknown>[]; total: number }>(
      `${API}/depreciation-runs`,
      { params },
    ),

  previewDeprRun: (period_year: number, period_month: number) =>
    apiRequest<{ id: number; lines: Record<string, unknown>[] }>(
      `${API}/depreciation-runs/preview`,
      { method: 'POST', body: { period_year, period_month } },
    ),

  getDeprRun: (id: number) => apiRequest(`${API}/depreciation-runs/${id}`),

  updateDeprLine: (runId: number, lineId: number, final_amount: number) =>
    apiRequest(`${API}/depreciation-runs/${runId}/lines/${lineId}`, {
      method: 'PATCH',
      body: { final_amount },
    }),

  confirmDeprRun: (id: number) =>
    apiRequest(`${API}/depreciation-runs/${id}/confirm`, { method: 'POST' }),

  listAdjustments: () => apiRequest<Record<string, unknown>[]>(`${API}/depreciation-adjustments`),

  createAdjustment: (body: Record<string, unknown>) =>
    apiRequest(`${API}/depreciation-adjustments`, { method: 'POST', body }),

  confirmAdjustment: (id: number) =>
    apiRequest(`${API}/depreciation-adjustments/${id}/confirm`, { method: 'POST' }),

  listChanges: () => apiRequest<Record<string, unknown>[]>(`${API}/changes`),

  createChange: (body: Record<string, unknown>) =>
    apiRequest(`${API}/changes`, { method: 'POST', body }),

  confirmChange: (id: number) =>
    apiRequest(`${API}/changes/${id}/confirm`, { method: 'POST' }),

  listDisposals: () => apiRequest<Record<string, unknown>[]>(`${API}/disposals`),

  createDisposal: (body: Record<string, unknown>) =>
    apiRequest(`${API}/disposals`, { method: 'POST', body }),

  confirmDisposal: (id: number) =>
    apiRequest(`${API}/disposals/${id}/confirm`, { method: 'POST' }),

  listPeriodCloses: () => apiRequest<Record<string, unknown>[]>(`${API}/period-closes`),

  closePeriod: (period_year: number, period_month: number, notes?: string) =>
    apiRequest(`${API}/period-close`, {
      method: 'POST',
      body: { period_year, period_month, notes },
    }),

  depreciationDetailReport: (params?: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>[]>(`${API}/reports/depreciation-detail`, { params }),

  depreciationSummaryReport: (params?: Record<string, unknown>) =>
    apiRequest<Record<string, unknown>[]>(`${API}/reports/depreciation-summary`, { params }),
};
