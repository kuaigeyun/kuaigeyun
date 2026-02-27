import type * as React from 'react';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
import type { Breakpoint } from '../_util/responsiveObserver';
type SemanticName = 'label' | 'content';
export interface DescriptionsItemProps {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    label?: React.ReactNode;
    /** @deprecated Please use `styles.label` instead */
    labelStyle?: React.CSSProperties;
    /** @deprecated Please use `styles.content` instead */
    contentStyle?: React.CSSProperties;
    classNames?: SemanticClassNames<SemanticName>;
    styles?: SemanticStyles<SemanticName>;
    span?: number | 'filled' | {
        [key in Breakpoint]?: number;
    };
    children?: React.ReactNode;
}
declare const DescriptionsItem: React.FC<React.PropsWithChildren<DescriptionsItemProps>>;
export default DescriptionsItem;
