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
exports.TinyRing = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var TinyRing = /** @class */ (function (_super) {
    __extends(TinyRing, _super);
    function TinyRing() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'TinyRing';
        return _this;
    }
    /**
     * 获取进度图默认配置项
     * 供外部使用
     */
    TinyRing.getDefaultOptions = function () {
        return {
            type: 'view',
            data: [],
            margin: 0,
            padding: 0,
            coordinate: { type: 'theta' },
            animate: { enter: { type: 'waveIn' } },
            interaction: { tooltip: false },
            tooltip: false,
            children: [
                {
                    type: 'interval',
                    axis: false,
                    legend: false,
                    encode: { y: function (d) { return d; }, color: function (d, idx) { return idx; } },
                },
            ],
        };
    };
    /**
     * 获取 进度图 默认配置
     */
    TinyRing.prototype.getDefaultOptions = function () {
        return TinyRing.getDefaultOptions();
    };
    /**
     * 迷你折线图适配器
     */
    TinyRing.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return TinyRing;
}(base_1.Plot));
exports.TinyRing = TinyRing;
