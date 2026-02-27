import type { GraphOptions } from '../../types';
import type { IndentedTreeOptions } from './types';
export declare const DEFAULT_OPTIONS: GraphOptions;
export declare const getIndentedTreeOptions: ({ type, nodeMinWidth, nodeMaxWidth, direction, labelField, }: Pick<IndentedTreeOptions, "type" | "nodeMinWidth" | "nodeMaxWidth" | "direction" | "labelField">) => GraphOptions;
