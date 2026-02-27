import { flow, transformOptions, get, set } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        set(params, 'options.coordinate', { type: get(params, 'options.coordinateType', 'polar') });
        return params;
    };
    return flow(init, transformOptions)(params);
}
