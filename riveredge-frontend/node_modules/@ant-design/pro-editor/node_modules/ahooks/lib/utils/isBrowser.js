"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var isBrowser = !!(typeof window !== 'undefined' && window.document && window.document.createElement);
var _default = isBrowser;
exports["default"] = _default;