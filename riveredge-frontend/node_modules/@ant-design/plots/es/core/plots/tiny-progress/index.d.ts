import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { TinyProgressOptions } from './type';
export type { TinyProgressOptions };
export declare class TinyProgress extends Plot<TinyProgressOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 进度图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<TinyProgressOptions>;
    /**
     * 获取 进度图 默认配置
     */
    protected getDefaultOptions(): Partial<TinyProgressOptions>;
    /**
     * 迷你折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<TinyProgressOptions>) => void;
}
