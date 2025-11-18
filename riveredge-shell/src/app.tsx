/**
 * 应用入口文件
 * 
 * 配置 Umi 应用的全局设置、请求拦截器等
 */

import { defineApp } from '@umijs/max';
import { App, message } from 'antd';

/**
 * 应用配置
 */
export default defineApp({
  /**
   * 根容器配置
   * 
   * 使用 Ant Design App 组件包裹应用，解决 message 静态函数警告
   */
  rootContainer: (lastRootContainer: JSX.Element) => {
    return <App>{lastRootContainer}</App>;
  },
  
  /**
   * 请求配置
   * 
   * 配置请求拦截器、响应拦截器、错误处理等
   */
  request: {
    /**
     * 请求拦截器
     * 
     * 在发送请求前添加 Token、设置请求头等
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
     */
    responseInterceptors: [
    (response: any) => {
      // 处理响应数据
      const { data } = response;
      
      // 如果响应包含错误信息，统一处理
      if (data && data.code && data.code !== 200) {
        message.error(data.message || '请求失败');
        throw new Error(data.message || '请求失败');
      }
      
      // 映射后端响应格式到前端格式
      // 后端返回 access_token，前端期望 token
      if (data && data.access_token) {
        data.token = data.access_token;
        delete data.access_token;
      }
      
      return response;
    },
    (error: any) => {
      // 处理错误响应
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            // 未授权，跳转到登录页
            message.error('登录已过期，请重新登录');
            window.location.href = '/login';
            break;
          case 403:
            message.error('权限不足');
            break;
          case 404:
            message.error('资源不存在');
            break;
          case 500:
            message.error('服务器内部错误');
            break;
          default:
            message.error(data?.message || '请求失败');
        }
      } else {
        message.error('网络错误，请检查网络连接');
      }
      
      return Promise.reject(error);
    },
    ],
    
    /**
     * 错误处理配置
     */
    errorConfig: {
      errorHandler: (error: any) => {
        console.error('请求错误:', error);
      },
      errorThrower: (error: any) => {
        throw error;
      },
    },
  },
});
