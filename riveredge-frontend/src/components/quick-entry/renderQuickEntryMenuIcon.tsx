/**
 * 快捷入口菜单图标：与侧栏同一真源 — manifest/库表 icon → ManufacturingIcons。
 * 叶子未配 icon 时沿菜单树向上取最近祖先已登记键（分组/应用根真源），禁止 path 猜测、
 * Ant 别名表、DynamicIcon、LayoutGrid / Plus 兜底。
 */

import React from 'react';
import type { MenuTree } from '../../services/menu';
import { ManufacturingIcons } from '../../utils/manufacturingIcons';

function iconKeyFromMenu(menu: MenuTree | null | undefined): string {
  return typeof menu?.icon === 'string' ? menu.icon.trim() : '';
}

/** 自身 icon → 最近祖先 icon（自近及远） */
export function resolveMenuIconKey(menu: MenuTree, ancestors: MenuTree[] = []): string {
  const own = iconKeyFromMenu(menu);
  if (own) return own;
  for (let i = ancestors.length - 1; i >= 0; i -= 1) {
    const key = iconKeyFromMenu(ancestors[i]);
    if (key) return key;
  }
  return '';
}

export function findMenuAncestryByUuid(
  menus: MenuTree[],
  uuid: string,
  ancestors: MenuTree[] = [],
): { menu: MenuTree; ancestors: MenuTree[] } | null {
  const target = String(uuid);
  for (const menu of menus) {
    if (String(menu.uuid) === target) return { menu, ancestors };
    if (menu.children?.length) {
      const found = findMenuAncestryByUuid(menu.children, uuid, [...ancestors, menu]);
      if (found) return found;
    }
  }
  return null;
}

export function findMenuAncestryByPath(
  menus: MenuTree[],
  path: string,
  ancestors: MenuTree[] = [],
): { menu: MenuTree; ancestors: MenuTree[] } | null {
  const normalized = path.replace(/\/$/, '');
  if (!normalized) return null;
  for (const menu of menus) {
    if (menu.path && menu.path.replace(/\/$/, '') === normalized) {
      return { menu, ancestors };
    }
    if (menu.children?.length) {
      const found = findMenuAncestryByPath(menu.children, path, [...ancestors, menu]);
      if (found) return found;
    }
  }
  return null;
}

export function renderQuickEntryIconByKey(
  rawIcon: string,
  debugPath = '',
): React.ReactNode {
  const key = rawIcon.trim();
  if (!key) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[quick-entry] 菜单无 icon（path=${debugPath}）。请在 manifest 登记预置键，禁止兜底。`,
      );
    }
    return null;
  }
  const IconComponent = ManufacturingIcons[key as keyof typeof ManufacturingIcons];
  if (!IconComponent) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[quick-entry] icon "${key}" 未登记 ManufacturingIcons（path=${debugPath}）。请改 manifest，禁止兜底。`,
      );
    }
    return null;
  }
  return React.createElement(IconComponent, { size: 24 });
}

export function renderQuickEntryMenuIcon(
  menu: MenuTree,
  ancestors: MenuTree[] = [],
): React.ReactNode {
  return renderQuickEntryIconByKey(resolveMenuIconKey(menu, ancestors), menu.path ?? '');
}

/** 在菜单树中按 uuid / path 解析图标；找不到节点时无法取真源，返回 null。 */
export function resolveQuickEntryIconFromTree(
  menuTree: MenuTree[],
  opts: { menu_uuid?: string; menu_path?: string },
): React.ReactNode {
  let hit: { menu: MenuTree; ancestors: MenuTree[] } | null = null;
  if (opts.menu_uuid) {
    hit = findMenuAncestryByUuid(menuTree, opts.menu_uuid);
  }
  if (!hit && opts.menu_path) {
    hit = findMenuAncestryByPath(menuTree, opts.menu_path);
  }
  if (!hit) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[quick-entry] 菜单树中找不到节点（uuid=${opts.menu_uuid ?? ''} path=${opts.menu_path ?? ''}），无法解析 icon。`,
      );
    }
    return null;
  }
  return renderQuickEntryMenuIcon(hit.menu, hit.ancestors);
}

/** @deprecated 无菜单树无法取真源；请用 resolveQuickEntryIconFromTree */
export function getQuickEntryIconByPath(menuPath: string, _menuName?: string): React.ReactNode {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      `[quick-entry] getQuickEntryIconByPath 已废弃（path=${menuPath}）。须带菜单树解析 icon。`,
    );
  }
  return null;
}
