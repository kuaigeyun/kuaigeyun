/**
 * 工程变更独立路由已并入变更工作台（WP-04A）。
 * 深链保留：/apps/kuaiplm/engineering-changes → change-management?tab=ecn
 */

import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

const EngineeringChangesRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const next = new URLSearchParams(searchParams);
  next.set('tab', 'ecn');
  const qs = next.toString();
  return <Navigate to={`/apps/kuaiplm/change-management${qs ? `?${qs}` : ''}`} replace />;
};

export default EngineeringChangesRedirect;
