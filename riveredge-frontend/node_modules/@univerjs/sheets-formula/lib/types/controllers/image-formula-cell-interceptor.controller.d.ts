import { Disposable, ICommandService } from '@univerjs/core';
import { FormulaDataModel } from '@univerjs/engine-formula';
import { SheetInterceptorService } from '@univerjs/sheets';
export declare class ImageFormulaCellInterceptorController extends Disposable {
    private readonly _commandService;
    private _sheetInterceptorService;
    private readonly _formulaDataModel;
    private _errorValueCell;
    private _refreshRender;
    constructor(_commandService: ICommandService, _sheetInterceptorService: SheetInterceptorService, _formulaDataModel: FormulaDataModel);
    private _initialize;
    private _commandExecutedListener;
    private _initInterceptorCellContent;
    private _getImageNatureSize;
    private _getImageSize;
    registerRefreshRenderFunction(refreshRender: () => void): void;
}
