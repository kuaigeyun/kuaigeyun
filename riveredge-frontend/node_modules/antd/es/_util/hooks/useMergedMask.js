import { useMemo } from 'react';
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
export const useMergedMask = (mask, contextMask, prefixCls) => {
  return useMemo(() => {
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