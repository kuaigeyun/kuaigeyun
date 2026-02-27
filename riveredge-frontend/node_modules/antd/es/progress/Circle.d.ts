import * as React from 'react';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
import type { ProgressGradient, ProgressProps, SemanticName } from './progress';
export interface CircleProps extends Omit<ProgressProps, 'classNames' | 'styles'> {
    prefixCls: string;
    children: React.ReactNode;
    progressStatus: string;
    strokeColor?: string | ProgressGradient;
    classNames: SemanticClassNames<SemanticName>;
    styles: SemanticStyles<SemanticName>;
}
declare const Circle: React.FC<CircleProps>;
export default Circle;
