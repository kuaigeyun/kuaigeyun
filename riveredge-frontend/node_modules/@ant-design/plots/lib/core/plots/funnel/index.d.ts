import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { FunnelOptions } from './type';
export type { FunnelOptions };
export declare class Funnel extends Plot<FunnelOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 漏斗图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<FunnelOptions>;
    /**
     * 获取 漏斗图 默认配置
     */
    protected getDefaultOptions(): Partial<FunnelOptions>;
    /**
     * 漏斗图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<FunnelOptions>) => void;
}
