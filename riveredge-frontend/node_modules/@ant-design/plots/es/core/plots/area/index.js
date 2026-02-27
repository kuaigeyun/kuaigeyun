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
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'area';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    Area.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'area' }],
            scale: {
                y: { nice: true },
            },
            axis: {
                y: { title: false },
                x: { title: false },
            },
            interaction: {
                tooltip: {
                    shared: true,
                },
            },
        };
    };
    /**
     * 获取 面积图 默认配置
     */
    Area.prototype.getDefaultOptions = function () {
        return Area.getDefaultOptions();
    };
    /**
     * 面积图适配器
     */
    Area.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Area;
}(Plot));
export { Area };
