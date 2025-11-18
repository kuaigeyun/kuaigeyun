/**
 * 认证 API 服务
 * 
 * 提供登录、注册、Token 刷新等认证相关的 API 接口
 */

import { apiRequest } from './api';

/**
 * 登录请求数据接口
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * 登录响应数据接口
 */
export interface LoginResponse {
  token: string;
  refresh_token?: string;
  tenant_id?: number;
  user: {
    id: number;
    username: string;
    email?: string;
    is_superuser?: boolean;
    is_tenant_admin?: boolean;
  };
}

/**
 * 用户信息接口
 */
export interface CurrentUser {
  id: number;
  username: string;
  email?: string;
  is_superuser?: boolean;
  is_tenant_admin?: boolean;
  tenant_id?: number;
}

// 导出类型别名，便于在其他地方使用
export type { CurrentUser as UserInfo };

/**
 * 登录
 * 
 * @param data - 登录数据
 * @returns 登录响应数据
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    data,
  });
}

/**
 * 获取当前用户信息
 * 
 * @returns 当前用户信息
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return apiRequest<CurrentUser>('/auth/me');
}

/**
 * 刷新 Token
 * 
 * @param refreshToken - 刷新令牌
 * @returns 新的 Token
 */
export async function refreshToken(refreshToken: string): Promise<{ token: string }> {
  return apiRequest<{ token: string }>('/auth/refresh', {
    method: 'POST',
    data: { refresh_token: refreshToken },
  });
}

/**
 * 登出
 */
export async function logout(): Promise<void> {
  return apiRequest<void>('/auth/logout', {
    method: 'POST',
  });
}

