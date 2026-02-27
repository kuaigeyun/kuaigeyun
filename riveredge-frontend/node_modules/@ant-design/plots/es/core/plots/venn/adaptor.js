import { flow, isArray, set, transformOptions } from '../../utils';
import { DefaultTransformKey } from './type';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        var options = params.options;
        var data = options.data, setsField = options.setsField, sizeField = options.sizeField;
        if (isArray(data)) {
            set(options, 'data', {
                type: 'inline',
                value: data,
                transform: [
                    {
                        type: 'venn',
                        sets: setsField,
                        size: sizeField,
                        as: [DefaultTransformKey.color, DefaultTransformKey.d],
                    },
                ],
            });
            set(options, 'colorField', DefaultTransformKey.color);
            set(options, ['children', '0', 'encode', 'd'], DefaultTransformKey.d);
        }
        return params;
    };
    return flow(init, transformOptions)(params);
}
