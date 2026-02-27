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
exports.Stock = exports.DEFAULT_COLORS = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
exports.DEFAULT_COLORS = ['#26a69a', '#999999', '#ef5350'];
var Stock = /** @class */ (function (_super) {
    __extends(Stock, _super);
    function Stock() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'stock';
        return _this;
    }
    /**
     * 获取 股票图 默认配置项
     * 供外部使用
     */
    Stock.getDefaultOptions = function () {
        return {
            type: 'view',
            scale: {
                color: {
                    domain: [-1, 0, 1],
                    range: exports.DEFAULT_COLORS,
                },
                y: { nice: true },
            },
            children: [
                // line shadow
                {
                    type: 'link',
                },
                {
                    type: 'interval',
                },
            ],
            axis: {
                x: { title: false, grid: false },
                y: { title: false, grid: true, gridLineDash: null },
            },
            animate: { enter: { type: 'scaleInY' } },
            interaction: {
                tooltip: {
                    shared: true,
                    marker: false,
                    groupName: false,
                    crosshairs: true,
                },
            },
        };
    };
    /**
     * 获取 股票图 默认配置
     */
    Stock.prototype.getDefaultOptions = function () {
        return Stock.getDefaultOptions();
    };
    /**
     * 股票图适配器
     */
    Stock.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Stock;
}(base_1.Plot));
exports.Stock = Stock;
