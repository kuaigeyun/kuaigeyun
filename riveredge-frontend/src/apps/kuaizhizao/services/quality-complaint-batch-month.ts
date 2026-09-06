import { apiRequest } from '../../../services/api';

export interface QualityComplaintBatchMonth {
  id?: number;
  year_month: string;
  total_batch_count: number;
  remarks?: string;
}

const BASE = '/apps/kuaizhizao/quality-complaint-batch-months';

export const qualityComplaintBatchMonthApi = {
  list: async (params?: Record<string, unknown>) =>
    apiRequest<{ data: QualityComplaintBatchMonth[]; total: number; success: boolean }>(BASE, {
      method: 'GET',
      params,
    }),
  upsert: async (data: QualityComplaintBatchMonth) =>
    apiRequest<QualityComplaintBatchMonth>(BASE, { method: 'PUT', data }),
};
