"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var adaptor_1 = require("../../adaptor");
var utils_1 = require("../../utils");
var defaultTransform = function (params) {
    var options = params.options;
    var data = options.data;
    var transformLinks = [
        {
            type: 'custom',
            callback: function (datum) { return ({ links: datum }); },
        },
    ];
    if ((0, utils_1.isArray)(data)) {
        if (data.length > 0) {
            (0, utils_1.set)(options, 'data', {
                value: data,
                transform: transformLinks,
            });
        }
        else {
            delete options.children;
        }
    }
    else if ((0, utils_1.get)(data, 'type') === 'fetch' && (0, utils_1.get)(data, 'value')) {
        var transform = (0, utils_1.get)(data, 'transform');
        if (!(0, utils_1.isArray)(transform)) {
            (0, utils_1.set)(data, 'transform', transformLinks);
        }
    }
    return params;
};
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    return (0, utils_1.flow)(utils_1.dataTransform, defaultTransform, adaptor_1.mark, utils_1.transformOptions)(params);
}
