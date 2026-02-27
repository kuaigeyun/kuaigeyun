import { flow, dataTransform, transformOptions } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(dataTransform, transformOptions)(params);
}
