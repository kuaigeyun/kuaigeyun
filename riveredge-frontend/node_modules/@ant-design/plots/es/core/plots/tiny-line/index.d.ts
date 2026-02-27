import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { TinyLineOptions } from './type';
export type { TinyLineOptions };
export declare class TinyLine extends Plot<TinyLineOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 迷你折线图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyLineOptions>;
    /**
     * 获取 迷你折线图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 迷你折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<TinyLineOptions>) => void;
}
