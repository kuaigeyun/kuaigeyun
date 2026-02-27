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
exports.Gauge = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var Gauge = /** @class */ (function (_super) {
    __extends(Gauge, _super);
    function Gauge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'Gauge';
        return _this;
    }
    /**
     * 获取 仪表盘 默认配置项
     * 供外部使用
     */
    Gauge.getDefaultOptions = function () {
        return {
            type: 'view',
            legend: false,
            children: [{ type: 'gauge' }],
        };
    };
    /**
     * 获取 仪表盘 默认配置
     */
    Gauge.prototype.getDefaultOptions = function () {
        return Gauge.getDefaultOptions();
    };
    /**
     * 仪表盘适配器
     */
    Gauge.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Gauge;
}(base_1.Plot));
exports.Gauge = Gauge;
