/**
 * Umi 配置文件
 * 
 * 配置 Umi V4 应用的基础设置、路由、插件等
 */

import { defineConfig } from '@umijs/max';

export default defineConfig({
  /**
   * 插件配置
   * 
   * 显式启用 model 和 request 插件
   * 注意：虽然 @umijs/max 预设已包含这些插件，但需要显式配置才能启用
   */
  plugins: [
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/request',
  ],
  /**
   * 路由配置
   */
  routes: [
    {
      path: '/login',
      component: '@/pages/login/index',
      layout: false, // 登录页不使用布局
    },
    {
      path: '/register',
      component: '@/pages/register/index',
      layout: false, // 注册页不使用布局
    },
    {
      path: '/',
      component: '@/layouts/BasicLayout',
      routes: [
        {
          path: '/',
          component: '@/pages/index',
          exact: true,
        },
        {
          path: '/dashboard',
          component: '@/pages/dashboard/index',
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
              component: '@/pages/user/list/index',
              name: '用户列表',
            },
            {
              path: '/user/form',
              component: '@/pages/user/form/index',
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
              component: '@/pages/role/list/index',
              name: '角色列表',
            },
            {
              path: '/role/form',
              component: '@/pages/role/form/index',
              name: '角色表单',
              hideInMenu: true,
            },
            {
              path: '/role/permissions',
              component: '@/pages/role/permissions/index',
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
              component: '@/pages/tenant/list/index',
              name: '租户列表',
            },
            {
              path: '/tenant/form',
              component: '@/pages/tenant/form/index',
              name: '租户表单',
              hideInMenu: true,
            },
            {
              path: '/tenant/detail',
              component: '@/pages/tenant/detail/index',
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
                  component: '@/pages/superadmin/tenants/list/index',
                  name: '租户列表',
                },
                {
                  path: '/superadmin/tenants/detail',
                  component: '@/pages/superadmin/tenants/detail/index',
                  name: '租户详情',
                  hideInMenu: true,
                },
              ],
            },
          ],
        },
        {
          path: '*',
          component: '@/pages/404',
          layout: false,
        },
      ],
    },
  ],
  
  /**
   * Model 插件配置
   * 启用 Umi Model 状态管理功能
   */
  model: {},
  
  /**
   * Request 插件配置
   * 启用 Umi Request HTTP 请求功能
   */
  request: {},
  
  /**
   * MFSU 配置
   * 禁用 MFSU 以解决 React 19 兼容性问题
   */
  mfsu: false,
  
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

