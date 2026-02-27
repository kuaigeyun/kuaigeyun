import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { formatTreeData } from '../../core/utils/data';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getDendrogramOptions } from './options';
export const Dendrogram = forwardRef(({ children, ...props }, ref) => {
    const options = useMemo(() => {
        const { data, defaultExpandLevel, direction = 'horizontal', compact = false, ...restProps } = props;
        return mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, { data: formatTreeData(data, defaultExpandLevel) }, getDendrogramOptions({ direction, compact }), restProps);
    }, [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
