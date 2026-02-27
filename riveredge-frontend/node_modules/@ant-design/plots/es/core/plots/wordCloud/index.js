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
var WordCloud = /** @class */ (function (_super) {
    __extends(WordCloud, _super);
    function WordCloud() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'WordCloud';
        return _this;
    }
    /**
     * 获取 词云图 默认配置项
     * 供外部使用
     */
    WordCloud.getDefaultOptions = function () {
        return { type: 'view', legend: false, children: [{ type: 'wordCloud' }] };
    };
    /**
     * 获取 词云图 默认配置
     */
    WordCloud.prototype.getDefaultOptions = function () {
        return WordCloud.getDefaultOptions();
    };
    /**
     * 词云图适配器
     */
    WordCloud.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return WordCloud;
}(Plot));
export { WordCloud };
