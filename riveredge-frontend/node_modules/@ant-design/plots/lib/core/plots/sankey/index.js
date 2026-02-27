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
exports.Sankey = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var Sankey = /** @class */ (function (_super) {
    __extends(Sankey, _super);
    function Sankey() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'sankey';
        return _this;
    }
    /**
     * 获取 桑基图 默认配置项
     * 供外部使用
     */
    Sankey.getDefaultOptions = function () {
        return { type: 'view', children: [{ type: 'sankey' }] };
    };
    /**
     * 获取 桑基图 默认配置
     */
    Sankey.prototype.getDefaultOptions = function () {
        return Sankey.getDefaultOptions();
    };
    /**
     * 桑基图适配器
     */
    Sankey.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Sankey;
}(base_1.Plot));
exports.Sankey = Sankey;
