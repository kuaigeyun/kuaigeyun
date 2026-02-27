var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React, { forwardRef } from 'react';
import { ErrorBoundary, ChartLoading } from '@ant-design/charts-util';
import useChart from '../../hooks/useChart';
import { Plots } from '../../core';
export var BaseChart = forwardRef(function (_a, ref) {
    var _b = _a.chartType, chartType = _b === void 0 ? 'Base' : _b, config = __rest(_a, ["chartType"]);
    var _c = config.containerStyle, containerStyle = _c === void 0 ? {
        height: 'inherit',
        flex: 1
    } : _c, _d = config.containerAttributes, containerAttributes = _d === void 0 ? {} : _d, className = config.className, loading = config.loading, loadingTemplate = config.loadingTemplate, errorTemplate = config.errorTemplate, onReady = config.onReady, rest = __rest(config, ["containerStyle", "containerAttributes", "className", "loading", "loadingTemplate", "errorTemplate", "onReady"]);
    var _e = useChart(Plots[chartType], __assign(__assign({}, rest), { onReady: function (chartInstance) {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(chartInstance);
                }
                else {
                    ref.current = chartInstance;
                }
            }
            onReady === null || onReady === void 0 ? void 0 : onReady(chartInstance);
        } })), chart = _e.chart, container = _e.container;
    return (React.createElement(ErrorBoundary, { errorTemplate: errorTemplate },
        loading && React.createElement(ChartLoading, { loadingTemplate: loadingTemplate, theme: config.theme, loading: loading }),
        React.createElement("div", __assign({ className: className, style: containerStyle, ref: container }, containerAttributes))));
});
