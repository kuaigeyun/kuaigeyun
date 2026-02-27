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
     * 图表差异化处理
     */
    var init = function (params) {
        var _a = params.options.boxType, boxType = _a === void 0 ? 'box' : _a;
        params.options.children[0].type = boxType;
        return params;
    };
    return (0, utils_1.flow)(init, adaptor_1.mark, utils_1.transformOptions)(params);
}
