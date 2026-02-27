import { Plot } from '../../base';
import type { BoxOptions } from './type';
import type { Adaptor } from '../../types';
export type { BoxOptions };
export declare class Box extends Plot<BoxOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取箱线图默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BoxOptions>;
    /**
     * 获取 折线图 默认配置
     */
    protected getDefaultOptions(): Partial<BoxOptions>;
    /**
     * 折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<BoxOptions>) => void;
}
