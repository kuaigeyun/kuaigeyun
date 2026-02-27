import { Nullable } from '@univerjs/core';
import { ICellDataWithSpanInfo } from './type';
/**
 * Fast clone for ICellDataWithSpanInfo. Optimized for the known structure.
 * This extends cloneCellData with additional span and plain properties.
 * @param cell - The cell data with span info to clone
 * @returns A deep clone of the cell data
 */
export declare function cloneCellDataWithSpanInfo(cell: Nullable<ICellDataWithSpanInfo>): Nullable<ICellDataWithSpanInfo>;
