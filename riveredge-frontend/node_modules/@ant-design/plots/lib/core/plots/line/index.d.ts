import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { LineOptions } from './type';
export type { LineOptions };
export declare class Line extends Plot<LineOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<LineOptions>;
    /**
     * 获取 折线图 默认配置
     */
    protected getDefaultOptions(): Partial<LineOptions>;
    /**
     * 折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<LineOptions>) => void;
}
