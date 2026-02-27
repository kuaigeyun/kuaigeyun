import { flow, transformOptions } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * @description 添加 tooltip 默认值
     */
    var tooltip = function (params) {
        var options = params.options;
        var _a = options.tooltip, tooltip = _a === void 0 ? {} : _a, colorField = options.colorField, sizeField = options.sizeField;
        if (tooltip && !tooltip.field) {
            tooltip.field = colorField || sizeField;
        }
        return params;
    };
    /**
     * @description 根据 mark 修改图表类型
     */
    var transformMark = function (params) {
        var options = params.options;
        var mark = options.mark, children = options.children;
        if (mark) {
            children[0].type = mark;
        }
        return params;
    };
    return flow(tooltip, transformMark, mark, transformOptions)(params);
}
