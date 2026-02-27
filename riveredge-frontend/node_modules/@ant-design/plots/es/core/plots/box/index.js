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
var Box = /** @class */ (function (_super) {
    __extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'box';
        return _this;
    }
    /**
     * 获取箱线图默认配置项
     * 供外部使用
     */
    Box.getDefaultOptions = function () {
        return {
            type: 'view',
            children: [{ type: 'box' }],
            axis: {
                y: { title: false },
                x: { title: false },
            },
            // 默认 tooltip
            tooltip: {
                items: [
                    { name: 'min', channel: 'y' },
                    { name: 'q1', channel: 'y1' },
                    { name: 'q2', channel: 'y2' },
                    { name: 'q3', channel: 'y3' },
                    { name: 'max', channel: 'y4' },
                ],
            },
        };
    };
    /**
     * 获取 折线图 默认配置
     */
    Box.prototype.getDefaultOptions = function () {
        return Box.getDefaultOptions();
    };
    /**
     * 折线图适配器
     */
    Box.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Box;
}(Plot));
export { Box };
