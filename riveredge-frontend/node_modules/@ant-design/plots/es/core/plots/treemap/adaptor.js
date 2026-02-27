import { flow, transformOptions, dataTransform } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(dataTransform, mark, transformOptions)(params);
}
