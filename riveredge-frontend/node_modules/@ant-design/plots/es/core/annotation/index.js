import { ANNOTATION_LIST } from '../constants';
import { ConversionTag } from './conversion-tag';
import { BidirectionalBarAxisText } from './bidirectional-bar-axis-text';
var Annotaion = { ConversionTag: ConversionTag, BidirectionalBarAxisText: BidirectionalBarAxisText };
var Controller = /** @class */ (function () {
    function Controller(chart, config) {
        this.container = new Map();
        this.chart = chart;
        this.config = config;
        this.init();
    }
    Controller.prototype.init = function () {
        var _this = this;
        ANNOTATION_LIST.forEach(function (annotation) {
            var _a;
            var key = annotation.key, shape = annotation.shape;
            var annotationOptions = _this.config[key];
            if (annotationOptions) {
                var annotationInstance = new Annotaion[shape](_this.chart, annotationOptions);
                var canvas = _this.chart.getContext().canvas;
                canvas.appendChild(annotationInstance);
                _this.container.set(key, annotationInstance);
            }
            else {
                (_a = _this.container.get(key)) === null || _a === void 0 ? void 0 : _a.clear();
            }
        });
    };
    /**
     * Update annotaions
     */
    Controller.prototype.update = function () {
        var _this = this;
        if (!this.container.size)
            return;
        ANNOTATION_LIST.forEach(function (annotation) {
            var key = annotation.key;
            var annotationInstance = _this.container.get(key);
            annotationInstance === null || annotationInstance === void 0 ? void 0 : annotationInstance.update();
        });
    };
    /**
     * Dws the annotations
     */
    Controller.prototype.destroy = function () {
        this.container.forEach(function (annotationInstance) {
            annotationInstance.destroy();
        });
        this.container.clear();
    };
    return Controller;
}());
export { Controller };
