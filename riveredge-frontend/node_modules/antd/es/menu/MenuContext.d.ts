import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
import type { DirectionType } from '../config-provider';
import type { SemanticName, SubMenuSemanticName } from './menu';
export type MenuTheme = 'light' | 'dark';
export interface MenuContextProps {
    prefixCls: string;
    inlineCollapsed: boolean;
    direction?: DirectionType;
    theme?: MenuTheme;
    firstLevel: boolean;
    classNames: SemanticClassNames<SemanticName> & {
        popup: SemanticClassNames<'root'>;
        subMenu: SemanticClassNames<SubMenuSemanticName>;
    };
    styles: SemanticStyles<SemanticName> & {
        popup: SemanticStyles<'root'>;
        subMenu: SemanticStyles<SubMenuSemanticName>;
    };
}
declare const MenuContext: import("react").Context<MenuContextProps>;
export default MenuContext;
