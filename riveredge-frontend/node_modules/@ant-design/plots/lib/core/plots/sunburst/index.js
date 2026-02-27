"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sunburst = void 0;
var adaptor_1 = require("./adaptor");
var base_1 = require("../../base");
var Sunburst = /** @class */ (function (_super) {
    __extends(Sunburst, _super);
    function Sunburst() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'Sunburst';
        return _this;
    }
    /**
     * 获取 旭日图 默认配置项
     * 供外部使用
     */
    Sunburst.getDefaultOptions = function () {
        return { type: 'view', children: [{ type: 'sunburst' }] };
    };
    /**
     * 获取 旭日图 默认配置
     */
    Sunburst.prototype.getDefaultOptions = function () {
        return Sunburst.getDefaultOptions();
    };
    /**
     * 旭日图适配器
     */
    Sunburst.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Sunburst;
}(base_1.Plot));
exports.Sunburst = Sunburst;
