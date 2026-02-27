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
import { DefaultTransformKey } from './type';
var Venn = /** @class */ (function (_super) {
    __extends(Venn, _super);
    function Venn() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'venn';
        return _this;
    }
    /**
     * 获取 韦恩图 默认配置项
     * 供外部使用
     */
    Venn.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'path' }],
            legend: {
                color: { itemMarker: 'circle' },
            },
            encode: { color: DefaultTransformKey.color, d: DefaultTransformKey.d },
        };
    };
    /**
     * 获取 韦恩图 默认配置
     */
    Venn.prototype.getDefaultOptions = function () {
        return Venn.getDefaultOptions();
    };
    /**
     * 韦恩图适配器
     */
    Venn.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Venn;
}(Plot));
export { Venn };
