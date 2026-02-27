import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { TinyAreaOptions } from './type';
export type { TinyAreaOptions };
export declare class TinyArea extends Plot<TinyAreaOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyAreaOptions>;
    /**
     * 获取 面积图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 面积图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<TinyAreaOptions>) => void;
}
