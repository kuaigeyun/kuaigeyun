"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExcessKeys = void 0;
var constants_1 = require("../constants");
/**
 * 统一删除已转换的配置项
 */
var deleteExcessKeys = function (options) {
    var _a = options.children, children = _a === void 0 ? [] : _a;
    var deleteKeys = Object.keys(constants_1.TRANSFORM_OPTION_KEY).concat(constants_1.CONFIG_SHAPE.map(function (item) { return item.key; }));
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
        if (!__spreadArray(__spreadArray([], constants_1.VIEW_OPTIONS, true), constants_1.ANNOTATION_LIST.map(function (item) { return item.key; }), true).includes(key)) {
            delete options[key];
        }
    });
    return options;
};
exports.deleteExcessKeys = deleteExcessKeys;
