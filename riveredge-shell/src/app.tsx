/**
 * 应用入口文件
 * 
 * 配置 Umi 应用的全局设置、请求拦截器等
 */

import React from 'react';
import { App } from 'antd';
import { getToken } from '@/utils/auth';
import { getCurrentUser } from '@/services/auth';

/**
 * 应用配置
 * 
 * Umi V4 中直接导出配置对象，不需要 defineApp
 */
/**
 * 获取初始状态
 *
 * 在应用启动时获取用户信息，用于权限控制和状态初始化
 */
export async function getInitialState(): Promise<{
  currentUser?: any;
  loading?: boolean;
}> {
  // 检查是否有 Token
  if (!getToken()) {
    return { currentUser: undefined, loading: false };
  }

  try {
    // 获取当前用户信息
    const currentUser = await getCurrentUser();
    return { currentUser, loading: false };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // Token 无效，清除认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('tenant_id');
    return { currentUser: undefined, loading: false };
  }
}

export const request = {
  /**
   * 请求拦截器
   *
   * 在发送请求前添加 Token、设置请求头等
   * 注意：确保使用相对路径，不要使用绝对 URL，以便代理生效
   */
  requestInterceptors: [
    (config: any) => {
      // 从本地存储获取 Token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // 从本地存储获取租户 ID
      const tenantId = localStorage.getItem('tenant_id');
      if (tenantId) {
        config.headers = {
          ...config.headers,
          'X-Tenant-ID': tenantId,
        };
      }

      return config;
    },
  ],

  /**
   * 响应拦截器
   *
   * 处理响应数据、错误处理、Token 刷新等
   * 注意：不在拦截器中使用 message，避免静态方法警告，错误由组件处理
   */
  responseInterceptors: [
    (response: any) => {
      // 处理响应数据
      const { data } = response;

      // 如果响应包含错误信息，统一处理
      // 注意：不在这里使用 message，让组件自己处理错误
      if (data && data.code && data.code !== 200) {
        throw new Error(data.message || '请求失败');
      }

      // 后端直接返回数据，不需要转换
      // 前端已更新为使用 access_token 字段
      return response;
    },
    (error: any) => {
      // 处理错误响应
      // 注意：不在这里使用 message，让组件自己处理错误
      // 只处理需要特殊处理的错误（如 401 跳转）
      if (error.response) {
        const { status } = error.response;

        if (status === 401) {
          // 未授权，跳转到登录页
          // 注意：不在这里使用 message，避免静态方法警告
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    },
  ],

  /**
   * 错误处理配置
   */
  errorConfig: {
    errorHandler: () => {
      // 错误由组件处理，这里不输出调试信息
    },
    errorThrower: (error: any) => {
      throw error;
    },
  },
};

/**
 * 根容器配置
 *
 * 使用 Ant Design App 组件包裹应用，解决 message 静态函数警告
 * 注意：在拦截器中不能使用 message 静态方法，需要在组件中使用 App.useApp() 获取 message 实例
 */
export function rootContainer(lastRootContainer: React.ReactElement) {
  return <App>{lastRootContainer}</App>;
}
