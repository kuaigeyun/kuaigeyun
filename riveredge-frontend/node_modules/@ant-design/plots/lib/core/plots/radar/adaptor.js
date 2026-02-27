"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        (0, utils_1.set)(params, 'options.coordinate', { type: (0, utils_1.get)(params, 'options.coordinateType', 'polar') });
        return params;
    };
    return (0, utils_1.flow)(init, utils_1.transformOptions)(params);
}
