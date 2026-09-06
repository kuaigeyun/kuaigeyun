import { apiRequest } from '../../../services/api';

const BASE = '/apps/kuaielectronics/label-oem';

export type LabelOemPackItem = {
  pack_code: string;
  pack_name: string;
  barcode_kind: string;
  qty_per_box: number;
  print_copies: number;
  validation_hooks: string[];
  policy_config?: Record<string, unknown>;
  remarks?: string;
  applied: boolean;
  model_id?: number | null;
  template_uuid?: string | null;
  template_bound: boolean;
};

export type LabelOemPackStatus = {
  items: LabelOemPackItem[];
  total: number;
  placeholder_template_uuid: string;
  created?: number;
  skipped?: number;
};

export const labelOemApi = {
  listPacks: async () => (await apiRequest(`${BASE}/packs`, { method: 'GET' })) as LabelOemPackStatus,
  ensurePacks: async (pack_codes?: string[]) =>
    (await apiRequest(`${BASE}/packs/ensure`, {
      method: 'POST',
      data: { pack_codes: pack_codes || null },
    })) as LabelOemPackStatus,
};
