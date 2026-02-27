import * as React from 'react';
import type { MenuProps as RcMenuProps, MenuRef as RcMenuRef } from '@rc-component/menu';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
import type { SiderContextProps } from '../layout/Sider';
import type { ItemType } from './interface';
import type { MenuTheme } from './MenuContext';
export type SemanticName = 'root' | 'itemTitle' | 'list' | 'item' | 'itemIcon' | 'itemContent';
export type SubMenuSemanticName = 'item' | 'itemTitle' | 'list' | 'itemContent' | 'itemIcon';
type MenuClassNamesSchemaType = SemanticClassNames<SemanticName> & {
    popup?: SemanticClassNames<'root'> | string;
    subMenu?: SemanticClassNames<SubMenuSemanticName>;
};
type MenuStylesSchemaType = SemanticStyles<SemanticName> & {
    popup?: SemanticStyles<'root'> | React.CSSProperties;
    subMenu?: SemanticStyles<SubMenuSemanticName>;
};
export type MenuClassNamesType = MenuClassNamesSchemaType | ((info: {
    props: MenuProps;
}) => MenuClassNamesSchemaType);
export type MenuStylesType = MenuStylesSchemaType | ((info: {
    props: MenuProps;
}) => MenuStylesSchemaType);
export interface MenuProps extends Omit<RcMenuProps, 'items' | '_internalComponents' | 'classNames' | 'styles' | 'activeKey' | 'defaultActiveFirst'> {
    theme?: MenuTheme;
    inlineIndent?: number;
    /**
     * @private Internal Usage. Not promise crash if used in production. Connect with chenshuai2144
     *   for removing.
     */
    _internalDisableMenuItemTitleTooltip?: boolean;
    items?: ItemType[];
    classNames?: MenuClassNamesType;
    styles?: MenuStylesType;
}
declare const InternalMenu: React.ForwardRefExoticComponent<MenuProps & SiderContextProps & {
    collapsedWidth?: string | number;
} & React.RefAttributes<RcMenuRef>>;
export default InternalMenu;
