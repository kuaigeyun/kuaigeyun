"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mark = mark;
var utils_1 = require("../utils");
var shape_stack_1 = require("./shape-stack");
/**
 * 根据图表类型新增一些高阶 Mark
 */
function mark(params) {
    return (0, utils_1.flow)(shape_stack_1.shapeStack)(params);
}
