import { ICommand, IRange } from '@univerjs/core';
import { APPLY_TYPE } from '../../services/auto-fill/type';
export interface IAutoFillCommandParams {
    sourceRange: IRange;
    targetRange: IRange;
    unitId?: string;
    subUnitId?: string;
    applyType?: APPLY_TYPE;
}
export declare const AutoFillCommand: ICommand;
export interface IAutoClearContentCommand {
    clearRange: IRange;
    selectionRange: IRange;
}
export declare const AutoClearContentCommand: ICommand;
