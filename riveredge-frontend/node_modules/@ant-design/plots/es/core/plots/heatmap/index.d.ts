import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { HeatmapOptions } from './type';
export type { HeatmapOptions };
export declare class Heatmap extends Plot<HeatmapOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<HeatmapOptions>;
    protected getDefaultOptions(): Partial<HeatmapOptions>;
    protected getSchemaAdaptor(): (params: Adaptor<HeatmapOptions>) => void;
}
