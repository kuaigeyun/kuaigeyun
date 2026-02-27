import { Observable } from 'rxjs';
import { FRange } from '../f-range';
import { FWorksheet } from '../f-worksheet';
import { IRangeProtectionOptions, RangePermissionSnapshot, RangePermissionPoint } from './permission-types';
import { IAuthzIoService, ICommandService, Injector, IPermissionService } from '@univerjs/core';
import { RangeProtectionRuleModel } from '@univerjs/sheets';
import { FRangeProtectionRule } from './f-range-protection-rule';
/**
 * Implementation class for RangePermission
 * Manages range-level permissions
 *
 * @hideconstructor
 */
export declare class FRangePermission {
    private readonly _unitId;
    private readonly _subUnitId;
    private readonly _range;
    private readonly _worksheet;
    private readonly _injector;
    private readonly _permissionService;
    private readonly _authzIoService;
    private readonly _commandService;
    private readonly _rangeProtectionRuleModel;
    private readonly _permissionSubject;
    private readonly _subscriptions;
    private readonly _fPermission;
    /**
     * Observable stream of permission snapshot changes
     * @returns Observable that emits when permission snapshot changes
     */
    readonly permission$: Observable<RangePermissionSnapshot>;
    /**
     * Observable stream of protection state changes
     * @returns Observable that emits when protection state changes
     */
    readonly protectionChange$: Observable<{
        type: 'protected';
        rule: FRangeProtectionRule;
    } | {
        type: 'unprotected';
        ruleId: string;
    }>;
    constructor(_unitId: string, _subUnitId: string, _range: FRange, _worksheet: FWorksheet, _injector: Injector, _permissionService: IPermissionService, _authzIoService: IAuthzIoService, _commandService: ICommandService, _rangeProtectionRuleModel: RangeProtectionRuleModel);
    /**
     * Create permission snapshot stream from IPermissionService
     * @private
     */
    private _createPermissionStream;
    /**
     * Create protection change stream from RangeProtectionRuleModel
     * @private
     */
    private _createProtectionChangeStream;
    /**
     * Check if a protection rule matches this range
     */
    private _rangeMatches;
    /**
     * Create a Facade rule from internal rule
     */
    private _createFacadeRule;
    /**
     * Get the value of a specific permission point.
     * @param {RangePermissionPoint} point The permission point to query.
     * @returns {boolean} true if allowed, false if denied.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const canEdit = permission?.getPoint(univerAPI.Enum.RangePermissionPoint.Edit);
     * console.log(canEdit);
     * ```
     */
    getPoint(point: RangePermissionPoint): boolean;
    /**
     * Get the current permission snapshot.
     * @returns {RangePermissionSnapshot} Snapshot of all permission points.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const snapshot = permission?.getSnapshot();
     * console.log(snapshot);
     * ```
     */
    getSnapshot(): RangePermissionSnapshot;
    /**
     * Check if the current range is protected.
     * @returns {boolean} true if protected, false otherwise.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const isProtected = permission?.isProtected();
     * console.log(isProtected);
     * ```
     */
    isProtected(): boolean;
    /**
     * Check if the current user can edit this range.
     * @returns {boolean} true if editable, false otherwise.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * if (permission?.canEdit()) {
     *   console.log('You can edit this range');
     * }
     * ```
     */
    canEdit(): boolean;
    /**
     * Check if the current user can view this range.
     * @returns {boolean} true if viewable, false otherwise.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * if (permission?.canView()) {
     *   console.log('You can view this range');
     * }
     * ```
     */
    canView(): boolean;
    /**
     * Check if the current user can manage collaborators for this range.
     * @returns {boolean} true if can manage collaborators, false otherwise.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * if (permission?.canManageCollaborator()) {
     *   console.log('You can manage collaborators for this range');
     * }
     * ```
     */
    canManageCollaborator(): boolean;
    /**
     * Check if the current user can delete this protection rule.
     * @returns {boolean} true if can delete rule, false otherwise.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * if (permission?.canDelete()) {
     *   console.log('You can delete this protection rule');
     * }
     * ```
     */
    canDelete(): boolean;
    /**
     * Set a specific permission point for the range (low-level API).
     *
     * **Important:** This method only updates the permission point value for an existing protection rule.
     * It does NOT create permission checks that will block actual editing operations.
     * You must call `protect()` first to create a protection rule before using this method.
     *
     * This method is useful for:
     * - Fine-tuning permissions after creating a protection rule with `protect()`
     * - Dynamically adjusting permissions based on runtime conditions
     * - Advanced permission management scenarios
     *
     * @param {RangePermissionPoint} point The permission point to set.
     * @param {boolean} value The value to set (true = allowed, false = denied).
     * @returns {Promise<void>} A promise that resolves when the point is set.
     * @throws {Error} If no protection rule exists for this range.
     *
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     *
     * // First, create a protection rule
     * await permission?.protect({ name: 'My Range', allowEdit: true });
     *
     * // Then you can dynamically update permission points
     * await permission?.setPoint(univerAPI.Enum.RangePermissionPoint.Edit, false); // Now disable edit
     * await permission?.setPoint(univerAPI.Enum.RangePermissionPoint.View, true);  // Ensure view is enabled
     * ```
     */
    setPoint(point: RangePermissionPoint, value: boolean): Promise<void>;
    /**
     * Protect the current range.
     * @param {IRangeProtectionOptions} options Protection options.
     * @returns {Promise<FRangeProtectionRule>} The created protection rule.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const rule = await permission?.protect({
     *   name: 'My protected range',
     *   allowEdit: true,
     *   allowedUsers: ['user1', 'user2'],
     *   allowViewByOthers: false,
     * });
     * console.log(rule);
     * ```
     */
    protect(options?: IRangeProtectionOptions): Promise<FRangeProtectionRule>;
    /**
     * Determine view state from options
     * @private
     */
    private _determineViewState;
    /**
     * Determine edit state from options
     * @private
     */
    private _determineEditState;
    /**
     * Set permission points based on options (for local runtime control)
     * @private
     */
    private _setPermissionPoints;
    /**
     * Set a single permission point
     * @private
     */
    private _setPermissionPoint;
    /**
     * Unprotect the current range.
     * @returns {Promise<void>} A promise that resolves when the range is unprotected.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * await permission?.unprotect();
     * ```
     */
    unprotect(): Promise<void>;
    /**
     * List all protection rules.
     * @returns {Promise<FRangeProtectionRule[]>} Array of protection rules.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const rules = await permission?.listRules();
     * console.log(rules);
     * ```
     */
    listRules(): Promise<FRangeProtectionRule[]>;
    /**
     * Subscribe to permission changes (simplified interface).
     * @param {Function} listener Callback function to be called when permissions change.
     * @returns {Function} Unsubscribe function.
     * @example
     * ```ts
     * const range = univerAPI.getActiveWorkbook()?.getActiveSheet()?.getRange('A1:B2');
     * const permission = range?.getRangePermission();
     * const unsubscribe = permission?.subscribe((snapshot) => {
     *   console.log('Permission changed:', snapshot);
     * });
     * // Later, to stop listening:
     * unsubscribe?.();
     * ```
     */
    subscribe(listener: (snapshot: RangePermissionSnapshot) => void): (() => void);
    /**
     * Get the protection rule for the current range
     */
    private _getProtectionRule;
    /**
     * Build Facade objects for all protection rules
     */
    private _buildProtectionRules;
    /**
     * Build Facade objects for all protection rules (async version with collaborator data)
     * @private
     */
    private _buildProtectionRulesAsync;
    /**
     * Build permission snapshot
     */
    private _buildSnapshot;
    /**
     * Clean up resources
     */
    dispose(): void;
}
