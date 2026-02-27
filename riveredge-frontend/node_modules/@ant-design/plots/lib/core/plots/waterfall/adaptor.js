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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
var adaptor_1 = require("../../adaptor");
var constants_1 = require("./constants");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * @description 数据转换
     */
    var transformData = function (params) {
        var options = params.options;
        var _a = options.data, data = _a === void 0 ? [] : _a, yField = options.yField;
        if (!data.length)
            return params;
        data.reduce(function (prev, cur, index) {
            var _a;
            var getFieldData = (0, utils_1.fieldAdapter)(yField);
            var newCur = getFieldData(cur, index, data);
            if (index === 0 || cur.isTotal) {
                cur[constants_1.START_KEY] = 0;
                cur[constants_1.END_KEY] = newCur;
                cur[constants_1.WATERFALL_VALUE] = newCur;
            }
            else {
                var start = (_a = prev[constants_1.END_KEY]) !== null && _a !== void 0 ? _a : getFieldData(prev, index, data);
                cur[constants_1.START_KEY] = start;
                cur[constants_1.END_KEY] = start + newCur;
                cur[constants_1.WATERFALL_VALUE] = prev[constants_1.END_KEY];
            }
            return cur;
        }, []);
        Object.assign(options, { yField: [constants_1.START_KEY, constants_1.END_KEY] });
        return params;
    };
    /**
     * @description 添加连线信息
     */
    var link = function (params) {
        var options = params.options;
        var _a = options.data, data = _a === void 0 ? [] : _a, xField = options.xField, children = options.children, linkStyle = options.linkStyle;
        var linkData = __spreadArray([], data, true);
        linkData.reduce(function (prev, cur, index) {
            if (index > 0) {
                cur.x1 = prev[xField];
                cur.x2 = cur[xField];
                cur.y1 = prev[constants_1.END_KEY];
            }
            return cur;
        }, []);
        linkData.shift();
        children.push({
            type: 'link',
            xField: ['x1', 'x2'],
            yField: 'y1',
            // 防止动画或 scrollbar 重绘时 link 层级高于 interval
            zIndex: -1,
            data: linkData,
            style: __assign({ stroke: '#697474' }, linkStyle),
            label: false,
            tooltip: false,
        });
        return params;
    };
    /**
    * @description 连接线
    */
    var connectorTransform = function (params) {
        var options = params.options;
        var _a = options.data, data = _a === void 0 ? [] : _a, connector = options.connector;
        if (!connector)
            return params;
        (0, utils_1.set)(options, 'connector', __assign({ xField: connector.reverse ? ['x2', 'x1'] : ['x1', 'x2'], yField: connector.reverse ? ['y2', 'y1'] : ['y1', 'y2'], data: [
                {
                    x1: data[0].x,
                    y1: data[0][constants_1.END_KEY],
                    x2: data[data.length - 1].x,
                    y2: data[data.length - 1][constants_1.END_KEY],
                },
            ] }, ((0, utils_1.isObject)(connector) ? connector : {})));
        return params;
    };
    return (0, utils_1.flow)(transformData, link, adaptor_1.mark, connectorTransform, utils_1.transformOptions)(params);
}
