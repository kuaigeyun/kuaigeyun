import { Chart } from '@antv/g2';
import { Annotation } from './core';
type ShapeAttrs = Record<string, any>;
export type ConversionTagOptions = {
    /** tag 高度 */
    size?: number;
    /** tag 箭头大小 */
    arrowSize?: number;
    /** tag 对柱子间距 */
    spacing?: number;
    /** 文本配置 */
    text?: {
        /** 文字样式 */
        style?: ShapeAttrs;
        /** 文本格式化 */
        formatter?: (prev: number, next: number) => string;
    };
    /** tag 样式 */
    style?: ShapeAttrs;
};
export declare class ConversionTag extends Annotation<ConversionTagOptions> {
    static tag: string;
    direction: 'vertical' | 'horizontal';
    constructor(chart: Chart, options: ConversionTagOptions);
    getConversionTagLayout(): any[];
    render(): void;
    /** 根据 coordinate 确定方向 */
    setDirection(): void;
    drawConversionTag(): void;
    update(): void;
    destroy(): void;
}
export {};
