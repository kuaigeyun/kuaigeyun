import { Plot } from '../../base';
import type { TreemapOptions } from './type';
import type { Adaptor } from '../../types';
export type { TreemapOptions };
export declare class Treemap extends Plot<TreemapOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<TreemapOptions>;
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    protected getSchemaAdaptor(): (params: Adaptor<TreemapOptions>) => void;
}
