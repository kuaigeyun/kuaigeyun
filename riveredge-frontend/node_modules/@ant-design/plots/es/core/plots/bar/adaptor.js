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
import { mark } from '../../adaptor';
import { flow, transformOptions, get, isArray, set, omit } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    /**
     * @title 背景图
     * @description 通过新增 interval 实现
     */
    var background = function (params) {
        var options = params.options;
        /**
         * @description 解决更新问题
         */
        if (get(options, 'children.length') > 1) {
            set(options, 'children', [{ type: 'interval' }]);
        }
        var scale = options.scale, markBackground = options.markBackground, data = options.data, children = options.children, yField = options.yField;
        var domain = get(scale, 'y.domain', []);
        if (markBackground && domain.length && isArray(data)) {
            var domainMax_1 = 'domainMax';
            var backgroundData = data.map(function (item) {
                var _a;
                return __assign(__assign({ originData: __assign({}, item) }, omit(item, yField)), (_a = {}, _a[domainMax_1] = domain[domain.length - 1], _a));
            });
            children.unshift(__assign({ type: 'interval', data: backgroundData, yField: domainMax_1, tooltip: false, style: {
                    fill: '#eee',
                }, label: false }, markBackground));
        }
        return params;
    };
    return flow(background, mark, transformOptions)(params);
}
