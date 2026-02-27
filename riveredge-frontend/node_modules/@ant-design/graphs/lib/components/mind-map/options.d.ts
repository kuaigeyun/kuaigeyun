import type { GraphOptions } from '../../types';
import type { MindMapOptions } from './types';
export declare const DEFAULT_OPTIONS: GraphOptions;
export declare function getMindMapOptions({ type, direction, nodeMinWidth, nodeMaxWidth, labelField, }: Pick<MindMapOptions, 'type' | 'nodeMaxWidth' | 'nodeMinWidth' | 'direction' | 'labelField'>): GraphOptions;
