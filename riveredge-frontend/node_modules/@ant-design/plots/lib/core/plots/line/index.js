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
exports.Line = void 0;
var base_1 = require("../../base");
var adaptor_1 = require("./adaptor");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'line';
        return _this;
    }
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    Line.getDefaultOptions = function () {
        return {
            type: 'view',
            scale: {
                y: { nice: true },
            },
            interaction: {
                tooltip: {
                    shared: true,
                },
            },
            axis: {
                y: { title: false },
                x: { title: false },
            },
            // 使用该动画，会导致线形图-连接空值 一进入页面渲染不出来，必须要更改窗口尺寸触发重新渲染。建议动画暂时使用默认
            // animate: {
            //   enter: { type: 'growInX' },
            // },
            children: [{ type: 'line' }],
        };
    };
    /**
     * 获取 折线图 默认配置
     */
    Line.prototype.getDefaultOptions = function () {
        return Line.getDefaultOptions();
    };
    /**
     * 折线图适配器
     */
    Line.prototype.getSchemaAdaptor = function () {
        return adaptor_1.adaptor;
    };
    return Line;
}(base_1.Plot));
exports.Line = Line;
