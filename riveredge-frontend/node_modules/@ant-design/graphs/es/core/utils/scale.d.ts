/**
 * 将一个值从一个范围线性映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
export declare const linear: (value: number, domain: [number, number], range: [number, number]) => number;
/**
 * 将一个值从一个范围对数映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
export declare const log: (value: number, domain: [number, number], range: [number, number]) => number;
/**
 * 将一个值从一个范围幂映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @param exponent - 幂指数
 * @returns 映射后的值
 */
export declare const pow: (value: number, domain: [number, number], range: [number, number], exponent?: number) => number;
/**
 * 将一个值从一个范围平方根映射到另一个范围
 * @param value - 需要映射的值
 * @param domain - 输入值的范围 [最小值, 最大值]
 * @param range - 输出值的范围 [最小值, 最大值]
 * @returns 映射后的值
 */
export declare const sqrt: (value: number, domain: [number, number], range: [number, number]) => number;
