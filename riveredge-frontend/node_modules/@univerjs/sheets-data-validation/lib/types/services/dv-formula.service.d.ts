import { ISheetDataValidationRule, Nullable, Disposable, IUniverInstanceService } from '@univerjs/core';
import { IFormulaInfo, IOtherFormulaResult, RegisterOtherFormulaService } from '@univerjs/sheets-formula';
import { DataValidationModel, DataValidatorRegistryService } from '@univerjs/data-validation';
import { DataValidationCacheService } from './dv-cache.service';
import { DataValidationListCacheService } from './dv-list-cache.service';
export declare class DataValidationFormulaService extends Disposable {
    private readonly _instanceService;
    private _registerOtherFormulaService;
    private readonly _dataValidationCacheService;
    private readonly _dataValidationModel;
    private readonly _validatorRegistryService;
    private readonly _listCacheService;
    private _formulaRuleMap;
    constructor(_instanceService: IUniverInstanceService, _registerOtherFormulaService: RegisterOtherFormulaService, _dataValidationCacheService: DataValidationCacheService, _dataValidationModel: DataValidationModel, _validatorRegistryService: DataValidatorRegistryService, _listCacheService: DataValidationListCacheService);
    private _initFormulaResultHandler;
    private _ensureRuleFormulaMap;
    private _registerSingleFormula;
    addRule(unitId: string, subUnitId: string, rule: ISheetDataValidationRule): void;
    removeRule(unitId: string, subUnitId: string, ruleId: string): void;
    getRuleFormulaResult(unitId: string, subUnitId: string, ruleId: string): Promise<Nullable<[Nullable<IOtherFormulaResult>, Nullable<IOtherFormulaResult>]>>;
    getRuleFormulaResultSync(unitId: string, subUnitId: string, ruleId: string): Nullable<IOtherFormulaResult>[] | undefined;
    getRuleFormulaInfo(unitId: string, subUnitId: string, ruleId: string): [IFormulaInfo | undefined, IFormulaInfo | undefined] | undefined;
}
