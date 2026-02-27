import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { BidirectionalBarOptions } from './type';
export type { BidirectionalBarOptions };
export declare class BidirectionalBar extends Plot<BidirectionalBarOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<BidirectionalBarOptions>;
    protected getDefaultOptions(): Partial<BidirectionalBarOptions>;
    protected getSchemaAdaptor(): (params: Adaptor<BidirectionalBarOptions>) => void;
}
