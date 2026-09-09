/**
 * 快设备应用入口（业务页仍由快制造 /apps/kuaizhizao/equipment-management 承载）
 */
import React, { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PageSkeleton from '../../components/page-skeleton';

const HomePage = lazy(() => import('./pages/home'));

const withPageSuspense = (LazyComponent: React.LazyExoticComponent<React.ComponentType<object>>) => (
  <Suspense fallback={<PageSkeleton />}>
    <LazyComponent />
  </Suspense>
);

export default function KuaiemsApp() {
  return (
    <Routes>
      <Route index element={withPageSuspense(HomePage)} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
}
