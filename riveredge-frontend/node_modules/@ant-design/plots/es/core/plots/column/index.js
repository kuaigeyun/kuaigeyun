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
import { adaptor } from '../bar/adaptor';
import { reisterShape } from './shape';
reisterShape();
var Column = /** @class */ (function (_super) {
    __extends(Column, _super);
    function Column() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'column';
        return _this;
    }
    Column.getDefaultOptions = function () {
        return {
            type: 'view',
            scale: {
                y: { nice: true },
            },
            interaction: {
                tooltip: {
                    shared: true,
                },
                elementHighlight: {
                    background: true,
                },
            },
            axis: {
                y: { title: false },
                x: { title: false },
            },
            children: [
                {
                    type: 'interval',
                },
            ],
        };
    };
    Column.prototype.getDefaultOptions = function () {
        return Column.getDefaultOptions();
    };
    Column.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Column;
}(Plot));
export { Column };
