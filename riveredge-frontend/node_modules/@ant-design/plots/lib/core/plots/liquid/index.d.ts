import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import type { LiquidOptions } from './type';
export type { LiquidOptions };
export declare class Liquid extends Plot<LiquidOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 水波图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<LiquidOptions>;
    /**
     * 获取 水波图 默认配置
     */
    protected getDefaultOptions(): Partial<LiquidOptions>;
    /**
     * 水波图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<LiquidOptions>) => void;
}
