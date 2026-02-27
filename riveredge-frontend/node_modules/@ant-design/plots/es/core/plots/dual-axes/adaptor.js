import { mark } from '../../adaptor';
import { flow, transformOptions, get, set } from '../../utils';
/**
 * @param chart
 * @param options
 */
export function adaptor(params) {
    var colorField = function (params) {
        var options = params.options;
        var _a = options.children, children = _a === void 0 ? [] : _a, legend = options.legend;
        if (!legend)
            return params;
        children.forEach(function (option) {
            if (!get(option, 'colorField')) {
                var yField_1 = get(option, 'yField');
                set(option, 'colorField', function () { return yField_1; });
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
        if (get(scale, 'y.key')) {
            return params;
        }
        children.forEach(function (child, index) {
            if (!get(child, 'scale.y.key')) {
                var scaleKey_1 = "child".concat(index, "Scale");
                set(child, 'scale.y.key', scaleKey_1);
                var _a = child.annotations, childAnnotations = _a === void 0 ? [] : _a;
                /**
                 * @description If the child has annotations, the scale of the child needs to be assigned scaleKey to connect the annotation.
                 */
                if (childAnnotations.length > 0) {
                    set(child, 'scale.y.independent', false);
                    childAnnotations.forEach(function (annotation) {
                        set(annotation, 'scale.y.key', scaleKey_1);
                    });
                }
                if (!sharedScale && annotations.length > 0 && get(child, 'scale.y.independent') === undefined) {
                    sharedScale = true;
                    set(child, 'scale.y.independent', false);
                    annotations.forEach(function (annotation) {
                        set(annotation, 'scale.y.key', scaleKey_1);
                    });
                }
            }
        });
        return params;
    };
    return flow(colorField, annotations, mark, transformOptions)(params);
}
