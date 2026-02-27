import { flow, transformOptions } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        var data = params.options.data;
        params.options.data = {
            value: data,
        };
        return params;
    };
    return flow(init, mark, transformOptions)(params);
}
