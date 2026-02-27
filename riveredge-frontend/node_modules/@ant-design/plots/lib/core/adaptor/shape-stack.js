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
exports.shapeStack = shapeStack;
var utils_1 = require("../utils");
var constants_1 = require("../constants");
/**
 * @description 处理堆叠图配置line|point|area时的transform问题
 */
function shapeStack(params) {
    var options = params.options;
    var stack = options.stack, tooltip = options.tooltip, xField = options.xField;
    if (!stack)
        return params;
    var shapes = constants_1.CONFIG_SHAPE.map(function (item) { return item.type; }).filter(function (item) { return !!item; });
    var hasStack = false;
    shapes.forEach(function (shape) {
        if (options[shape]) {
            hasStack = true;
            /** 堆叠特殊处理，详见https://github.com/antvis/G2/issues/4515 */
            (0, utils_1.set)(options, [shape, 'stack'], __assign({ y1: 'y' }, (typeof stack === 'object' ? stack : {})));
        }
    });
    /** 调整通道，避免多份tooltip */
    if (hasStack && !(0, utils_1.isBoolean)(tooltip) && !tooltip) {
        (0, utils_1.set)(options, 'tooltip', {
            title: xField,
            items: [
                {
                    channel: 'y',
                },
            ],
        });
    }
    return params;
}
