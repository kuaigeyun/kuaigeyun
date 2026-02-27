import * as React from 'react';
import type { SegmentedLabeledOption as RcSegmentedLabeledOption, SegmentedProps as RCSegmentedProps, SegmentedValue as RcSegmentedValue, SegmentedRawOption } from '@rc-component/segmented';
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { SizeType } from '../config-provider/SizeContext';
import type { TooltipProps } from '../tooltip';
export type { SegmentedValue } from '@rc-component/segmented';
export type SemanticName = 'root' | 'icon' | 'label' | 'item';
interface SegmentedLabeledOptionWithoutIcon<ValueType = RcSegmentedValue> extends RcSegmentedLabeledOption<ValueType> {
    label: RcSegmentedLabeledOption['label'];
    tooltip?: string | Omit<TooltipProps, 'children'>;
}
interface SegmentedLabeledOptionWithIcon<ValueType = RcSegmentedValue> extends Omit<RcSegmentedLabeledOption<ValueType>, 'label'> {
    label?: RcSegmentedLabeledOption['label'];
    /** Set icon for Segmented item */
    icon: React.ReactNode;
    tooltip?: string | Omit<TooltipProps, 'children'>;
}
export type SegmentedLabeledOption<ValueType = RcSegmentedValue> = SegmentedLabeledOptionWithIcon<ValueType> | SegmentedLabeledOptionWithoutIcon<ValueType>;
export type SegmentedOptions<T = SegmentedRawOption> = (T | SegmentedLabeledOption<T>)[];
export type SegmentedClassNamesType = SemanticClassNamesType<SegmentedProps, SemanticName>;
export type SegmentedStylesType = SemanticStylesType<SegmentedProps, SemanticName>;
export interface SegmentedProps<ValueType = RcSegmentedValue> extends Omit<RCSegmentedProps<ValueType>, 'size' | 'options' | 'itemRender' | 'styles' | 'classNames'> {
    rootClassName?: string;
    options: SegmentedOptions<ValueType>;
    /** Option to fit width to its parent's width */
    block?: boolean;
    /** Option to control the display size */
    size?: SizeType;
    vertical?: boolean;
    orientation?: Orientation;
    classNames?: SegmentedClassNamesType;
    styles?: SegmentedStylesType;
    shape?: 'default' | 'round';
}
declare const InternalSegmented: React.ForwardRefExoticComponent<Omit<SegmentedProps<RcSegmentedValue>, "ref"> & React.RefAttributes<HTMLDivElement>>;
declare const Segmented: (<ValueType>(props: SegmentedProps<ValueType> & React.RefAttributes<HTMLDivElement>) => ReturnType<typeof InternalSegmented>) & Pick<React.FC, "displayName">;
export default Segmented;
