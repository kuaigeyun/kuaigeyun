"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeepCompareEffect = void 0;
var _react = require("react");
var _depsEqual = require("../utils/depsEqual");
var createDeepCompareEffect = function createDeepCompareEffect(hook) {
  return function (effect, deps) {
    var ref = (0, _react.useRef)();
    var signalRef = (0, _react.useRef)(0);
    if (deps === undefined || !(0, _depsEqual.depsEqual)(deps, ref.current)) {
      ref.current = deps;
      signalRef.current += 1;
    }
    hook(effect, [signalRef.current]);
  };
};
exports.createDeepCompareEffect = createDeepCompareEffect;