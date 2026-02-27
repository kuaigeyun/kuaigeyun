import type { DrawData } from '@antv/g6';
import { BaseTransform } from '@antv/g6';
/**
 * ArrangeEdgeZIndex transform, specifically for indented tree layout
 */
export declare class ArrangeEdgeZIndex extends BaseTransform {
    beforeDraw(input: DrawData): DrawData;
}
