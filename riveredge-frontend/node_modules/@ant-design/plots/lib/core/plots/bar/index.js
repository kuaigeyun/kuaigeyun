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
exports.Bar = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var shape_1 = require("./shape");
(0, shape_1.reisterShape)();
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'Bar';
        return _this;
    }
    /**
     * 获取 条形图 默认配置项
     * 供外部使用
     */
    Bar.getDefaultOptions = function () {
        return {
            type: 'view',
            coordinate: { transform: [{ type: 'transpose' }] },
            children: [{ type: 'interval' }],
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
                elementHighlight: {
                    background: true,
                },
            },
        };
    };
    /**
     * 获取 条形图 默认配置
     */
    Bar.prototype.getDefaultOptions = function () {
        return Bar.getDefaultOptions();
    };
    /**
     * 条形图适配器
     */
    Bar.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Bar;
}(base_1.Plot));
exports.Bar = Bar;
