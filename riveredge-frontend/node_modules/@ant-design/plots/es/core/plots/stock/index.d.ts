import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { StockOptions } from './type';
export declare const DEFAULT_COLORS: string[];
export type { StockOptions };
export declare class Stock extends Plot<StockOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 股票图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<StockOptions>;
    /**
     * 获取 股票图 默认配置
     */
    protected getDefaultOptions(): Partial<StockOptions>;
    /**
     * 股票图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<StockOptions>) => Adaptor<StockOptions>;
}
