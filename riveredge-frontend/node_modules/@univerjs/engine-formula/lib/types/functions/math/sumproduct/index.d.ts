import { BaseValueObject } from '../../../engine/value-object/base-value-object';
import { BaseFunction } from '../../base-function';
export declare class Sumproduct extends BaseFunction {
    minParams: number;
    maxParams: number;
    calculate(array1: BaseValueObject, ...variants: BaseValueObject[]): BaseValueObject;
    /**
     * Validate all variants:
     * - propagate first error BaseValueObject
     * - ensure array dimensions are compatible with base (rowCount/columnCount)
     * Returns an ErrorValueObject / BaseValueObject on failure, or null when OK.
     */
    private _validateVariants;
    /**
     * Core SUMPRODUCT loop.
     * - baseArray already contains numeric values from array1
     * - variants may be scalar or array; non-number cells are treated as 0
     * - any error cell short-circuits with that error
     */
    private _sumProduct;
    /**
     * Get the value object of a variant at (r, c).
     * - For scalar variants, returns the variant itself.
     * - For array variants, returns the cell at (r, c).
     *   If cell does not exist, returns null and let caller convert to #VALUE!.
     */
    private _getVariantCell;
    private _initArray1;
    private _getResultArrayByArray1;
}
