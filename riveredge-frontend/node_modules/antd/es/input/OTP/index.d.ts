import * as React from 'react';
import type { SemanticClassNamesType, SemanticStylesType } from '../../_util/hooks';
import type { InputStatus } from '../../_util/statusUtils';
import type { Variant } from '../../config-provider';
import type { SizeType } from '../../config-provider/SizeContext';
type SemanticName = 'root' | 'input' | 'separator';
export type OTPClassNamesType = SemanticClassNamesType<OTPProps, SemanticName>;
export type OTPStylesType = SemanticStylesType<OTPProps, SemanticName>;
export interface OTPRef {
    focus: VoidFunction;
    blur: VoidFunction;
    nativeElement: HTMLDivElement;
}
export interface OTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'onInput'> {
    prefixCls?: string;
    length?: number;
    variant?: Variant;
    rootClassName?: string;
    className?: string;
    style?: React.CSSProperties;
    size?: SizeType;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    formatter?: (value: string) => string;
    separator?: ((index: number) => React.ReactNode) | React.ReactNode;
    disabled?: boolean;
    status?: InputStatus;
    mask?: boolean | string;
    type?: React.HTMLInputTypeAttribute;
    onInput?: (value: string[]) => void;
    classNames?: OTPClassNamesType;
    styles?: OTPStylesType;
}
declare const OTP: React.ForwardRefExoticComponent<OTPProps & React.RefAttributes<OTPRef>>;
export default OTP;
