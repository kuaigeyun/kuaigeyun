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
    var transformHistogramConfig = function (params) {
        var options = params.options;
        var data = options.data, binNumber = options.binNumber, binWidth = options.binWidth, children = options.children, _a = options.channel, channel = _a === void 0 ? 'count' : _a;
        var targetTransform = (0, utils_1.get)(children, '[0].transform[0]', {});
        if ((0, utils_1.isNumber)(binWidth)) {
            (0, utils_1.assign)(targetTransform, { thresholds: (0, utils_1.ceil)((0, utils_1.divide)(data.length, binWidth)), y: channel });
            return params;
        }
        if ((0, utils_1.isNumber)(binNumber)) {
            (0, utils_1.assign)(targetTransform, { thresholds: binNumber, y: channel });
            return params;
        }
        return params;
    };
    return (0, utils_1.flow)(transformHistogramConfig, adaptor_1.mark, utils_1.transformOptions)(params);
}
