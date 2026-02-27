"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(utils_1.dataTransform, utils_1.transformOptions)(params);
}
