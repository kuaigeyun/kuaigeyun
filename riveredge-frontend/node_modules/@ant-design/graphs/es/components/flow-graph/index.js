import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getFlowGraphOptions } from './options';
export const FlowGraph = forwardRef(({ children, ...props }, ref) => {
    const options = useMemo(() => {
        const { direction = 'horizontal', labelField, ...restProps } = props;
        return mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, getFlowGraphOptions({ direction, labelField }), restProps);
    }, [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
