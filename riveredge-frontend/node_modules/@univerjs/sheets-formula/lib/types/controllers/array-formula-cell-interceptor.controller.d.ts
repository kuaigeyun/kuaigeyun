import { Disposable, ICommandService, IConfigService } from '@univerjs/core';
import { FormulaDataModel, IDefinedNamesService, IFunctionService, LexerTreeBuilder } from '@univerjs/engine-formula';
import { SheetInterceptorService } from '@univerjs/sheets';
export declare class ArrayFormulaCellInterceptorController extends Disposable {
    private readonly _commandService;
    private readonly _configService;
    private _sheetInterceptorService;
    private readonly _formulaDataModel;
    private readonly _lexerTreeBuilder;
    private readonly _functionService;
    private readonly _definedNamesService;
    constructor(_commandService: ICommandService, _configService: IConfigService, _sheetInterceptorService: SheetInterceptorService, _formulaDataModel: FormulaDataModel, _lexerTreeBuilder: LexerTreeBuilder, _functionService: IFunctionService, _definedNamesService: IDefinedNamesService);
    private _initialize;
    private _commandExecutedListener;
    private _addPrefixToDefinedNamesFunctionSnapshot;
    private _addPrefixToFunctionSnapshot;
    private _writeArrayFormulaToSnapshot;
    private _initInterceptorCellContent;
}
