import { ChartLoading, ErrorBoundary } from '@ant-design/charts-util';
import { Graphin } from '@antv/graphin';
import { isEmpty } from 'lodash';
import React, { forwardRef, useImperativeHandle, useRef, } from 'react';
export const BaseGraph = forwardRef(({ children, ...props }, ref) => {
    const { containerStyle, className, onInit, onReady, onDestroy, errorTemplate, loading, loadingTemplate, ...options } = props;
    const graphRef = useRef(null);
    useImperativeHandle(ref, () => graphRef.current);
    return (React.createElement(ErrorBoundary, { errorTemplate: errorTemplate },
        loading && React.createElement(ChartLoading, { loadingTemplate: loadingTemplate }),
        !isEmpty(options.data) && (React.createElement(Graphin, { ref: (ref) => {
                graphRef.current = ref;
            }, className: className, style: containerStyle, options: options, onInit: onInit, onReady: onReady, onDestroy: onDestroy }, children))));
});
