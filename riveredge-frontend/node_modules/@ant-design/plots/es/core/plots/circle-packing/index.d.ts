import { Plot } from '../../base';
import type { CirclePackingOptions } from './type';
import type { Adaptor } from '../../types';
export type { CirclePackingOptions };
export declare class CirclePacking extends Plot<CirclePackingOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 circle packing 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<CirclePackingOptions>;
    /**
     * 获取 打包图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 打包图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<CirclePackingOptions>) => void;
}
