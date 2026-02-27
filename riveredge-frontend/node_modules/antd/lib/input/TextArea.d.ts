import * as React from 'react';
import type { TextAreaProps as RcTextAreaProps, TextAreaRef as RcTextAreaRef } from '@rc-component/textarea';
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks';
import type { InputStatus } from '../_util/statusUtils';
import type { Variant } from '../config-provider';
import type { SizeType } from '../config-provider/SizeContext';
import type { InputFocusOptions } from './Input';
type SemanticName = 'root' | 'textarea' | 'count';
export type TextAreaClassNamesType = SemanticClassNamesType<TextAreaProps, SemanticName>;
export type TextAreaStylesType = SemanticStylesType<TextAreaProps, SemanticName>;
export interface TextAreaProps extends Omit<RcTextAreaProps, 'suffix' | 'classNames' | 'styles'> {
    /** @deprecated Use `variant` instead */
    bordered?: boolean;
    size?: SizeType;
    status?: InputStatus;
    rootClassName?: string;
    /**
     * @since 5.13.0
     * @default "outlined"
     */
    variant?: Variant;
    classNames?: TextAreaClassNamesType;
    styles?: TextAreaStylesType;
}
export interface TextAreaRef {
    focus: (options?: InputFocusOptions) => void;
    blur: () => void;
    resizableTextArea?: RcTextAreaRef['resizableTextArea'];
}
declare const TextArea: React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<TextAreaRef>>;
export default TextArea;
