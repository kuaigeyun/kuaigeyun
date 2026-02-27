import { Plot } from '../../base';
import type { Options } from '../../types/common';
import type { Adaptor } from '../../types';
export declare class Base extends Plot<Options> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 万能图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<Options>;
    /**
     * 获取 万能图 默认配置
     */
    protected getDefaultOptions(): Partial<Options>;
    /**
     * 万能图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<Options>) => void;
}
