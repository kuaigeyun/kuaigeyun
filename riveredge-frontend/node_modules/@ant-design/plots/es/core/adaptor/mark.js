import { flow } from '../utils';
import { shapeStack } from './shape-stack';
/**
 * 根据图表类型新增一些高阶 Mark
 */
export function mark(params) {
    return flow(shapeStack)(params);
}
