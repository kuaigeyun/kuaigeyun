import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageSkeleton from '../page-skeleton';
import { TENANT_HOME_FALLBACK } from '../../stores/configStore';
import { useTenantEffectiveHomePath } from '../../hooks/useTenantEffectiveHomePath';

/**
 * 仅当有效首页确为兜底页时才展示 Default-home；
 * 已配置菜单/角色首页时自动跳转到真实首页，避免误报「未配置首页」。
 */
export const DefaultHomeRouteGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { path, ready } = useTenantEffectiveHomePath();

  useEffect(() => {
    if (!ready) return;
    if (path !== TENANT_HOME_FALLBACK) {
      navigate(path, { replace: true });
    }
  }, [ready, path, navigate]);

  if (!ready) {
    return <PageSkeleton variant="content" />;
  }

  if (path !== TENANT_HOME_FALLBACK) {
    return null;
  }

  return <>{children}</>;
};

export default DefaultHomeRouteGate;
