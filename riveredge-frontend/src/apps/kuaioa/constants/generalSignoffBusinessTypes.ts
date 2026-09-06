/**
 * 轻办公通用会签业务类型（WP-04B）
 * 与后端 general_signoff_business_types 对齐；让步放行仍走 collaboration/concession。
 */

export const GENERAL_SIGNOFF_BUSINESS_TYPES = [
  { code: 'five_m_change', labelKey: 'app.kuaioa.formBusinessType.five_m_change' },
  { code: 'material_request', labelKey: 'app.kuaioa.formBusinessType.material_request' },
  { code: 'sample_inspection', labelKey: 'app.kuaioa.formBusinessType.sample_inspection' },
  { code: 'tech_work_contact', labelKey: 'app.kuaioa.formBusinessType.tech_work_contact' },
  { code: 'confirmation', labelKey: 'app.kuaioa.formBusinessType.confirmation' },
  { code: 'review_sheet', labelKey: 'app.kuaioa.formBusinessType.review_sheet' },
  { code: 'material_issue', labelKey: 'app.kuaioa.formBusinessType.material_issue' },
] as const;

export type GeneralSignoffBusinessTypeCode =
  (typeof GENERAL_SIGNOFF_BUSINESS_TYPES)[number]['code'];
