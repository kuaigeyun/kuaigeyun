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
exports.Histogram = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var Histogram = /** @class */ (function (_super) {
    __extends(Histogram, _super);
    function Histogram() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'Histogram';
        return _this;
    }
    /**
     * 获取 直方图 默认配置项
     * 供外部使用
     */
    Histogram.getDefaultOptions = function () {
        return {
            type: 'view',
            autoFit: true,
            axis: {
                y: { title: false },
                x: { title: false },
            },
            children: [
                {
                    type: 'rect',
                    transform: [{ type: 'binX', y: 'count' }],
                    interaction: {
                        elementHighlight: {
                            background: true,
                        },
                    },
                },
            ],
        };
    };
    /**
     * 获取 直方图 默认配置
     */
    Histogram.prototype.getDefaultOptions = function () {
        return Histogram.getDefaultOptions();
    };
    /**
     * 直方图适配器
     */
    Histogram.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Histogram;
}(base_1.Plot));
exports.Histogram = Histogram;
