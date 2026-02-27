import { FunctionVariantType } from '../../../engine/reference-object/base-reference-object';
import { BaseValueObject } from '../../../engine/value-object/base-value-object';
import { BaseFunction } from '../../base-function';
export declare class Aggregate extends BaseFunction {
    minParams: number;
    maxParams: number;
    needsReferenceObject: boolean;
    needsFilteredOutRows: boolean;
    needsFormulaDataModel: boolean;
    calculate(functionNum: FunctionVariantType, options: FunctionVariantType, ...refs: FunctionVariantType[]): BaseValueObject;
    private _handleSingleObject;
    private _getAggregateOptions;
    private _handleLargeSmallPercentileQuartile;
}
