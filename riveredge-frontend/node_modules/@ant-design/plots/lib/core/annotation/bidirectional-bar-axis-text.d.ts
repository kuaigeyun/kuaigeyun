import { Chart, AxisComponent } from '@antv/g2';
import { Annotation } from './core';
export type BidirectionalBarAxisTextOptions = AxisComponent;
export declare class BidirectionalBarAxisText extends Annotation<BidirectionalBarAxisTextOptions> {
    static tag: string;
    constructor(chart: Chart, options: BidirectionalBarAxisTextOptions);
    render(): void;
    getBidirectionalBarAxisTextLayout(): any[];
    transformLabelStyle(style: any): {};
    drawText(): void;
    destroy(): void;
    /** 仅仅更新位置即可 */
    update(): void;
}
