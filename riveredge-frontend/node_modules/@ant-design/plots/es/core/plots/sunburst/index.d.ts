import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import type { SunburstOptions } from './type';
export type { SunburstOptions };
export declare class Sunburst extends Plot<SunburstOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 旭日图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<SunburstOptions>;
    /**
     * 获取 旭日图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 旭日图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<SunburstOptions>) => void;
}
