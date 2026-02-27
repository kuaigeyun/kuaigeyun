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
var TinyProgress = /** @class */ (function (_super) {
    __extends(TinyProgress, _super);
    function TinyProgress() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'TinyProgress';
        return _this;
    }
    /**
     * 获取 进度图 默认配置项
     * 供外部使用
     */
    TinyProgress.getDefaultOptions = function () {
        return {
            type: 'view',
            data: [],
            margin: 0,
            padding: 0,
            tooltip: false,
            children: [
                {
                    interaction: { tooltip: false },
                    coordinate: { transform: [{ type: 'transpose' }] },
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
    TinyProgress.prototype.getDefaultOptions = function () {
        return TinyProgress.getDefaultOptions();
    };
    /**
     * 迷你折线图适配器
     */
    TinyProgress.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return TinyProgress;
}(Plot));
export { TinyProgress };
