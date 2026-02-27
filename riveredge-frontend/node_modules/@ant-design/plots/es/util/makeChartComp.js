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
import React, { forwardRef, useMemo } from 'react';
import { BaseChart } from '../components/base';
import useConfig from '../hooks/useConfig';
import { flow } from '../util';
import scale from './scale';
export function makeChartComp(chartType) {
    var configKey = chartType.charAt(0).toLowerCase() + chartType.slice(1);
    return forwardRef(function (props, ref) {
        var _a, _b;
        var config = useConfig();
        var configKey = useMemo(function () { return chartType.charAt(0).toLowerCase() + chartType.slice(1); }, [chartType]);
        var flowProps = flow([scale])(props);
        var mergedConfig = __assign(__assign({}, ((_a = config === null || config === void 0 ? void 0 : config.common) !== null && _a !== void 0 ? _a : {})), ((_b = config === null || config === void 0 ? void 0 : config[configKey]) !== null && _b !== void 0 ? _b : {}));
        return React.createElement(BaseChart, __assign({}, mergedConfig, flowProps, { chartType: chartType, ref: ref }));
    });
}
