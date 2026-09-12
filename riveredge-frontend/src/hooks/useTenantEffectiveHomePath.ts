import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  EFFECTIVE_HOME_QUERY_KEY,
  getEffectiveHome,
  getTenantBackendHome,
  TENANT_BACKEND_HOME_QUERY_KEY,
  type EffectiveHomeSource,
} from '../services/menu';
import { resolveEffectiveHomePath, useConfigStore } from '../stores/configStore';
import { getTenantId, getToken } from '../utils/auth';

/** 当前用户有效首页：角色 > 菜单主页 > 系统工作台 > 兜底页（与后端 effective-home 一致） */
export function useTenantEffectiveHomePath(options?: { enabled?: boolean }) {
  const configs = useConfigStore((s) => s.configs);
  const tenantIdStr = getTenantId()?.toString() ?? null;
  const enabled = (options?.enabled ?? true) && !!(getToken() && tenantIdStr);

  const { data: tenantBackendHome, isFetched: backendHomeFetched } = useQuery({
    queryKey: [...TENANT_BACKEND_HOME_QUERY_KEY, tenantIdStr],
    queryFn: getTenantBackendHome,
    enabled,
    staleTime: 60 * 1000,
  });

  const { data: effectiveHome, isFetched: effectiveHomeFetched } = useQuery({
    queryKey: [...EFFECTIVE_HOME_QUERY_KEY, tenantIdStr],
    queryFn: getEffectiveHome,
    enabled,
    staleTime: 60 * 1000,
  });

  const path = useMemo(
    () => resolveEffectiveHomePath(effectiveHome, tenantBackendHome?.path, configs),
    [effectiveHome, tenantBackendHome?.path, configs],
  );

  const ready = !enabled || (backendHomeFetched && effectiveHomeFetched);

  return {
    path,
    ready,
    source: effectiveHome?.source as EffectiveHomeSource | undefined,
    menuUuid: effectiveHome?.menu_uuid ?? tenantBackendHome?.menu_uuid ?? null,
  };
}
