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
import { Plot } from '../../base';
import { adaptor } from './adaptor';
var TinyLine = /** @class */ (function (_super) {
    __extends(TinyLine, _super);
    function TinyLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'TinyLine';
        return _this;
    }
    /**
     * 获取 迷你折线图 默认配置项
     * 供外部使用
     */
    TinyLine.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'line', axis: false }],
            // 使用该动画，会导致线形图-连接空值 一进入页面渲染不出来，必须要更改窗口尺寸触发重新渲染。建议动画暂时使用默认
            // animate: {
            //   enter: { type: 'growInX', duration: 500 },
            // },
            padding: 0,
            margin: 0,
            tooltip: false,
        };
    };
    /**
     * 获取 迷你折线图 默认配置
     */
    TinyLine.prototype.getDefaultOptions = function () {
        return TinyLine.getDefaultOptions();
    };
    /**
     * 迷你折线图适配器
     */
    TinyLine.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return TinyLine;
}(Plot));
export { TinyLine };
