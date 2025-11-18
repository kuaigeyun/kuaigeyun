/**
 * API 基础配置
 * 
 * 定义 API 基础 URL 和通用配置
 */

import { request } from '@umijs/max';

/**
 * API 基础 URL
 */
export const API_BASE_URL = '/api/v1';

/**
 * 通用 API 响应接口
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应接口
 */
export interface PageResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * 通用 API 请求函数
 * 
 * @param url - 请求 URL
 * @param options - 请求选项
 * @returns 响应数据
 */
export async function apiRequest<T = any>(
  url: string,
  options?: any
): Promise<T> {
  const response = await request<ApiResponse<T>>(`${API_BASE_URL}${url}`, {
    ...options,
  });
  
  return response.data;
}

