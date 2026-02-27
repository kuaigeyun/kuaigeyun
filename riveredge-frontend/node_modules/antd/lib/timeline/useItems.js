"use strict";
"use client";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useItems;
var React = _interopRequireWildcard(require("react"));
var _icons = require("@ant-design/icons");
var _util = require("@rc-component/util");
var _clsx = require("clsx");
function useItems(prefixCls, mode, items, children, pending, pendingDot) {
  const itemCls = `${prefixCls}-item`;
  // Merge items and children
  const parseItems = React.useMemo(() => {
    return Array.isArray(items) ? items : (0, _util.toArray)(children).map(ele => ({
      ...ele.props
    }));
  }, [items, children]);
  // convert legacy type
  return React.useMemo(() => {
    const mergedItems = parseItems.map((item, index) => {
      const {
        label,
        children,
        title,
        content,
        color,
        className,
        style,
        icon,
        dot,
        placement,
        position,
        loading,
        ...restProps
      } = item;
      let mergedStyle = style;
      let mergedClassName = className;
      // Color
      if (color) {
        if (['blue', 'red', 'green', 'gray'].includes(color)) {
          mergedClassName = (0, _clsx.clsx)(className, `${itemCls}-color-${color}`);
        } else {
          mergedStyle = {
            '--steps-item-icon-dot-color': color,
            ...style
          };
        }
      }
      // Placement
      const mergedPlacement = placement ?? position ?? (mode === 'alternate' ? index % 2 === 0 ? 'start' : 'end' : mode);
      mergedClassName = (0, _clsx.clsx)(mergedClassName, `${itemCls}-placement-${mergedPlacement}`);
      // Icon
      let mergedIcon = icon ?? dot;
      if (!mergedIcon && loading) {
        mergedIcon = /*#__PURE__*/React.createElement(_icons.LoadingOutlined, null);
      }
      return {
        ...restProps,
        title: title ?? label,
        content: content ?? children,
        style: mergedStyle,
        className: mergedClassName,
        icon: mergedIcon,
        status: loading ? 'process' : 'finish'
      };
    });
    if (pending) {
      mergedItems.push({
        icon: pendingDot ?? /*#__PURE__*/React.createElement(_icons.LoadingOutlined, null),
        content: pending,
        status: 'process'
      });
    }
    return mergedItems;
  }, [parseItems, pending, pendingDot, itemCls, mode]);
}