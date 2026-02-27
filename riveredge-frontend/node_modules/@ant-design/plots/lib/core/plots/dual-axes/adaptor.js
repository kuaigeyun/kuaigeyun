"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptor = adaptor;
var adaptor_1 = require("../../adaptor");
var utils_1 = require("../../utils");
/**
 * @param chart
 * @param options
 */
function adaptor(params) {
    var colorField = function (params) {
        var options = params.options;
        var _a = options.children, children = _a === void 0 ? [] : _a, legend = options.legend;
        if (!legend)
            return params;
        children.forEach(function (option) {
            if (!(0, utils_1.get)(option, 'colorField')) {
                var yField_1 = (0, utils_1.get)(option, 'yField');
                (0, utils_1.set)(option, 'colorField', function () { return yField_1; });
            }
        });
        return params;
    };
    /**
     * @description Top level annotations needs to share scale, when top level annotations is not empty, scale needs to be dynamically set.
     */
    var annotations = function (params) {
        var options = params.options;
        var _a = options.annotations, annotations = _a === void 0 ? [] : _a, _b = options.children, children = _b === void 0 ? [] : _b, scale = options.scale;
        var sharedScale = false;
        if ((0, utils_1.get)(scale, 'y.key')) {
            return params;
        }
        children.forEach(function (child, index) {
            if (!(0, utils_1.get)(child, 'scale.y.key')) {
                var scaleKey_1 = "child".concat(index, "Scale");
                (0, utils_1.set)(child, 'scale.y.key', scaleKey_1);
                var _a = child.annotations, childAnnotations = _a === void 0 ? [] : _a;
                /**
                 * @description If the child has annotations, the scale of the child needs to be assigned scaleKey to connect the annotation.
                 */
                if (childAnnotations.length > 0) {
                    (0, utils_1.set)(child, 'scale.y.independent', false);
                    childAnnotations.forEach(function (annotation) {
                        (0, utils_1.set)(annotation, 'scale.y.key', scaleKey_1);
                    });
                }
                if (!sharedScale && annotations.length > 0 && (0, utils_1.get)(child, 'scale.y.independent') === undefined) {
                    sharedScale = true;
                    (0, utils_1.set)(child, 'scale.y.independent', false);
                    annotations.forEach(function (annotation) {
                        (0, utils_1.set)(annotation, 'scale.y.key', scaleKey_1);
                    });
                }
            }
        });
        return params;
    };
    return (0, utils_1.flow)(colorField, annotations, adaptor_1.mark, utils_1.transformOptions)(params);
}
