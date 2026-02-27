import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getFlowDirectionGraphOptions } from './options';
export const FlowDirectionGraph = forwardRef(({ children, ...props }, ref) => {
    const { labelField, ...restProps } = props;
    const options = useMemo(() => mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, getFlowDirectionGraphOptions({ labelField }), restProps), [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
