import { flow, transformOptions, isNumber, set } from '../../utils';
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
        var percent = params.options.percent;
        if (isNumber(percent)) {
            set(params, 'options.data', percent);
            delete params.options.percent;
        }
        return params;
    };
    return flow(init, mark, transformOptions)(params);
}
