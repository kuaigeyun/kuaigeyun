import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { HistogramOptions } from './type';
export type { HistogramOptions };
export declare class Histogram extends Plot<HistogramOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 直方图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<HistogramOptions>;
    /**
     * 获取 直方图 默认配置
     */
    protected getDefaultOptions(): Partial<HistogramOptions>;
    /**
     * 直方图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<HistogramOptions>) => void;
}
