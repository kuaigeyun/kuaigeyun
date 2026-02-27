import { FRange } from '../f-range';
import { IRangeProtectionOptions } from './permission-types';
import { ICommandService, Injector } from '@univerjs/core';
import { RangeProtectionRuleModel } from '@univerjs/sheets';
/**
 * Implementation class for range protection rules
 * Encapsulates operations on a single protection rule
 *
 * @hideconstructor
 */
export declare class FRangeProtectionRule {
    private readonly _unitId;
    private readonly _subUnitId;
    private readonly _ruleId;
    private readonly _permissionId;
    private readonly _ranges;
    private readonly _options;
    private readonly _injector;
    private readonly _commandService;
    private readonly _rangeProtectionRuleModel;
    constructor(_unitId: string, _subUnitId: string, _ruleId: string, _permissionId: string, _ranges: FRange[], _options: IRangeProtectionOptions, _injector: Injector, _commandService: ICommandService, _rangeProtectionRuleModel: RangeProtectionRuleModel);
    /**
     * Get the rule ID.
     * @returns {string} The unique identifier of this protection rule.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * const ruleId = rules?.[0]?.id;
     * console.log(ruleId);
     * ```
     */
    get id(): string;
    /**
     * Get the protected ranges.
     * @returns {FRange[]} Array of protected ranges.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * const ranges = rules?.[0]?.ranges;
     * console.log(ranges);
     * ```
     */
    get ranges(): FRange[];
    /**
     * Get the protection options.
     * @returns {IRangeProtectionOptions} Copy of the protection options.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * const options = rules?.[0]?.options;
     * console.log(options);
     * ```
     */
    get options(): IRangeProtectionOptions;
    /**
     * Update the protected ranges.
     * @param {FRange[]} ranges New ranges to protect.
     * @returns {Promise<void>} A promise that resolves when the ranges are updated.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * const rule = rules?.[0];
     * await rule?.updateRanges([worksheet.getRange('A1:C3')]);
     * ```
     */
    updateRanges(ranges: FRange[]): Promise<void>;
    /**
     * Delete the current protection rule.
     * @returns {Promise<void>} A promise that resolves when the rule is removed.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * const rule = rules?.[0];
     * await rule?.remove();
     * ```
     */
    remove(): Promise<void>;
    /**
     * Check if two ranges intersect
     * @returns true if ranges intersect, false otherwise
     * @private
     */
    private _rangesIntersect;
}
