import * as React from 'react';
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks';
import type { ProgressProps, SemanticName } from './progress';
interface ProgressStepsProps extends Omit<ProgressProps, 'classNames' | 'styles'> {
    steps: number;
    strokeColor?: string | string[];
    railColor?: string;
    /** @deprecated Please use `railColor` instead */
    trailColor?: string;
    classNames: SemanticClassNames<SemanticName>;
    styles: SemanticStyles<SemanticName>;
}
declare const Steps: React.FC<ProgressStepsProps>;
export default Steps;
