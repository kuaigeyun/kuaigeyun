import React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { FloatButtonGroupTrigger, FloatButtonProps } from './FloatButton';
type InternalFloatButtonGroupSemanticName = 'root' | 'list' | 'item' | 'itemIcon' | 'itemContent' | 'trigger' | 'triggerIcon' | 'triggerContent';
export type FloatButtonGroupClassNamesType = SemanticClassNamesType<FloatButtonGroupProps, InternalFloatButtonGroupSemanticName>;
export type FloatButtonGroupStylesType = SemanticStylesType<FloatButtonGroupProps, InternalFloatButtonGroupSemanticName>;
export interface FloatButtonGroupProps extends Omit<FloatButtonProps, 'classNames' | 'styles'> {
    classNames?: FloatButtonGroupClassNamesType;
    styles?: FloatButtonGroupStylesType;
    trigger?: FloatButtonGroupTrigger;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeIcon?: React.ReactNode;
    children: React.ReactNode;
    placement?: 'top' | 'left' | 'right' | 'bottom';
}
declare const FloatButtonGroup: React.FC<Readonly<FloatButtonGroupProps>>;
export default FloatButtonGroup;
