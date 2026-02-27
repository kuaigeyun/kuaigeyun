"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversionTagFormatter = conversionTagFormatter;
var _1 = require(".");
/**
 * 转化率的计算方式
 * @param prev
 * @param next
 */
function conversionTagFormatter(prev, next) {
    if (!(0, _1.isNumber)(prev) || !(0, _1.isNumber)(next)) {
        return '-';
    }
    // 0 / 0 没有意义
    if (prev === 0 && next === 0) {
        return '-';
    }
    if (prev === next) {
        return '100%';
    }
    if (prev === 0) {
        return '∞';
    }
    return "".concat(((100 * next) / prev).toFixed(2), "%");
}
