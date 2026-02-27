import { Observable } from 'rxjs';
import { FRange } from '../f-range';
import { FWorksheet } from '../f-worksheet';
import { IRangeProtectionOptions, IWorksheetPermissionConfig, IWorksheetProtectionOptions, UnsubscribeFn, WorksheetMode, WorksheetPermissionSnapshot, WorksheetPermissionPoint } from './permission-types';
import { IAuthzIoService, ICommandService, Injector, IPermissionService } from '@univerjs/core';
import { RangeProtectionRuleModel, WorksheetProtectionPointModel, WorksheetProtectionRuleModel } from '@univerjs/sheets';
import { FRangeProtectionRule } from './f-range-protection-rule';
/**
 * Implementation class for WorksheetPermission
 * Provides worksheet-level permission control
 *
 * @hideconstructor
 */
export declare class FWorksheetPermission {
    private readonly _worksheet;
    private readonly _injector;
    private readonly _permissionService;
    private readonly _authzIoService;
    private readonly _commandService;
    private readonly _rangeProtectionRuleModel;
    private readonly _worksheetProtectionPointModel;
    private readonly _worksheetProtectionRuleModel;
    private readonly _permissionSubject;
    private readonly _rangeRulesSubject;
    /**
     * Observable stream of permission snapshot changes (BehaviorSubject)
     * Emits immediately on subscription with current state, then on any permission point change
     */
    readonly permission$: Observable<WorksheetPermissionSnapshot>;
    /**
     * Observable stream of individual permission point changes
     * Emits when a specific permission point value changes
     */
    readonly pointChange$: Observable<{
        point: WorksheetPermissionPoint;
        value: boolean;
        oldValue: boolean;
    }>;
    /**
     * Observable stream of range protection rule changes
     * Emits when protection rules are added, updated, or deleted
     */
    readonly rangeProtectionChange$: Observable<{
        type: 'add' | 'update' | 'delete';
        rules: FRangeProtectionRule[];
    }>;
    /**
     * Observable stream of current range protection rules list (BehaviorSubject)
     * Emits immediately on subscription with current rules, then auto-updates when rules change
     */
    readonly rangeProtectionRules$: Observable<FRangeProtectionRule[]>;
    private readonly _unitId;
    private readonly _subUnitId;
    private readonly _subscriptions;
    private readonly _fPermission;
    constructor(_worksheet: FWorksheet, _injector: Injector, _permissionService: IPermissionService, _authzIoService: IAuthzIoService, _commandService: ICommandService, _rangeProtectionRuleModel: RangeProtectionRuleModel, _worksheetProtectionPointModel: WorksheetProtectionPointModel, _worksheetProtectionRuleModel: WorksheetProtectionRuleModel);
    /**
     * Create permission snapshot stream from IPermissionService
     * @private
     */
    private _createPermissionStream;
    /**
     * Create point change stream from IPermissionService
     * @private
     */
    private _createPointChangeStream;
    /**
     * Create range protection change stream from RangeProtectionRuleModel
     * @private
     */
    private _createRangeProtectionChangeStream;
    /**
     * Create range protection rules list stream from RangeProtectionRuleModel
     * @private
     */
    private _createRangeProtectionRulesStream;
    /**
     * Extract WorksheetPermissionPoint type from permission point ID
     * @private
     */
    private _extractWorksheetPointType;
    /**
     * Read the actual edit permission from a rule's permissionId
     */
    private _getRuleEditPermission;
    /**
     * Build permission snapshot
     */
    private _buildSnapshot;
    /**
     * Build range protection rules list
     */
    private _buildRangeProtectionRules;
    /**
     * Build Facade objects for all protection rules
     */
    private _buildProtectionRule;
    /**
     * Debug cell permission information.
     * @param {number} row Row index.
     * @param {number} col Column index.
     * @returns {ICellPermissionDebugInfo | null} Debug information about which rules affect this cell, or null if no rules apply.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const debugInfo = permission?.debugCellPermission(0, 0);
     * console.log(debugInfo);
     * ```
     */
    debugCellPermission(row: number, col: number): FRangeProtectionRule | undefined;
    /**
     * Create worksheet protection with collaborators support.
     * This must be called before setting permission points for collaboration to work.
     * @param {IWorksheetProtectionOptions} options Protection options including allowed users.
     * @returns {Promise<string>} The permissionId for the created protection.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     *
     * // Create worksheet protection with collaborators
     * const permissionId = await permission?.protect({
     *   allowedUsers: ['user1', 'user2'],
     *   name: 'My Worksheet Protection'
     * });
     *
     * // Now set permission points
     * await permission?.setMode('readOnly');
     * ```
     */
    protect(options?: IWorksheetProtectionOptions): Promise<string>;
    /**
     * Remove worksheet protection.
     * This deletes the protection rule and resets all permission points to allowed.
     * @returns {Promise<void>} A promise that resolves when protection is removed.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.unprotect();
     * ```
     */
    unprotect(): Promise<void>;
    /**
     * Check if worksheet is currently protected.
     * @returns {boolean} true if protected, false otherwise.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * if (permission?.isProtected()) {
     *   console.log('Worksheet is protected');
     * }
     * ```
     */
    isProtected(): boolean;
    /**
     * Set permission mode for the worksheet.
     * Automatically creates worksheet protection if not already protected.
     * @param {WorksheetMode} mode The permission mode to set ('editable' | 'readOnly' | 'filterOnly' | 'commentOnly').
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.setMode('readOnly');
     * ```
     */
    setMode(mode: WorksheetMode): Promise<void>;
    /**
     * Get permission configuration for a specific mode
     * @private
     */
    private _getModePermissions;
    /**
     * Batch set multiple permission points efficiently
     * @private
     */
    private _batchSetPermissionPoints;
    /**
     * Set the worksheet to read-only mode.
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.setReadOnly();
     * ```
     */
    setReadOnly(): Promise<void>;
    /**
     * Set the worksheet to editable mode.
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.setEditable();
     * ```
     */
    setEditable(): Promise<void>;
    /**
     * Check if the worksheet is editable.
     * @returns {boolean} true if the worksheet can be edited, false otherwise.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * if (permission?.canEdit()) {
     *   console.log('Worksheet is editable');
     * }
     * ```
     */
    canEdit(): boolean;
    /**
     * Check if a specific cell can be edited.
     * @param {number} row Row index.
     * @param {number} col Column index.
     * @returns {boolean} true if the cell can be edited, false otherwise.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const canEdit = permission?.canEditCell(0, 0);
     * console.log(canEdit);
     * ```
     */
    canEditCell(row: number, col: number): boolean;
    /**
     * Check if a specific cell can be viewed.
     * @param {number} _row Row index (unused, for API consistency).
     * @param {number} _col Column index (unused, for API consistency).
     * @returns {boolean} true if the cell can be viewed, false otherwise.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const canView = permission?.canViewCell(0, 0);
     * console.log(canView);
     * ```
     */
    canViewCell(_row: number, _col: number): boolean;
    /**
     * Set a specific permission point for the worksheet.
     * Automatically creates worksheet protection if not already protected.
     * @param {WorksheetPermissionPoint} point The permission point to set.
     * @param {boolean} value The value to set (true = allowed, false = denied).
     * @returns {Promise<void>} A promise that resolves when the point is set.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.setPoint(univerAPI.Enum.WorksheetPermissionPoint.InsertRow, false);
     * ```
     */
    setPoint(point: WorksheetPermissionPoint, value: boolean): Promise<void>;
    /**
     * Get the value of a specific permission point.
     * @param {WorksheetPermissionPoint} point The permission point to query.
     * @returns {boolean} true if allowed, false if denied.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const canInsertRow = permission?.getPoint(univerAPI.Enum.WorksheetPermissionPoint.InsertRow);
     * console.log(canInsertRow);
     * ```
     */
    getPoint(point: WorksheetPermissionPoint): boolean;
    /**
     * Get a snapshot of all permission points.
     * @returns {WorksheetPermissionSnapshot} An object containing all permission point values.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const snapshot = permission?.getSnapshot();
     * console.log(snapshot);
     * ```
     */
    getSnapshot(): WorksheetPermissionSnapshot;
    /**
     * Apply a permission configuration to the worksheet.
     * @param {IWorksheetPermissionConfig} config The configuration to apply.
     * @returns {Promise<void>} A promise that resolves when the configuration is applied.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.applyConfig({
     *   mode: 'readOnly',
     *   points: {
     *     [univerAPI.Enum.WorksheetPermissionPoint.View]: true,
     *     [univerAPI.Enum.WorksheetPermissionPoint.Edit]: false
     *   }
     * });
     * ```
     */
    applyConfig(config: IWorksheetPermissionConfig): Promise<void>;
    /**
     * Protect multiple ranges at once (batch operation).
     * @param {Array<{ ranges: FRange[]; options?: IRangeProtectionOptions }>} configs Array of protection configurations.
     * @returns {Promise<FRangeProtectionRule[]>} Array of created protection rules.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.protectRanges([
     *   {
     *     ranges: [worksheet.getRange('A1:B2')],
     *     options: { name: 'Protected Area 1', allowEdit: false, allowViewByOthers: true }
     *   },
     *   {
     *     ranges: [worksheet.getRange('C3:D4')],
     *     options: { name: 'Protected Area 2', allowEdit: true, allowViewByOthers: false }
     *   }
     * ]);
     * console.log(rules);
     * ```
     */
    protectRanges(configs: Array<{
        ranges: FRange[];
        options?: IRangeProtectionOptions;
    }>): Promise<FRangeProtectionRule[]>;
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
     * Remove multiple protection rules at once.
     * @param {string[]} ruleIds Array of rule IDs to remove.
     * @returns {Promise<void>} A promise that resolves when the rules are removed.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * await permission?.unprotectRules(['rule1', 'rule2']);
     * ```
     */
    unprotectRules(ruleIds: string[]): Promise<void>;
    /**
     * List all range protection rules for the worksheet.
     * @returns {Promise<FRangeProtectionRule[]>} Array of protection rules.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const rules = await permission?.listRangeProtectionRules();
     * console.log(rules);
     * ```
     */
    listRangeProtectionRules(): Promise<FRangeProtectionRule[]>;
    /**
     * Subscribe to permission changes (simplified interface for users not familiar with RxJS).
     * @param {Function} listener Callback function to be called when permissions change.
     * @returns {UnsubscribeFn} Unsubscribe function.
     * @example
     * ```ts
     * const worksheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
     * const permission = worksheet?.getWorksheetPermission();
     * const unsubscribe = permission?.subscribe((snapshot) => {
     *   console.log('Permission changed:', snapshot);
     * });
     * // Later, to stop listening:
     * unsubscribe?.();
     * ```
     */
    subscribe(listener: (snapshot: WorksheetPermissionSnapshot) => void): UnsubscribeFn;
    /**
     * Clean up resources
     */
    dispose(): void;
}
