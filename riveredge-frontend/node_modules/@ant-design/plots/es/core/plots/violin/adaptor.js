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
import { flow, transformOptions, set } from '../../utils';
import { mark } from '../../adaptor';
function withField(field1, field2) {
    if (field1)
        return field1;
    return field2;
}
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var customTransform = function (params) {
        var options = params.options;
        var xField = options.xField, yField = options.yField, colorField = options.colorField, seriesField = options.seriesField, children = options.children;
        var newChildren = children === null || children === void 0 ? void 0 : children.map(function (item) {
            return __assign(__assign({}, item), { xField: xField, yField: yField, seriesField: withField(seriesField, colorField), colorField: withField(colorField, seriesField), data: item.type === 'density'
                    ? {
                        transform: [
                            {
                                type: 'kde',
                                field: yField,
                                groupBy: [xField, withField(seriesField, colorField)],
                            },
                        ],
                    }
                    : item.data });
        }).filter(function (item) { return options.box || item.type === 'density'; });
        set(options, 'children', newChildren);
        // 删除底层不消费的字段。
        delete options.box;
        return params;
    };
    return flow(customTransform, mark, transformOptions)(params);
}
