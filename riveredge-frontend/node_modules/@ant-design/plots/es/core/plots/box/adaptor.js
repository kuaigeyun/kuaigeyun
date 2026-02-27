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
        var _a = params.options.boxType, boxType = _a === void 0 ? 'box' : _a;
        params.options.children[0].type = boxType;
        return params;
    };
    return flow(init, mark, transformOptions)(params);
}
