"use client";

import * as React from 'react';
import { clsx } from 'clsx';
import { debounce } from 'throttle-debounce';
import { useMergeSemantic } from '../_util/hooks';
import { devUseWarning } from '../_util/warning';
import { useComponentConfig } from '../config-provider/context';
import Indicator from './Indicator';
import useStyle from './style/index';
import usePercent from './usePercent';
const _SpinSizes = ['small', 'default', 'large'];
// Render indicator
let defaultIndicator;
function shouldDelay(spinning, delay) {
  return !!spinning && !!delay && !Number.isNaN(Number(delay));
}
const Spin = props => {
  const {
    prefixCls: customizePrefixCls,
    spinning: customSpinning = true,
    delay = 0,
    className,
    rootClassName,
    size = 'default',
    tip,
    wrapperClassName,
    style,
    children,
    fullscreen = false,
    indicator,
    percent,
    classNames,
    styles,
    ...restProps
  } = props;
  const {
    getPrefixCls,
    direction,
    indicator: contextIndicator,
    className: contextClassName,
    style: contextStyle,
    classNames: contextClassNames,
    styles: contextStyles
  } = useComponentConfig('spin');
  const prefixCls = getPrefixCls('spin', customizePrefixCls);
  const [hashId, cssVarCls] = useStyle(prefixCls);
  const [spinning, setSpinning] = React.useState(() => customSpinning && !shouldDelay(customSpinning, delay));
  const mergedPercent = usePercent(spinning, percent);
  React.useEffect(() => {
    if (customSpinning) {
      const showSpinning = debounce(delay, () => {
        setSpinning(true);
      });
      showSpinning();
      return () => {
        showSpinning?.cancel?.();
      };
    }
    setSpinning(false);
  }, [delay, customSpinning]);
  const isNestedPattern = React.useMemo(() => typeof children !== 'undefined' && !fullscreen, [children, fullscreen]);
  // =========== Merged Props for Semantic ===========
  const mergedProps = {
    ...props,
    size,
    spinning,
    tip,
    fullscreen,
    children,
    percent: mergedPercent
  };
  // ========================= Style ==========================
  const [mergedClassNames, mergedStyles] = useMergeSemantic([contextClassNames, classNames], [contextStyles, styles], {
    props: mergedProps
  });
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Spin');
    process.env.NODE_ENV !== "production" ? warning(!tip || isNestedPattern || fullscreen, 'usage', '`tip` only work in nest or fullscreen pattern.') : void 0;
  }
  const spinClassName = clsx(prefixCls, contextClassName, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-spinning`]: spinning,
    [`${prefixCls}-show-text`]: !!tip,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, className, !fullscreen && rootClassName, !fullscreen && mergedClassNames.root, hashId, cssVarCls);
  const containerClassName = clsx(`${prefixCls}-container`, {
    [`${prefixCls}-blur`]: spinning
  });
  const mergedIndicator = indicator ?? contextIndicator ?? defaultIndicator;
  const mergedStyle = {
    ...contextStyle,
    ...style
  };
  const spinElement = /*#__PURE__*/React.createElement("div", {
    ...restProps,
    style: fullscreen ? mergedStyle : {
      ...mergedStyles.root,
      ...mergedStyle
    },
    className: spinClassName,
    "aria-live": "polite",
    "aria-busy": spinning
  }, /*#__PURE__*/React.createElement(Indicator, {
    className: mergedClassNames.indicator,
    style: mergedStyles.indicator,
    prefixCls: prefixCls,
    indicator: mergedIndicator,
    percent: mergedPercent
  }), tip && (isNestedPattern || fullscreen) ? (/*#__PURE__*/React.createElement("div", {
    className: clsx(`${prefixCls}-text`, mergedClassNames.tip),
    style: mergedStyles.tip
  }, tip)) : null);
  if (isNestedPattern) {
    return /*#__PURE__*/React.createElement("div", {
      ...restProps,
      className: clsx(`${prefixCls}-nested-loading`, wrapperClassName, mergedClassNames.wrapper, hashId, cssVarCls),
      style: mergedStyles.wrapper
    }, spinning && /*#__PURE__*/React.createElement("div", {
      key: "loading"
    }, spinElement), /*#__PURE__*/React.createElement("div", {
      className: containerClassName,
      key: "container"
    }, children));
  }
  if (fullscreen) {
    return /*#__PURE__*/React.createElement("div", {
      className: clsx(`${prefixCls}-fullscreen`, {
        [`${prefixCls}-fullscreen-show`]: spinning
      }, rootClassName, hashId, cssVarCls, mergedClassNames.mask),
      style: mergedStyles.mask
    }, spinElement);
  }
  return spinElement;
};
Spin.setDefaultIndicator = indicator => {
  defaultIndicator = indicator;
};
if (process.env.NODE_ENV !== 'production') {
  Spin.displayName = 'Spin';
}
export default Spin;