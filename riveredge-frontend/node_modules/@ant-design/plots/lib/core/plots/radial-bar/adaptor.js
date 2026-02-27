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
     * coordinate 配置
     * @param params
     */
    var coordinate = function (params) {
        var options = params.options;
        var startAngle = options.startAngle, maxAngle = options.maxAngle, coordinate = options.coordinate;
        // 默认开始角度是-90度
        var start = (0, utils_1.isNumber)(startAngle) ? (startAngle / (2 * Math.PI)) * 360 : -90;
        // 结束角度通过maxAngle来计算
        var end = (0, utils_1.isNumber)(maxAngle) ? ((Number(maxAngle) + start) / 180) * Math.PI : Math.PI;
        (0, utils_1.set)(params, ['options', 'coordinate'], __assign(__assign({}, coordinate), { endAngle: end, startAngle: startAngle !== null && startAngle !== void 0 ? startAngle : -Math.PI / 2 }));
        return params;
    };
    /**
     * tooltip 配置
     * @param params
     */
    var tooltip = function (params) {
        var options = params.options;
        var tooltip = options.tooltip, xField = options.xField, yField = options.yField;
        var getXFieldData = (0, utils_1.fieldAdapter)(xField);
        var getYFieldData = (0, utils_1.fieldAdapter)(yField);
        if (!tooltip) {
            (0, utils_1.set)(options, 'tooltip', {
                title: false,
                items: [function (d, i, data) { return ({ name: getXFieldData(d, i, data), value: getYFieldData(d, i, data) }); }],
            });
        }
        return params;
    };
    /**
     * background 配置
     * @param params
     */
    var background = function (params) {
        var options = params.options;
        var markBackground = options.markBackground, children = options.children, scale = options.scale, coordinate = options.coordinate, xField = options.xField;
        var domain = (0, utils_1.get)(scale, 'y.domain', []);
        if (markBackground) {
            var style = markBackground.style, rest = __rest(markBackground, ["style"]);
            children.unshift(__assign({ type: 'interval', xField: xField, yField: domain[domain.length - 1], style: __assign({ fillOpacity: 0.4, fill: '#e0e4ee' }, style), 
                // 背景图需要填满整个圆
                coordinate: __assign(__assign({}, coordinate), { startAngle: -Math.PI / 2, endAngle: (3 / 2) * Math.PI }), animate: false }, rest));
        }
        return params;
    };
    return (0, utils_1.flow)(coordinate, tooltip, background, adaptor_1.mark, utils_1.transformOptions)(params);
}
