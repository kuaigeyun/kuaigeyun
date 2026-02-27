import { IRange, Worksheet, Disposable, ICommandService, InterceptorManager, IUniverInstanceService } from '@univerjs/core';
import { ArrayValueObject, FormulaDataModel } from '@univerjs/engine-formula';
import { INumfmtService, SheetsSelectionsService } from '@univerjs/sheets';
import { IStatusBarService } from '../services/status-bar.service';
export declare const STATUS_BAR_PERMISSION_CORRECT: import('@univerjs/core').IInterceptor<ArrayValueObject[], ArrayValueObject[]>;
export declare class StatusBarController extends Disposable {
    private readonly _univerInstanceService;
    private readonly _selectionManagerService;
    private readonly _statusBarService;
    private readonly _commandService;
    private _numfmtService;
    private readonly _formulaDataModel;
    interceptor: InterceptorManager<{
        STATUS_BAR_PERMISSION_CORRECT: import('@univerjs/core').IInterceptor<ArrayValueObject[], ArrayValueObject[]>;
    }>;
    constructor(_univerInstanceService: IUniverInstanceService, _selectionManagerService: SheetsSelectionsService, _statusBarService: IStatusBarService, _commandService: ICommandService, _numfmtService: INumfmtService, _formulaDataModel: FormulaDataModel);
    private _init;
    private _registerSelectionListener;
    private _clearResult;
    getRangeStartEndInfo(range: IRange, sheet: Worksheet): IRange;
    private _getCellValue;
    private _calculateSelection;
}
