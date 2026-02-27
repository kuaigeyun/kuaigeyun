import * as React from 'react';
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { SizeType } from '../config-provider/SizeContext';
type SemanticName = 'root' | 'rail' | 'content';
export type TitlePlacement = 'left' | 'right' | 'center' | 'start' | 'end';
export type DividerClassNamesType = SemanticClassNamesType<DividerProps, SemanticName>;
export type DividerStylesType = SemanticStylesType<DividerProps, SemanticName>;
export interface DividerProps {
    prefixCls?: string;
    /**  @deprecated please use `orientation`*/
    type?: Orientation;
    orientation?: Orientation;
    vertical?: boolean;
    titlePlacement?: TitlePlacement;
    /** @deprecated please use `styles.content.margin` */
    orientationMargin?: string | number;
    className?: string;
    rootClassName?: string;
    children?: React.ReactNode;
    dashed?: boolean;
    /**
     * @since 5.20.0
     * @default solid
     */
    variant?: 'dashed' | 'dotted' | 'solid';
    style?: React.CSSProperties;
    size?: SizeType;
    plain?: boolean;
    classNames?: DividerClassNamesType;
    styles?: DividerStylesType;
}
declare const Divider: React.FC<DividerProps>;
export default Divider;
