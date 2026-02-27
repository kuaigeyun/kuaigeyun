import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { TinyRingOptions } from './type';
export type { TinyRingOptions };
export declare class TinyRing extends Plot<TinyRingOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取进度图默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyRingOptions>;
    /**
     * 获取 进度图 默认配置
     */
    protected getDefaultOptions(): Partial<TinyRingOptions>;
    /**
     * 迷你折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<TinyRingOptions>) => void;
}
