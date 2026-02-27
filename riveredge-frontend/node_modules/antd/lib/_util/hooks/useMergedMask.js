"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMergedMask = void 0;
var _react = require("react");
const normalizeMaskConfig = mask => {
  if (mask && typeof mask === 'object') {
    return mask;
  }
  if (typeof mask === 'boolean') {
    return {
      enabled: mask,
      blur: mask
    };
  }
  return {};
};
const useMergedMask = (mask, contextMask, prefixCls) => {
  return (0, _react.useMemo)(() => {
    const maskConfig = normalizeMaskConfig(mask);
    const contextMaskConfig = normalizeMaskConfig(contextMask);
    const mergedConfig = {
      ...contextMaskConfig,
      ...maskConfig
    };
    const className = mergedConfig.blur !== false ? `${prefixCls}-mask-blur` : undefined;
    return [mergedConfig.enabled !== false, {
      mask: className
    }];
  }, [mask, contextMask, prefixCls]);
};
exports.useMergedMask = useMergedMask;