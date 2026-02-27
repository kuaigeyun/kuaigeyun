"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterTransformed = void 0;
var constants_1 = require("../constants");
var index_1 = require("./index");
var filterTransformed = function (params) {
    var options = params.options;
    var _a = options.children, children = _a === void 0 ? [] : _a;
    children.forEach(function (child) {
        Object.keys(child).forEach(function (key) {
            if ((0, index_1.isArray)(child[key]) && key !== 'data') {
                child[key] = child[key].filter(function (item) { return !item[constants_1.TRANSFORM_SIGN]; });
            }
        });
    });
    return options;
};
exports.filterTransformed = filterTransformed;
