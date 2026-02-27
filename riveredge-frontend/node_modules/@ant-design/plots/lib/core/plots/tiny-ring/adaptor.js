"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
var adaptor_1 = require("../../adaptor");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * @description radius
     */
    var radius = function (params) {
        var options = params.options;
        var _a = options.radius, radius = _a === void 0 ? 0.8 : _a;
        (0, utils_1.set)(params, 'options.coordinate.innerRadius', radius);
        return params;
    };
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
    return (0, utils_1.flow)(radius, transformData, adaptor_1.mark, utils_1.transformOptions)(params);
}
