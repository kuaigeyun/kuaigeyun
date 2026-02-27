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
var Funnel = /** @class */ (function (_super) {
    __extends(Funnel, _super);
    function Funnel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'column';
        return _this;
    }
    /**
     * 获取 漏斗图 默认配置项
     * 供外部使用
     */
    Funnel.getDefaultOptions = function () {
        return {
            type: 'view',
            scale: { x: { padding: 0 } },
            animate: { enter: { type: 'fadeIn' } },
            axis: false,
            shapeField: 'funnel',
            label: {
                position: 'inside',
                transform: [{ type: 'contrastReverse' }],
            },
            children: [
                {
                    type: 'interval',
                },
            ],
        };
    };
    /**
     * 获取 漏斗图 默认配置
     */
    Funnel.prototype.getDefaultOptions = function () {
        return Funnel.getDefaultOptions();
    };
    /**
     * 漏斗图适配器
     */
    Funnel.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Funnel;
}(Plot));
export { Funnel };
