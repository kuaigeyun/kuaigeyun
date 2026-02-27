import { Plot } from '../../base';
import type { RadarOptions } from './type';
import type { Adaptor } from '../../types';
export type { RadarOptions };
export declare class Radar extends Plot<RadarOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 雷达图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<RadarOptions>;
    /**
     * 获取 雷达图 默认配置
     */
    protected getDefaultOptions(): Partial<RadarOptions>;
    /**
     * 雷达图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<RadarOptions>) => void;
}
