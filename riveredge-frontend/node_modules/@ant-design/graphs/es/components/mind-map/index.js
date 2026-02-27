import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { formatTreeData } from '../../core/utils/data';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getMindMapOptions } from './options';
export const MindMap = forwardRef(({ children, ...props }, ref) => {
    const options = useMemo(() => {
        const { data, type = 'default', nodeMinWidth, nodeMaxWidth, direction = 'alternate', labelField, defaultExpandLevel, ...restProps } = props;
        const options = mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, { data: formatTreeData(data, defaultExpandLevel) }, getMindMapOptions({ type, nodeMinWidth, nodeMaxWidth, direction, labelField }), restProps);
        return options;
    }, [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
