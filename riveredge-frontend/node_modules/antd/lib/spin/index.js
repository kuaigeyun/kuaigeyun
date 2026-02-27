"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _clsx = require("clsx");
var _throttleDebounce = require("throttle-debounce");
var _hooks = require("../_util/hooks");
var _warning = require("../_util/warning");
var _context = require("../config-provider/context");
var _Indicator = _interopRequireDefault(require("./Indicator"));
var _index = _interopRequireDefault(require("./style/index"));
var _usePercent = _interopRequireDefault(require("./usePercent"));
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
  } = (0, _context.useComponentConfig)('spin');
  const prefixCls = getPrefixCls('spin', customizePrefixCls);
  const [hashId, cssVarCls] = (0, _index.default)(prefixCls);
  const [spinning, setSpinning] = React.useState(() => customSpinning && !shouldDelay(customSpinning, delay));
  const mergedPercent = (0, _usePercent.default)(spinning, percent);
  React.useEffect(() => {
    if (customSpinning) {
      const showSpinning = (0, _throttleDebounce.debounce)(delay, () => {
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
  const [mergedClassNames, mergedStyles] = (0, _hooks.useMergeSemantic)([contextClassNames, classNames], [contextStyles, styles], {
    props: mergedProps
  });
  if (process.env.NODE_ENV !== 'production') {
    const warning = (0, _warning.devUseWarning)('Spin');
    process.env.NODE_ENV !== "production" ? warning(!tip || isNestedPattern || fullscreen, 'usage', '`tip` only work in nest or fullscreen pattern.') : void 0;
  }
  const spinClassName = (0, _clsx.clsx)(prefixCls, contextClassName, {
    [`${prefixCls}-sm`]: size === 'small',
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-spinning`]: spinning,
    [`${prefixCls}-show-text`]: !!tip,
    [`${prefixCls}-rtl`]: direction === 'rtl'
  }, className, !fullscreen && rootClassName, !fullscreen && mergedClassNames.root, hashId, cssVarCls);
  const containerClassName = (0, _clsx.clsx)(`${prefixCls}-container`, {
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
  }, /*#__PURE__*/React.createElement(_Indicator.default, {
    className: mergedClassNames.indicator,
    style: mergedStyles.indicator,
    prefixCls: prefixCls,
    indicator: mergedIndicator,
    percent: mergedPercent
  }), tip && (isNestedPattern || fullscreen) ? (/*#__PURE__*/React.createElement("div", {
    className: (0, _clsx.clsx)(`${prefixCls}-text`, mergedClassNames.tip),
    style: mergedStyles.tip
  }, tip)) : null);
  if (isNestedPattern) {
    return /*#__PURE__*/React.createElement("div", {
      ...restProps,
      className: (0, _clsx.clsx)(`${prefixCls}-nested-loading`, wrapperClassName, mergedClassNames.wrapper, hashId, cssVarCls),
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
      className: (0, _clsx.clsx)(`${prefixCls}-fullscreen`, {
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
var _default = exports.default = Spin;