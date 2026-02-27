import { NumericTuple } from '@flatten-js/interval-tree';
export declare const DEFAULT_EMPTY_CELL_KEY: unique symbol;
export declare class InvertedIndexCache {
    /**
     * {
     *    unitId:{
     *       sheetId:{
     *          'columnIndex': {
     *              10:[1,3,4,5],
     *              5:[2,6,11,22]
     *          }
     *       }
     *    }
     * }
     */
    private _cache;
    private _continueBuildingCache;
    set(unitId: string, sheetId: string, column: number, value: string | number | boolean | null | symbol, row: number, isForceUpdate?: boolean): void;
    getCellValuePositions(unitId: string, sheetId: string, column: number): Map<string | number | boolean | symbol | null, Set<number>> | undefined;
    getCellPositions(unitId: string, sheetId: string, column: number, value: string | number | boolean | null | symbol, rowsInCache: NumericTuple[]): number[] | undefined;
    setContinueBuildingCache(unitId: string, sheetId: string, column: number, startRow: number, endRow: number): void;
    shouldContinueBuildingCache(unitId: string, sheetId: string, column: number, row: number): boolean;
    canUseCache(unitId: string, sheetId: string, column: number, rangeStartRow: number, rangeEndRow: number): {
        rowsInCache: NumericTuple[];
        rowsNotInCache: NumericTuple[];
    };
    clear(): void;
    private _handleNewInterval;
}
export declare const CELL_INVERTED_INDEX_CACHE: InvertedIndexCache;
