import * as React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
export interface TransferLocale {
    description: string;
}
export type EmptySemanticName = 'root' | 'image' | 'description' | 'footer';
export type EmptyClassNamesType = SemanticClassNamesType<EmptyProps, EmptySemanticName>;
export type EmptyStylesType = SemanticStylesType<EmptyProps, EmptySemanticName>;
export type SemanticName = EmptySemanticName;
export interface EmptyProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    /** @deprecated Please use `styles.image` instead */
    imageStyle?: React.CSSProperties;
    image?: React.ReactNode;
    description?: React.ReactNode;
    children?: React.ReactNode;
    classNames?: EmptyClassNamesType;
    styles?: EmptyStylesType;
}
type CompoundedComponent = React.FC<EmptyProps> & {
    PRESENTED_IMAGE_DEFAULT: React.ReactNode;
    PRESENTED_IMAGE_SIMPLE: React.ReactNode;
};
declare const Empty: CompoundedComponent;
export default Empty;
