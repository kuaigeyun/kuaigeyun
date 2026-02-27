import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { ViolinOptions } from './type';
export type { ViolinOptions };
export declare class Violin extends Plot<ViolinOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<ViolinOptions>;
    /**
     * 获取 折线图 默认配置
     */
    protected getDefaultOptions(): Partial<ViolinOptions>;
    /**
     * 折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<ViolinOptions>) => void;
}
