import type { GraphOptions } from '../../types';
import type { FishboneOptions } from './types';
export declare const DEFAULT_OPTIONS: GraphOptions;
export declare function getFishboneOptions({ type, labelField }: Pick<FishboneOptions, 'type' | 'labelField'>): GraphOptions;
