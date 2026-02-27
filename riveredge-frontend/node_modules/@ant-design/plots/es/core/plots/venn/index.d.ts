import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { VennOptions } from './type';
export type { VennOptions };
export declare class Venn extends Plot<VennOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 韦恩图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<VennOptions>;
    /**
     * 获取 韦恩图 默认配置
     */
    protected getDefaultOptions(): Partial<VennOptions>;
    /**
     * 韦恩图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<VennOptions>) => void;
}
