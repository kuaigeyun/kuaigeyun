import { mark } from '../../adaptor';
import { flow, get, isArray, set, dataTransform, transformOptions } from '../../utils';
var defaultTransform = function (params) {
    var options = params.options;
    var data = options.data;
    var transformLinks = [
        {
            type: 'custom',
            callback: function (datum) { return ({ links: datum }); },
        },
    ];
    if (isArray(data)) {
        if (data.length > 0) {
            set(options, 'data', {
                value: data,
                transform: transformLinks,
            });
        }
        else {
            delete options.children;
        }
    }
    else if (get(data, 'type') === 'fetch' && get(data, 'value')) {
        var transform = get(data, 'transform');
        if (!isArray(transform)) {
            set(data, 'transform', transformLinks);
        }
    }
    return params;
};
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    return flow(dataTransform, defaultTransform, mark, transformOptions)(params);
}
