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
exports.mergeWithArrayCoverage = void 0;
var index_1 = require("./index");
var arrayCoverage = function (objValue, srcValue) {
    if ((0, index_1.isArray)(srcValue)) {
        return srcValue;
    }
};
var mergeWithArrayCoverage = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return index_1.mergeWith.apply(void 0, __spreadArray(__spreadArray([], args, false), [arrayCoverage], false));
};
exports.mergeWithArrayCoverage = mergeWithArrayCoverage;
