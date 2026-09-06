import { apiRequest } from '../../../services/api';

export type EsdProjectType = {
  code: string;
  label: string;
  sort?: number;
  active?: boolean;
  value_type?: string;
  method?: string;
  judgment_standard?: string;
  requirement?: string;
  is_critical?: boolean;
  photo_required?: boolean;
};

export type EsdCatalog = {
  profile: Record<string, unknown>;
  scheme: {
    id: number;
    uuid: string;
    code: string;
    name: string;
    domain: string;
    is_active: boolean;
    capture_mode?: string;
    cycle_type?: string;
  } | null;
  project_types: EsdProjectType[];
  active_count: number;
};

export type EsdBoard = {
  plant: { id: number; uuid: string; code: string; name: string } | null;
  domain?: string;
  metrics: {
    total_count: number;
    faulty_count: number;
    open_fault_count: number;
    failure_rate: number;
    spot_check_due: number;
    spot_check_done: number;
    spot_check_pending: number;
    spot_check_rate: number;
    spot_check_review_pending: number;
    alert_count: number;
  };
  status_breakdown: { status: string; count: number }[];
  alerts: {
    kind: string;
    title: string;
    detail?: string;
    document_no?: string;
    equipment_code?: string;
    equipment_name?: string;
    occurred_at?: string;
    link_path?: string;
    link_uuid?: string;
  }[];
  as_of?: string;
  spot_check_date?: string;
};

export const kuaielectronicsEsdApi = {
  getCatalog: () => apiRequest<EsdCatalog>('/apps/kuaielectronics/esd/catalog', { method: 'GET' }),
  updateCatalog: (project_types: Partial<EsdProjectType> & { code: string }[]) =>
    apiRequest('/apps/kuaielectronics/esd/catalog', {
      method: 'PUT',
      data: { project_types },
    }),
  ensureCatalog: () =>
    apiRequest('/apps/kuaielectronics/esd/catalog/ensure', { method: 'POST' }),
  getBoardPlants: () =>
    apiRequest<{ items: { id: number; uuid: string; code: string; name: string }[]; total: number }>(
      '/apps/kuaielectronics/esd/board/plants',
      { method: 'GET' },
    ),
  getBoard: (plantId?: number, visitMode = false) =>
    apiRequest<EsdBoard>('/apps/kuaielectronics/esd/board', {
      method: 'GET',
      params: { plant_id: plantId, alert_limit: 30, visit_mode: visitMode },
    }),
};
