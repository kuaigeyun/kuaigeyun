"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHTMLElement = exports.isReactElement = exports.isRegExp = exports.isObj = exports.isNumberLike = exports.isWeakSet = exports.isWeakMap = exports.isSet = exports.isMap = exports.isNum = exports.isBool = exports.isStr = exports.isPlainObj = exports.isArr = exports.isFn = exports.getType = void 0;
var toString = Object.prototype.toString;
var isType = function (type) {
    return function (obj) {
        return (0, exports.getType)(obj) === "[object ".concat(type, "]");
    };
};
var getType = function (obj) { return toString.call(obj); };
exports.getType = getType;
var isFn = function (val) { return typeof val === 'function'; };
exports.isFn = isFn;
exports.isArr = Array.isArray;
exports.isPlainObj = isType('Object');
exports.isStr = isType('String');
exports.isBool = isType('Boolean');
exports.isNum = isType('Number');
var isMap = function (val) {
    return val && val instanceof Map;
};
exports.isMap = isMap;
var isSet = function (val) { return val && val instanceof Set; };
exports.isSet = isSet;
var isWeakMap = function (val) {
    return val && val instanceof WeakMap;
};
exports.isWeakMap = isWeakMap;
var isWeakSet = function (val) {
    return val && val instanceof WeakSet;
};
exports.isWeakSet = isWeakSet;
var isNumberLike = function (index) {
    return (0, exports.isNum)(index) || /^\d+$/.test(index);
};
exports.isNumberLike = isNumberLike;
var isObj = function (val) { return typeof val === 'object'; };
exports.isObj = isObj;
exports.isRegExp = isType('RegExp');
var isReactElement = function (obj) {
    return obj && obj['$$typeof'] && obj['_owner'];
};
exports.isReactElement = isReactElement;
var isHTMLElement = function (target) {
    return Object.prototype.toString.call(target).indexOf('HTML') > -1;
};
exports.isHTMLElement = isHTMLElement;
//# sourceMappingURL=checkers.js.map