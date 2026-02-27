import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { RadialBarOptions } from './type';
export type { RadialBarOptions };
export declare class RadialBar extends Plot<RadialBarOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 玉珏图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<RadialBarOptions>;
    /**
     * 获取 玉珏图 默认配置
     */
    protected getDefaultOptions(): Partial<RadialBarOptions>;
    /**
     * 玉珏图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<RadialBarOptions>) => void;
}
