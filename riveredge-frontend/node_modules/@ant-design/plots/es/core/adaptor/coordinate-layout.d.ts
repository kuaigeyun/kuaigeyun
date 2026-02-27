import type { Adaptor, Options } from '../types';
/**
 * layout = 'horizontal' | 'vertical'
 * @param params
 * @returns
 */
export declare function coordinateLayout<P extends Adaptor<Options & {
    layout: 'horizontal' | 'vertical';
}>>(params: P): P;
/**
 * layout = 'horizontal' | 'vertical'
 * all children change
 * @param params
 * @returns
 */
export declare function allCoordinateLayout<P extends Adaptor<Options & {
    layout: 'horizontal' | 'vertical';
}>>(params: P): P;
