import { Nullable } from '@univerjs/core';
import { ArrayValueObject } from '../value-object/array-value-object';
import { BaseValueObject, ErrorValueObject } from '../value-object/base-value-object';
import { BaseReferenceObject } from './base-reference-object';
export type MultiAreaValue = BaseReferenceObject | ErrorValueObject;
export declare class MultiAreaReferenceObject extends BaseReferenceObject {
    /**
     * 2D structure:
     * - First dimension: stored by rows
     * - Second dimension: each AreaValue within that row
     */
    private _areas;
    constructor(token: string, areas?: MultiAreaValue[][]);
    dispose(): void;
    getAreas(): MultiAreaValue[][];
    setAreas(areas: MultiAreaValue[][]): void;
    /**
     * Append an area:
     * - If a single AreaValue is passed, it will be wrapped as one row.
     * - If an AreaValue[] is passed, it will be inserted as an entire row.
     */
    addArea(area: MultiAreaValue | MultiAreaValue[]): void;
    /** Flatten the 2D areas to reuse 1D logic */
    private _flatAreas;
    isMultiArea(): boolean;
    isRange(): boolean;
    isCell(): boolean;
    isRow(): boolean;
    isColumn(): boolean;
    getRowCount(): number;
    getColumnCount(): number;
    isExceedRange(): boolean;
    setRefOffset(x?: number, y?: number): void;
    private _getReferenceArea;
    /**
     * Multi-area reference may span multiple sheets, but Excel requires
     * them to be in the same sheet for most functions. We follow Excel semantics
     * by returning the first area’s identifiers.
     */
    getUnitId(): string;
    getSheetId(): string;
    getActiveSheetRowCount(): number;
    getActiveSheetColumnCount(): number;
    /**
     * Iterate through all areas in order, flattening the multi-area into
     * a sequence of cells.
     *
     * Note: The order here is "row-major":
     *   iterate by the row order of _areas, then within each row by the area order.
     */
    iterator(callback: (v: Nullable<BaseValueObject>, row: number, col: number) => Nullable<boolean>): void;
    /**
     * Excel defines the "first cell" of a multi-area reference
     * as the first cell of the first area.
     */
    getFirstCell(): BaseValueObject;
    /**
     * For multi-area, we only take the *first cell* of each area and
     * arrange them into a 2D ArrayValueObject:
     *
     * - outer `_areas` dimension => rows
     * - inner `_areas[row]` dimension => columns
     */
    toArrayValueObject(): ArrayValueObject;
    getRangePosition(): {
        startRow: number;
        endRow: number;
        startColumn: number;
        endColumn: number;
    };
    toUnitRange(): {
        range: {
            startRow: number;
            endRow: number;
            startColumn: number;
            endColumn: number;
        };
        sheetId: string;
        unitId: string;
    };
    getRangeData(): import('@univerjs/core').IRange;
}
