import { Disposable, ICommandService } from '@univerjs/core';
import { TableManager } from '../model/table-manager';
export declare class SheetTableFormulaController extends Disposable {
    private _tableManager;
    private readonly _commandService;
    constructor(_tableManager: TableManager, _commandService: ICommandService);
    private _initRangeListener;
    private _updateSuperTable;
}
