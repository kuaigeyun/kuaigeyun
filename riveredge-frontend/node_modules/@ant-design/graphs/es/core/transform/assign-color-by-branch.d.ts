import type { BaseTransformOptions, CategoricalPalette, DrawData, RuntimeContext } from '@antv/g6';
import { BaseTransform } from '@antv/g6';
export interface AssignColorByBranchOptions extends BaseTransformOptions {
    colors?: CategoricalPalette;
}
export declare class AssignColorByBranch extends BaseTransform {
    static defaultOptions: Partial<AssignColorByBranchOptions>;
    constructor(context: RuntimeContext, options: AssignColorByBranchOptions);
    beforeDraw(input: DrawData): DrawData;
}
