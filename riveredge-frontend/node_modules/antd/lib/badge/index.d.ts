import InternalBadge from './Badge';
import Ribbon from './Ribbon';
export type { BadgeClassNamesType, BadgeProps, BadgeStylesType } from './Badge';
export type { ScrollNumberProps } from './ScrollNumber';
type CompoundedComponent = typeof InternalBadge & {
    Ribbon: typeof Ribbon;
};
declare const Badge: CompoundedComponent;
export default Badge;
