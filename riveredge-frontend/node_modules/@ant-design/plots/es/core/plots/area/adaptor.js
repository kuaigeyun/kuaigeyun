import { flow, transformOptions } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(mark, transformOptions)(params);
}
