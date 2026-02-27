import * as React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
export type SemanticName = 'root' | 'section' | 'avatar' | 'title' | 'description';
export type CardMetaClassNamesType = SemanticClassNamesType<CardMetaProps, SemanticName>;
export type CardMetaStylesType = SemanticStylesType<CardMetaProps, SemanticName>;
export interface CardMetaProps {
    prefixCls?: string;
    style?: React.CSSProperties;
    className?: string;
    avatar?: React.ReactNode;
    title?: React.ReactNode;
    description?: React.ReactNode;
    classNames?: CardMetaClassNamesType;
    styles?: CardMetaStylesType;
}
declare const CardMeta: React.FC<CardMetaProps>;
export default CardMeta;
