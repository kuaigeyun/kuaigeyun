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
var Violin = /** @class */ (function (_super) {
    __extends(Violin, _super);
    function Violin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'violin';
        return _this;
    }
    /**
     * 获取 折线图 默认配置项
     * 供外部使用
     */
    Violin.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [
                {
                    type: 'density',
                    sizeField: 'size',
                    tooltip: false,
                },
                {
                    type: 'boxplot',
                    shapeField: 'violin',
                    style: {
                        opacity: 0.5,
                        point: false,
                    },
                },
            ],
            animate: { enter: { type: 'fadeIn' } },
        };
    };
    /**
     * 获取 折线图 默认配置
     */
    Violin.prototype.getDefaultOptions = function () {
        return Violin.getDefaultOptions();
    };
    /**
     * 折线图适配器
     */
    Violin.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Violin;
}(Plot));
export { Violin };
