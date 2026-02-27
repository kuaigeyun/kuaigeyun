import * as React from 'react';
import type { PresetColorType } from '../_util/colors';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { LiteralUnion } from '../_util/type';
type RibbonPlacement = 'start' | 'end';
type SemanticName = 'root' | 'content' | 'indicator';
export type RibbonClassNamesType = SemanticClassNamesType<RibbonProps, SemanticName>;
export type RibbonStylesType = SemanticStylesType<RibbonProps, SemanticName>;
export interface RibbonProps {
    className?: string;
    prefixCls?: string;
    style?: React.CSSProperties;
    text?: React.ReactNode;
    color?: LiteralUnion<PresetColorType>;
    children?: React.ReactNode;
    placement?: RibbonPlacement;
    rootClassName?: string;
    classNames?: RibbonClassNamesType;
    styles?: RibbonStylesType;
}
declare const Ribbon: React.FC<RibbonProps>;
export default Ribbon;
