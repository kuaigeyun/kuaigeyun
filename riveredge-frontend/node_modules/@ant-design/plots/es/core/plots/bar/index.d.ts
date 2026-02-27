import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { BarOptions } from './type';
export type { BarOptions };
export declare class Bar extends Plot<BarOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 条形图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BarOptions>;
    /**
     * 获取 条形图 默认配置
     */
    protected getDefaultOptions(): Partial<BarOptions>;
    /**
     * 条形图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<BarOptions>) => void;
}
