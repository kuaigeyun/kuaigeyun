import * as React from 'react';
import type { HTMLAriaDataAttributes } from '../_util/aria-data-attrs';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { FormatConfig, valueType } from './utils';
export type SemanticName = 'root' | 'content' | 'title' | 'header' | 'prefix' | 'suffix';
export type StatisticClassNamesType = SemanticClassNamesType<StatisticProps, SemanticName>;
export type StatisticStylesType = SemanticStylesType<StatisticProps, SemanticName>;
export interface StatisticRef {
    nativeElement: HTMLDivElement;
}
interface StatisticReactProps extends FormatConfig {
    prefixCls?: string;
    className?: string;
    classNames?: StatisticClassNamesType;
    styles?: StatisticStylesType;
    rootClassName?: string;
    style?: React.CSSProperties;
    value?: valueType;
    /** @deprecated Please use `styles.content` instead */
    valueStyle?: React.CSSProperties;
    valueRender?: (node: React.ReactNode) => React.ReactNode;
    title?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    loading?: boolean;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}
export type StatisticProps = HTMLAriaDataAttributes & StatisticReactProps;
declare const Statistic: React.ForwardRefExoticComponent<React.AriaAttributes & {
    [key: `data-${string}`]: unknown;
} & Pick<React.HTMLAttributes<HTMLDivElement>, "role"> & StatisticReactProps & React.RefAttributes<StatisticRef>>;
export default Statistic;
