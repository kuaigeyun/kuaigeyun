/**
 * 快研发 APP 入口
 *
 * URL: /apps/kuaiplm/{path}
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageSkeleton from '../../components/page-skeleton';

const withPageSuspense = (LazyComponent: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<PageSkeleton />}>
    <LazyComponent />
  </Suspense>
);

const DashboardPage = lazy(() => import('./pages/dashboard/index'));
const RdProjectsListPage = lazy(() => import('./pages/rd-projects/index'));
const RdProjectDetailPage = lazy(() => import('./pages/rd-projects/detail'));
const ChangeManagementPage = lazy(() => import('./pages/change-management/index'));
const KnowledgeBasePage = lazy(() => import('./pages/knowledge-base/index'));
const KnowledgeArticleDetailPage = lazy(() => import('./pages/knowledge-base/detail'));
const RequirementsPage = lazy(() => import('./pages/phase2/requirements/index'));
const DesignReviewsPage = lazy(() => import('./pages/phase2/design-reviews/index'));
const FmeaPage = lazy(() => import('./pages/phase2/fmea/index'));
const GateTemplatesPage = lazy(() => import('./pages/gate-templates/index'));
const ProductFirmwaresPage = lazy(() => import('./pages/product-firmwares/index'));
const ProductionFilesPage = lazy(() => import('./pages/production-files/index'));
const TrialFlowsPage = lazy(() => import('./pages/trial-flows/index'));
const LabRequestsPage = lazy(() => import('./pages/lab-requests/index'));
const LabJudgmentRulesPage = lazy(() => import('./pages/lab-judgment-rules/index'));
const AnnualLabPlansPage = lazy(() => import('./pages/annual-lab-plans/index'));
const EngineeringChangesPage = lazy(() => import('./pages/engineering-changes/index'));
const SampleProcessApplicationsPage = lazy(
  () => import('./pages/sample-process-applications/index'),
);
const MaterialReviewsPage = lazy(() => import('./pages/material-reviews/index'));
const BomCollaborationsPage = lazy(() => import('./pages/bom-collaborations/index'));
const ProjectProposalsPage = lazy(() => import('./pages/project-proposals/index'));
const MoldSampleOrdersPage = lazy(() => import('./pages/mold-sample-orders/index'));
const PendingInboxPage = lazy(() => import('./pages/pending-inbox/index'));

const KuaiplmApp: React.FC = () => (
  <Routes>
    <Route path="dashboard" element={withPageSuspense(DashboardPage)} />
    <Route path="pending-inbox" element={withPageSuspense(PendingInboxPage)} />
    <Route path="rd-projects" element={withPageSuspense(RdProjectsListPage)} />
    <Route path="rd-projects/detail/:id" element={withPageSuspense(RdProjectDetailPage)} />
    <Route path="gate-templates" element={withPageSuspense(GateTemplatesPage)} />
    <Route path="change-management" element={withPageSuspense(ChangeManagementPage)} />
    <Route path="knowledge-base" element={withPageSuspense(KnowledgeBasePage)} />
    <Route path="knowledge-base/detail/:id" element={withPageSuspense(KnowledgeArticleDetailPage)} />
    <Route path="phase2/requirements" element={withPageSuspense(RequirementsPage)} />
    <Route path="phase2/design-reviews" element={withPageSuspense(DesignReviewsPage)} />
    <Route path="phase2/fmea" element={withPageSuspense(FmeaPage)} />
    <Route path="product-firmwares" element={withPageSuspense(ProductFirmwaresPage)} />
    <Route path="production-files" element={withPageSuspense(ProductionFilesPage)} />
    <Route path="trial-flows" element={withPageSuspense(TrialFlowsPage)} />
    <Route path="lab-requests" element={withPageSuspense(LabRequestsPage)} />
    <Route path="lab-board" element={withPageSuspense(LabRequestsPage)} />
    <Route path="lab-judgment-rules" element={withPageSuspense(LabJudgmentRulesPage)} />
    <Route path="annual-lab-plans" element={withPageSuspense(AnnualLabPlansPage)} />
    <Route path="engineering-changes" element={withPageSuspense(EngineeringChangesPage)} />
    <Route
      path="sample-process-applications"
      element={withPageSuspense(SampleProcessApplicationsPage)}
    />
    <Route path="material-reviews" element={withPageSuspense(MaterialReviewsPage)} />
    <Route path="bom-collaborations" element={withPageSuspense(BomCollaborationsPage)} />
    <Route path="project-proposals" element={withPageSuspense(ProjectProposalsPage)} />
    <Route path="mold-sample-orders" element={withPageSuspense(MoldSampleOrdersPage)} />
    <Route path="" element={<Navigate to="dashboard" replace />} />
  </Routes>
);

export default KuaiplmApp;
