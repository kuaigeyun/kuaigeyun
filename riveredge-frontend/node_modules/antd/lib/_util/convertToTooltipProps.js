"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = require("react");
var _isNonNullable = _interopRequireDefault(require("./isNonNullable"));
const convertToTooltipProps = tooltip => {
  if (!(0, _isNonNullable.default)(tooltip)) {
    return null;
  }
  if (typeof tooltip === 'object' && ! /*#__PURE__*/(0, _react.isValidElement)(tooltip)) {
    return tooltip;
  }
  return {
    title: tooltip
  };
};
var _default = exports.default = convertToTooltipProps;