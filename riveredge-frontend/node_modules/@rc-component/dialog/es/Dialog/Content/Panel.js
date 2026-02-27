function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import { clsx } from 'clsx';
import { useComposeRef } from "@rc-component/util/es/ref";
import React, { useMemo, useRef } from 'react';
import { RefContext } from "../../context";
import MemoChildren from "./MemoChildren";
import pickAttrs from "@rc-component/util/es/pickAttrs";
const sentinelStyle = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none'
};
const entityStyle = {
  outline: 'none'
};
const Panel = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    prefixCls,
    className,
    style,
    title,
    ariaId,
    footer,
    closable,
    closeIcon,
    onClose,
    children,
    bodyStyle,
    bodyProps,
    modalRender,
    onMouseDown,
    onMouseUp,
    holderRef,
    visible,
    forceRender,
    width,
    height,
    classNames: modalClassNames,
    styles: modalStyles
  } = props;

  // ================================= Refs =================================
  const {
    panel: panelRef
  } = React.useContext(RefContext);
  const mergedRef = useComposeRef(holderRef, panelRef);
  const sentinelStartRef = useRef(null);
  const sentinelEndRef = useRef(null);
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      sentinelStartRef.current?.focus({
        preventScroll: true
      });
    },
    changeActive: next => {
      const {
        activeElement
      } = document;
      if (next && activeElement === sentinelEndRef.current) {
        sentinelStartRef.current.focus({
          preventScroll: true
        });
      } else if (!next && activeElement === sentinelStartRef.current) {
        sentinelEndRef.current.focus({
          preventScroll: true
        });
      }
    }
  }));

  // ================================ Style =================================
  const contentStyle = {};
  if (width !== undefined) {
    contentStyle.width = width;
  }
  if (height !== undefined) {
    contentStyle.height = height;
  }
  // ================================ Render ================================
  const footerNode = footer ? /*#__PURE__*/React.createElement("div", {
    className: clsx(`${prefixCls}-footer`, modalClassNames?.footer),
    style: {
      ...modalStyles?.footer
    }
  }, footer) : null;
  const headerNode = title ? /*#__PURE__*/React.createElement("div", {
    className: clsx(`${prefixCls}-header`, modalClassNames?.header),
    style: {
      ...modalStyles?.header
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: clsx(`${prefixCls}-title`, modalClassNames?.title),
    id: ariaId,
    style: {
      ...modalStyles?.title
    }
  }, title)) : null;
  const closableObj = useMemo(() => {
    if (typeof closable === 'object' && closable !== null) {
      return closable;
    }
    if (closable) {
      return {
        closeIcon: closeIcon ?? /*#__PURE__*/React.createElement("span", {
          className: `${prefixCls}-close-x`
        })
      };
    }
    return {};
  }, [closable, closeIcon, prefixCls]);
  const ariaProps = pickAttrs(closableObj, true);
  const closeBtnIsDisabled = typeof closable === 'object' && closable.disabled;
  const closerNode = closable ? /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClose,
    "aria-label": "Close"
  }, ariaProps, {
    className: `${prefixCls}-close`,
    disabled: closeBtnIsDisabled
  }), closableObj.closeIcon) : null;
  const content = /*#__PURE__*/React.createElement("div", {
    className: clsx(`${prefixCls}-container`, modalClassNames?.container),
    style: modalStyles?.container
  }, closerNode, headerNode, /*#__PURE__*/React.createElement("div", _extends({
    className: clsx(`${prefixCls}-body`, modalClassNames?.body),
    style: {
      ...bodyStyle,
      ...modalStyles?.body
    }
  }, bodyProps), children), footerNode);
  return /*#__PURE__*/React.createElement("div", {
    key: "dialog-element",
    role: "dialog",
    "aria-labelledby": title ? ariaId : null,
    "aria-modal": "true",
    ref: mergedRef,
    style: {
      ...style,
      ...contentStyle
    },
    className: clsx(prefixCls, className),
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  }, /*#__PURE__*/React.createElement("div", {
    ref: sentinelStartRef,
    tabIndex: 0,
    style: entityStyle
  }, /*#__PURE__*/React.createElement(MemoChildren, {
    shouldUpdate: visible || forceRender
  }, modalRender ? modalRender(content) : content)), /*#__PURE__*/React.createElement("div", {
    tabIndex: 0,
    ref: sentinelEndRef,
    style: sentinelStyle
  }));
});
if (process.env.NODE_ENV !== 'production') {
  Panel.displayName = 'Panel';
}
export default Panel;