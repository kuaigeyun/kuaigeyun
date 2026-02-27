import type { GraphOptions, ParsedGraphOptions } from '../../types';
/**
 * 合并多个图配置项，优先级从左到右递增
 * @param options 图配置项列表
 * @returns 最后用于渲染的配置项
 */
export declare function mergeOptions(...options: GraphOptions[]): ParsedGraphOptions;
