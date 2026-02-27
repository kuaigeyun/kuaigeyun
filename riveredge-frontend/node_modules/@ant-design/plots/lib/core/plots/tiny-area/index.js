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
exports.TinyArea = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var TinyArea = /** @class */ (function (_super) {
    __extends(TinyArea, _super);
    function TinyArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'TinyArea';
        return _this;
    }
    /**
     * 获取 面积图 默认配置项
     * 供外部使用
     */
    TinyArea.getDefaultOptions = function () {
        return {
            type: 'view',
            animate: {
                enter: { type: 'growInX', duration: 500 },
            },
            children: [{ type: 'area', axis: false }],
            padding: 0,
            margin: 0,
            tooltip: false,
        };
    };
    /**
     * 获取 面积图 默认配置
     */
    TinyArea.prototype.getDefaultOptions = function () {
        return TinyArea.getDefaultOptions();
    };
    /**
     * 面积图适配器
     */
    TinyArea.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return TinyArea;
}(base_1.Plot));
exports.TinyArea = TinyArea;
