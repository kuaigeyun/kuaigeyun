import { IDataValidationRule, Nullable, Disposable, Injector } from '@univerjs/core';
import { IOtherFormulaResult } from '@univerjs/sheets-formula';
import { DataValidationModel } from '@univerjs/data-validation';
export interface IListCacheItem {
    list: string[];
    listWithColor: Array<{
        label: string;
        color: string;
    }>;
    colorMap: Record<string, string>;
    set: Set<string>;
}
/**
 * Service for caching data validation list results.
 * Cache is invalidated when formula results change (through markRuleDirty).
 */
export declare class DataValidationListCacheService extends Disposable {
    private readonly _injector;
    private readonly _dataValidationModel;
    private _cache;
    constructor(_injector: Injector, _dataValidationModel: DataValidationModel);
    private _initRuleChangeListener;
    /**
     * Get cached list data or compute and cache it if not exists.
     */
    getOrCompute(unitId: string, subUnitId: string, rule: IDataValidationRule): IListCacheItem;
    private _ensureCache;
    /**
     * Get cached list data for a rule. Returns undefined if not cached.
     */
    getCache(unitId: string, subUnitId: string, ruleId: string): IListCacheItem | undefined;
    /**
     * Set cache for a rule.
     */
    setCache(unitId: string, subUnitId: string, ruleId: string, item: IListCacheItem): void;
    /**
     * Mark a rule's cache as dirty (invalidate it).
     * Called when formula results change.
     */
    markRuleDirty(unitId: string, subUnitId: string, ruleId: string): void;
    /**
     * Clear all caches.
     */
    clear(): void;
    /**
     * Compute list data from formula result and cache it.
     */
    computeAndCache(unitId: string, subUnitId: string, rule: IDataValidationRule, formulaResult: Nullable<Nullable<IOtherFormulaResult>[]>): IListCacheItem;
    /**
     * Extract string list from formula result cells.
     */
    private _getRuleFormulaResultSet;
}
