import { Chart } from '@antv/g2';
export declare class Controller<T extends object> {
    chart: Chart;
    config: T;
    container: Map<string, any>;
    constructor(chart: Chart, config: T);
    init(): void;
    /**
     * Update annotaions
     */
    update(): void;
    /**
     * Dws the annotations
     */
    destroy(): void;
}
