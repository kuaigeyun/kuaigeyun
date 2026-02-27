"use strict";
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
    return (0, utils_1.flow)(tooltip, transformMark, adaptor_1.mark, utils_1.transformOptions)(params);
}
