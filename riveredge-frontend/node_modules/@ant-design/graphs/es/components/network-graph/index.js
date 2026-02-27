import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS } from './options';
export const NetworkGraph = forwardRef(({ children, ...props }, ref) => {
    const options = useMemo(() => mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, props), [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
