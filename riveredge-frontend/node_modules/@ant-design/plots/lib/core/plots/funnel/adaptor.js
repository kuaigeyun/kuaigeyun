"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var utils_1 = require("../../utils");
var adaptor_1 = require("../../adaptor");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * 图表差异化处理
     */
    var init = function (params) {
        var options = params.options;
        var xField = options.xField, colorField = options.colorField;
        if (!colorField) {
            (0, utils_1.set)(options, 'colorField', xField);
        }
        return params;
    };
    var transform = function (params) {
        var options = params.options;
        var compareField = options.compareField, transform = options.transform, _a = options.isTransposed, isTransposed = _a === void 0 ? true : _a, coordinate = options.coordinate;
        if (!transform) {
            if (compareField) {
                (0, utils_1.set)(options, 'transform', []);
            }
            else {
                (0, utils_1.set)(options, 'transform', [{ type: 'symmetryY' }]);
            }
        }
        if (!coordinate && isTransposed) {
            (0, utils_1.set)(options, 'coordinate', { transform: [{ type: 'transpose' }] });
        }
        return params;
    };
    var compare = function (params) {
        var options = params.options;
        var compareField = options.compareField, seriesField = options.seriesField, data = options.data, children = options.children, yField = options.yField, _a = options.isTransposed, isTransposed = _a === void 0 ? true : _a;
        if (compareField || seriesField) {
            var groupedData = Object.values((0, utils_1.groupBy)(data, function (item) { return item[compareField || seriesField]; }));
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
            (0, utils_1.set)(options, 'type', 'spaceFlex');
            (0, utils_1.set)(options, 'ratio', [1, 1]);
            (0, utils_1.set)(options, 'direction', isTransposed ? 'row' : 'col');
            delete options['seriesField'];
        }
        return params;
    };
    var tooltip = function (params) {
        var options = params.options;
        var tooltip = options.tooltip, xField = options.xField, yField = options.yField;
        if (!tooltip) {
            (0, utils_1.set)(options, 'tooltip', {
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
    return (0, utils_1.flow)(init, transform, compare, tooltip, adaptor_1.mark, utils_1.transformOptions)(params);
}
