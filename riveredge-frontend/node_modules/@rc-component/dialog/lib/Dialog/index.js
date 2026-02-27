"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _clsx = require("clsx");
var _contains = _interopRequireDefault(require("@rc-component/util/lib/Dom/contains"));
var _useId = _interopRequireDefault(require("@rc-component/util/lib/hooks/useId"));
var _KeyCode = _interopRequireDefault(require("@rc-component/util/lib/KeyCode"));
var _pickAttrs = _interopRequireDefault(require("@rc-component/util/lib/pickAttrs"));
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _util = require("../util");
var _Content = _interopRequireDefault(require("./Content"));
var _Mask = _interopRequireDefault(require("./Mask"));
var _warning = require("@rc-component/util/lib/warning");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const Dialog = props => {
  const {
    prefixCls = 'rc-dialog',
    zIndex,
    visible = false,
    keyboard = true,
    focusTriggerAfterClose = true,
    // scrollLocker,
    // Wrapper
    wrapStyle,
    wrapClassName,
    wrapProps,
    onClose,
    afterOpenChange,
    afterClose,
    // Dialog
    transitionName,
    animation,
    closable = true,
    // Mask
    mask = true,
    maskTransitionName,
    maskAnimation,
    maskClosable = true,
    maskStyle,
    maskProps,
    rootClassName,
    rootStyle,
    classNames: modalClassNames,
    styles: modalStyles
  } = props;
  if (process.env.NODE_ENV !== 'production') {
    ['wrapStyle', 'bodyStyle', 'maskStyle'].forEach(prop => {
      // (prop in props) && console.error(`Warning: ${prop} is deprecated, please use styles instead.`)
      (0, _warning.warning)(!(prop in props), `${prop} is deprecated, please use styles instead.`);
    });
    if ('wrapClassName' in props) {
      (0, _warning.warning)(false, `wrapClassName is deprecated, please use classNames instead.`);
    }
  }
  const lastOutSideActiveElementRef = (0, _react.useRef)(null);
  const wrapperRef = (0, _react.useRef)(null);
  const contentRef = (0, _react.useRef)(null);
  const [animatedVisible, setAnimatedVisible] = React.useState(visible);

  // ========================== Init ==========================
  const ariaId = (0, _useId.default)();
  function saveLastOutSideActiveElementRef() {
    if (!(0, _contains.default)(wrapperRef.current, document.activeElement)) {
      lastOutSideActiveElementRef.current = document.activeElement;
    }
  }
  function focusDialogContent() {
    if (!(0, _contains.default)(wrapperRef.current, document.activeElement)) {
      contentRef.current?.focus();
    }
  }

  // ========================= Events =========================
  // Close action will trigger by:
  //   1. When hide motion end
  //   2. Controlled `open` to `false` immediately after set to `true` which will not trigger motion
  function doClose() {
    // Clean up scroll bar & focus back
    setAnimatedVisible(false);
    if (mask && lastOutSideActiveElementRef.current && focusTriggerAfterClose) {
      try {
        lastOutSideActiveElementRef.current.focus({
          preventScroll: true
        });
      } catch (e) {
        // Do nothing
      }
      lastOutSideActiveElementRef.current = null;
    }

    // Trigger afterClose only when change visible from true to false
    if (animatedVisible) {
      afterClose?.();
    }
  }
  function onDialogVisibleChanged(newVisible) {
    // Try to focus
    if (newVisible) {
      focusDialogContent();
    } else {
      doClose();
    }
    afterOpenChange?.(newVisible);
  }
  function onInternalClose(e) {
    onClose?.(e);
  }

  // >>> Content
  const contentClickRef = (0, _react.useRef)(false);
  const contentTimeoutRef = (0, _react.useRef)(null);

  // We need record content click incase content popup out of dialog
  const onContentMouseDown = () => {
    clearTimeout(contentTimeoutRef.current);
    contentClickRef.current = true;
  };
  const onContentMouseUp = () => {
    contentTimeoutRef.current = setTimeout(() => {
      contentClickRef.current = false;
    });
  };

  // >>> Wrapper
  // Close only when element not on dialog
  let onWrapperClick = null;
  if (maskClosable) {
    onWrapperClick = e => {
      if (contentClickRef.current) {
        contentClickRef.current = false;
      } else if (wrapperRef.current === e.target) {
        onInternalClose(e);
      }
    };
  }
  function onWrapperKeyDown(e) {
    if (keyboard && e.keyCode === _KeyCode.default.ESC) {
      e.stopPropagation();
      onInternalClose(e);
      return;
    }

    // keep focus inside dialog
    if (visible && e.keyCode === _KeyCode.default.TAB) {
      contentRef.current.changeActive(!e.shiftKey);
    }
  }

  // ========================= Effect =========================
  (0, _react.useEffect)(() => {
    if (visible) {
      setAnimatedVisible(true);
      saveLastOutSideActiveElementRef();
    } else if (animatedVisible && contentRef.current.enableMotion() && !contentRef.current.inMotion()) {
      doClose();
    }
  }, [visible]);

  // Remove direct should also check the scroll bar update
  (0, _react.useEffect)(() => () => {
    clearTimeout(contentTimeoutRef.current);
  }, []);
  const mergedStyle = {
    zIndex,
    ...wrapStyle,
    ...modalStyles?.wrapper,
    display: !animatedVisible ? 'none' : null
  };

  // ========================= Render =========================
  return /*#__PURE__*/React.createElement("div", _extends({
    className: (0, _clsx.clsx)(`${prefixCls}-root`, rootClassName),
    style: rootStyle
  }, (0, _pickAttrs.default)(props, {
    data: true
  })), /*#__PURE__*/React.createElement(_Mask.default, {
    prefixCls: prefixCls,
    visible: mask && visible,
    motionName: (0, _util.getMotionName)(prefixCls, maskTransitionName, maskAnimation),
    style: {
      zIndex,
      ...maskStyle,
      ...modalStyles?.mask
    },
    maskProps: maskProps,
    className: modalClassNames?.mask
  }), /*#__PURE__*/React.createElement("div", _extends({
    tabIndex: -1,
    onKeyDown: onWrapperKeyDown,
    className: (0, _clsx.clsx)(`${prefixCls}-wrap`, wrapClassName, modalClassNames?.wrapper),
    ref: wrapperRef,
    onClick: onWrapperClick,
    style: mergedStyle
  }, wrapProps), /*#__PURE__*/React.createElement(_Content.default, _extends({}, props, {
    onMouseDown: onContentMouseDown,
    onMouseUp: onContentMouseUp,
    ref: contentRef,
    closable: closable,
    ariaId: ariaId,
    prefixCls: prefixCls,
    visible: visible && animatedVisible,
    onClose: onInternalClose,
    onVisibleChanged: onDialogVisibleChanged,
    motionName: (0, _util.getMotionName)(prefixCls, transitionName, animation)
  }))));
};
var _default = exports.default = Dialog;