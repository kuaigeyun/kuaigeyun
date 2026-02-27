import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { AreaOptions } from './type';
export type { AreaOptions };
export declare class Area extends Plot<AreaOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<AreaOptions>;
    /**
     * 获取 面积图 默认配置
     */
    protected getDefaultOptions(): Partial<AreaOptions>;
    /**
     * 面积图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<AreaOptions>) => void;
}
