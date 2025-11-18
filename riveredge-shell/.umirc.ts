/**
 * Umi 配置文件
 * 
 * 配置 Umi V4 应用的基础设置、路由、插件等
 */

import { defineConfig } from '@umijs/max';

export default defineConfig({
  /**
   * 应用配置
   */
  antd: {
    // 启用 Ant Design
    configProvider: {},
    appConfig: {},
  },
  
  /**
   * 路由配置
   */
  routes: [
    {
      path: '/',
      component: './pages',
    },
    {
      path: '/login',
      component: './pages/login',
      layout: false, // 登录页不使用布局
    },
    {
      path: '/register',
      component: './pages/register',
      layout: false, // 注册页不使用布局
    },
    {
      path: '/',
      component: './layouts/BasicLayout',
      routes: [
        {
          path: '/dashboard',
          component: './pages/dashboard',
          name: '仪表盘',
          icon: 'DashboardOutlined',
        },
        {
          path: '/user',
          name: '用户管理',
          icon: 'UserOutlined',
          routes: [
            {
              path: '/user/list',
              component: './pages/user/list',
              name: '用户列表',
            },
            {
              path: '/user/form',
              component: './pages/user/form',
              name: '用户表单',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/role',
          name: '角色管理',
          icon: 'TeamOutlined',
          routes: [
            {
              path: '/role/list',
              component: './pages/role/list',
              name: '角色列表',
            },
            {
              path: '/role/form',
              component: './pages/role/form',
              name: '角色表单',
              hideInMenu: true,
            },
            {
              path: '/role/permissions',
              component: './pages/role/permissions',
              name: '权限分配',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/tenant',
          name: '租户管理',
          icon: 'ApartmentOutlined',
          routes: [
            {
              path: '/tenant/list',
              component: './pages/tenant/list',
              name: '租户列表',
            },
            {
              path: '/tenant/form',
              component: './pages/tenant/form',
              name: '租户表单',
              hideInMenu: true,
            },
            {
              path: '/tenant/detail',
              component: './pages/tenant/detail',
              name: '租户详情',
              hideInMenu: true,
            },
          ],
        },
        {
          path: '/superadmin',
          name: '超级管理员',
          icon: 'CrownOutlined',
          access: 'isSuperAdmin',
          routes: [
            {
              path: '/superadmin/tenants',
              name: '租户管理',
              routes: [
                {
                  path: '/superadmin/tenants/list',
                  component: './pages/superadmin/tenants/list',
                  name: '租户列表',
                },
                {
                  path: '/superadmin/tenants/detail',
                  component: './pages/superadmin/tenants/detail',
                  name: '租户详情',
                  hideInMenu: true,
                },
              ],
            },
          ],
        },
        {
          path: '*',
          component: './pages/404',
        },
      ],
    },
  ],
  
  /**
   * 国际化配置
   */
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
    baseSeparator: '-',
  },
  
  /**
   * 权限配置
   */
  access: {},
  
  /**
   * 数据流配置
   */
  model: {},
  
  /**
   * 请求配置
   */
  request: {
    dataField: 'data',
  },
  
  /**
   * 代理配置（开发环境）
   */
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  
  /**
   * 构建配置
   */
  npmClient: 'npm',
  
  /**
   * 其他配置
   */
  favicons: ['/favicon.ico'],
  title: 'RiverEdge SaaS 多租户框架',
});

