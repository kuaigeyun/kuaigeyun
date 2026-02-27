"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var adaptor_1 = require("../../adaptor");
var utils_1 = require("../../utils");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    /**
     * @title 背景图
     * @description 通过新增 interval 实现
     */
    var background = function (params) {
        var options = params.options;
        /**
         * @description 解决更新问题
         */
        if ((0, utils_1.get)(options, 'children.length') > 1) {
            (0, utils_1.set)(options, 'children', [{ type: 'interval' }]);
        }
        var scale = options.scale, markBackground = options.markBackground, data = options.data, children = options.children, yField = options.yField;
        var domain = (0, utils_1.get)(scale, 'y.domain', []);
        if (markBackground && domain.length && (0, utils_1.isArray)(data)) {
            var domainMax_1 = 'domainMax';
            var backgroundData = data.map(function (item) {
                var _a;
                return __assign(__assign({ originData: __assign({}, item) }, (0, utils_1.omit)(item, yField)), (_a = {}, _a[domainMax_1] = domain[domain.length - 1], _a));
            });
            children.unshift(__assign({ type: 'interval', data: backgroundData, yField: domainMax_1, tooltip: false, style: {
                    fill: '#eee',
                }, label: false }, markBackground));
        }
        return params;
    };
    return (0, utils_1.flow)(background, adaptor_1.mark, utils_1.transformOptions)(params);
}
