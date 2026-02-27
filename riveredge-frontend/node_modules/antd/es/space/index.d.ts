import * as React from 'react';
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { SizeType } from '../config-provider/SizeContext';
import Compact from './Compact';
import Addon from './Addon';
export { SpaceContext } from './context';
export type SpaceSize = SizeType | number;
type SemanticName = 'root' | 'item' | 'separator';
export type SpaceClassNamesType = SemanticClassNamesType<SpaceProps, SemanticName>;
export type SpaceStylesType = SemanticStylesType<SpaceProps, SemanticName>;
export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    size?: SpaceSize | [SpaceSize, SpaceSize];
    /** @deprecated please use `orientation` instead */
    direction?: Orientation;
    vertical?: boolean;
    orientation?: Orientation;
    align?: 'start' | 'end' | 'center' | 'baseline';
    /** @deprecated please use `separator` instead */
    split?: React.ReactNode;
    separator?: React.ReactNode;
    wrap?: boolean;
    classNames?: SpaceClassNamesType;
    styles?: SpaceStylesType;
}
declare const InternalSpace: React.ForwardRefExoticComponent<SpaceProps & React.RefAttributes<HTMLDivElement>>;
type CompoundedComponent = typeof InternalSpace & {
    Compact: typeof Compact;
    Addon: typeof Addon;
};
declare const Space: CompoundedComponent;
export default Space;
