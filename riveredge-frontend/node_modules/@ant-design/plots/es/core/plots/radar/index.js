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
import { adaptor } from './adaptor';
import { Plot } from '../../base';
var Radar = /** @class */ (function (_super) {
    __extends(Radar, _super);
    function Radar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'radar';
        return _this;
    }
    /**
     * 获取 雷达图 默认配置项
     * 供外部使用
     */
    Radar.getDefaultOptions = function () {
        return {
            axis: {
                x: { grid: true, line: true },
                y: { zIndex: 1, title: false, line: true, nice: true },
            },
            meta: { x: { padding: 0.5, align: 0 } },
            interaction: { tooltip: { style: { crosshairsLineDash: [4, 4] } } },
            children: [{ type: 'line' }],
            // 有  polar 和 radar 两种极坐标形式
            coordinateType: 'polar',
        };
    };
    /**
     * 获取 雷达图 默认配置
     */
    Radar.prototype.getDefaultOptions = function () {
        return Radar.getDefaultOptions();
    };
    /**
     * 雷达图适配器
     */
    Radar.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Radar;
}(Plot));
export { Radar };
