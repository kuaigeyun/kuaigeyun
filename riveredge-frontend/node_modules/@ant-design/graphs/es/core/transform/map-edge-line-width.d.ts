import type { BaseTransformOptions, DrawData, EdgeData, ID, RuntimeContext } from '@antv/g6';
import { BaseTransform } from '@antv/g6';
export interface MapEdgeLineWidthOptions extends BaseTransformOptions {
    /**
     * 数值
     */
    value: number | ((data: EdgeData) => number);
    /**
     * 最小值
     */
    minValue?: number | ((data: EdgeData, edges: Record<ID, number>) => number);
    /**
     * 最大值
     */
    maxValue?: number | ((data: EdgeData, edges: Record<ID, number>) => number);
    /**
     * 最小线宽
     */
    minLineWidth?: number | ((data: EdgeData) => number);
    /**
     * 最大线宽
     */
    maxLineWidth?: number | ((data: EdgeData) => number);
    /**
     * 插值函数，用于将数值映射到线宽
     * - `'linear'`：线性插值函数，将一个值从一个范围线性映射到另一个范围，常用于处理中心性值的差异较小的情况
     * - `'log'`：对数插值函数，将一个值从一个范围对数映射到另一个范围，常用于处理中心性值的差异较大的情况
     * - `'pow'`：幂律插值函数，将一个值从一个范围幂律映射到另一个范围，常用于处理中心性值的差异较大的情况
     * - `'sqrt'`：平方根插值函数，将一个值从一个范围平方根映射到另一个范围，常用于处理中心性值的差异较大的情况
     * - 自定义插值函数：`(value: number, domain: [number, number], range: [number, number]) => number`，其中 `value` 为需要映射的值，`domain` 为输入值的范围，`range` 为输出值的范围
     */
    scale?: 'linear' | 'log' | 'pow' | 'sqrt' | ((value: number, domain: [number, number], range: [number, number]) => number);
}
export declare class MapEdgeLineWidth extends BaseTransform {
    static defaultOptions: Partial<MapEdgeLineWidthOptions>;
    constructor(context: RuntimeContext, options: MapEdgeLineWidthOptions);
    beforeDraw(input: DrawData): DrawData;
    private assignLineWidthByValue;
}
