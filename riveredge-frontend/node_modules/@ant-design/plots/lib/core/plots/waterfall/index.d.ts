import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { WaterfallOptions } from './type';
export type { WaterfallOptions };
export declare class Waterfall extends Plot<WaterfallOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<WaterfallOptions>;
    protected getDefaultOptions(): Partial<WaterfallOptions>;
    protected getSchemaAdaptor(): (params: Adaptor<WaterfallOptions>) => void;
}
