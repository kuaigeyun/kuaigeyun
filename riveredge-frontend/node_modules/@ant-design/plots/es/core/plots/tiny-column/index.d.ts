import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { TinyColumnOptions } from './type';
export type { TinyColumnOptions };
export declare class TinyColumn extends Plot<TinyColumnOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 迷你柱形图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyColumnOptions>;
    /**
     * 获取 迷你柱形图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 迷你柱形图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<TinyColumnOptions>) => void;
}
