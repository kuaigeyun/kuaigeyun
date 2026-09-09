/**
 * 快捷入口菜单图标：与侧栏同一真源 — manifest/库表 icon → ManufacturingIcons。
 * 禁止 path 猜测、Ant 别名表、DynamicIcon、LayoutGrid 兜底。
 */

import React from 'react';
import type { MenuTree } from '../../services/menu';
import { ManufacturingIcons } from '../../utils/manufacturingIcons';

export function renderQuickEntryMenuIcon(menu: MenuTree): React.ReactNode {
  const rawIcon = typeof menu.icon === 'string' ? menu.icon.trim() : '';
  if (!rawIcon) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[quick-entry] 菜单无 icon（path=${menu.path ?? ''}）。请在 manifest 登记预置键，禁止兜底。`,
      );
    }
    return null;
  }
  const IconComponent = ManufacturingIcons[rawIcon as keyof typeof ManufacturingIcons];
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[quick-entry] icon "${rawIcon}" 未登记 ManufacturingIcons（path=${menu.path ?? ''}）。请改 manifest，禁止兜底。`,
      );
    }
    return null;
  }
  return React.createElement(IconComponent, { size: 24 });
}

export function getQuickEntryIconByPath(menuPath: string, menuName?: string): React.ReactNode {
  const pseudoMenu = {
    uuid: menuPath || 'quick-entry',
    tenant_id: 0,
    name: menuName || menuPath || '',
    path: menuPath,
    sort_order: 0,
    is_active: true,
    is_external: false,
    created_at: '',
    updated_at: '',
    children: [],
  } as MenuTree;
  return renderQuickEntryMenuIcon(pseudoMenu);
}
