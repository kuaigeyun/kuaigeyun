import type { Adaptor } from '../types';
/**
 * Data transformation.
 * @description `data` to `data.value`
 * If `data` is not an object or does not have a `value` property, it will be set to `data.value`.
 * If `data` is an object without a `type` property, it will be set to `data.value`.
 * @param params - The adaptor parameters.
 * @returns The updated parameters with transformed data.
 */
export declare const dataTransform: (params: Adaptor) => Adaptor;
