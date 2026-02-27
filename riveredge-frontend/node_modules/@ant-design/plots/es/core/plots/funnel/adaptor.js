import { flow, transformOptions, set, groupBy } from '../../utils';
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
        var options = params.options;
        var xField = options.xField, colorField = options.colorField;
        if (!colorField) {
            set(options, 'colorField', xField);
        }
        return params;
    };
    var transform = function (params) {
        var options = params.options;
        var compareField = options.compareField, transform = options.transform, _a = options.isTransposed, isTransposed = _a === void 0 ? true : _a, coordinate = options.coordinate;
        if (!transform) {
            if (compareField) {
                set(options, 'transform', []);
            }
            else {
                set(options, 'transform', [{ type: 'symmetryY' }]);
            }
        }
        if (!coordinate && isTransposed) {
            set(options, 'coordinate', { transform: [{ type: 'transpose' }] });
        }
        return params;
    };
    var compare = function (params) {
        var options = params.options;
        var compareField = options.compareField, seriesField = options.seriesField, data = options.data, children = options.children, yField = options.yField, _a = options.isTransposed, isTransposed = _a === void 0 ? true : _a;
        if (compareField || seriesField) {
            var groupedData = Object.values(groupBy(data, function (item) { return item[compareField || seriesField]; }));
            children[0].data = groupedData[0];
            children.push({
                type: 'interval',
                data: groupedData[1],
                // @ts-ignore
                yField: function (item) { return -item[yField]; },
            });
            delete options['compareField'];
            delete options.data;
        }
        if (seriesField) {
            set(options, 'type', 'spaceFlex');
            set(options, 'ratio', [1, 1]);
            set(options, 'direction', isTransposed ? 'row' : 'col');
            delete options['seriesField'];
        }
        return params;
    };
    var tooltip = function (params) {
        var options = params.options;
        var tooltip = options.tooltip, xField = options.xField, yField = options.yField;
        if (!tooltip) {
            set(options, 'tooltip', {
                title: false,
                items: [
                    function (d) {
                        return { name: d[xField], value: d[yField] };
                    },
                ],
            });
        }
        return params;
    };
    return flow(init, transform, compare, tooltip, mark, transformOptions)(params);
}
