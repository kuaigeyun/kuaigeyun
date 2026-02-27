import { Plot } from '../../base';
import type { BulletOptions } from './type';
import type { Adaptor } from '../../types';
export type { BulletOptions };
export declare class Bullet extends Plot<BulletOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 子弹图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<BulletOptions>;
    /**
     * 获取 子弹图 默认配置
     */
    protected getDefaultOptions(): Partial<BulletOptions>;
    /**
     * 子弹图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<BulletOptions>) => void;
}
