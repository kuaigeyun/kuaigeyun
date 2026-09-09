/**
 * 快捷入口数据：收藏项解析 + 无收藏时从菜单树生成默认项（与工作台一致）
 */

import type { ReactNode } from 'react';
import type { MenuTree } from '../../services/menu';
import {
  extractAppCodeFromPath,
  getAppDisplayName,
  getMenuDisplayNameOverride,
  isSyncedI18nMenuName,
  translateAppMenuItemName,
  translateMenuName,
  translatePathTitle,
} from '../../utils/menuTranslation';
import type { QuickEntryItem } from './QuickEntryGrid';
import {
  findMenuAncestryByPath,
  findMenuAncestryByUuid,
  renderQuickEntryMenuIcon,
  resolveQuickEntryIconFromTree,
} from './renderQuickEntryMenuIcon';

export function findMenuInTree(menus: MenuTree[], uuid: string): MenuTree | null {
  const target = String(uuid);
  for (const menu of menus) {
    if (String(menu.uuid) === target) return menu;
    if (menu.children?.length) {
      const found = findMenuInTree(menu.children, uuid);
      if (found) return found;
    }
  }
  return null;
}

/** 按 path 在菜单树中查找（uuid 漂移或收藏时仅存 path 时的回退） */
export function findMenuInTreeByPath(menus: MenuTree[], path: string): MenuTree | null {
  const normalized = path.replace(/\/$/, '');
  if (!normalized) return null;
  for (const menu of menus) {
    if (menu.path && menu.path.replace(/\/$/, '') === normalized) return menu;
    if (menu.children?.length) {
      const found = findMenuInTreeByPath(menu.children, path);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 快捷入口展示名：始终按当前语言 + 菜单 path 解析，不直接使用偏好里缓存的中文 menu_name。
 * 与侧栏 translateAppMenuItemName 策略一致。
 */
export function resolveQuickEntryMenuLabel(
  entry: Pick<QuickEntryItem, 'menu_name'>,
  resolvedPath: string,
  t: (key: string, options?: any) => string,
  menu?: MenuTree | null,
): string {
  const path = resolvedPath.trim();
  if (menu) {
    const fromMenu = getTranslatedMenuTitle(menu, t);
    if (fromMenu) return fromMenu;
  }

  if (path.startsWith('/apps/')) {
    const fromAppPath = translateAppMenuItemName(entry.menu_name, path, t, menu?.children);
    if (fromAppPath) return fromAppPath;
  }

  const fromPath = translatePathTitle(path, t);
  if (fromPath && fromPath !== path) return fromPath;

  const fromName = translateMenuName(entry.menu_name, t, path);
  if (fromName && fromName !== entry.menu_name) return fromName;

  return entry.menu_name || fromPath || path;
}

export function getTranslatedMenuTitle(
  menu: MenuTree,
  t: (key: string, options?: any) => string,
): string {
  const findFirstPath = (children?: MenuTree[]): string | undefined => {
    if (!children?.length) return undefined;
    for (const child of children) {
      if (child.path) return child.path;
      const nested = findFirstPath(child.children);
      if (nested) return nested;
    }
    return undefined;
  };

  const effectivePath = menu.path || findFirstPath(menu.children);
  const appCode = extractAppCodeFromPath(effectivePath);

  if (effectivePath?.startsWith('/apps/')) {
    const translated = translateAppMenuItemName(menu.name, effectivePath, t, menu.children, menu.meta);
    const isAppRootByPath = !!appCode && (menu.path || '').replace(/\/$/, '') === `/apps/${appCode}`;
    const isAppRootByNameKey = typeof menu.name === 'string' && /^app\.[a-z0-9-]+\.name$/i.test(menu.name);
    if (appCode && (isAppRootByPath || isAppRootByNameKey)) {
      const appDisplayName = getAppDisplayName(appCode, t, translated || menu.name);
      if (appDisplayName && appDisplayName.trim() !== '') {
        return appDisplayName;
      }
    }
    return translated;
  }
  const override = getMenuDisplayNameOverride(menu.meta);
  if (override && isSyncedI18nMenuName(menu.name)) return override;
  return translateMenuName(menu.name, t, effectivePath);
}

export function buildQuickEntriesFromMenuTree(
  menus: MenuTree[],
  t: (key: string, options?: any) => string,
  limit = 10,
): QuickEntryItem[] {
  const allPathMenus: Array<{ menu: MenuTree; ancestors: MenuTree[] }> = [];

  const walk = (nodes: MenuTree[], ancestors: MenuTree[]) => {
    nodes.forEach((menu) => {
      if (menu.children?.length) {
        walk(menu.children, [...ancestors, menu]);
      }
      if (menu.path && !menu.is_external && menu.path !== '/system/dashboard/workplace') {
        allPathMenus.push({ menu, ancestors });
      }
    });
  };

  walk(menus, []);

  const uniqueMenus = Array.from(
    new Map(allPathMenus.map((entry) => [entry.menu.uuid, entry])).values(),
  );
  const businessMenus = uniqueMenus.filter((entry) => entry.menu.path?.startsWith('/apps/'));
  const sourceMenus = businessMenus.length > 0 ? businessMenus : uniqueMenus;
  const priorityPatterns = [
    '/production-execution/work-orders',
    '/production-execution/reporting',
    '/warehouse-management/inventory',
    '/warehouse-management/inbound',
    '/warehouse-management/outbound',
    '/quality-management',
    '/equipment-management/equipment',
    '/equipment-management/maintenance',
    '/plan-management',
    '/master-data',
  ];

  const sortedMenus = [...sourceMenus].sort((a, b) => {
    const aPath = a.menu.path || '';
    const bPath = b.menu.path || '';
    const aPriority = priorityPatterns.findIndex((pattern) => aPath.includes(pattern));
    const bPriority = priorityPatterns.findIndex((pattern) => bPath.includes(pattern));
    const aRank = aPriority === -1 ? Number.MAX_SAFE_INTEGER : aPriority;
    const bRank = bPriority === -1 ? Number.MAX_SAFE_INTEGER : bPriority;
    if (aRank !== bRank) return aRank - bRank;
    return (a.menu.sort_order ?? 0) - (b.menu.sort_order ?? 0);
  });

  return sortedMenus.slice(0, limit).map((entry, index) => ({
    menu_uuid: entry.menu.uuid,
    menu_name: getTranslatedMenuTitle(entry.menu, t),
    menu_path: entry.menu.path || '',
    menu_icon: renderQuickEntryMenuIcon(entry.menu, entry.ancestors),
    sort_order: index,
  }));
}

export type QuickEntryDisplayItem = QuickEntryItem & { menu_icon: ReactNode };

export function resolveQuickEntryDisplayItems(
  menuTree: MenuTree[],
  savedEntries: QuickEntryItem[] | undefined,
  t: (key: string, options?: any) => string,
  limit = 10,
): QuickEntryDisplayItem[] {
  const entries = Array.isArray(savedEntries) ? savedEntries : [];

  if (entries.length > 0) {
    return entries
      .slice()
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .slice(0, limit)
      .map((entry) => {
        let hit =
          menuTree.length && entry.menu_uuid
            ? findMenuAncestryByUuid(menuTree, entry.menu_uuid)
            : null;
        const resolvedPath = entry.menu_path || hit?.menu.path || '';
        if (!resolvedPath) return null;
        if (!hit && menuTree.length) {
          hit = findMenuAncestryByPath(menuTree, resolvedPath);
        }

        const menu = hit?.menu ?? null;
        const menuName = resolveQuickEntryMenuLabel(entry, resolvedPath, t, menu);

        return {
          ...entry,
          menu_name: menuName,
          menu_path: resolvedPath,
          menu_icon: menuTree.length
            ? resolveQuickEntryIconFromTree(menuTree, {
                menu_uuid: entry.menu_uuid,
                menu_path: resolvedPath,
              })
            : null,
        };
      })
      .filter((item): item is QuickEntryDisplayItem => item !== null);
  }

  if (!menuTree.length) {
    return [];
  }

  return buildQuickEntriesFromMenuTree(menuTree, t, limit) as QuickEntryDisplayItem[];
}
