import * as React from 'react';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
export type ElementSemanticName = 'root' | 'content';
export interface SkeletonElementProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    size?: 'large' | 'small' | 'default' | number;
    shape?: 'circle' | 'square' | 'round' | 'default';
    active?: boolean;
    classNames?: SemanticClassNames<ElementSemanticName>;
    styles?: SemanticStyles<ElementSemanticName>;
}
declare const Element: React.FC<SkeletonElementProps>;
export default Element;
