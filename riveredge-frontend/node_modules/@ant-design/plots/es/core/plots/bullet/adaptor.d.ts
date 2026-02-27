import type { Adaptor } from '../../types';
import type { BulletOptions } from './type';
export declare const DEFAULT_COLORS: string[];
type Params = Adaptor<BulletOptions>;
/**
 * @param chart
 * @param options
 */
export declare function adaptor(params: Params): any;
export {};
