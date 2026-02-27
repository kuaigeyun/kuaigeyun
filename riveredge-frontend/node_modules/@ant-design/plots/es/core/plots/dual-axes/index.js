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
var DualAxes = /** @class */ (function (_super) {
    __extends(DualAxes, _super);
    function DualAxes() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'DualAxes';
        return _this;
    }
    /**
     * 获取 双轴图 默认配置项
     * 供外部使用
     */
    DualAxes.getDefaultOptions = function () {
        return {
            type: 'view',
            axis: {
                y: { title: false, tick: false },
                x: { title: false },
            },
            scale: {
                y: {
                    independent: true,
                    nice: true,
                },
            },
        };
    };
    /**
     * 获取 条形图 默认配置
     */
    DualAxes.prototype.getDefaultOptions = function () {
        return DualAxes.getDefaultOptions();
    };
    /**
     * 条形图适配器
     */
    DualAxes.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return DualAxes;
}(Plot));
export { DualAxes };
