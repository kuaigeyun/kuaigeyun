import { ICommand, IRange } from '@univerjs/core';
export interface IClearSelectionContentCommandParams {
    unitId?: string;
    subUnitId?: string;
    ranges?: IRange[];
}
/**
 * The command to clear content in current selected ranges.
 */
export declare const ClearSelectionContentCommand: ICommand;
