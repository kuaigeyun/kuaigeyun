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
import { adaptor, DEFAULT_COLORS } from './adaptor';
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'bullet';
        return _this;
    }
    /**
     * 获取 子弹图 默认配置项
     * 供外部使用
     */
    Bullet.getDefaultOptions = function () {
        return {
            type: 'view',
            scale: {
                color: {
                    range: DEFAULT_COLORS,
                },
            },
            legend: {
                color: {
                    itemMarker: function (d) {
                        return d === 'targets' ? 'line' : 'square';
                    },
                },
            },
            axis: {
                y: { title: false },
                x: { title: false },
            },
            children: [
                {
                    type: 'interval',
                    style: { maxWidth: 30, zIndex: -2 },
                    axis: { y: { grid: true, gridLineWidth: 2 } },
                },
                {
                    type: 'interval',
                    style: { maxWidth: 20, zIndex: -1 },
                    transform: [{ type: 'stackY' }],
                },
                {
                    type: 'point',
                    encode: { size: 8, shape: 'line' },
                },
            ],
            interaction: { tooltip: { shared: true } },
            coordinate: { transform: [{ type: 'transpose' }] },
        };
    };
    /**
     * 获取 子弹图 默认配置
     */
    Bullet.prototype.getDefaultOptions = function () {
        return Bullet.getDefaultOptions();
    };
    /**
     * 子弹图适配器
     */
    Bullet.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Bullet;
}(Plot));
export { Bullet };
