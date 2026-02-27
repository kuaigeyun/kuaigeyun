"use strict";
"use client";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _motion = _interopRequireDefault(require("@rc-component/motion"));
var _clsx = require("clsx");
var _context = require("../../config-provider/context");
const MotionContent = ({
  children
}) => {
  const {
    getPrefixCls
  } = _react.default.useContext(_context.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  // This will never reach since we will not render this when no children
  /* istanbul ignore next */
  if (! /*#__PURE__*/_react.default.isValidElement(children)) {
    return children;
  }
  return /*#__PURE__*/_react.default.createElement(_motion.default, {
    visible: true,
    motionName: `${rootPrefixCls}-fade`,
    motionAppear: true,
    motionEnter: true,
    motionLeave: false,
    removeOnLeave: false
  }, ({
    style: motionStyle,
    className: motionClassName
  }) => {
    const {
      className,
      style
    } = children.props;
    const mergedStyles = {
      ...style,
      ...motionStyle
    };
    return /*#__PURE__*/_react.default.cloneElement(children, {
      className: (0, _clsx.clsx)(className, motionClassName),
      style: mergedStyles
    });
  });
};
var _default = exports.default = MotionContent;