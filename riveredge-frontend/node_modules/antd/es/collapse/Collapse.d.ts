import * as React from 'react';
import type { CollapseProps as RcCollapseProps } from '@rc-component/collapse';
import type { SemanticClassNames, SemanticClassNamesType, SemanticStyles, SemanticStylesType } from '../_util/hooks';
import type { SizeType } from '../config-provider/SizeContext';
import type { CollapsibleType } from './CollapsePanel';
export type ExpandIconPlacement = 'start' | 'end';
export type CollapseSemanticName = 'root' | 'header' | 'title' | 'body' | 'icon';
export type CollapseClassNamesType = SemanticClassNamesType<CollapseProps, CollapseSemanticName>;
export type CollapseStylesType = SemanticStylesType<CollapseProps, CollapseSemanticName>;
export interface CollapseProps extends Pick<RcCollapseProps, 'items'> {
    activeKey?: Array<string | number> | string | number;
    defaultActiveKey?: Array<string | number> | string | number;
    /** 手风琴效果 */
    accordion?: boolean;
    /** @deprecated Please use `destroyOnHidden` instead */
    destroyInactivePanel?: boolean;
    /**
     * @since 5.25.0
     */
    destroyOnHidden?: boolean;
    onChange?: (key: string[]) => void;
    style?: React.CSSProperties;
    className?: string;
    rootClassName?: string;
    bordered?: boolean;
    prefixCls?: string;
    expandIcon?: (panelProps: PanelProps) => React.ReactNode;
    expandIconPlacement?: ExpandIconPlacement;
    /** @deprecated Please use `expandIconPlacement` instead */
    expandIconPosition?: ExpandIconPlacement;
    ghost?: boolean;
    size?: SizeType;
    collapsible?: CollapsibleType;
    /**
     * @deprecated use `items` instead
     */
    children?: React.ReactNode;
    classNames?: CollapseClassNamesType;
    styles?: CollapseStylesType;
}
interface PanelProps {
    isActive?: boolean;
    header?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    forceRender?: boolean;
    extra?: React.ReactNode;
    collapsible?: CollapsibleType;
    classNames?: SemanticClassNames<CollapseSemanticName>;
    styles?: SemanticStyles<CollapseSemanticName>;
}
declare const _default: React.ForwardRefExoticComponent<CollapseProps & React.RefAttributes<HTMLDivElement>> & {
    Panel: React.ForwardRefExoticComponent<import("./CollapsePanel").CollapsePanelProps & React.RefAttributes<HTMLDivElement>>;
};
export default _default;
