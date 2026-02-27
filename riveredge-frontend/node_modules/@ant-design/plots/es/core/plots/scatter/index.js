var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Plot } from '../../base';
import { adaptor } from './adaptor';
var Scatter = /** @class */ (function (_super) {
    __extends(Scatter, _super);
    function Scatter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'scatter';
        return _this;
    }
    /**
     * 获取 散点图 默认配置项
     * 供外部使用
     */
    Scatter.getDefaultOptions = function () {
        return {
            axis: {
                y: { title: false },
                x: { title: false },
            },
            legend: {
                size: false,
            },
            children: [{ type: 'point' }],
        };
    };
    /**
     * 获取 散点图 默认配置
     */
    Scatter.prototype.getDefaultOptions = function () {
        return Scatter.getDefaultOptions();
    };
    /**
     * 散点图适配器
     */
    Scatter.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Scatter;
}(Plot));
export { Scatter };
