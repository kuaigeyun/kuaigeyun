import type { DrawData } from '@antv/g6';
import { BaseTransform } from '@antv/g6';
/**
 * HTML 元素的默认原点位置在左上角，而 G6 的默认原点位置在中心，所以需要调整 dx 和 dy
 */
export declare class TranslateReactNodeOrigin extends BaseTransform {
    beforeDraw(input: DrawData): DrawData;
}
