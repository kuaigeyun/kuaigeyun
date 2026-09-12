import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageSkeleton from '../page-skeleton';
import { useTenantEffectiveHomePath } from '../../hooks/useTenantEffectiveHomePath';

/** 解析有效首页后 replace 跳转（用于 /、/login 已登录回落等） */
export const TenantHomeRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { path, ready } = useTenantEffectiveHomePath();

  useEffect(() => {
    if (ready) {
      navigate(path, { replace: true });
    }
  }, [ready, path, navigate]);

  if (!ready) {
    return <PageSkeleton variant="content" />;
  }

  return <Navigate to={path} replace />;
};

export default TenantHomeRedirect;
