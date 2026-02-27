import React, { forwardRef, useMemo, } from 'react';
import { BaseGraph } from '../../core/base-graph';
import { COMMON_OPTIONS } from '../../core/constants';
import { formatTreeData } from '../../core/utils/data';
import { mergeOptions } from '../../core/utils/options';
import { DEFAULT_OPTIONS, getFishboneOptions } from './options';
export const Fishbone = forwardRef(({ children, ...props }, ref) => {
    const { data, defaultExpandLevel, type = 'cause', labelField, ...restProps } = props;
    const options = useMemo(() => mergeOptions(COMMON_OPTIONS, DEFAULT_OPTIONS, { data: formatTreeData(data) }, getFishboneOptions({ type, labelField }), restProps), [props]);
    return (React.createElement(BaseGraph, { ...options, ref: ref }, children));
});
