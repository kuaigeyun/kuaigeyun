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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotation = void 0;
var g_1 = require("@antv/g");
var utils_1 = require("../utils");
var Annotation = /** @class */ (function (_super) {
    __extends(Annotation, _super);
    function Annotation(chart, config, defaultOptions) {
        var _this = _super.call(this, { style: (0, utils_1.mergeWithArrayCoverage)(defaultOptions, config) }) || this;
        _this.chart = chart;
        return _this;
    }
    Annotation.prototype.connectedCallback = function () {
        this.render(this.attributes, this);
        this.bindEvents(this.attributes, this);
    };
    Annotation.prototype.disconnectedCallback = function () { };
    Annotation.prototype.attributeChangedCallback = function (name) { };
    Annotation.prototype.update = function (attr, animate) {
        var _a;
        this.attr((0, utils_1.mergeWithArrayCoverage)({}, this.attributes, attr || {}));
        return (_a = this.render) === null || _a === void 0 ? void 0 : _a.call(this, this.attributes, this, animate);
    };
    Annotation.prototype.clear = function () {
        this.removeChildren();
    };
    Annotation.prototype.getElementsLayout = function () {
        var canvas = this.chart.getContext().canvas;
        var elements = canvas.document.getElementsByClassName('element');
        var elementsLayout = [];
        elements.forEach(function (element) {
            //@ts-expect-error
            var bbox = element.getBBox();
            var x = bbox.x, y = bbox.y, width = bbox.width, height = bbox.height;
            var data = element['__data__'];
            elementsLayout.push({
                bbox: bbox,
                x: x,
                y: y,
                width: width,
                height: height,
                key: data.key,
                data: data,
            });
        });
        return elementsLayout;
    };
    Annotation.prototype.bindEvents = function (attributes, container) { };
    return Annotation;
}(g_1.CustomElement));
exports.Annotation = Annotation;
