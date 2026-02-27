import * as React from 'react';
import type { RenderFunction } from '../_util/getRenderPropValue';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { AbstractTooltipProps, TooltipRef, SemanticName as TooltipSemanticName } from '../tooltip';
import PurePanel from './PurePanel';
export type PopoverSemanticName = TooltipSemanticName | 'title' | 'content';
export type PopoverClassNamesType = SemanticClassNamesType<PopoverProps, PopoverSemanticName>;
export type PopoverStylesType = SemanticStylesType<PopoverProps, PopoverSemanticName>;
export interface PopoverProps extends AbstractTooltipProps {
    title?: React.ReactNode | RenderFunction;
    content?: React.ReactNode | RenderFunction;
    onOpenChange?: (open: boolean, e?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLDivElement>) => void;
    classNames?: PopoverClassNamesType;
    styles?: PopoverStylesType;
}
declare const InternalPopover: React.ForwardRefExoticComponent<PopoverProps & React.RefAttributes<TooltipRef>>;
type CompoundedComponent = typeof InternalPopover & {
    _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel;
};
declare const Popover: CompoundedComponent;
export default Popover;
