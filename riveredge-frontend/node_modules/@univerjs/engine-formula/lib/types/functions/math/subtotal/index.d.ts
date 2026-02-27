import { FunctionVariantType } from '../../../engine/reference-object/base-reference-object';
import { ArrayValueObject } from '../../../engine/value-object/array-value-object';
import { BaseValueObject } from '../../../engine/value-object/base-value-object';
import { BaseFunction } from '../../base-function';
export declare class Subtotal extends BaseFunction {
    minParams: number;
    maxParams: number;
    needsReferenceObject: boolean;
    needsFilteredOutRows: boolean;
    needsFormulaDataModel: boolean;
    calculate(functionNum: FunctionVariantType, ...refs: FunctionVariantType[]): BaseValueObject | ArrayValueObject;
    private _handleSingleObject;
    private _handleMultiAreaRefs;
    private _getMultiAreaInfo;
}
