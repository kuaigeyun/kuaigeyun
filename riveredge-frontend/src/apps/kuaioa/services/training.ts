import { kuaioaDelete, kuaioaList, kuaioaPost, kuaioaPut, kuaioaGet } from './kuaioaApi';

const BASE = '/apps/kuaioa/training';

export interface TrainingPlan {
  id: number;
  plan_code: string;
  plan_name: string;
  plan_type: string;
  plan_year?: number | null;
  department_name?: string | null;
  due_date?: string | null;
  status: string;
}

export interface TrainingRecord {
  id: number;
  record_code: string;
  training_name: string;
  record_kind?: string;
  trainee_name?: string | null;
  training_date?: string | null;
  due_date?: string | null;
  is_passed: boolean;
  hr_confirmed_at?: string | null;
  status: string;
}

export interface WorkLicense {
  id: number;
  license_code: string;
  license_name: string;
  holder_name?: string | null;
  expiry_date?: string | null;
  status: string;
}

export interface DeptTrainingApplication {
  id: number;
  request_code: string;
  title: string;
  plan_year: number;
  department_name?: string | null;
  status: string;
}

export interface SpecialWorkQualification {
  id: number;
  request_code: string;
  title: string;
  qualification_year: number;
  holder_name?: string | null;
  job_type?: string | null;
  status: string;
}

export interface TrainingTemplate {
  id: number;
  template_code: string;
  template_name: string;
  template_kind: string;
  is_active: boolean;
}

export const listTrainingPlans = (params?: Record<string, unknown>) =>
  kuaioaList<TrainingPlan>(`${BASE}/plans`, params);
export const getTrainingPlan = (id: number) =>
  kuaioaGet<TrainingPlan>(`${BASE}/plans/${id}`);
export const createTrainingPlan = (data: Partial<TrainingPlan>) =>
  kuaioaPost<TrainingPlan>(`${BASE}/plans`, data);
export const updateTrainingPlan = (id: number, data: Partial<TrainingPlan>) =>
  kuaioaPut<TrainingPlan>(`${BASE}/plans/${id}`, data);
export const deleteTrainingPlan = (id: number) => kuaioaDelete(`${BASE}/plans/${id}`);

export const listTrainingRecords = (params?: Record<string, unknown>) =>
  kuaioaList<TrainingRecord>(`${BASE}/records`, params);
export const getTrainingRecord = (id: number) =>
  kuaioaGet<TrainingRecord>(`${BASE}/records/${id}`);
export const createTrainingRecord = (data: Partial<TrainingRecord>) =>
  kuaioaPost<TrainingRecord>(`${BASE}/records`, data);
export const updateTrainingRecord = (id: number, data: Partial<TrainingRecord>) =>
  kuaioaPut<TrainingRecord>(`${BASE}/records/${id}`, data);
export const deleteTrainingRecord = (id: number) => kuaioaDelete(`${BASE}/records/${id}`);
export const confirmTrainingRecordHr = (id: number) =>
  kuaioaPost<TrainingRecord>(`${BASE}/records/${id}/confirm-hr`, {});

export const listExpiringWorkLicenses = (withinDays = 30) =>
  kuaioaList<WorkLicense>(`${BASE}/work-licenses/expiring`, { within_days: withinDays });
export const listWorkLicenses = (params?: Record<string, unknown>) =>
  kuaioaList<WorkLicense>(`${BASE}/work-licenses`, params);
export const getWorkLicense = (id: number) =>
  kuaioaGet<WorkLicense>(`${BASE}/work-licenses/${id}`);
export const createWorkLicense = (data: Partial<WorkLicense>) =>
  kuaioaPost<WorkLicense>(`${BASE}/work-licenses`, data);
export const updateWorkLicense = (id: number, data: Partial<WorkLicense>) =>
  kuaioaPut<WorkLicense>(`${BASE}/work-licenses/${id}`, data);
export const deleteWorkLicense = (id: number) => kuaioaDelete(`${BASE}/work-licenses/${id}`);
export const printWorkLicense = (id: number) =>
  kuaioaGet<{
    title: string;
    fields: Array<{ label: string; value?: string | null }>;
    record: WorkLicense;
  }>(`${BASE}/work-licenses/${id}/print`);

export const listDeptTrainingApplications = (params?: Record<string, unknown>) =>
  kuaioaList<DeptTrainingApplication>(`${BASE}/dept-applications`, params);
export const getDeptTrainingApplication = (id: number) =>
  kuaioaGet<DeptTrainingApplication>(`${BASE}/dept-applications/${id}`);
export const createDeptTrainingApplication = (data: Partial<DeptTrainingApplication>) =>
  kuaioaPost<DeptTrainingApplication>(`${BASE}/dept-applications`, data);
export const updateDeptTrainingApplication = (
  id: number,
  data: Partial<DeptTrainingApplication>,
) => kuaioaPut<DeptTrainingApplication>(`${BASE}/dept-applications/${id}`, data);
export const deleteDeptTrainingApplication = (id: number) =>
  kuaioaDelete(`${BASE}/dept-applications/${id}`);

export const listSpecialWorkQualifications = (params?: Record<string, unknown>) =>
  kuaioaList<SpecialWorkQualification>(`${BASE}/special-work-qualifications`, params);
export const getSpecialWorkQualification = (id: number) =>
  kuaioaGet<SpecialWorkQualification>(`${BASE}/special-work-qualifications/${id}`);
export const createSpecialWorkQualification = (data: Partial<SpecialWorkQualification>) =>
  kuaioaPost<SpecialWorkQualification>(`${BASE}/special-work-qualifications`, data);
export const updateSpecialWorkQualification = (
  id: number,
  data: Partial<SpecialWorkQualification>,
) => kuaioaPut<SpecialWorkQualification>(`${BASE}/special-work-qualifications/${id}`, data);
export const deleteSpecialWorkQualification = (id: number) =>
  kuaioaDelete(`${BASE}/special-work-qualifications/${id}`);

export const listTrainingTemplates = (params?: Record<string, unknown>) =>
  kuaioaList<TrainingTemplate>(`${BASE}/templates`, params);
export const getTrainingTemplate = (id: number) =>
  kuaioaGet<TrainingTemplate>(`${BASE}/templates/${id}`);
export const createTrainingTemplate = (data: Partial<TrainingTemplate>) =>
  kuaioaPost<TrainingTemplate>(`${BASE}/templates`, data);
export const updateTrainingTemplate = (id: number, data: Partial<TrainingTemplate>) =>
  kuaioaPut<TrainingTemplate>(`${BASE}/templates/${id}`, data);
export const deleteTrainingTemplate = (id: number) => kuaioaDelete(`${BASE}/templates/${id}`);
