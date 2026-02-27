import { IMutationInfo, Disposable, ICommandService, IUniverInstanceService } from '@univerjs/core';
import { ISetRangeValuesMutationParams } from '../commands/mutations/set-range-values.mutation';
/**
 * Service to schedule and execute remaining SetRangeValuesMutation tasks
 * during browser idle time after a sheet copy operation.
 *
 * This improves user experience by:
 * 1. Immediately showing the copied sheet with first chunk of data
 * 2. Filling remaining data in background during idle time
 * 3. Automatically canceling tasks if the sheet is deleted
 * 4. Warning user if they try to close while tasks are pending
 */
export declare class SheetLazyExecuteScheduleService extends Disposable {
    private readonly _commandService;
    private readonly _univerInstanceService;
    private _tasks;
    private _idleCallbackId;
    private _beforeUnloadHandler;
    constructor(_commandService: ICommandService, _univerInstanceService: IUniverInstanceService);
    /**
     * Check if there are any pending tasks
     */
    hasPendingTasks(): boolean;
    /**
     * Get the count of pending mutations across all tasks
     */
    getPendingMutationsCount(): number;
    /**
     * Schedule mutations to be executed during idle time
     * @param unitId - The workbook unit ID
     * @param subUnitId - The sheet ID (newly created sheet)
     * @param mutations - Remaining SetRangeValuesMutation to execute
     */
    scheduleMutations(unitId: string, subUnitId: string, mutations: IMutationInfo<ISetRangeValuesMutationParams>[]): void;
    /**
     * Cancel scheduled mutations for a specific sheet
     * Called when the sheet is deleted
     */
    cancelScheduledMutations(unitId: string, subUnitId: string): void;
    private _cancelTask;
    private _cancelAllTasks;
    private _scheduleNextIdle;
    private _processIdleTasks;
    private _isSheetExist;
    private _setupBeforeUnloadListener;
    private _removeBeforeUnloadListener;
}
