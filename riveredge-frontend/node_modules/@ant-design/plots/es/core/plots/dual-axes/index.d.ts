import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { DualAxesOptions } from './type';
export type { DualAxesOptions };
export declare class DualAxes extends Plot<DualAxesOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 双轴图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<DualAxesOptions>;
    /**
     * 获取 条形图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 条形图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<DualAxesOptions>) => void;
}
