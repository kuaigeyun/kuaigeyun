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
import { WATERFALL_VALUE } from './constants';
var Waterfall = /** @class */ (function (_super) {
    __extends(Waterfall, _super);
    function Waterfall() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /** 图表类型 */
        _this.type = 'waterfall';
        return _this;
    }
    Waterfall.getDefaultOptions = function () {
        return {
            type: 'view',
            legend: null,
            tooltip: {
                field: WATERFALL_VALUE,
                valueFormatter: '~s',
                name: 'value',
            },
            axis: {
                y: {
                    title: null,
                    labelFormatter: '~s',
                },
                x: {
                    title: null,
                },
            },
            children: [
                {
                    type: 'interval',
                    interaction: {
                        elementHighlight: {
                            background: true,
                        },
                    },
                },
            ],
        };
    };
    Waterfall.prototype.getDefaultOptions = function () {
        return Waterfall.getDefaultOptions();
    };
    Waterfall.prototype.getSchemaAdaptor = function () {
        return adaptor;
    };
    return Waterfall;
}(Plot));
export { Waterfall };
