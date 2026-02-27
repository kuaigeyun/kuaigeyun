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
var Base = /** @class */ (function (_super) {
    __extends(Base, _super);
    function Base() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'base';
        return _this;
    }
    /**
     * 获取 万能图 默认配置项
     * 供外部使用
     */
    Base.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'line' }],
        };
    };
    /**
     * 获取 万能图 默认配置
     */
    Base.prototype.getDefaultOptions = function () {
        return Base.getDefaultOptions();
    };
    /**
     * 万能图适配器
     */
    Base.prototype.getSchemaAdaptor = function () {
        return function (params) { return params; };
    };
    return Base;
}(Plot));
export { Base };
