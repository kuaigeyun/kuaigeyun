import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { TENANT_HOME_FALLBACK } from '../stores/configStore';
import { useTenantEffectiveHomePath } from './useTenantEffectiveHomePath';

/** 系统级仪表盘关闭时的兜底路径（与 effective-home 一致，不再使用应用中心） */
export const SYSTEM_DASHBOARD_FALLBACK_PATH = TENANT_HOME_FALLBACK;

/**
 * 站点设置「系统级仪表盘是否显示」关闭时，将系统仪表盘路由重定向到租户有效首页：
 * 自定义后台首页 → 应用中心（系统仪表盘已关闭时不再落工作台）。
 */
export function useRedirectIfSystemDashboardOff() {
  const navigate = useNavigate();
  const initialized = useConfigStore((s) => s.initialized);
  const configs = useConfigStore((s) => s.configs);
  const enabled = configs.enable_system_dashboard !== false;
  const { path: redirectPath, ready: homeReady } = useTenantEffectiveHomePath();

  useEffect(() => {
    if (!initialized || !homeReady) return;
    if (!enabled) {
      navigate(redirectPath, { replace: true });
    }
  }, [initialized, homeReady, enabled, navigate, redirectPath]);

  return { initialized: initialized && homeReady, enabled };
}
