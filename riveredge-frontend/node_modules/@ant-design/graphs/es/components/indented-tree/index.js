import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { formatTreeData } from '../../core/utils/data';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getIndentedTreeOptions } from './options';
export const IndentedTree = forwardRef(({ children, ...props }, ref) => {
    const { data, defaultExpandLevel, type = 'default', nodeMinWidth, nodeMaxWidth, direction = 'right', labelField, ...restProps } = props;
    const options = useMemo(() => mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, { data: formatTreeData(data, defaultExpandLevel) }, getIndentedTreeOptions({ type, nodeMinWidth, nodeMaxWidth, direction, labelField }), restProps), [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
