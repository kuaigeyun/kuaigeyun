import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { SankeyOptions } from './type';
export type { SankeyOptions };
export declare class Sankey extends Plot<SankeyOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 桑基图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<SankeyOptions>;
    /**
     * 获取 桑基图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 桑基图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<SankeyOptions>) => void;
}
