import { Plot } from '../../base';
import type { Adaptor } from '../../types';
import { ColumnOptions } from './type';
export type { ColumnOptions };
export declare class Column extends Plot<ColumnOptions> {
    /** 图表类型 */
    type: string;
    static getDefaultOptions(): Partial<ColumnOptions>;
    protected getDefaultOptions(): Partial<import("../bar").BarOptions>;
    protected getSchemaAdaptor(): (params: Adaptor<ColumnOptions>) => void;
}
