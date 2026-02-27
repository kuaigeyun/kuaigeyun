import { BaseValueObject } from '../../../engine/value-object/base-value-object';
import { BaseFunction } from '../../base-function';
export declare class ImageFunction extends BaseFunction {
    minParams: number;
    maxParams: number;
    calculate(source: BaseValueObject, altText?: BaseValueObject, sizing?: BaseValueObject, height?: BaseValueObject, width?: BaseValueObject): BaseValueObject;
    private _handleSingleObject;
}
