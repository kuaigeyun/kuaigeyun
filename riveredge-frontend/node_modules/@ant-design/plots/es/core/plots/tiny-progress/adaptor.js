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
import { flow, transformOptions } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * @description 数据转换
     */
    var transformData = function (params) {
        var options = params.options;
        var percent = options.percent, _a = options.color, color = _a === void 0 ? [] : _a;
        if (!percent)
            return params;
        var transformOption = {
            scale: {
                color: { range: color.length ? color : [] },
            },
            data: [1, percent],
        };
        Object.assign(options, __assign({}, transformOption));
        return params;
    };
    return flow(transformData, mark, transformOptions)(params);
}
