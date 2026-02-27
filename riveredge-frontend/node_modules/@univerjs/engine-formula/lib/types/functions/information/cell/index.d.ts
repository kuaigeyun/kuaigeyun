import { FunctionVariantType } from '../../../engine/reference-object/base-reference-object';
import { BaseFunction } from '../../base-function';
export declare class Cell extends BaseFunction {
    needsReferenceObject: boolean;
    minParams: number;
    maxParams: number;
    calculate(infoType: FunctionVariantType, reference: FunctionVariantType): FunctionVariantType;
    private _handleSingleObject;
    private _getWidthResult;
}
