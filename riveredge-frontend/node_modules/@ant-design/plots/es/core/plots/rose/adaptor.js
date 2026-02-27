import { flow, transformOptions } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(transformOptions)(params);
}
