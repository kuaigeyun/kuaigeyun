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
import { flow, transformOptions, fieldAdapter, isObject, set } from '../../utils';
import { mark } from '../../adaptor';
import { START_KEY, END_KEY, WATERFALL_VALUE } from './constants';
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
        var _a = options.data, data = _a === void 0 ? [] : _a, yField = options.yField;
        if (!data.length)
            return params;
        data.reduce(function (prev, cur, index) {
            var _a;
            var getFieldData = fieldAdapter(yField);
            var newCur = getFieldData(cur, index, data);
            if (index === 0 || cur.isTotal) {
                cur[START_KEY] = 0;
                cur[END_KEY] = newCur;
                cur[WATERFALL_VALUE] = newCur;
            }
            else {
                var start = (_a = prev[END_KEY]) !== null && _a !== void 0 ? _a : getFieldData(prev, index, data);
                cur[START_KEY] = start;
                cur[END_KEY] = start + newCur;
                cur[WATERFALL_VALUE] = prev[END_KEY];
            }
            return cur;
        }, []);
        Object.assign(options, { yField: [START_KEY, END_KEY] });
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
                cur.y1 = prev[END_KEY];
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
        set(options, 'connector', __assign({ xField: connector.reverse ? ['x2', 'x1'] : ['x1', 'x2'], yField: connector.reverse ? ['y2', 'y1'] : ['y1', 'y2'], data: [
                {
                    x1: data[0].x,
                    y1: data[0][END_KEY],
                    x2: data[data.length - 1].x,
                    y2: data[data.length - 1][END_KEY],
                },
            ] }, (isObject(connector) ? connector : {})));
        return params;
    };
    return flow(transformData, link, mark, connectorTransform, transformOptions)(params);
}
