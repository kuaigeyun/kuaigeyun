import type { GraphOptions } from '../../types';
import type { DendrogramOptions } from './types';
export declare const DEFAULT_OPTIONS: GraphOptions;
export declare const getDendrogramOptions: ({ direction, compact, }: Pick<DendrogramOptions, "direction" | "compact">) => GraphOptions;
