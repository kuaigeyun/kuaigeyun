import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { PieOptions } from './type';
export type { PieOptions };
export declare class Pie extends Plot<PieOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 饼图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<PieOptions>;
    /**
     * 获取 折线图 默认配置
     */
    protected getDefaultOptions(): Partial<PieOptions>;
    /**
     * 折线图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<PieOptions>) => void;
}
