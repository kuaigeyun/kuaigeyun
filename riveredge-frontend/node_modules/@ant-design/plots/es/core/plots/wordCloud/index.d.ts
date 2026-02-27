import { Plot } from '../../base';
import type { WordCloudOptions } from './type';
import type { Adaptor } from '../../types';
export type { WordCloudOptions };
export declare class WordCloud extends Plot<WordCloudOptions> {
    /** 图表类型 */
    type: string;
    /**
     * 获取 词云图 默认配置项
     * 供外部使用
     */
    static getDefaultOptions(): Partial<WordCloudOptions>;
    /**
     * 获取 词云图 默认配置
     */
    protected getDefaultOptions(): Partial<import("../../types").Options>;
    /**
     * 词云图适配器
     */
    protected getSchemaAdaptor(): (params: Adaptor<WordCloudOptions>) => void;
}
