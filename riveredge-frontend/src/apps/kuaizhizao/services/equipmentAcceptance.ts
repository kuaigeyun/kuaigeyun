/**
 * 设备工装验收 API（R-10）
 */

import { apiRequest } from '../../../services/api';

const BASE = '/apps/kuaizhizao/equipment-acceptances';

export const equipmentAcceptanceApi = {
  list: (params?: Record<string, unknown>) =>
    apiRequest(BASE, { method: 'GET', params }),
  get: (id: number) => apiRequest(`${BASE}/${id}`, { method: 'GET' }),
  create: (data: unknown) => apiRequest(BASE, { method: 'POST', data }),
  update: (id: number, data: unknown) =>
    apiRequest(`${BASE}/${id}`, { method: 'PUT', data }),
  delete: (id: number) => apiRequest(`${BASE}/${id}`, { method: 'DELETE' }),
  submit: (id: number) => apiRequest(`${BASE}/${id}/submit`, { method: 'POST' }),
  approve: (id: number) => apiRequest(`${BASE}/${id}/approve`, { method: 'POST' }),
  reject: (id: number, data: { reject_reason: string }) =>
    apiRequest(`${BASE}/${id}/reject`, { method: 'POST', data }),
};
