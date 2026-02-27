import { Plot } from '../../base';
import type { RoseOptions } from './type';
import type { Adaptor } from '../../types';
export type { RoseOptions };
export declare class Rose extends Plot<RoseOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<RoseOptions>;
    /**
     * 获取 散点图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 散点图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<RoseOptions>) => void;
}
