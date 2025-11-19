/**
 * Umi 配置文件 (V4.0.90)
 *
 * 配置 Umi V4.0.90 应用的基础设置、路由、插件等
 * 【锁定版本】：@umijs/max@4.0.90，永久不再更改
 */

/**
 * Umi V4.0.90 配置
 *
 * 使用 defineConfig 方式配置（V4.0.90 推荐）
 */
import { defineConfig } from '@umijs/max';

export default defineConfig({
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
   * MFSU 配置
   * 禁用 MFSU 以解决 React 19 兼容性问题
   */
  mfsu: false,

  /**
   * 插件配置
   * 【锁定语法】：UMI V4.0.90 中 request 和 model 是内置功能，无需额外配置
   * 永久锁定此配置，不再更改
   */
  
  /**
   * 代理配置（仅开发环境生效）
   * 
   * Umi V4 官方规范：
   * - proxy 配置仅在开发环境（umi dev）中生效
   * - 生产环境（umi build）中代理配置不会生效，需要通过 Nginx 等反向代理或设置 baseURL
   * 
   * 工作原理（开发环境）：
   * - 前端请求：/api/v1/auth/login（相对路径）
   * - 代理匹配：/api 路径前缀
   * - 代理转发：http://localhost:8000/api/v1/auth/login（后端服务器）
   * - 路径保持：不移除 /api 前缀，因为后端路由包含 /api/v1 前缀
   * 
   * 配置说明：
   * - target: 后端服务器地址（必须包含协议和端口）
   * - changeOrigin: 改变请求的 origin，解决跨域问题（必须设置为 true）
   * - secure: 如果是 https 接口，设置为 false 跳过证书验证（开发环境）
   * - pathRewrite: 路径重写规则（不配置，保持路径不变）
   * 
   * 生产环境处理：
   * - 方式一：设置环境变量 REACT_APP_API_BASE_URL，request.baseURL 会自动使用
   * - 方式二：使用 Nginx 等反向代理，将 /api 请求转发到后端服务器
   * 
   * 参考：
   * - https://umijs.org/docs/guides/proxy
   * - https://umijs.org/docs/api/config#proxy
   */
  proxy: {
    '/api': {
      target: 'http://localhost:9001',
      changeOrigin: true,
      secure: false,
      // 不配置 pathRewrite，保持路径不变
      // 因为后端路由包含 /api/v1 前缀，需要完整路径
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
  
  /**
   * Webpack 配置
   * 
   * 注意：不要手动配置 umi 别名，Umi 会自动处理
   */
  // chainWebpack(config: any) {
  //   // Umi 会自动处理 umi 模块的解析，不需要手动配置别名
  // },
});

