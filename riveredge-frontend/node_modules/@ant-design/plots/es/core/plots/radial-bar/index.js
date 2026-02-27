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
var RadialBar = /** @class */ (function (_super) {
    __extends(RadialBar, _super);
    function RadialBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'radial';
        return _this;
    }
    /**
     * 获取 玉珏图 默认配置项
     * 供外部使用
     */
    RadialBar.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'interval' }],
            coordinate: { type: 'radial', innerRadius: 0.1, outerRadius: 1, endAngle: Math.PI },
            animate: { enter: { type: 'waveIn', duration: 800 } },
            axis: {
                y: {
                    nice: true,
                    labelAutoHide: true,
                    labelAutoRotate: false,
                },
                x: {
                    title: false,
                    nice: true,
                    labelAutoRotate: false,
                    labelAutoHide: { type: 'equidistance', cfg: { minGap: 6 } },
                },
            },
        };
    };
    /**
     * 获取 玉珏图 默认配置
     */
    RadialBar.prototype.getDefaultOptions = function () {
        return RadialBar.getDefaultOptions();
    };
    /**
     * 玉珏图适配器
     */
    RadialBar.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return RadialBar;
}(Plot));
export { RadialBar };
