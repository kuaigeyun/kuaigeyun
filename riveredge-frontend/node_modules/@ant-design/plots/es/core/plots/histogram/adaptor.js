import { flow, transformOptions, assign, isNumber, divide, ceil, get } from '../../utils';
import { mark } from '../../adaptor';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    var transformHistogramConfig = function (params) {
        var options = params.options;
        var data = options.data, binNumber = options.binNumber, binWidth = options.binWidth, children = options.children, _a = options.channel, channel = _a === void 0 ? 'count' : _a;
        var targetTransform = get(children, '[0].transform[0]', {});
        if (isNumber(binWidth)) {
            assign(targetTransform, { thresholds: ceil(divide(data.length, binWidth)), y: channel });
            return params;
        }
        if (isNumber(binNumber)) {
            assign(targetTransform, { thresholds: binNumber, y: channel });
            return params;
        }
        return params;
    };
    return flow(transformHistogramConfig, mark, transformOptions)(params);
}
