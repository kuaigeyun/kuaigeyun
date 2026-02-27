"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataTransform = void 0;
var utils_1 = require("../utils");
/**
 * Data transformation.
 * @description `data` to `data.value`
 * If `data` is not an object or does not have a `value` property, it will be set to `data.value`.
 * If `data` is an object without a `type` property, it will be set to `data.value`.
 * @param params - The adaptor parameters.
 * @returns The updated parameters with transformed data.
 */
var dataTransform = function (params) {
    var options = params.options;
    var data = options.data;
    if ((0, utils_1.get)(data, 'value'))
        return params;
    if ((0, utils_1.get)(data, 'type') !== 'fetch' && (0, utils_1.isPlainObject)(data)) {
        (0, utils_1.set)(options, 'data.value', data);
    }
    return params;
};
exports.dataTransform = dataTransform;
