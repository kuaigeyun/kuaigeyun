/**
 * 电子制造行业包入口
 */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageSkeleton from '../../components/page-skeleton';

const withPageSuspense = (LazyComponent: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense fallback={<PageSkeleton />}>
    <LazyComponent />
  </Suspense>
);

const HomePage = lazy(() => import('./pages/home/index'));
const EsdHubPage = lazy(() => import('./pages/esd/index'));
const EsdInspectionPage = lazy(() => import('./pages/esd/inspection'));
const EsdDashboardPage = lazy(() => import('./pages/esd/dashboard'));
const LabelOemPage = lazy(() => import('./pages/label-oem/index'));

export default function KuaiElectronicsApp() {
  return (
    <Routes>
      <Route index element={withPageSuspense(HomePage)} />
      <Route path="esd" element={withPageSuspense(EsdHubPage)} />
      <Route path="esd/inspection" element={withPageSuspense(EsdInspectionPage)} />
      <Route path="esd/dashboard" element={withPageSuspense(EsdDashboardPage)} />
      <Route path="label-oem" element={withPageSuspense(LabelOemPage)} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
