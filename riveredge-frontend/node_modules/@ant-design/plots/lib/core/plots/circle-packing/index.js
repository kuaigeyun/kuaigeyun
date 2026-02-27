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
exports.CirclePacking = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var CirclePacking = /** @class */ (function (_super) {
    __extends(CirclePacking, _super);
    function CirclePacking() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'CirclePacking';
        return _this;
    }
    /**
     * 获取 circle packing 默认配置项
     * 供外部使用
     */
    CirclePacking.getDefaultOptions = function () {
        return {
            legend: false,
            type: 'view',
            children: [
                {
                    type: 'pack',
                    encode: {
                        color: 'depth',
                    }
                },
            ],
        };
    };
    /**
     * 获取 打包图 默认配置
     */
    CirclePacking.prototype.getDefaultOptions = function () {
        return CirclePacking.getDefaultOptions();
    };
    /**
     * 打包图适配器
     */
    CirclePacking.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return CirclePacking;
}(base_1.Plot));
exports.CirclePacking = CirclePacking;
