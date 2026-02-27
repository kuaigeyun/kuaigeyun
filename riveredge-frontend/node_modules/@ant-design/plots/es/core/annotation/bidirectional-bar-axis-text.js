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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { get, isFunction, uniqBy, groupBy } from '../utils';
import { Annotation } from './core';
import { Text } from './shapes';
import { VERTICAL_MARGIN } from '../plots/bidirectional-bar/constants';
var BidirectionalBarAxisText = /** @class */ (function (_super) {
    __extends(BidirectionalBarAxisText, _super);
    function BidirectionalBarAxisText(chart, options) {
        return _super.call(this, chart, options, { type: BidirectionalBarAxisText.tag }) || this;
    }
    BidirectionalBarAxisText.prototype.render = function () {
        this.drawText();
    };
    BidirectionalBarAxisText.prototype.getBidirectionalBarAxisTextLayout = function () {
        var layout = this.attributes.layout;
        var isVertical = layout === 'vertical';
        var allElementsLayout = this.getElementsLayout();
        var elementsLayout = isVertical ? uniqBy(allElementsLayout, 'x') : uniqBy(allElementsLayout, 'y');
        var textPath = ['title'];
        var textLayout = [];
        var views = this.chart.getContext().views;
        var _a = get(views, [0, 'layout']), viewWidth = _a.width, viewHeight = _a.height;
        elementsLayout.forEach(function (element) {
            var x = element.x, y = element.y, height = element.height, width = element.width, data = element.data, key = element.key;
            var text = get(data, textPath);
            if (isVertical) {
                textLayout.push({
                    x: x + width / 2,
                    y: viewHeight,
                    text: text,
                    key: key,
                });
            }
            else {
                textLayout.push({
                    x: viewWidth,
                    y: y + height / 2,
                    text: text,
                    key: key,
                });
            }
        });
        /** 分组情况需要特殊处理 */
        if (uniqBy(textLayout, 'text').length !== textLayout.length) {
            textLayout = Object.values(groupBy(textLayout, 'text')).map(function (items) {
                var _a;
                var sum = items.reduce(function (pre, cur) {
                    return pre + (isVertical ? cur.x : cur.y);
                }, 0);
                return __assign(__assign({}, items[0]), (_a = {}, _a[isVertical ? 'x' : 'y'] = sum / items.length, _a));
            });
        }
        return textLayout;
    };
    BidirectionalBarAxisText.prototype.transformLabelStyle = function (style) {
        var removeLabel = {};
        var reg = /^label[A-Z]/;
        Object.keys(style).forEach(function (key) {
            if (reg.test(key)) {
                removeLabel[key.replace('label', '').replace(/^[A-Z]/, function (match) { return match.toLowerCase(); })] = style[key];
            }
        });
        return removeLabel;
    };
    BidirectionalBarAxisText.prototype.drawText = function () {
        var _this = this;
        var axisLayout = this.getBidirectionalBarAxisTextLayout();
        var _a = this.attributes, viewLayout = _a.layout, labelFormatter = _a.labelFormatter, textStyle = __rest(_a, ["layout", "labelFormatter"]);
        axisLayout.forEach(function (layout) {
            var x = layout.x, y = layout.y, text = layout.text, key = layout.key;
            var textNode = new Text({
                style: __assign({ x: x, y: y, text: isFunction(labelFormatter) ? labelFormatter(text) : text, wordWrap: true, wordWrapWidth: viewLayout === 'horizontal' ? VERTICAL_MARGIN * 2 : 120, maxLines: 2, textOverflow: 'ellipsis' }, _this.transformLabelStyle(textStyle)),
                id: "text-".concat(key),
            });
            _this.appendChild(textNode);
        });
    };
    BidirectionalBarAxisText.prototype.destroy = function () {
        this.clear();
    };
    /** 仅仅更新位置即可 */
    BidirectionalBarAxisText.prototype.update = function () {
        this.destroy();
        this.drawText();
    };
    BidirectionalBarAxisText.tag = 'BidirectionalBarAxisText';
    return BidirectionalBarAxisText;
}(Annotation));
export { BidirectionalBarAxisText };
