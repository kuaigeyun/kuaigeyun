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
import { mark } from '../../adaptor';
import { flow, transformOptions, set, isArray, get, isPlainObject } from '../../utils';
import { HORIZONTAL_MARGIN, AXIS_LABEL_PADDING, VERTICAL_MARGIN } from './constants';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /** 除了 yFiled Array 的情况 */
    var field = function (params) {
        var options = params.options;
        var yField = options.yField, children = options.children;
        children.forEach(function (child, index) {
            set(child, 'yField', yField[index]);
        });
        return params;
    };
    /** data 拆分 */
    var data = function (params) {
        var options = params.options;
        var yField = options.yField, children = options.children, data = options.data;
        if (isPlainObject(data))
            return params;
        var transformData = isArray(get(data, [0])) ? data : [data, data];
        children.forEach(function (child, index) {
            set(child, 'data', __spreadArray([], transformData[index].map(function (item) { return (__assign({ groupKey: yField[index] }, item)); }), true));
        });
        return params;
    };
    /** 内置 Tooltip 逻辑 */
    var tooltip = function (params) {
        var options = params.options;
        var _a = options.yField, y1 = _a[0], y2 = _a[1], tooltip = options.tooltip;
        if (!tooltip) {
            set(options, 'tooltip', {
                items: [
                    {
                        field: y1,
                        value: y1,
                    },
                    {
                        field: y2,
                        value: y2,
                    },
                ],
            });
        }
        return params;
    };
    /** 根据 layout 调整配置 */
    var layout = function (params) {
        var options = params.options;
        var children = options.children, layout = options.layout, transform = options.coordinate.transform, _a = options.paddingBottom, paddingBottom = _a === void 0 ? AXIS_LABEL_PADDING : _a, _b = options.paddingLeft, paddingLeft = _b === void 0 ? AXIS_LABEL_PADDING : _b, axis = options.axis;
        set(options, 'axisText', __assign(__assign({}, ((axis === null || axis === void 0 ? void 0 : axis.x) || {})), { layout: layout }));
        var child1 = children[0], child2 = children[1];
        if (layout === 'vertical') {
            set(options, 'direction', 'col');
            set(options, 'paddingLeft', paddingLeft);
            set(options, 'coordinate.transform', transform.filter(function (item) { return item.type !== 'transpose'; }));
            set(child1, 'paddingBottom', HORIZONTAL_MARGIN);
            set(child2, 'paddingTop', HORIZONTAL_MARGIN);
            set(child2, 'axis.x.position', 'top');
            set(child2, 'scale.y.range', [0, 1]);
        }
        else {
            set(options, 'paddingBottom', paddingBottom);
            set(child1, 'scale.y.range', [0, 1]);
            var _c = child1.paddingRight, paddingRight = _c === void 0 ? VERTICAL_MARGIN : _c;
            var _d = child2.paddingLeft, paddingLeft_1 = _d === void 0 ? VERTICAL_MARGIN : _d;
            set(child1, 'paddingRight', paddingRight);
            set(child1, 'axis.x.position', 'right');
            set(child2, 'paddingLeft', paddingLeft_1);
        }
        return params;
    };
    return flow(field, data, tooltip, layout, mark, transformOptions)(params);
}
