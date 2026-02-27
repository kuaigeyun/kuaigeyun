import { TRANSFORM_SIGN } from '../constants';
import { isArray } from './index';
export var filterTransformed = function (params) {
    var options = params.options;
    var _a = options.children, children = _a === void 0 ? [] : _a;
    children.forEach(function (child) {
        Object.keys(child).forEach(function (key) {
            if (isArray(child[key]) && key !== 'data') {
                child[key] = child[key].filter(function (item) { return !item[TRANSFORM_SIGN]; });
            }
        });
    });
    return options;
};
