"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversionTag = void 0;
var utils_1 = require("../utils");
var shapes_1 = require("./shapes");
var core_1 = require("./core");
var ConversionTag = /** @class */ (function (_super) {
    __extends(ConversionTag, _super);
    function ConversionTag(chart, options) {
        return _super.call(this, chart, options, { type: ConversionTag.tag }) || this;
    }
    ConversionTag.prototype.getConversionTagLayout = function () {
        var isVertical = this.direction === 'vertical';
        // Ensure elements are sorted by their position
        var elementsLayout = Array.from(this.getElementsLayout()).sort(function (a, b) {
            if (isVertical) {
                return a.y - b.y;
            }
            return a.x - b.x;
        });
        var _a = elementsLayout[0], firstX = _a.x, firstY = _a.y, firstHeight = _a.height, firstWidth = _a.width, firstData = _a.data;
        var valuePath = ['items', 0, 'value'];
        var preValue = (0, utils_1.get)(firstData, valuePath);
        var elementDistance = isVertical
            ? elementsLayout[1].y - firstY - firstHeight
            : elementsLayout[1].x - firstX - firstWidth;
        var tagLayout = [];
        var _b = this.attributes, _c = _b.size, size = _c === void 0 ? 40 : _c, _d = _b.arrowSize, arrowSize = _d === void 0 ? 20 : _d, _e = _b.spacing, spacing = _e === void 0 ? 4 : _e;
        elementsLayout.forEach(function (element, index) {
            if (index > 0) {
                var x = element.x, y = element.y, height = element.height, width = element.width, data = element.data, key = element.key;
                var currentValue = (0, utils_1.get)(data, valuePath);
                var halfSize = size / 2;
                if (isVertical) {
                    var arrowVertexX = x + width / 2;
                    var arrowVertexY = y;
                    tagLayout.push({
                        points: [
                            [arrowVertexX + halfSize, arrowVertexY - elementDistance + spacing],
                            [arrowVertexX + halfSize, arrowVertexY - arrowSize - spacing],
                            [arrowVertexX, arrowVertexY - spacing],
                            [arrowVertexX - halfSize, arrowVertexY - arrowSize - spacing],
                            [arrowVertexX - halfSize, arrowVertexY - elementDistance + spacing],
                        ],
                        center: [arrowVertexX, arrowVertexY - elementDistance / 2],
                        width: elementDistance,
                        value: [preValue, currentValue],
                        key: key,
                    });
                }
                else {
                    var arrowVertexX = x;
                    var arrowVertexY = y + height / 2;
                    tagLayout.push({
                        points: [
                            [x - elementDistance + spacing, arrowVertexY - halfSize],
                            [x - arrowSize - spacing, arrowVertexY - halfSize],
                            [arrowVertexX - spacing, arrowVertexY],
                            [x - arrowSize - spacing, arrowVertexY + halfSize],
                            [x - elementDistance + spacing, arrowVertexY + halfSize],
                        ],
                        center: [arrowVertexX - elementDistance / 2, arrowVertexY],
                        width: elementDistance,
                        value: [preValue, currentValue],
                        key: key,
                    });
                }
                preValue = currentValue;
            }
        });
        return tagLayout;
    };
    ConversionTag.prototype.render = function () {
        this.setDirection();
        this.drawConversionTag();
    };
    /** 根据 coordinate 确定方向 */
    ConversionTag.prototype.setDirection = function () {
        var coordinate = this.chart.getCoordinate();
        var transformations = (0, utils_1.get)(coordinate, 'options.transformations');
        var direction = 'horizontal';
        transformations.forEach(function (transformation) {
            if (transformation.includes('transpose')) {
                direction = 'vertical';
            }
        });
        this.direction = direction;
    };
    ConversionTag.prototype.drawConversionTag = function () {
        var _this = this;
        var conversionLayout = this.getConversionTagLayout();
        var _a = this.attributes, style = _a.style, _b = _a.text, textStyle = _b.style, formatter = _b.formatter;
        conversionLayout.forEach(function (layout) {
            var points = layout.points, center = layout.center, value = layout.value, key = layout.key;
            var prev = value[0], next = value[1];
            var x = center[0], y = center[1];
            var polygon = new shapes_1.Polygon({
                style: __assign({ points: points, fill: '#eee' }, style),
                id: "polygon-".concat(key),
            });
            var text = new shapes_1.Text({
                style: __assign({ x: x, y: y, text: (0, utils_1.isFunction)(formatter) ? formatter(prev, next) : ((next / prev) * 100).toFixed(2) + '%' }, textStyle),
                id: "text-".concat(key),
            });
            _this.appendChild(polygon);
            _this.appendChild(text);
        });
    };
    ConversionTag.prototype.update = function () {
        this.clear();
        this.drawConversionTag();
    };
    ConversionTag.prototype.destroy = function () {
        this.clear();
    };
    ConversionTag.tag = 'ConversionTag';
    return ConversionTag;
}(core_1.Annotation));
exports.ConversionTag = ConversionTag;
