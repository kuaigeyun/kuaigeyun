import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getOrganizationChartOptions } from './options';
export const OrganizationChart = forwardRef(({ children, ...props }, ref) => {
    const options = useMemo(() => {
        const { direction = 'vertical', labelField, ...restProps } = props;
        const options = mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, getOrganizationChartOptions({ direction, labelField }), restProps);
        return options;
    }, [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
