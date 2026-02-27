"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
var type_1 = require("./type");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        var options = params.options;
        var data = options.data, setsField = options.setsField, sizeField = options.sizeField;
        if ((0, utils_1.isArray)(data)) {
            (0, utils_1.set)(options, 'data', {
                type: 'inline',
                value: data,
                transform: [
                    {
                        type: 'venn',
                        sets: setsField,
                        size: sizeField,
                        as: [type_1.DefaultTransformKey.color, type_1.DefaultTransformKey.d],
                    },
                ],
            });
            (0, utils_1.set)(options, 'colorField', type_1.DefaultTransformKey.color);
            (0, utils_1.set)(options, ['children', '0', 'encode', 'd'], type_1.DefaultTransformKey.d);
        }
        return params;
    };
    return (0, utils_1.flow)(init, utils_1.transformOptions)(params);
}
