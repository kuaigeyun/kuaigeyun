/**
 * 权限定义文件
 * 
 * 使用 @umijs/plugin-access 定义权限规则
 */

import { CurrentUser } from '@/types/api';

/**
 * 权限定义
 * 
 * 根据用户信息判断用户拥有的权限
 * 
 * @param initialState - 初始状态（包含用户信息）
 * @returns 权限对象
 */
export default function access(initialState: { currentUser?: CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  
  return {
    /**
     * 是否已登录
     */
    canAccess: !!currentUser,
    
    /**
     * 是否为超级管理员
     */
    isSuperAdmin: currentUser?.is_superuser === true,
    
    /**
     * 是否为租户管理员
     */
    isTenantAdmin: currentUser?.is_tenant_admin === true,
    
    /**
     * 是否拥有用户管理权限
     */
    canManageUsers: currentUser?.is_superuser === true || currentUser?.is_tenant_admin === true,
    
    /**
     * 是否拥有角色管理权限
     */
    canManageRoles: currentUser?.is_superuser === true || currentUser?.is_tenant_admin === true,
  };
}

