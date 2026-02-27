import { set, flow, transformOptions } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        var options = params.options;
        var yField = options.yField, children = options.children, _a = options.style, style = _a === void 0 ? {} : _a, _b = options.lineStyle, lineStyle = _b === void 0 ? {} : _b;
        var open = yField[0], close = yField[1], high = yField[2], low = yField[3];
        // 线影，最高价和最低价
        set(children, [0, 'yField'], [high, low]);
        set(children, [0, 'style'], lineStyle);
        // 实体部分，开票价和收盘价
        set(children, [1, 'yField'], [open, close]);
        set(children, [1, 'style'], style);
        delete options.yField;
        delete options.lineStyle;
        delete options.style;
        return params;
    };
    return flow(init, transformOptions)(params);
}
