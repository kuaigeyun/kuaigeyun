import { IUser } from '@univerjs/protocol';
import { Observable } from 'rxjs';
import { ICollaborator, IWorkbookPermission, UnsubscribeFn, WorkbookMode, WorkbookPermissionSnapshot, UnitRole, WorkbookPermissionPoint } from './permission-types';
import { IAuthzIoService, Injector, IPermissionService } from '@univerjs/core';
/**
 * Implementation class for WorkbookPermission
 * Provides workbook-level permission control
 *
 * @hideconstructor
 */
export declare class FWorkbookPermission implements IWorkbookPermission {
    private readonly _unitId;
    private readonly _injector;
    private readonly _permissionService;
    private readonly _authzIoService;
    private readonly _permissionSubject;
    private readonly _collaboratorChangeSubject;
    /**
     * Observable stream of permission snapshot changes (BehaviorSubject)
     * Emits immediately on subscription with current state, then on any permission point change
     */
    readonly permission$: Observable<WorkbookPermissionSnapshot>;
    /**
     * Observable stream of individual permission point changes
     * Emits when a specific permission point value changes
     */
    readonly pointChange$: Observable<{
        point: WorkbookPermissionPoint;
        value: boolean;
        oldValue: boolean;
    }>;
    /**
     * Observable stream of collaborator changes
     * Emits when collaborators are added, updated, or removed
     */
    readonly collaboratorChange$: Observable<{
        type: 'add' | 'update' | 'delete';
        collaborator: ICollaborator;
    }>;
    private _subscriptions;
    private readonly _fPermission;
    constructor(_unitId: string, _injector: Injector, _permissionService: IPermissionService, _authzIoService: IAuthzIoService);
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
     * Extract WorkbookPermissionPoint type from permission point ID
     * @private
     */
    private _extractWorkbookPointType;
    /**
     * Build permission snapshot
     */
    private _buildSnapshot;
    /**
     * Listen to permission point changes
    /**
     * Set permission mode for the workbook.
     * @param {WorkbookMode} mode The permission mode to set ('owner' | 'editor' | 'viewer' | 'commenter').
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.setMode('editor');
     * ```
     */
    setMode(mode: WorkbookMode): Promise<void>;
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
     * Set the workbook to read-only mode (viewer mode).
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.setReadOnly();
     * ```
     */
    setReadOnly(): Promise<void>;
    /**
     * Set the workbook to editable mode (editor mode).
     * @returns {Promise<void>} A promise that resolves when the mode is set.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.setEditable();
     * ```
     */
    setEditable(): Promise<void>;
    /**
     * Check if the workbook is editable.
     * @returns {boolean} true if the workbook can be edited, false otherwise.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * if (permission?.canEdit()) {
     *   console.log('Workbook is editable');
     * }
     * ```
     */
    canEdit(): boolean;
    /**
     * Set a specific permission point.
     * @param {WorkbookPermissionPoint} point The permission point to set.
     * @param {boolean} value The value to set (true = allowed, false = denied).
     * @returns {Promise<void>} A promise that resolves when the point is set.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.setPoint(univerAPI.Enum.WorkbookPermissionPoint.Print, false);
     * ```
     */
    setPoint(point: WorkbookPermissionPoint, value: boolean): Promise<void>;
    /**
     * Get the value of a specific permission point.
     * @param {WorkbookPermissionPoint} point The permission point to query.
     * @returns {boolean} true if allowed, false if denied.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * const canPrint = permission?.getPoint(univerAPI.Enum.WorkbookPermissionPoint.Print);
     * console.log(canPrint);
     * ```
     */
    getPoint(point: WorkbookPermissionPoint): boolean;
    /**
     * Get a snapshot of all permission points.
     * @returns {WorkbookPermissionSnapshot} An object containing all permission point values.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * const snapshot = permission?.getSnapshot();
     * console.log(snapshot);
     * ```
     */
    getSnapshot(): WorkbookPermissionSnapshot;
    /**
     * Set multiple collaborators at once (replaces existing collaborators).
     * @param {Array<{ user: IUser; role: UnitRole }>} collaborators Array of collaborators with user information and role.
     * @returns {Promise<void>} A promise that resolves when the collaborators are set.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.setCollaborators([
     *   {
     *     user: { userID: 'user1', name: 'John Doe', avatar: 'https://...' },
     *     role: univerAPI.Enum.UnitRole.Editor
     *   },
     *   {
     *     user: { userID: 'user2', name: 'Jane Smith', avatar: '' },
     *     role: univerAPI.Enum.UnitRole.Reader
     *   }
     * ]);
     * ```
     */
    setCollaborators(collaborators: Array<{
        user: IUser;
        role: UnitRole;
    }>): Promise<void>;
    /**
     * Add a single collaborator.
     * @param {IUser} user The user information (userID, name, avatar).
     * @param {UnitRole} role The role to assign.
     * @returns {Promise<void>} A promise that resolves when the collaborator is added.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.addCollaborator(
     *   { userID: 'user1', name: 'John Doe', avatar: 'https://...' },
     *   univerAPI.Enum.UnitRole.Editor
     * );
     * ```
     */
    addCollaborator(user: IUser, role: UnitRole): Promise<void>;
    /**
     * Update an existing collaborator's role and information.
     * @param {IUser} user The updated user information (userID, name, avatar).
     * @param {UnitRole} role The new role to assign.
     * @returns {Promise<void>} A promise that resolves when the collaborator is updated.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.updateCollaborator(
     *   { userID: 'user1', name: 'John Doe Updated', avatar: 'https://...' },
     *   univerAPI.Enum.UnitRole.Reader
     * );
     * ```
     */
    updateCollaborator(user: IUser, role: UnitRole): Promise<void>;
    /**
     * Remove a collaborator from the workbook.
     * @param {string} userId The user ID to remove.
     * @returns {Promise<void>} A promise that resolves when the collaborator is removed.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.removeCollaborator('user1');
     * ```
     */
    removeCollaborator(userId: string): Promise<void>;
    /**
     * Remove multiple collaborators at once.
     * @param {string[]} userIds Array of user IDs to remove.
     * @returns {Promise<void>} A promise that resolves when the collaborators are removed.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * await permission?.removeCollaborators(['user1', 'user2']);
     * ```
     */
    removeCollaborators(userIds: string[]): Promise<void>;
    /**
     * List all collaborators of the workbook.
     * @returns {Promise<ICollaborator[]>} Array of collaborators with their roles.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * const collaborators = await permission?.listCollaborators();
     * console.log(collaborators);
     * ```
     */
    listCollaborators(): Promise<ICollaborator[]>;
    /**
     * Subscribe to permission changes (simplified interface for users not familiar with RxJS).
     * @param {Function} listener Callback function to be called when permissions change.
     * @returns {UnsubscribeFn} Unsubscribe function.
     * @example
     * ```ts
     * const workbook = univerAPI.getActiveWorkbook();
     * const permission = workbook?.getWorkbookPermission();
     * const unsubscribe = permission?.subscribe((snapshot) => {
     *   console.log('Permission changed:', snapshot);
     * });
     * // Later, to stop listening:
     * unsubscribe?.();
     * ```
     */
    subscribe(listener: (snapshot: WorkbookPermissionSnapshot) => void): UnsubscribeFn;
    /**
     * Clean up resources
     */
    dispose(): void;
}
