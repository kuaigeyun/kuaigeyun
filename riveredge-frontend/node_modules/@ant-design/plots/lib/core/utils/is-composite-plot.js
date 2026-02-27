"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCompositePlot = void 0;
/**
 * 是否是复合图表
 */
var isCompositePlot = function (options) { var _a; return ((_a = options.children) === null || _a === void 0 ? void 0 : _a.length) > 0; };
exports.isCompositePlot = isCompositePlot;
