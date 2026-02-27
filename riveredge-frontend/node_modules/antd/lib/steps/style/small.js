"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _util = require("./util");
const genSmallStyle = token => {
  const {
    componentCls,
    iconSizeSM,
    fontSize,
    lineHeight,
    marginXS
  } = token;
  return {
    [`${componentCls}${componentCls}-small`]: {
      '--steps-icon-size': iconSizeSM,
      '--steps-title-horizontal-item-margin': token.marginSM,
      '--steps-title-vertical-row-gap': token.paddingXS,
      '--steps-title-font-size': fontSize,
      '--steps-title-line-height': lineHeight,
      '--steps-title-horizontal-rail-margin': token.marginXS,
      '--steps-title-horizontal-title-height': token.fontHeight,
      // Horizontal: label vertical
      [`&${componentCls}-horizontal${componentCls}-title-vertical`]: (0, _util.getItemWithWidthStyle)(token, marginXS)
    }
  };
};
var _default = exports.default = genSmallStyle;