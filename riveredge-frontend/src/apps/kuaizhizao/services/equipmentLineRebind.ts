/**
 * 设备换线绑定 API（R-10 WP-10.7）
 */
import { apiRequest } from '../../../services/api';

const BASE = '/apps/kuaizhizao/equipment-line-rebinds';

export const equipmentLineRebindApi = {
  list: (params?: Record<string, unknown>) =>
    apiRequest(BASE, { method: 'GET', params }),
  get: (id: number) => apiRequest(`${BASE}/${id}`, { method: 'GET' }),
  create: (data: unknown) => apiRequest(BASE, { method: 'POST', data }),
  scan: (id: number, data: { scan_code: string }) =>
    apiRequest(`${BASE}/${id}/scan`, { method: 'POST', data }),
  addItem: (id: number, data: { equipment_id: number }) =>
    apiRequest(`${BASE}/${id}/items`, { method: 'POST', data }),
  removeItem: (id: number, itemId: number) =>
    apiRequest(`${BASE}/${id}/items/${itemId}`, { method: 'DELETE' }),
  complete: (id: number) =>
    apiRequest(`${BASE}/${id}/complete`, { method: 'POST' }),
  cancel: (id: number) =>
    apiRequest(`${BASE}/${id}/cancel`, { method: 'POST' }),
  delete: (id: number) => apiRequest(`${BASE}/${id}`, { method: 'DELETE' }),
};
