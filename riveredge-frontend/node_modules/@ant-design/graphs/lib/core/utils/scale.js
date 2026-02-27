"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqrt = exports.pow = exports.log = exports.linear = void 0;
/**
 * 将一个值从一个范围线性映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
const linear = (value, domain, range) => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    if (d1 === d0)
        return r0;
    const ratio = (value - d0) / (d1 - d0);
    return r0 + ratio * (r1 - r0);
};
exports.linear = linear;
/**
 * 将一个值从一个范围对数映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
const log = (value, domain, range) => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const ratio = Math.log(value - d0 + 1) / Math.log(d1 - d0 + 1);
    return r0 + ratio * (r1 - r0);
};
exports.log = log;
/**
 * 将一个值从一个范围幂映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @param exponent - 幂指数
 * @returns 映射后的值
 */
const pow = (value, domain, range, exponent = 2) => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const ratio = Math.pow((value - d0) / (d1 - d0), exponent);
    return r0 + ratio * (r1 - r0);
};
exports.pow = pow;
/**
 * 将一个值从一个范围平方根映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
const sqrt = (value, domain, range) => {
    const [d0, d1] = domain;
    const [r0, r1] = range;
    const ratio = Math.sqrt((value - d0) / (d1 - d0));
    return r0 + ratio * (r1 - r0);
};
exports.sqrt = sqrt;
