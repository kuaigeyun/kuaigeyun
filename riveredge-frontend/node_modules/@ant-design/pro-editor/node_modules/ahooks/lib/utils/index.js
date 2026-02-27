"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isUndef = exports.isString = exports.isObject = exports.isNumber = exports.isFunction = exports.isBoolean = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var isObject = function isObject(value) {
  return value !== null && (0, _typeof2["default"])(value) === 'object';
};
exports.isObject = isObject;
var isFunction = function isFunction(value) {
  return typeof value === 'function';
};
exports.isFunction = isFunction;
var isString = function isString(value) {
  return typeof value === 'string';
};
exports.isString = isString;
var isBoolean = function isBoolean(value) {
  return typeof value === 'boolean';
};
exports.isBoolean = isBoolean;
var isNumber = function isNumber(value) {
  return typeof value === 'number';
};
exports.isNumber = isNumber;
var isUndef = function isUndef(value) {
  return typeof value === 'undefined';
};
exports.isUndef = isUndef;