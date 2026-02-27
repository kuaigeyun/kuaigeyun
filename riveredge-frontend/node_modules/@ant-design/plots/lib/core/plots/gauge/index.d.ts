import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { GaugeOptions } from './type';
export type { GaugeOptions };
export declare class Gauge extends Plot<GaugeOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<GaugeOptions>;
    /**
     * 获取 仪表盘 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 仪表盘适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<GaugeOptions>) => void;
}
