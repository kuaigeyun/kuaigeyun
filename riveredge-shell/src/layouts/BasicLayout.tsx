/**
 * 基础布局组件
 * 
 * 使用 ProLayout 实现页面布局，包含顶部导航栏、侧边栏菜单等
 */

import { ProLayout } from '@ant-design/pro-components';
import { Outlet, useNavigate, useLocation } from '@umijs/max';
import { useState } from 'react';
import { MenuDataItem } from '@umijs/max';
import { DashboardOutlined } from '@ant-design/icons';
import TenantSelector from '@/components/TenantSelector';

/**
 * 菜单数据
 * 
 * 定义侧边栏菜单项
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] => {
  return menuList.map((item) => {
    return {
      ...item,
      icon: item.icon,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
  });
};

/**
 * 基础布局组件
 */
export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <ProLayout
      title="RiverEdge SaaS"
      logo="/logo.png"
      collapsed={collapsed}
      onCollapse={setCollapsed}
      location={location}
      menu={{
        request: async () => {
          // 从路由配置中获取菜单数据
          // 这里后续可以从后端动态加载菜单
          return [
            {
              path: '/dashboard',
              name: '仪表盘',
              icon: <DashboardOutlined />,
            },
          ];
        },
      }}
      menuDataRender={menuDataRender}
      onMenuHeaderClick={() => navigate('/')}
      menuItemRender={(item, dom) => (
        <div onClick={() => navigate(item.path || '/')}>{dom}</div>
      )}
      headerContentRender={() => <TenantSelector />}
      footerRender={() => null}
    >
      <Outlet />
    </ProLayout>
  );
}

