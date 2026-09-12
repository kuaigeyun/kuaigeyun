import TenantHomeRedirect from '../tenant-home-redirect';

/** 已登录访问 /login：解析有效首页后跳转（角色 > 菜单主页 > 工作台 > 兜底页） */
export default function RedirectToTenantHome() {
  return <TenantHomeRedirect />;
}
