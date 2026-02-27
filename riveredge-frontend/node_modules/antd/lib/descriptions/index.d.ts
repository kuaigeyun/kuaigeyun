import * as React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { Breakpoint } from '../_util/responsiveObserver';
import DescriptionsContext from './DescriptionsContext';
import type { DescriptionsContextProps } from './DescriptionsContext';
import type { DescriptionsItemProps } from './Item';
import DescriptionsItem from './Item';
interface CompoundedComponent {
    Item: typeof DescriptionsItem;
}
export interface InternalDescriptionsItemType extends Omit<DescriptionsItemProps, 'span'> {
    key?: React.Key;
    filled?: boolean;
    span?: number;
}
export interface DescriptionsItemType extends Omit<DescriptionsItemProps, 'prefixCls'> {
    key?: React.Key;
}
type SemanticName = 'root' | 'header' | 'title' | 'extra' | 'label' | 'content';
export type DescriptionsClassNamesType = SemanticClassNamesType<DescriptionsProps, SemanticName>;
export type DescriptionsStylesType = SemanticStylesType<DescriptionsProps, SemanticName>;
export interface DescriptionsProps {
    prefixCls?: string;
    className?: string;
    rootClassName?: string;
    style?: React.CSSProperties;
    bordered?: boolean;
    size?: 'middle' | 'small' | 'default';
    /**
     * @deprecated use `items` instead
     */
    children?: React.ReactNode;
    title?: React.ReactNode;
    extra?: React.ReactNode;
    column?: number | Partial<Record<Breakpoint, number>>;
    layout?: 'horizontal' | 'vertical';
    colon?: boolean;
    labelStyle?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    styles?: DescriptionsStylesType;
    classNames?: DescriptionsClassNamesType;
    items?: DescriptionsItemType[];
    id?: string;
}
declare const Descriptions: React.FC<DescriptionsProps> & CompoundedComponent;
export type { DescriptionsContextProps };
export { DescriptionsContext };
export default Descriptions;
