var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { TRANSFORM_OPTION_KEY, VIEW_OPTIONS, CONFIG_SHAPE, ANNOTATION_LIST } from '../constants';
/**
 * 统一删除已转换的配置项
 */
export var deleteExcessKeys = function (options) {
    var _a = options.children, children = _a === void 0 ? [] : _a;
    var deleteKeys = Object.keys(TRANSFORM_OPTION_KEY).concat(CONFIG_SHAPE.map(function (item) { return item.key; }));
    deleteKeys.forEach(function (key) {
        delete options[key];
    });
    /** 针对双轴图、Mix 等复合图表 */
    children.forEach(function (child) {
        Object.keys(child).forEach(function (key) {
            if (deleteKeys.includes(key)) {
                delete child[key];
            }
        });
    });
    /** 删除不在 View 和自定义 Annotations 里面配置，避免多次 Transform & Scale 等 */
    Object.keys(options).forEach(function (key) {
        if (!__spreadArray(__spreadArray([], VIEW_OPTIONS, true), ANNOTATION_LIST.map(function (item) { return item.key; }), true).includes(key)) {
            delete options[key];
        }
    });
    return options;
};
